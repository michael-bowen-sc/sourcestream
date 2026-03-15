import { renderHook, act, waitFor } from "@testing-library/react";
import { useRequests } from "../useRequests";
import * as grpcClient from "../../services/grpcClient";

jest.mock("../../services/grpcClient");

describe("useRequests", () => {
  const mockUserId = "test-user-123";

  beforeEach(() => {
    jest.clearAllMocks();
    (grpcClient.getRequests as jest.Mock).mockResolvedValue([]);
    (grpcClient.submitRequest as jest.Mock).mockResolvedValue({
      success: true,
    });
  });

  it("provides required functions", async () => {
    (grpcClient.getRequests as jest.Mock).mockResolvedValueOnce([]);
    const { result } = renderHook(() => useRequests(mockUserId));
    expect(typeof result.current.submitNewRequest).toBe("function");
    expect(typeof result.current.refreshRequests).toBe("function");
    expect(Array.isArray(result.current.requests)).toBe(true);
  });

  it("fetches requests on mount", async () => {
    const mockResponse = [
      {
        id: "req-1",
        type: "project" as const,
        title: "Test Project Request",
        status: "pending" as const,
        projectName: "Test Project",
        createdAt: "2024-01-01T00:00:00Z",
      },
    ];
    (grpcClient.getRequests as jest.Mock).mockResolvedValueOnce(mockResponse);
    const { result } = renderHook(() => useRequests(mockUserId));
    await waitFor(() => {
      expect(result.current.requests).toHaveLength(1);
    });
  });

  it("handles loading state during fetch", async () => {
    (grpcClient.getRequests as jest.Mock).mockImplementationOnce(
      () => new Promise((resolve) => setTimeout(() => resolve([]), 100)),
    );
    const { result } = renderHook(() => useRequests(mockUserId));
    expect(result.current.loading).toBe(true);
    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });
  });

  it("handles fetch errors", async () => {
    (grpcClient.getRequests as jest.Mock).mockRejectedValueOnce(
      new Error("Server error"),
    );
    const { result } = renderHook(() => useRequests(mockUserId));
    await waitFor(() => {
      expect(result.current.error).toBeTruthy();
    });
  });

  it("submits new project request successfully", async () => {
    (grpcClient.getRequests as jest.Mock)
      .mockResolvedValueOnce([])
      .mockResolvedValueOnce([]);
    (grpcClient.submitRequest as jest.Mock).mockResolvedValueOnce({
      success: true,
    });
    const { result } = renderHook(() => useRequests(mockUserId));
    let success = false;
    await act(async () => {
      success = await result.current.submitNewRequest({
        type: "project",
        title: "Test",
        projectName: "Test",
        projectUrl: "https://test.com",
      });
    });
    expect(success).toBe(true);
  });

  it("handles submission errors", async () => {
    (grpcClient.getRequests as jest.Mock).mockResolvedValueOnce([]);
    (grpcClient.submitRequest as jest.Mock).mockRejectedValueOnce(
      new Error("Failed"),
    );
    const { result } = renderHook(() => useRequests(mockUserId));
    let success = true;
    await act(async () => {
      success = await result.current.submitNewRequest({
        type: "project",
        title: "Test",
        projectName: "Test",
        projectUrl: "https://test.com",
      });
    });
    expect(success).toBe(false);
  });
});
