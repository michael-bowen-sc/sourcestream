// Simple HTTP client for gRPC-Web communication
const GRPC_URL = import.meta.env.VITE_GRPC_URL || "http://localhost:8080";

export interface SubmitRequestData {
  type: "project" | "pullrequest" | "access";
  title: string;
  projectName?: string;
  projectUrl?: string;
  license?: string;
  role?: string;
}

// Simple HTTP-based API client (can be replaced with proper gRPC-Web later)
const apiCall = async (endpoint: string, data: any) => {
  const response = await fetch(`${GRPC_URL}/api/${endpoint}`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });

  if (!response.ok) {
    throw new Error(`API call failed: ${response.statusText}`);
  }

  return response.json();
};

export const submitRequest = async (
  data: SubmitRequestData,
  requesterId: string,
) => {
  try {
    switch (data.type) {
      case "project":
        return await apiCall("submit-project-request", {
          title: data.title,
          projectUrl: data.projectUrl || "",
          license: data.license || "",
          requesterId,
        });

      case "pullrequest":
        return await apiCall("submit-pullrequest-approval", {
          title: data.title,
          projectName: data.projectName || "",
          prUrl: data.projectUrl || "",
          requesterId,
        });

      case "access":
        return await apiCall("submit-access-request", {
          title: data.title,
          projectName: data.projectName || "",
          role: data.role || "",
          requesterId,
        });

      default:
        throw new Error(`Unsupported request type: ${data.type}`);
    }
  } catch (error) {
    console.error("Failed to submit request:", error);
    throw error;
  }
};

export const getRequests = async (userId: string, status?: string) => {
  try {
    const response = await apiCall("get-requests", {
      userId,
      status: status || "",
      page: 1,
      limit: 100,
    });
    return response.requests;
  } catch (error) {
    console.error("Failed to get requests:", error);
    throw error;
  }
};
