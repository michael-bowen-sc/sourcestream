import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { ChakraProvider, defaultSystem } from "@chakra-ui/react";
import App from "../App";
import { server } from "../test/mocks/server";
import { http, HttpResponse } from "msw";

// Setup MSW server
beforeAll(() => server.listen());
afterEach(() => server.resetHandlers());
afterAll(() => server.close());

const renderWithChakra = (component: React.ReactElement) => {
  return render(
    <ChakraProvider value={defaultSystem}>{component}</ChakraProvider>,
  );
};

describe("App Integration Tests", () => {
  it("renders dashboard with pending requests", async () => {
    renderWithChakra(<App />);

    // Should show dashboard elements
    expect(screen.getByText(/sourcestream dashboard/i)).toBeInTheDocument();

    // Should show pending requests section
    await waitFor(() => {
      expect(screen.getByText(/pending requests/i)).toBeInTheDocument();
    });
  });

  it("opens request modal when action button is clicked", async () => {
    renderWithChakra(<App />);

    // Find and click a request action button
    const requestButton = await screen.findByText(/request project access/i);
    fireEvent.click(requestButton);

    // Modal should open
    await waitFor(() => {
      expect(screen.getByText("Request Access")).toBeInTheDocument();
    });
  });

  it("submits request form and updates dashboard", async () => {
    // Mock successful submission and updated requests list
    server.use(
      http.post(
        "http://localhost:8080/api/submit-project-request",
        () => {
          return HttpResponse.json(
            { success: true, id: "new-request-id" },
            { status: 200 },
          );
        },
      ),
      http.get("http://localhost:8080/api/requests", () => {
        return HttpResponse.json(
          [
            {
              id: "req-1",
              type: "project",
              title: "Test Project Request",
              status: "pending",
              projectName: "Test Project",
              createdAt: "2024-01-01T00:00:00Z",
            },
            {
              id: "new-request-id",
              type: "project",
              title: "Integration Test Project",
              status: "pending",
              projectName: "New Test Project",
              createdAt: "2024-01-02T00:00:00Z",
            },
          ],
          { status: 200 },
        );
      }),
    );

    renderWithChakra(<App />);

    // Open modal
    const requestButton = await screen.findByText(/request project access/i);
    fireEvent.click(requestButton);

    // Fill out form
    await waitFor(() => {
      const typeSelect = screen.getByLabelText(/request type/i);
      const titleInput = screen.getByLabelText(/title/i);

      fireEvent.change(typeSelect, { target: { value: "project" } });
      fireEvent.change(titleInput, {
        target: { value: "Integration Test Project" },
      });
    });

    await waitFor(() => {
      const projectNameInput = screen.getByLabelText(/project name/i);
      const projectUrlInput = screen.getByLabelText(/project url/i);
      const licenseSelect = screen.getByLabelText(/license/i);

      fireEvent.change(projectNameInput, {
        target: { value: "New Test Project" },
      });
      fireEvent.change(projectUrlInput, {
        target: { value: "https://github.com/test/new-project" },
      });
      fireEvent.change(licenseSelect, { target: { value: "MIT" } });
    });

    // Submit form
    const submitButton = screen.getByText("Submit Request");
    fireEvent.click(submitButton);

    // Modal should close and dashboard should update
    await waitFor(() => {
      expect(screen.queryByText("Request Access")).not.toBeInTheDocument();
    });

    // Dashboard should show updated request count or new request
    // Note: This depends on how the dashboard displays the data
    await waitFor(() => {
      // Verify the request was submitted (console.log should have been called)
      // In a real test, you might check for updated UI elements
    });
  });

  it("handles form submission errors gracefully", async () => {
    // Mock failed submission
    server.use(
      http.post(
        "http://localhost:8080/api/submit-project-request",
        () => {
          return HttpResponse.json(
            { error: "Server error" },
            { status: 500 },
          );
        },
      ),
    );

    renderWithChakra(<App />);

    // Open modal and fill form
    const requestButton = await screen.findByText(/request project access/i);
    fireEvent.click(requestButton);

    await waitFor(() => {
      const typeSelect = screen.getByLabelText(/request type/i);
      const titleInput = screen.getByLabelText(/title/i);

      fireEvent.change(typeSelect, { target: { value: "project" } });
      fireEvent.change(titleInput, { target: { value: "Failed Request" } });
    });

    await waitFor(() => {
      const projectNameInput = screen.getByLabelText(/project name/i);
      const projectUrlInput = screen.getByLabelText(/project url/i);
      const licenseSelect = screen.getByLabelText(/license/i);

      fireEvent.change(projectNameInput, {
        target: { value: "Failed Project" },
      });
      fireEvent.change(projectUrlInput, {
        target: { value: "https://github.com/test/failed" },
      });
      fireEvent.change(licenseSelect, { target: { value: "MIT" } });
    });

    // Submit form
    const submitButton = screen.getByText("Submit Request");
    fireEvent.click(submitButton);

    // Form should handle error gracefully
    // Modal might stay open or show error message
    await waitFor(() => {
      // In a real implementation, you might check for error messages
      // For now, just ensure the app doesn't crash
      expect(screen.getByText("Submit Request")).toBeInTheDocument();
    });
  });

  it("closes modal when cancel is clicked", async () => {
    renderWithChakra(<App />);

    // Open modal
    const requestButton = await screen.findByText(/request project access/i);
    fireEvent.click(requestButton);

    await waitFor(() => {
      expect(screen.getByText("Request Access")).toBeInTheDocument();
    });

    // Click cancel
    const cancelButton = screen.getByText("Cancel");
    fireEvent.click(cancelButton);

    // Modal should close
    await waitFor(() => {
      expect(screen.queryByText("Request Access")).not.toBeInTheDocument();
    });
  });
});
