import { render, screen, fireEvent } from "@testing-library/react";
import { ChakraProvider, defaultSystem } from "@chakra-ui/react";
import RequestModal from "../RequestModal";

const renderWithChakra = (component: React.ReactElement) => {
  return render(
    <ChakraProvider value={defaultSystem}>{component}</ChakraProvider>,
  );
};

describe("RequestModal", () => {
  const mockOnSubmit = jest.fn();
  const mockOnCancel = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("renders modal when visible is true", () => {
    renderWithChakra(
      <RequestModal
        visible={true}
        onCancel={mockOnCancel}
        onSubmit={mockOnSubmit}
      />,
    );

    expect(screen.getByText(/New Project Request|New Request/i)).toBeInTheDocument();
  });

  it("does not render modal when visible is false", () => {
    renderWithChakra(
      <RequestModal
        visible={false}
        onCancel={mockOnCancel}
        onSubmit={mockOnSubmit}
      />,
    );

    expect(screen.queryByText(/New Project Request/i)).not.toBeInTheDocument();
  });

  it("calls onCancel when cancel button is clicked", () => {
    renderWithChakra(
      <RequestModal
        visible={true}
        onCancel={mockOnCancel}
        onSubmit={mockOnSubmit}
      />,
    );

    const cancelButton = screen.getByText("Cancel");
    fireEvent.click(cancelButton);

    expect(mockOnCancel).toHaveBeenCalled();
  });
});
