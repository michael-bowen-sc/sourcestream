package main

import (
	"context"
	"io"
	"net/http"
	"testing"
	"time"

	"github.com/stretchr/testify/assert"
	"google.golang.org/grpc"
	"google.golang.org/grpc/credentials/insecure"
	pb "sourcestream/backend/pb"
)

func TestGRPCIntegration(t *testing.T) {
	// Start the gRPC server in a goroutine
	go main()

	// Give the server a moment to start
	time.Sleep(1 * time.Second)

	conn, err := grpc.Dial("localhost:50051", grpc.WithTransportCredentials(insecure.NewCredentials()))
	assert.NoError(t, err)
	defer conn.Close()

	c := pb.NewUserServiceClient(conn)

	// Test RegisterContributor
	regReq := &pb.RegisterContributorRequest{CorporateId: "grpc_test_corp", GithubUsername: "grpc_test_user"}
	regRes, err := c.RegisterContributor(context.Background(), regReq)
	assert.NoError(t, err)
	assert.NotNil(t, regRes)
	assert.Contains(t, regRes.Message, "grpc_test_corp")

	// Test GetContributor
	getReq := &pb.GetContributorRequest{CorporateId: "grpc_test_corp"}
	getRes, err := c.GetContributor(context.Background(), getReq)
	assert.NoError(t, err)
	assert.NotNil(t, getRes)
	assert.Equal(t, "grpc_test_corp", getRes.CorporateId)
	assert.Equal(t, "testuser", getRes.GithubUsername)
}

func TestRESTIntegration(t *testing.T) {
	// Start the gRPC server and REST gateway in a goroutine
	go main()

	// Give the server a moment to start
	time.Sleep(1 * time.Second)

	// Test RegisterContributor via REST
	resp, err := http.Post("http://localhost:8080/v1/contributors:register", "application/json", io.NopCloser(nil))
	assert.NoError(t, err)
	assert.Equal(t, http.StatusOK, resp.StatusCode)
	defer resp.Body.Close()

	// Test GetContributor via REST
	resp, err = http.Get("http://localhost:8080/v1/contributors/rest_test_corp")
	assert.NoError(t, err)
	assert.Equal(t, http.StatusOK, resp.StatusCode)
	defer resp.Body.Close()
}
