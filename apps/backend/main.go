package main

import (
	"context"
	"log"
	"net"
	
	"google.golang.org/grpc"
	pb "sourcestream/backend/pb"
)

type server struct {
	pb.UnimplementedUserServiceServer
}

func (s *server) RegisterContributor(ctx context.Context, in *pb.RegisterContributorRequest) (*pb.RegisterContributorResponse, error) {
	log.Printf("Received: %v", in.GetCorporateId())
	return &pb.RegisterContributorResponse{Message: "Contributor registered: " + in.GetCorporateId()}, nil
}

func (s *server) GetContributor(ctx context.Context, in *pb.GetContributorRequest) (*pb.GetContributorResponse, error) {
	log.Printf("Received: %v", in.GetCorporateId())
	// In a real application, you would fetch this from a database
	return &pb.GetContributorResponse{
		CorporateId:    in.GetCorporateId(),
		GithubUsername: "testuser",
		ApprovedProjects: []string{"project1", "project2"},
	}, nil
}

func main() {
	// Start gRPC server
	lis, err := net.Listen("tcp", ":50051")
	if err != nil {
		log.Fatalf("failed to listen: %v", err)
	}
	s := grpc.NewServer()
	pb.RegisterUserServiceServer(s, &server{})
	log.Printf("gRPC server listening at %v", lis.Addr())
	go func() {
		if err := s.Serve(lis); err != nil {
			log.Fatalf("failed to serve gRPC: %v", err)
		}
	}()

	// Start gRPC Gateway (REST) server
	/*
	ctx := context.Background()
	ctx, cancel := context.WithCancel(ctx)
	defer cancel()

	mux := runtime.NewServeMux()
	err = pb.RegisterUserServiceHandlerFromEndpoint(ctx, mux, ":50051", []grpc.DialOption{grpc.WithInsecure()})
	if err != nil {
		log.Fatalf("failed to register gateway: %v", err)
	}

	log.Printf("REST server listening on :8080")
	if err := http.ListenAndServe(":8080", mux); err != nil && err != http.ErrServerClosed {
		log.Fatalf("failed to serve REST: %v", err)
	}
	*/
}