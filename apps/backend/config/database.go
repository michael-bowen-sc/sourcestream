// Package config contains configuration structures and database helpers.
package config

import (
	"database/sql"
	"fmt"
	"log"
	"os"
	"strconv"
	"time"

	_ "github.com/lib/pq" // register postgres driver via side-effects
)

// DatabaseConfig holds PostgreSQL connection settings.
type DatabaseConfig struct {
	Host     string
	Port     int
	User     string
	Password string
	DBName   string
	SSLMode  string
}

// NewDatabaseConfig builds a DatabaseConfig from environment variables with defaults.
func NewDatabaseConfig() *DatabaseConfig {
	return &DatabaseConfig{
		Host:     getEnv("DB_HOST", "localhost"),
		Port:     getEnvAsInt("DB_PORT", 5432),
		User:     getEnv("DB_USER", "postgres"),
		Password: getEnv("DB_PASSWORD", "password"),
		DBName:   getEnv("DB_NAME", "sourcestream"),
		SSLMode:  getEnv("DB_SSLMODE", "disable"),
	}
}

// ConnectionString returns a lib/pq connection string from the config.
func (c *DatabaseConfig) ConnectionString() string {
	return fmt.Sprintf("host=%s port=%d user=%s password=%s dbname=%s sslmode=%s",
		c.Host, c.Port, c.User, c.Password, c.DBName, c.SSLMode)
}

// NewDatabase opens and verifies a PostgreSQL connection using environment configuration.
// Connection pool is optimized for typical API workloads with proper timeout handling.
func NewDatabase() (*sql.DB, error) {
	config := NewDatabaseConfig()

	db, err := sql.Open("postgres", config.ConnectionString())
	if err != nil {
		return nil, fmt.Errorf("failed to open database: %w", err)
	}

	// Configure connection pool for optimal performance
	// MaxOpenConns: 50 connections (balance between resource usage and throughput)
	// - Kubernetes staging: 2 pods × 25 = 50 total
	// - Handles spikes while maintaining reasonable resource footprint
	// - Prevents connection pool exhaustion under high load
	db.SetMaxOpenConns(50)

	// MaxIdleConns: 10 idle connections (keep connections warm)
	// - Reduces latency for new queries (reuse warm connections)
	// - Typical ratio 1:5 with MaxOpenConns
	// - Reduces connection churn on the database
	db.SetMaxIdleConns(10)

	// ConnMaxLifetime: 30 minutes (refresh connections periodically)
	// - Prevents long-lived connections from becoming stale
	// - Works with database-side connection idle timeout
	// - Allows clean session resets
	db.SetConnMaxLifetime(30 * time.Minute)

	// ConnMaxIdleTime: 5 minutes (close idle connections quickly)
	// - Reduces resource usage on both sides
	// - Connections idle longer than this are closed
	// - Prevents accumulation of stale connections
	db.SetConnMaxIdleTime(5 * time.Minute)

	// Test the connection
	if err := db.Ping(); err != nil {
		return nil, fmt.Errorf("failed to ping database: %w", err)
	}

	log.Printf("Successfully connected to PostgreSQL database: %s", config.DBName)
	log.Printf("Connection pool configured: MaxOpenConns=%d, MaxIdleConns=%d, MaxLifetime=30m, MaxIdleTime=5m",
		50, 10)

	return db, nil
}

// Helper functions for environment variables
func getEnv(key, defaultValue string) string {
	if value := os.Getenv(key); value != "" {
		return value
	}

	return defaultValue
}

func getEnvAsInt(key string, defaultValue int) int {
	if value := os.Getenv(key); value != "" {
		if intValue, err := strconv.Atoi(value); err == nil {
			return intValue
		}
	}

	return defaultValue
}
