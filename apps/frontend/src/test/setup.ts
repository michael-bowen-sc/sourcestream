import "@testing-library/jest-dom";
import { TextEncoder, TextDecoder } from "util";

// Polyfill for TextEncoder/TextDecoder
global.TextEncoder = TextEncoder;
global.TextDecoder = TextDecoder as unknown as typeof global.TextDecoder;

// Polyfill for structuredClone (needed for Chakra UI)
if (typeof global.structuredClone === "undefined") {
  global.structuredClone = (obj: unknown) => {
    if (obj === undefined) return undefined;
    return JSON.parse(JSON.stringify(obj));
  };
}

// Mock environment variables
process.env.VITE_GRPC_URL = "http://localhost:8080";

// Mock fetch for API calls
global.fetch = jest.fn();

// Mock the grpcClient module
jest.mock("../services/grpcClient", () => ({
  getRequests: jest.fn(async () => []),
  submitRequest: jest.fn(async () => ({ success: true })),
}));

// Mock console methods to reduce noise in tests
const originalError = console.error;
beforeAll(() => {
  console.error = (...args: unknown[]) => {
    if (
      typeof args[0] === "string" &&
      args[0].includes("Warning: ReactDOM.render is deprecated")
    ) {
      return;
    }
    originalError.call(console, ...args);
  };
});

afterAll(() => {
  console.error = originalError;
});

// Reset all mocks after each test
afterEach(() => {
  jest.clearAllMocks();
});
