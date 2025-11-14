import { renderHook, act, waitFor } from "@testing-library/react";
import { useRequests } from "../useRequests";
import { server } from "../../test/mocks/server";
import { rest } from "msw";

// Setup MSW server
beforeAll(() => server.listen());
afterEach(() => server.resetHandlers());
afterAll(() => server.close());

describe("useRequests", () => {
  const mockUserId = "test-user-123";

  it("initializes with empty state", () => {
    const { result } = renderHook(() => useRequests(mockUserId));

    expect(result.current.requests).toEqual([]);
    expect(result.current.loading).toBe(false);
    expect(result.current.error).toBe(null);
    expect(typeof result.current.submitNewRequest).toBe("function");
    expect(typeof result.current.refreshRequests).toBe("function");
  });

  it("fetches requests on mount", async () => {
    const { result } = renderHook(() => useRequests(mockUserId));

    await waitFor(() => {
      expect(result.current.requests).toHaveLength(1);
      expect(result.current.requests[0]).toMatchObject({
        id: "req-1",
        type: "project",
        title: "Test Project Request",
        status: "pending",
      });
    });
  });

  it("handles loading state during fetch", async () => {
    // Mock slow response
    server.use(
      rest.get("http://localhost:8080/api/requests", (req, res, ctx) => {
        return res(ctx.delay(100), ctx.status(200), ctx.json([]));
      }),
    );

    const { result } = renderHook(() => useRequests(mockUserId));

    expect(result.current.loading).toBe(true);

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });
  });

  it("handles fetch errors", async () => {
    server.use(
      rest.get("http://localhost:8080/api/requests", (req, res, ctx) => {
        return res(ctx.status(500), ctx.json({ error: "Server error" }));
      }),
    );

    const { result } = renderHook(() => useRequests(mockUserId));

    await waitFor(() => {
      expect(result.current.error).toBeTruthy();
      expect(result.current.requests).toEqual([]);
    });
  });

  it("submits new project request successfully", async () => {
    const { result } = renderHook(() => useRequests(mockUserId));

    const requestData = {
      type: "project" as const,
      title: "New Project Request",
      projectName: "Test Project",
      projectUrl: "https://github.com/test/project",
    };

    let success = false;
    await act(async () => {
      success = await result.current.submitNewRequest(requestData);
    });

    expect(success).toBe(true);
  });

  it("submits new access request successfully", async () => {
    const { result } = renderHook(() => useRequests(mockUserId));

    const requestData = {
      type: "access" as const,
      title: "Access Request",
      projectName: "Existing Project",
    };

    let success = false;
    await act(async () => {
      success = await result.current.submitNewRequest(requestData);
    });

    expect(success).toBe(true);
  });

  it("handles submission errors", async () => {
    server.use(
      rest.post(
        "http://localhost:8080/api/submit-project-request",
        (req, res, ctx) => {
          return res(ctx.status(400), ctx.json({ error: "Bad request" }));
        },
      ),
    );

    const { result } = renderHook(() => useRequests(mockUserId));

    const requestData = {
      type: "project" as const,
      title: "Failed Request",
      projectName: "Test Project",
      projectUrl: "https://github.com/test/project",
    };

    let success = true;
    await act(async () => {
      success = await result.current.submitNewRequest(requestData);
    });

    expect(success).toBe(false);
  });

  it("refreshes requests manually", async () => {
    const { result } = renderHook(() => useRequests(mockUserId));

    // Wait for initial load
    await waitFor(() => {
      expect(result.current.requests).toHaveLength(1);
    });

    // Mock updated response
    server.use(
      rest.get("http://localhost:8080/api/requests", (req, res, ctx) => {
        return res(
          ctx.status(200),
          ctx.json([
            {
              id: "req-1",
              type: "project",
              title: "Updated Project Request",
              status: "approved",
              projectName: "Test Project",
              createdAt: "2024-01-01T00:00:00Z",
            },
          ]),
        );
      }),
    );

    await act(async () => {
      await result.current.refreshRequests();
    });

    expect(result.current.requests[0].status).toBe("approved");
    expect(result.current.requests[0].title).toBe("Updated Project Request");
  });

  it("automatically refreshes after successful submission", async () => {
    const { result } = renderHook(() => useRequests(mockUserId));

    // Wait for initial load
    await waitFor(() => {
      expect(result.current.requests).toHaveLength(1);
    });

    // Mock updated response after submission
    server.use(
      rest.get("http://localhost:8080/api/requests", (req, res, ctx) => {
        return res(
          ctx.status(200),
          ctx.json([
            {
              id: "req-1",
              type: "project",
              title: "Test Project Request",
              status: "pending",
              projectName: "Test Project",
              createdAt: "2024-01-01T00:00:00Z",
            },
            {
              id: "req-2",
              type: "project",
              title: "New Submitted Request",
              status: "pending",
              projectName: "New Project",
              createdAt: "2024-01-02T00:00:00Z",
            },
          ]),
        );
      }),
    );

    const requestData = {
      type: "project" as const,
      title: "New Submitted Request",
      projectName: "New Project",
      projectUrl: "https://github.com/test/new-project",
    };

    await act(async () => {
      await result.current.submitNewRequest(requestData);
    });

    // Should have refreshed and now show 2 requests
    await waitFor(() => {
      expect(result.current.requests).toHaveLength(2);
    });
  });
});
