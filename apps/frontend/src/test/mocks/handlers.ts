import { http, HttpResponse } from "msw";

export const handlers = [
  // Mock API endpoints for testing
  http.post(
    "http://localhost:8080/api/submit-project-request",
    () => {
      return HttpResponse.json({ success: true, id: "mock-request-id" }, { status: 200 });
    },
  ),

  http.get("http://localhost:8080/api/requests", () => {
    return HttpResponse.json([
      {
        id: "req-1",
        type: "project",
        title: "Test Project Request",
        status: "pending",
        projectName: "Test Project",
        createdAt: "2024-01-01T00:00:00Z",
      },
    ], { status: 200 });
  }),

  http.post(
    "http://localhost:8080/api/submit-access-request",
    () => {
      return HttpResponse.json({ success: true, id: "mock-access-id" }, { status: 200 });
    },
  ),
];
