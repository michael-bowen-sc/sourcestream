// Generated protobuf definitions for frontend
// This is a simplified version - in production, use proper protobuf-ts or similar

export interface SubmitProjectRequestRequest {
  title: string;
  projectUrl: string;
  license: string;
  requesterId: string;
}

export interface SubmitProjectRequestResponse {
  requestId: string;
  message: string;
}

export interface SubmitPullRequestApprovalRequest {
  title: string;
  projectName: string;
  prUrl: string;
  requesterId: string;
}

export interface SubmitPullRequestApprovalResponse {
  requestId: string;
  message: string;
}

export interface SubmitAccessRequestRequest {
  title: string;
  projectName: string;
  role: string;
  requesterId: string;
}

export interface SubmitAccessRequestResponse {
  requestId: string;
  message: string;
}

export interface GetRequestsRequest {
  userId: string;
  status: string;
  page: number;
  limit: number;
}

export interface Request {
  id: string;
  type: string;
  title: string;
  status: string;
  requesterId: string;
  createdAt: string;
  projectName: string;
}

export interface GetRequestsResponse {
  requests: Request[];
  total: number;
}

// Service definition for nice-grpc-web
export const RequestServiceDefinition = {
  submitProjectRequest: {
    path: "/backend.RequestService/SubmitProjectRequest",
    requestStream: false,
    responseStream: false,
    requestType: {} as SubmitProjectRequestRequest,
    responseType: {} as SubmitProjectRequestResponse,
  },
  submitPullRequestApproval: {
    path: "/backend.RequestService/SubmitPullRequestApproval",
    requestStream: false,
    responseStream: false,
    requestType: {} as SubmitPullRequestApprovalRequest,
    responseType: {} as SubmitPullRequestApprovalResponse,
  },
  submitAccessRequest: {
    path: "/backend.RequestService/SubmitAccessRequest",
    requestStream: false,
    responseStream: false,
    requestType: {} as SubmitAccessRequestRequest,
    responseType: {} as SubmitAccessRequestResponse,
  },
  getRequests: {
    path: "/backend.RequestService/GetRequests",
    requestStream: false,
    responseStream: false,
    requestType: {} as GetRequestsRequest,
    responseType: {} as GetRequestsResponse,
  },
};
