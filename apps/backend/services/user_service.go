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

// UserService implements the gRPC UserService server.
type UserService struct {
	pb.UnimplementedUserServiceServer
	userRepo *repository.UserRepository
}

// NewUserService creates a new UserService with the given database.
func NewUserService(db *sql.DB) *UserService {
	return &UserService{
		userRepo: repository.NewUserRepository(db),
	}
}

// RegisterContributor registers a new contributor in the system.
func (s *UserService) RegisterContributor(_ context.Context, req *pb.RegisterContributorRequest) (*pb.RegisterContributorResponse, error) {
	user := &models.User{
		ID:             uuid.New().String(),
		CorporateID:    req.GetCorporateId(),
		GithubUsername: req.GetGithubUsername(),
		Email:          req.GetCorporateId() + "@company.com", // Default email
		FullName:       req.GetGithubUsername(),               // Use GitHub username as fallback
		Department:     "Engineering",                         // Default department
		Role:           "contributor",
		IsActive:       true,
		CreatedAt:      time.Now(),
		UpdatedAt:      time.Now(),
	}

	err := s.userRepo.CreateUser(user)
	if err != nil {
		return nil, fmt.Errorf("failed to register contributor: %w", err)
	}

	return &pb.RegisterContributorResponse{
		Message: "Contributor registered successfully",
	}, nil
}

// GetContributor returns contributor details by corporate ID.
func (s *UserService) GetContributor(_ context.Context, req *pb.GetContributorRequest) (*pb.GetContributorResponse, error) {
	user, err := s.userRepo.GetUserByCorporateID(req.GetCorporateId())
	if err != nil {
		return nil, fmt.Errorf("contributor not found: %w", err)
	}

	// TODO: Get approved projects from project repository
	approvedProjects := []string{"React Component Library", "API Gateway Service"}

	return &pb.GetContributorResponse{
		CorporateId:      user.CorporateID,
		GithubUsername:   user.GithubUsername,
		ApprovedProjects: approvedProjects,
	}, nil
}

// GetUserProfile returns a user's profile information.
func (s *UserService) GetUserProfile(_ context.Context, _ *pb.GetUserProfileRequest) (*pb.GetUserProfileResponse, error) {
	// Return empty response for now - protobuf needs to be updated
	return &pb.GetUserProfileResponse{}, nil
}
