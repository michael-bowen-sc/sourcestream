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

type UserService struct {
	pb.UnimplementedUserServiceServer
	userRepo *repository.UserRepository
}

func NewUserService(db *sql.DB) *UserService {
	return &UserService{
		userRepo: repository.NewUserRepository(db),
	}
}

func (s *UserService) RegisterContributor(ctx context.Context, req *pb.RegisterContributorRequest) (*pb.RegisterContributorResponse, error) {
	user := &models.User{
		ID:             uuid.New().String(),
		CorporateID:    req.GetCorporateId(),
		GithubUsername: req.GetGithubUsername(),
		Email:          req.GetCorporateId() + "@company.com", // Default email
		FullName:       req.GetGithubUsername(),              // Use GitHub username as fallback
		Department:     "Engineering",                        // Default department
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

func (s *UserService) GetContributor(ctx context.Context, req *pb.GetContributorRequest) (*pb.GetContributorResponse, error) {
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

func (s *UserService) GetUserProfile(ctx context.Context, req *pb.GetUserProfileRequest) (*pb.GetUserProfileResponse, error) {
	// Return empty response for now - protobuf needs to be updated
	return &pb.GetUserProfileResponse{}, nil
}
