package main

import (
	"context"
	"log"
	"net"
	"net/http"
	"time"

	"sourcestream/backend/config"
	"sourcestream/backend/services"
	pb "sourcestream/backend/pb"

	"github.com/grpc-ecosystem/grpc-gateway/v2/runtime"
	"google.golang.org/grpc"
)

func main() {
	// Initialize database connection
	db, err := config.NewDatabase()
	if err != nil {
		log.Fatalf("failed to connect to database: %v", err)
	}
	defer db.Close()

	// Create service instances with database
	userService := services.NewUserService(db)
	projectService := services.NewProjectService(db)
	requestService := services.NewRequestService(db)

	// Start gRPC server
	lis, err := net.Listen("tcp", ":50051")
	if err != nil {
		log.Fatalf("failed to listen: %v", err)
	}

	grpcServer := grpc.NewServer()
	
	// Register all services
	pb.RegisterUserServiceServer(grpcServer, userService)
	pb.RegisterProjectServiceServer(grpcServer, projectService)
	pb.RegisterRequestServiceServer(grpcServer, requestService)

	log.Printf("gRPC server listening at %v", lis.Addr())
	
	// Start gRPC server in goroutine
	go func() {
		if err := grpcServer.Serve(lis); err != nil {
			log.Fatalf("failed to serve gRPC: %v", err)
		}
	}()

	// Start gRPC Gateway (REST) server
	ctx := context.Background()
	ctx, cancel := context.WithCancel(ctx)
	defer cancel()

	// Create gRPC-Gateway mux
	mux := runtime.NewServeMux()
	
	// For now, skip gRPC-Gateway registration until protobuf files are updated
	// The gRPC server will still work directly

	// Create HTTP server with CORS support
	httpServer := &http.Server{
		Addr:         ":8080",
		Handler:      corsHandler(mux),
		ReadTimeout:  15 * time.Second,
		WriteTimeout: 15 * time.Second,
	}

	log.Printf("REST server listening on :8080")
	if err := httpServer.ListenAndServe(); err != nil && err != http.ErrServerClosed {
		log.Fatalf("failed to serve REST: %v", err)
	}
}

// corsHandler adds CORS headers to support frontend requests
func corsHandler(h http.Handler) http.Handler {
	return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		w.Header().Set("Access-Control-Allow-Origin", "*")
		w.Header().Set("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS")
		w.Header().Set("Access-Control-Allow-Headers", "Content-Type, Authorization")
		
		if r.Method == "OPTIONS" {
			w.WriteHeader(http.StatusOK)
			return
		}
		
		h.ServeHTTP(w, r)
	})
}