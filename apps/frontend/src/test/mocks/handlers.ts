import { rest } from "msw";

export const handlers = [
  // Mock API endpoints for testing
  rest.post(
    "http://localhost:8080/api/submit-project-request",
    (req, res, ctx) => {
      return res(
        ctx.status(200),
        ctx.json({ success: true, id: "mock-request-id" }),
      );
    },
  ),

  rest.get("http://localhost:8080/api/requests", (req, res, ctx) => {
    const userId = req.url.searchParams.get("userId");
    const status = req.url.searchParams.get("status");

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
      ]),
    );
  }),

  rest.post(
    "http://localhost:8080/api/submit-access-request",
    (req, res, ctx) => {
      return res(
        ctx.status(200),
        ctx.json({ success: true, id: "mock-access-id" }),
      );
    },
  ),
];
