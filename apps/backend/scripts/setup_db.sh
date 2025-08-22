#!/bin/bash

# SourceStream Database Setup Script

set -e

# Default values
DB_HOST=${DB_HOST:-localhost}
DB_PORT=${DB_PORT:-5432}
DB_USER=${DB_USER:-postgres}
DB_NAME=${DB_NAME:-sourcestream}

echo "Setting up SourceStream database..."

# Check if PostgreSQL is running
if ! pg_isready -h $DB_HOST -p $DB_PORT -U $DB_USER > /dev/null 2>&1; then
    echo "Error: PostgreSQL is not running or not accessible"
    echo "Please ensure PostgreSQL is installed and running on $DB_HOST:$DB_PORT"
    exit 1
fi

# Create database if it doesn't exist
echo "Creating database '$DB_NAME' if it doesn't exist..."
psql -h $DB_HOST -p $DB_PORT -U $DB_USER -tc "SELECT 1 FROM pg_database WHERE datname = '$DB_NAME'" | grep -q 1 || \
    psql -h $DB_HOST -p $DB_PORT -U $DB_USER -c "CREATE DATABASE $DB_NAME"

# Run migrations
echo "Running database migrations..."
psql -h $DB_HOST -p $DB_PORT -U $DB_USER -d $DB_NAME -f migrations/001_initial_schema.sql
psql -h $DB_HOST -p $DB_PORT -U $DB_USER -d $DB_NAME -f migrations/002_seed_data.sql

echo "Database setup completed successfully!"
echo ""
echo "Database: $DB_NAME"
echo "Host: $DB_HOST:$DB_PORT"
echo "User: $DB_USER"
echo ""
echo "You can now start the backend server with: go run main.go"
