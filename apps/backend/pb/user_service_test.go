package pb

import (
	"context"
	"testing"

	"github.com/stretchr/testify/assert"
)

type mockUserServiceServer struct {
	UnimplementedUserServiceServer
}

func (m *mockUserServiceServer) RegisterContributor(ctx context.Context, in *RegisterContributorRequest) (*RegisterContributorResponse, error) {
	return &RegisterContributorResponse{Message: "Mock contributor registered: " + in.GetCorporateId()}, nil
}

func (m *mockUserServiceServer) GetContributor(ctx context.Context, in *GetContributorRequest) (*GetContributorResponse, error) {
	return &GetContributorResponse{
		CorporateId:    in.GetCorporateId(),
		GithubUsername: "mockuser",
		ApprovedProjects: []string{"mock_project1", "mock_project2"},
	}, nil
}

func TestRegisterContributor(t *testing.T) {
	s := &mockUserServiceServer{}
	req := &RegisterContributorRequest{CorporateId: "testcorp", GithubUsername: "testgithub"}
	res, err := s.RegisterContributor(context.Background(), req)

	assert.NoError(t, err)
	assert.NotNil(t, res)
	assert.Equal(t, "Mock contributor registered: testcorp", res.Message)
}

func TestGetContributor(t *testing.T) {
	s := &mockUserServiceServer{}
	req := &GetContributorRequest{CorporateId: "testcorp"}
	res, err := s.GetContributor(context.Background(), req)

	assert.NoError(t, err)
	assert.NotNil(t, res)
	assert.Equal(t, "testcorp", res.CorporateId)
	assert.Equal(t, "mockuser", res.GithubUsername)
	assert.Contains(t, res.ApprovedProjects, "mock_project1")
}
