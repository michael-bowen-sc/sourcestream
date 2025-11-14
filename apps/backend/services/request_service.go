// Package services contains gRPC service implementations for the backend.
package services

import (
	"context"
	"database/sql"
	"fmt"
	"time"

	"sourcestream/backend/models"
	pb "sourcestream/backend/pb"
	"sourcestream/backend/repository"

	"github.com/google/uuid"
)

// RequestService implements the gRPC RequestService server.
type RequestService struct {
	pb.UnimplementedRequestServiceServer
	requestRepo *repository.RequestRepository
}

// NewRequestService creates a new RequestService with the given database.
func NewRequestService(db *sql.DB) *RequestService {
	return &RequestService{
		requestRepo: repository.NewRequestRepository(db),
	}
}

// SubmitProjectRequest handles submission of a project request.
func (s *RequestService) SubmitProjectRequest(_ context.Context, req *pb.SubmitProjectRequestRequest) (*pb.SubmitProjectRequestResponse, error) {
	// Mock implementation - in real app, save to database
	request := &models.Request{
		ID:          uuid.New().String(),
		Type:        "project",
		Title:       req.GetTitle(),
		Status:      "pending",
		RequesterID: req.GetRequesterId(),
		ProjectURL:  req.GetProjectUrl(),
		License:     req.GetLicense(),
		CreatedAt:   time.Now(),
		UpdatedAt:   time.Now(),
	}

	// TODO: Save request to database
	_ = request

	return &pb.SubmitProjectRequestResponse{
		RequestId: request.ID,
		Message:   "Project request submitted successfully",
	}, nil
}

// SubmitPullRequestApproval handles submission of a pull request approval request.
func (s *RequestService) SubmitPullRequestApproval(_ context.Context, req *pb.SubmitPullRequestApprovalRequest) (*pb.SubmitPullRequestApprovalResponse, error) {
	// Mock implementation - in real app, save to database
	request := &models.Request{
		ID:          uuid.New().String(),
		Type:        "pullrequest",
		Title:       req.GetTitle(),
		Status:      "pending",
		RequesterID: req.GetRequesterId(),
		ProjectName: req.GetProjectName(),
		ProjectURL:  req.GetPrUrl(),
		CreatedAt:   time.Now(),
		UpdatedAt:   time.Now(),
	}

	// TODO: Save request to database
	_ = request

	return &pb.SubmitPullRequestApprovalResponse{
		RequestId: request.ID,
		Message:   "Pull request approval submitted successfully",
	}, nil
}

// SubmitAccessRequest handles submission of an access request.
func (s *RequestService) SubmitAccessRequest(_ context.Context, req *pb.SubmitAccessRequestRequest) (*pb.SubmitAccessRequestResponse, error) {
	request := &models.Request{
		ID:          uuid.New().String(),
		Type:        "access",
		Title:       req.GetTitle(),
		Status:      "pending",
		RequesterID: req.GetRequesterId(),
		ProjectName: req.GetProjectName(),
		Role:        req.GetRole(),
		CreatedAt:   time.Now(),
		UpdatedAt:   time.Now(),
	}

	// Save request to database using repository
	err := s.requestRepo.CreateRequest(request)
	if err != nil {
		return nil, fmt.Errorf("failed to create access request: %w", err)
	}

	return &pb.SubmitAccessRequestResponse{
		RequestId: request.ID,
		Message:   "Access request submitted successfully",
	}, nil
}

// SubmitContributionPermissionRequest handles submission of a contribution permission request.
func (s *RequestService) SubmitContributionPermissionRequest(_ context.Context, req *pb.SubmitContributionPermissionRequestRequest) (*pb.SubmitContributionPermissionRequestResponse, error) {
	// Mock implementation - in real app, save to database
	request := &models.Request{
		ID:                    uuid.New().String(),
		Type:                  "contribution_permission",
		Title:                 req.GetTitle(),
		Status:                "pending",
		RequesterID:           req.GetRequesterId(),
		ApprovedProjectID:     func() *string { s := req.GetApprovedProjectId(); return &s }(),
		BusinessJustification: func() *string { s := req.GetBusinessJustification(); return &s }(),
		CreatedAt:             time.Now(),
		UpdatedAt:             time.Now(),
	}

	// TODO: Save request to database
	_ = request

	return &pb.SubmitContributionPermissionRequestResponse{
		RequestId: request.ID,
		Message:   "Contribution permission request submitted successfully",
	}, nil
}

// GetRequests returns requests for a user, optionally filtered by status.
func (s *RequestService) GetRequests(_ context.Context, req *pb.GetRequestsRequest) (*pb.GetRequestsResponse, error) {
	// Get requests from database using repository
	requests, err := s.requestRepo.GetRequestsByUser(req.GetUserId())
	if err != nil {
		return nil, fmt.Errorf("failed to get requests: %w", err)
	}

	// Convert to protobuf format
	pbRequests := make([]*pb.Request, len(requests))
	for i, request := range requests {
		pbRequests[i] = &pb.Request{
			Id:          request.ID,
			Type:        request.Type,
			Title:       request.Title,
			Status:      request.Status,
			RequesterId: request.RequesterID,
			ProjectName: request.ProjectName,
			CreatedAt:   request.CreatedAt.Format("2006-01-02T15:04:05Z"),
		}
	}

	// Filter by status if provided
	if req.GetStatus() != "" {
		var filtered []*pb.Request

		for _, r := range pbRequests {
			if r.Status == req.GetStatus() {
				filtered = append(filtered, r)
			}
		}

		pbRequests = filtered
	}

	total := len(pbRequests)
	if total > 2147483647 { // clamp to int32 max
		total = 2147483647
	}

	return &pb.GetRequestsResponse{
		Requests: pbRequests,
		Total:    int32(total), // #nosec G115 -- total is clamped to int32 range above
	}, nil
}
