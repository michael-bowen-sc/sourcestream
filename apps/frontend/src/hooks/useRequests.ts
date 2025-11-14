import { useState, useEffect, useCallback } from "react";
import {
  submitRequest,
  getRequests,
  type SubmitRequestData,
} from "../services/grpcClient";
import { type Request } from "../data/mockData";

export const useRequests = (userId: string) => {
  const [requests, setRequests] = useState<Request[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchRequests = useCallback(
    async (status?: string) => {
      setLoading(true);
      setError(null);
      try {
        const fetchedRequests = await getRequests(userId, status);
        setRequests(
          fetchedRequests.map((req: any) => ({
            id: req.id,
            type: req.type as "project" | "pullrequest" | "access",
            title: req.title,
            status: req.status as
              | "pending"
              | "approved"
              | "rejected"
              | "in_review",
            projectName: req.projectName,
            createdAt: req.createdAt,
          })),
        );
      } catch (err) {
        setError(
          err instanceof Error ? err.message : "Failed to fetch requests",
        );
        console.error("Error fetching requests:", err);
      } finally {
        setLoading(false);
      }
    },
    [userId],
  );

  const submitNewRequest = useCallback(
    async (data: SubmitRequestData) => {
      setLoading(true);
      setError(null);
      try {
        await submitRequest(data, userId);
        // Refresh requests after successful submission
        await fetchRequests();
        return true;
      } catch (err) {
        setError(
          err instanceof Error ? err.message : "Failed to submit request",
        );
        console.error("Error submitting request:", err);
        return false;
      } finally {
        setLoading(false);
      }
    },
    [userId, fetchRequests],
  );

  useEffect(() => {
    fetchRequests();
  }, [fetchRequests]);

  return {
    requests,
    loading,
    error,
    submitNewRequest,
    refreshRequests: fetchRequests,
  };
};
