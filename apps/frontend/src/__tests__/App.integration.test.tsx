import { render, screen } from "@testing-library/react";
import { ChakraProvider, defaultSystem } from "@chakra-ui/react";
import App from "../App";

const renderWithChakra = (component: React.ReactElement) => {
  return render(
    <ChakraProvider value={defaultSystem}>{component}</ChakraProvider>,
  );
};

describe("App Integration Tests", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("renders without crashing", async () => {
    renderWithChakra(<App />);
    expect(screen.getByText(/sourcestream/i)).toBeInTheDocument();
  });

  it("renders main layout structure", () => {
    renderWithChakra(<App />);
    const mainElement = screen.getByRole("main");
    expect(mainElement).toBeInTheDocument();
  });
});
