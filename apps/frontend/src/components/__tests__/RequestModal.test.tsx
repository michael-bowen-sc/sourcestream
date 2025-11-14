import React from "react";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { ChakraProvider } from "@chakra-ui/react";
import RequestModal from "../RequestModal";
import { RequestFormData } from "../RequestModal";

// Mock data for testing
const mockFormData: RequestFormData = {
  type: "project",
  title: "Test Project",
  projectName: "My Test Project",
  projectUrl: "https://github.com/test/project",
  license: "MIT",
  role: "contributor",
};

const renderWithChakra = (component: React.ReactElement) => {
  return render(<ChakraProvider>{component}</ChakraProvider>);
};

describe("RequestModal", () => {
  const mockOnSubmit = jest.fn();
  const mockOnClose = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("renders modal when isOpen is true", () => {
    renderWithChakra(
      <RequestModal
        isOpen={true}
        onClose={mockOnClose}
        onSubmit={mockOnSubmit}
      />,
    );

    expect(screen.getByText("Request Access")).toBeInTheDocument();
    expect(screen.getByLabelText(/request type/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/title/i)).toBeInTheDocument();
  });

  it("does not render modal when isOpen is false", () => {
    renderWithChakra(
      <RequestModal
        isOpen={false}
        onClose={mockOnClose}
        onSubmit={mockOnSubmit}
      />,
    );

    expect(screen.queryByText("Request Access")).not.toBeInTheDocument();
  });

  it("shows project-specific fields when project type is selected", async () => {
    renderWithChakra(
      <RequestModal
        isOpen={true}
        onClose={mockOnClose}
        onSubmit={mockOnSubmit}
      />,
    );

    const typeSelect = screen.getByLabelText(/request type/i);
    fireEvent.change(typeSelect, { target: { value: "project" } });

    await waitFor(() => {
      expect(screen.getByLabelText(/project name/i)).toBeInTheDocument();
      expect(screen.getByLabelText(/project url/i)).toBeInTheDocument();
      expect(screen.getByLabelText(/license/i)).toBeInTheDocument();
    });
  });

  it("shows access-specific fields when access type is selected", async () => {
    renderWithChakra(
      <RequestModal
        isOpen={true}
        onClose={mockOnClose}
        onSubmit={mockOnSubmit}
      />,
    );

    const typeSelect = screen.getByLabelText(/request type/i);
    fireEvent.change(typeSelect, { target: { value: "access" } });

    await waitFor(() => {
      expect(screen.getByLabelText(/project name/i)).toBeInTheDocument();
      expect(screen.getByLabelText(/role/i)).toBeInTheDocument();
    });
  });

  it("validates required fields before submission", async () => {
    renderWithChakra(
      <RequestModal
        isOpen={true}
        onClose={mockOnClose}
        onSubmit={mockOnSubmit}
      />,
    );

    const submitButton = screen.getByText("Submit Request");
    fireEvent.click(submitButton);

    // Should not call onSubmit with empty required fields
    expect(mockOnSubmit).not.toHaveBeenCalled();
  });

  it("submits form with valid data", async () => {
    renderWithChakra(
      <RequestModal
        isOpen={true}
        onClose={mockOnClose}
        onSubmit={mockOnSubmit}
      />,
    );

    // Fill out form
    const typeSelect = screen.getByLabelText(/request type/i);
    const titleInput = screen.getByLabelText(/title/i);

    fireEvent.change(typeSelect, { target: { value: "project" } });
    fireEvent.change(titleInput, { target: { value: "Test Project" } });

    await waitFor(() => {
      const projectNameInput = screen.getByLabelText(/project name/i);
      const projectUrlInput = screen.getByLabelText(/project url/i);
      const licenseSelect = screen.getByLabelText(/license/i);

      fireEvent.change(projectNameInput, {
        target: { value: "My Test Project" },
      });
      fireEvent.change(projectUrlInput, {
        target: { value: "https://github.com/test/project" },
      });
      fireEvent.change(licenseSelect, { target: { value: "MIT" } });
    });

    const submitButton = screen.getByText("Submit Request");
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(mockOnSubmit).toHaveBeenCalledWith(
        expect.objectContaining({
          type: "project",
          title: "Test Project",
          projectName: "My Test Project",
          projectUrl: "https://github.com/test/project",
          license: "MIT",
        }),
      );
    });
  });

  it("calls onClose when cancel button is clicked", () => {
    renderWithChakra(
      <RequestModal
        isOpen={true}
        onClose={mockOnClose}
        onSubmit={mockOnSubmit}
      />,
    );

    const cancelButton = screen.getByText("Cancel");
    fireEvent.click(cancelButton);

    expect(mockOnClose).toHaveBeenCalled();
  });

  it("calls onClose when close button (X) is clicked", () => {
    renderWithChakra(
      <RequestModal
        isOpen={true}
        onClose={mockOnClose}
        onSubmit={mockOnSubmit}
      />,
    );

    const closeButton = screen.getByLabelText(/close/i);
    fireEvent.click(closeButton);

    expect(mockOnClose).toHaveBeenCalled();
  });

  it("resets form when modal is closed and reopened", async () => {
    const { rerender } = renderWithChakra(
      <RequestModal
        isOpen={true}
        onClose={mockOnClose}
        onSubmit={mockOnSubmit}
      />,
    );

    // Fill out form
    const titleInput = screen.getByLabelText(/title/i);
    fireEvent.change(titleInput, { target: { value: "Test Title" } });

    // Close modal
    rerender(
      <ChakraProvider>
        <RequestModal
          isOpen={false}
          onClose={mockOnClose}
          onSubmit={mockOnSubmit}
        />
      </ChakraProvider>,
    );

    // Reopen modal
    rerender(
      <ChakraProvider>
        <RequestModal
          isOpen={true}
          onClose={mockOnClose}
          onSubmit={mockOnSubmit}
        />
      </ChakraProvider>,
    );

    // Form should be reset
    const newTitleInput = screen.getByLabelText(/title/i);
    expect(newTitleInput).toHaveValue("");
  });
});
