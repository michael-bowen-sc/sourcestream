package services

import (
	"context"
	"database/sql"
	"fmt"
	"time"

	"sourcestream/backend/models"
	"sourcestream/backend/repository"
	pb "sourcestream/backend/pb"

	"github.com/google/uuid"
)

type RequestService struct {
	pb.UnimplementedRequestServiceServer
	requestRepo *repository.RequestRepository
}

func NewRequestService(db *sql.DB) *RequestService {
	return &RequestService{
		requestRepo: repository.NewRequestRepository(db),
	}
}

func (s *RequestService) SubmitProjectRequest(ctx context.Context, req *pb.SubmitProjectRequestRequest) (*pb.SubmitProjectRequestResponse, error) {
	// Mock implementation - in real app, save to database
	request := &models.Request{
		ID:          uuid.New().String(),
		Type:        "project",
		Title:       req.GetTitle(),
		Description: req.GetDescription(),
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

func (s *RequestService) SubmitPullRequestApproval(ctx context.Context, req *pb.SubmitPullRequestApprovalRequest) (*pb.SubmitPullRequestApprovalResponse, error) {
	// Mock implementation - in real app, save to database
	request := &models.Request{
		ID:          uuid.New().String(),
		Type:        "pullrequest",
		Title:       req.GetTitle(),
		Description: req.GetDescription(),
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

func (s *RequestService) SubmitAccessRequest(ctx context.Context, req *pb.SubmitAccessRequestRequest) (*pb.SubmitAccessRequestResponse, error) {
	request := &models.Request{
		ID:          uuid.New().String(),
		Type:        "access",
		Title:       req.GetTitle(),
		Description: req.GetDescription(),
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

func (s *RequestService) GetRequests(ctx context.Context, req *pb.GetRequestsRequest) (*pb.GetRequestsResponse, error) {
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
			Description: request.Description,
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

	return &pb.GetRequestsResponse{
		Requests: pbRequests,
		Total:    int32(len(pbRequests)),
	}, nil
}
