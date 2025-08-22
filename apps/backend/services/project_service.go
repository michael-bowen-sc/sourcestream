package services

import (
	"context"
	"database/sql"
	"time"

	"sourcestream/backend/models"
	"sourcestream/backend/repository"
	pb "sourcestream/backend/pb"

	"github.com/google/uuid"
)

type ProjectService struct {
	pb.UnimplementedProjectServiceServer
	projectRepo *repository.ProjectRepository
}

func NewProjectService(db *sql.DB) *ProjectService {
	return &ProjectService{
		projectRepo: repository.NewProjectRepository(db),
	}
}

func (s *ProjectService) GetAuthoredProjects(ctx context.Context, req *pb.GetAuthoredProjectsRequest) (*pb.GetAuthoredProjectsResponse, error) {
	// Mock data - in real app, fetch from database
	projects := []*pb.Project{
		{
			Id:           "1",
			Name:         "React Components Library",
			Description:  "Reusable UI components",
			Status:       "active",
			LastActivity: "2 days ago",
			Url:          "https://github.com/company/react-components",
			License:      "MIT",
			OwnerId:      req.GetUserId(),
		},
		{
			Id:           "2",
			Name:         "API Gateway Service",
			Description:  "Microservices gateway",
			Status:       "approved",
			LastActivity: "1 week ago",
			Url:          "https://github.com/company/api-gateway",
			License:      "Apache-2.0",
			OwnerId:      req.GetUserId(),
		},
		{
			Id:           "3",
			Name:         "Data Analytics Tool",
			Description:  "Business intelligence dashboard",
			Status:       "pending",
			LastActivity: "3 days ago",
			Url:          "https://github.com/company/analytics-tool",
			License:      "MIT",
			OwnerId:      req.GetUserId(),
		},
	}

	return &pb.GetAuthoredProjectsResponse{
		Projects: projects,
		Total:    int32(len(projects)),
	}, nil
}

func (s *ProjectService) GetContributedProjects(ctx context.Context, req *pb.GetContributedProjectsRequest) (*pb.GetContributedProjectsResponse, error) {
	// Mock data - in real app, fetch from database
	projects := []*pb.Project{
		{
			Id:           "4",
			Name:         "Open Source ML Framework",
			Description:  "Machine learning utilities",
			Status:       "active",
			LastActivity: "1 day ago",
			Url:          "https://github.com/opensource/ml-framework",
			License:      "MIT",
			OwnerId:      "other-user",
		},
		{
			Id:           "5",
			Name:         "DevOps Automation",
			Description:  "CI/CD pipeline tools",
			Status:       "active",
			LastActivity: "4 days ago",
			Url:          "https://github.com/opensource/devops-automation",
			License:      "Apache-2.0",
			OwnerId:      "other-user",
		},
		{
			Id:           "6",
			Name:         "Security Scanner",
			Description:  "Vulnerability assessment tool",
			Status:       "approved",
			LastActivity: "1 week ago",
			Url:          "https://github.com/opensource/security-scanner",
			License:      "GPL-3.0",
			OwnerId:      "other-user",
		},
		{
			Id:           "7",
			Name:         "Documentation Generator",
			Description:  "Auto-generate API docs",
			Status:       "active",
			LastActivity: "2 days ago",
			Url:          "https://github.com/opensource/doc-generator",
			License:      "MIT",
			OwnerId:      "other-user",
		},
	}

	return &pb.GetContributedProjectsResponse{
		Projects: projects,
		Total:    int32(len(projects)),
	}, nil
}

func (s *ProjectService) GetApprovedProjects(ctx context.Context, req *pb.GetApprovedProjectsRequest) (*pb.GetApprovedProjectsResponse, error) {
	// Mock data - in real app, fetch from database
	projects := []*pb.Project{
		{
			Id:           "8",
			Name:         "Cloud Infrastructure",
			Description:  "Kubernetes deployment configs",
			Status:       "approved",
			LastActivity: "5 days ago",
			Url:          "https://github.com/company/k8s-infrastructure",
			License:      "Apache-2.0",
			OwnerId:      "other-user",
		},
		{
			Id:           "9",
			Name:         "Monitoring Dashboard",
			Description:  "System health monitoring",
			Status:       "approved",
			LastActivity: "1 week ago",
			Url:          "https://github.com/company/monitoring-dashboard",
			License:      "MIT",
			OwnerId:      "other-user",
		},
		{
			Id:           "10",
			Name:         "Authentication Service",
			Description:  "OAuth2 implementation",
			Status:       "approved",
			LastActivity: "3 days ago",
			Url:          "https://github.com/company/auth-service",
			License:      "MIT",
			OwnerId:      "other-user",
		},
		{
			Id:           "11",
			Name:         "Logging Framework",
			Description:  "Centralized logging solution",
			Status:       "approved",
			LastActivity: "6 days ago",
			Url:          "https://github.com/company/logging-framework",
			License:      "Apache-2.0",
			OwnerId:      "other-user",
		},
		{
			Id:           "12",
			Name:         "Testing Utilities",
			Description:  "Automated testing tools",
			Status:       "approved",
			LastActivity: "2 weeks ago",
			Url:          "https://github.com/company/testing-utils",
			License:      "MIT",
			OwnerId:      "other-user",
		},
	}

	return &pb.GetApprovedProjectsResponse{
		Projects: projects,
		Total:    int32(len(projects)),
	}, nil
}

func (s *ProjectService) CreateProject(ctx context.Context, req *pb.CreateProjectRequest) (*pb.CreateProjectResponse, error) {
	// Mock implementation - in real app, save to database
	project := &models.Project{
		ID:          uuid.New().String(),
		Name:        req.GetName(),
		Description: req.GetDescription(),
		URL:         req.GetUrl(),
		License:     req.GetLicense(),
		OwnerID:     req.GetOwnerId(),
		Status:      "pending",
		CreatedAt:   time.Now(),
		UpdatedAt:   time.Now(),
	}

	// TODO: Save project to database
	_ = project

	pbProject := &pb.Project{
		Id:          project.ID,
		Name:        project.Name,
		Description: project.Description,
		Status:      project.Status,
		Url:         project.URL,
		License:     project.License,
		OwnerId:     project.OwnerID,
	}

	return &pb.CreateProjectResponse{
		Project: pbProject,
		Message: "Project created successfully",
	}, nil
}
