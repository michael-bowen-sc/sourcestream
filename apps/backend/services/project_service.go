// Package services contains gRPC service implementations for the backend.
package services

import (
	"context"
	"database/sql"
	"time"

	"sourcestream/backend/models"
	pb "sourcestream/backend/pb"
	"sourcestream/backend/repository"

	"github.com/google/uuid"
)

// ProjectService implements the gRPC ProjectService server.
type ProjectService struct {
	pb.UnimplementedProjectServiceServer
	projectRepo *repository.ProjectRepository
}

// NewProjectService creates a new ProjectService with the given database.
func NewProjectService(db *sql.DB) *ProjectService {
	return &ProjectService{
		projectRepo: repository.NewProjectRepository(db),
	}
}

// GetAuthoredProjects returns projects authored by the specified user.
func (s *ProjectService) GetAuthoredProjects(_ context.Context, req *pb.GetAuthoredProjectsRequest) (*pb.GetAuthoredProjectsResponse, error) {
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

	total := len(projects)
	if total > 2147483647 { // clamp to int32 max
		total = 2147483647
	}

	return &pb.GetAuthoredProjectsResponse{
		Projects: projects,
		Total:    int32(total), // #nosec G115 -- total is clamped to int32 range above
	}, nil
}

// GetContributedProjects returns projects the user contributes to.
func (s *ProjectService) GetContributedProjects(_ context.Context, _ *pb.GetContributedProjectsRequest) (*pb.GetContributedProjectsResponse, error) {
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

	total := len(projects)
	if total > 2147483647 {
		total = 2147483647
	}

	return &pb.GetContributedProjectsResponse{
		Projects: projects,
		Total:    int32(total), // #nosec G115 -- total is clamped to int32 range above
	}, nil
}

// GetApprovedProjects returns approved projects relevant to the user.
func (s *ProjectService) GetApprovedProjects(_ context.Context, _ *pb.GetApprovedProjectsRequest) (*pb.GetApprovedProjectsResponse, error) {
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

	total := len(projects)
	if total > 2147483647 {
		total = 2147483647
	}

	return &pb.GetApprovedProjectsResponse{
		Projects: projects,
		Total:    int32(total), // #nosec G115 -- total is clamped to int32 range above
	}, nil
}

// CreateProject creates a new project.
func (s *ProjectService) CreateProject(_ context.Context, req *pb.CreateProjectRequest) (*pb.CreateProjectResponse, error) {
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

// GetApprovedProjectsList returns the catalog of pre-approved projects.
func (s *ProjectService) GetApprovedProjectsList(_ context.Context, req *pb.GetApprovedProjectsListRequest) (*pb.GetApprovedProjectsListResponse, error) {
	// Mock data - in real app, fetch from approved_projects table
	approvedProjects := []*pb.ApprovedProject{
		{
			Id:                       "1",
			Name:                     "React",
			Description:              "A JavaScript library for building user interfaces",
			RepositoryUrl:            "https://github.com/facebook/react",
			License:                  "MIT",
			ContributionType:         "CLA",
			MaintainerContact:        "react-team@meta.com",
			ApprovalDate:             "2024-01-15T00:00:00Z",
			IsActive:                 true,
			AllowedContributionTypes: []string{"bug-fix", "feature", "documentation", "testing"},
		},
		{
			Id:                       "2",
			Name:                     "Vue.js",
			Description:              "The Progressive JavaScript Framework",
			RepositoryUrl:            "https://github.com/vuejs/vue",
			License:                  "MIT",
			ContributionType:         "DCO",
			MaintainerContact:        "team@vuejs.org",
			ApprovalDate:             "2024-01-10T00:00:00Z",
			IsActive:                 true,
			AllowedContributionTypes: []string{"bug-fix", "feature", "documentation", "testing", "maintenance"},
		},
		{
			Id:                       "3",
			Name:                     "Angular",
			Description:              "Deliver web apps with confidence",
			RepositoryUrl:            "https://github.com/angular/angular",
			License:                  "MIT",
			ContributionType:         "CLA",
			MaintainerContact:        "angular-team@google.com",
			ApprovalDate:             "2024-01-20T00:00:00Z",
			IsActive:                 true,
			AllowedContributionTypes: []string{"bug-fix", "feature", "documentation", "testing"},
		},
		{
			Id:                       "4",
			Name:                     "Node.js",
			Description:              "Node.js JavaScript runtime",
			RepositoryUrl:            "https://github.com/nodejs/node",
			License:                  "MIT",
			ContributionType:         "DCO",
			MaintainerContact:        "nodejs-team@nodejs.org",
			ApprovalDate:             "2024-01-25T00:00:00Z",
			IsActive:                 true,
			AllowedContributionTypes: []string{"bug-fix", "feature", "documentation", "testing", "maintenance"},
		},
		{
			Id:                       "5",
			Name:                     "TypeScript",
			Description:              "TypeScript is a superset of JavaScript",
			RepositoryUrl:            "https://github.com/microsoft/TypeScript",
			License:                  "Apache-2.0",
			ContributionType:         "CLA",
			MaintainerContact:        "typescript@microsoft.com",
			ApprovalDate:             "2024-02-01T00:00:00Z",
			IsActive:                 true,
			AllowedContributionTypes: []string{"bug-fix", "feature", "documentation", "testing"},
		},
		{
			Id:                       "6",
			Name:                     "Kubernetes",
			Description:              "Production-Grade Container Scheduling and Management",
			RepositoryUrl:            "https://github.com/kubernetes/kubernetes",
			License:                  "Apache-2.0",
			ContributionType:         "CLA",
			MaintainerContact:        "kubernetes-dev@googlegroups.com",
			ApprovalDate:             "2024-02-05T00:00:00Z",
			IsActive:                 true,
			AllowedContributionTypes: []string{"bug-fix", "feature", "documentation", "testing", "maintenance"},
		},
		{
			Id:                       "7",
			Name:                     "Docker",
			Description:              "Docker container platform",
			RepositoryUrl:            "https://github.com/docker/docker-ce",
			License:                  "Apache-2.0",
			ContributionType:         "DCO",
			MaintainerContact:        "docker-maintainers@docker.com",
			ApprovalDate:             "2024-02-10T00:00:00Z",
			IsActive:                 true,
			AllowedContributionTypes: []string{"bug-fix", "feature", "documentation", "testing"},
		},
		{
			Id:                       "8",
			Name:                     "Webpack",
			Description:              "A bundler for javascript and friends",
			RepositoryUrl:            "https://github.com/webpack/webpack",
			License:                  "MIT",
			ContributionType:         "DCO",
			MaintainerContact:        "webpack-team@webpack.js.org",
			ApprovalDate:             "2024-02-15T00:00:00Z",
			IsActive:                 true,
			AllowedContributionTypes: []string{"bug-fix", "feature", "documentation", "testing", "maintenance"},
		},
	}

	// Filter by active status if requested
	if req.GetActiveOnly() {
		var activeProjects []*pb.ApprovedProject

		for _, project := range approvedProjects {
			if project.GetIsActive() {
				activeProjects = append(activeProjects, project)
			}
		}

		approvedProjects = activeProjects
	}

	return &pb.GetApprovedProjectsListResponse{
		Projects: approvedProjects,
	}, nil
}
