package services

import (
	"context"
	"testing"
	"time"

	"github.com/stretchr/testify/assert"
	"github.com/stretchr/testify/mock"
	"sourcestream/backend/models"
	pb "sourcestream/backend/pb"
)

// MockRequestRepository is a mock implementation of RequestRepository
type MockRequestRepository struct {
	mock.Mock
}

func (m *MockRequestRepository) CreateRequest(ctx context.Context, request *models.Request) error {
	args := m.Called(ctx, request)
	return args.Error(0)
}

func (m *MockRequestRepository) GetRequestByID(ctx context.Context, id string) (*models.Request, error) {
	args := m.Called(ctx, id)
	return args.Get(0).(*models.Request), args.Error(1)
}

func (m *MockRequestRepository) GetRequestsByUser(ctx context.Context, userID string, status string) ([]*models.Request, error) {
	args := m.Called(ctx, userID, status)
	return args.Get(0).([]*models.Request), args.Error(1)
}

func (m *MockRequestRepository) UpdateRequestStatus(ctx context.Context, id string, status string) error {
	args := m.Called(ctx, id, status)
	return args.Error(0)
}

func TestRequestService_SubmitProjectRequest(t *testing.T) {
	mockRepo := new(MockRequestRepository)
	service := NewRequestService(mockRepo)

	tests := []struct {
		name        string
		request     *pb.SubmitProjectRequestRequest
		setupMock   func()
		expectError bool
	}{
		{
			name: "successful project request submission",
			request: &pb.SubmitProjectRequestRequest{
				Title:       "Test Project",
				ProjectName: "test-project",
				ProjectUrl:  "https://github.com/test/project",
				RequesterId: "user123",
			},
			setupMock: func() {
				mockRepo.On("CreateRequest", mock.Anything, mock.MatchedBy(func(req *models.Request) bool {
					return req.Type == "project" &&
						req.Title == "Test Project" &&
						req.ProjectName == "test-project" &&
						req.ProjectURL == "https://github.com/test/project" &&
						req.RequesterID == "user123" &&
						req.Status == "pending"
				})).Return(nil)
			},
			expectError: false,
		},
		{
			name: "missing required fields",
			request: &pb.SubmitProjectRequestRequest{
				Title: "Test Project",
				// Missing ProjectName, ProjectUrl, RequesterId
			},
			setupMock: func() {
				// No mock setup needed as validation should fail first
			},
			expectError: true,
		},
	}

	for _, tt := range tests {
		t.Run(tt.name, func(t *testing.T) {
			mockRepo.ExpectedCalls = nil // Reset mock
			tt.setupMock()

			response, err := service.SubmitProjectRequest(context.Background(), tt.request)

			if tt.expectError {
				assert.Error(t, err)
				assert.Nil(t, response)
			} else {
				assert.NoError(t, err)
				assert.NotNil(t, response)
				assert.True(t, response.Success)
				assert.NotEmpty(t, response.RequestId)
			}

			mockRepo.AssertExpectations(t)
		})
	}
}

func TestRequestService_SubmitAccessRequest(t *testing.T) {
	mockRepo := new(MockRequestRepository)
	service := NewRequestService(mockRepo)

	tests := []struct {
		name        string
		request     *pb.SubmitAccessRequestRequest
		setupMock   func()
		expectError bool
	}{
		{
			name: "successful access request submission",
			request: &pb.SubmitAccessRequestRequest{
				Title:       "Access Request",
				ProjectName: "existing-project",
				RequesterId: "user123",
			},
			setupMock: func() {
				mockRepo.On("CreateRequest", mock.Anything, mock.MatchedBy(func(req *models.Request) bool {
					return req.Type == "access" &&
						req.Title == "Access Request" &&
						req.ProjectName == "existing-project" &&
						req.RequesterID == "user123" &&
						req.Status == "pending"
				})).Return(nil)
			},
			expectError: false,
		},
		{
			name: "missing required fields",
			request: &pb.SubmitAccessRequestRequest{
				Title: "Access Request",
				// Missing ProjectName, RequesterId
			},
			setupMock: func() {
				// No mock setup needed as validation should fail first
			},
			expectError: true,
		},
	}

	for _, tt := range tests {
		t.Run(tt.name, func(t *testing.T) {
			mockRepo.ExpectedCalls = nil // Reset mock
			tt.setupMock()

			response, err := service.SubmitAccessRequest(context.Background(), tt.request)

			if tt.expectError {
				assert.Error(t, err)
				assert.Nil(t, response)
			} else {
				assert.NoError(t, err)
				assert.NotNil(t, response)
				assert.True(t, response.Success)
				assert.NotEmpty(t, response.RequestId)
			}

			mockRepo.AssertExpectations(t)
		})
	}
}

func TestRequestService_GetRequests(t *testing.T) {
	mockRepo := new(MockRequestRepository)
	service := NewRequestService(mockRepo)

	mockRequests := []*models.Request{
		{
			ID:          "req1",
			Type:        "project",
			Title:       "Test Project 1",
			Status:      "pending",
			ProjectName: "project1",
			RequesterID: "user123",
			CreatedAt:   time.Now(),
		},
		{
			ID:          "req2",
			Type:        "access",
			Title:       "Access Request",
			Status:      "approved",
			ProjectName: "project2",
			RequesterID: "user123",
			CreatedAt:   time.Now(),
		},
	}

	tests := []struct {
		name        string
		request     *pb.GetRequestsRequest
		setupMock   func()
		expectError bool
		expectCount int
	}{
		{
			name: "get all requests for user",
			request: &pb.GetRequestsRequest{
				UserId: "user123",
			},
			setupMock: func() {
				mockRepo.On("GetRequestsByUser", mock.Anything, "user123", "").Return(mockRequests, nil)
			},
			expectError: false,
			expectCount: 2,
		},
		{
			name: "get pending requests for user",
			request: &pb.GetRequestsRequest{
				UserId: "user123",
				Status: "pending",
			},
			setupMock: func() {
				pendingRequests := []*models.Request{mockRequests[0]} // Only the pending one
				mockRepo.On("GetRequestsByUser", mock.Anything, "user123", "pending").Return(pendingRequests, nil)
			},
			expectError: false,
			expectCount: 1,
		},
		{
			name: "missing user ID",
			request: &pb.GetRequestsRequest{
				// Missing UserId
			},
			setupMock: func() {
				// No mock setup needed as validation should fail first
			},
			expectError: true,
			expectCount: 0,
		},
	}

	for _, tt := range tests {
		t.Run(tt.name, func(t *testing.T) {
			mockRepo.ExpectedCalls = nil // Reset mock
			tt.setupMock()

			response, err := service.GetRequests(context.Background(), tt.request)

			if tt.expectError {
				assert.Error(t, err)
				assert.Nil(t, response)
			} else {
				assert.NoError(t, err)
				assert.NotNil(t, response)
				assert.Len(t, response.Requests, tt.expectCount)

				// Verify first request if any
				if tt.expectCount > 0 {
					req := response.Requests[0]
					assert.NotEmpty(t, req.Id)
					assert.NotEmpty(t, req.Type)
					assert.NotEmpty(t, req.Title)
					assert.NotEmpty(t, req.Status)
				}
			}

			mockRepo.AssertExpectations(t)
		})
	}
}

func TestRequestService_modelToProto(t *testing.T) {
	service := &RequestService{}
	
	modelRequest := &models.Request{
		ID:          "test-id",
		Type:        "project",
		Title:       "Test Title",
		Status:      "pending",
		ProjectName: "test-project",
		ProjectURL:  "https://github.com/test/project",
		RequesterID: "user123",
		CreatedAt:   time.Date(2024, 1, 1, 12, 0, 0, 0, time.UTC),
	}

	protoRequest := service.modelToProto(modelRequest)

	assert.Equal(t, "test-id", protoRequest.Id)
	assert.Equal(t, "project", protoRequest.Type)
	assert.Equal(t, "Test Title", protoRequest.Title)
	assert.Equal(t, "pending", protoRequest.Status)
	assert.Equal(t, "test-project", protoRequest.ProjectName)
	assert.Equal(t, "https://github.com/test/project", protoRequest.ProjectUrl)
	assert.Equal(t, "user123", protoRequest.RequesterId)
	assert.Equal(t, "2024-01-01T12:00:00Z", protoRequest.CreatedAt)
}

func TestRequestService_validateProjectRequest(t *testing.T) {
	service := &RequestService{}

	tests := []struct {
		name        string
		request     *pb.SubmitProjectRequestRequest
		expectError bool
	}{
		{
			name: "valid request",
			request: &pb.SubmitProjectRequestRequest{
				Title:       "Test Project",
				ProjectName: "test-project",
				ProjectUrl:  "https://github.com/test/project",
				RequesterId: "user123",
			},
			expectError: false,
		},
		{
			name: "missing title",
			request: &pb.SubmitProjectRequestRequest{
				ProjectName: "test-project",
				ProjectUrl:  "https://github.com/test/project",
				RequesterId: "user123",
			},
			expectError: true,
		},
		{
			name: "missing project name",
			request: &pb.SubmitProjectRequestRequest{
				Title:       "Test Project",
				ProjectUrl:  "https://github.com/test/project",
				RequesterId: "user123",
			},
			expectError: true,
		},
		{
			name: "missing requester ID",
			request: &pb.SubmitProjectRequestRequest{
				Title:       "Test Project",
				ProjectName: "test-project",
				ProjectUrl:  "https://github.com/test/project",
			},
			expectError: true,
		},
	}

	for _, tt := range tests {
		t.Run(tt.name, func(t *testing.T) {
			err := service.validateProjectRequest(tt.request)
			if tt.expectError {
				assert.Error(t, err)
			} else {
				assert.NoError(t, err)
			}
		})
	}
}
