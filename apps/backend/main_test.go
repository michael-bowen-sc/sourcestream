package main

import (
	"context"
	"net"
	"testing"

	"github.com/stretchr/testify/assert"
	"google.golang.org/grpc"
	"google.golang.org/grpc/credentials/insecure"
	pb "sourcestream/backend/pb"
)

func TestGRPCIntegration(t *testing.T) {
	lis, err := net.Listen("tcp", ":0") // Use ephemeral port
	assert.NoError(t, err)
	defer lis.Close()

	s := grpc.NewServer()
	pb.RegisterUserServiceServer(s, &server{}) // Assuming 'server' struct is accessible or defined here
	go func() {
		if err := s.Serve(lis); err != nil {
			t.Fatalf("failed to serve gRPC: %v", err)
		}
	}()

	conn, err := grpc.Dial(lis.Addr().String(), grpc.WithTransportCredentials(insecure.NewCredentials()))
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
	s.Stop() // Stop the gRPC server gracefully
}
