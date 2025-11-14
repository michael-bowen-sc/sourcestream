// Package models contains the domain data structures persisted in the backend.
package models

import (
	"time"
)

// User represents a user in the system
type User struct {
	ID             string    `json:"id" db:"id"`
	CorporateID    string    `json:"corporate_id" db:"corporate_id"`
	GithubUsername string    `json:"github_username" db:"github_username"`
	Email          string    `json:"email" db:"email"`
	FullName       string    `json:"full_name" db:"full_name"`
	Department     string    `json:"department" db:"department"`
	Role           string    `json:"role" db:"role"`
	IsActive       bool      `json:"is_active" db:"is_active"`
	CreatedAt      time.Time `json:"created_at" db:"created_at"`
	UpdatedAt      time.Time `json:"updated_at" db:"updated_at"`
}

// Project represents an open source project
type Project struct {
	ID          string    `json:"id" db:"id"`
	Name        string    `json:"name" db:"name"`
	Description string    `json:"description" db:"description"`
	URL         string    `json:"url" db:"url"`
	License     string    `json:"license" db:"license"`
	Status      string    `json:"status" db:"status"`
	OwnerID     string    `json:"owner_id" db:"owner_id"`
	Language    string    `json:"language" db:"language"`
	Stars       int       `json:"stars" db:"stars"`
	Forks       int       `json:"forks" db:"forks"`
	IsPublic    bool      `json:"is_public" db:"is_public"`
	CreatedAt   time.Time `json:"created_at" db:"created_at"`
	UpdatedAt   time.Time `json:"updated_at" db:"updated_at"`
}

// Request represents a request for project access, PR approval, etc.
type Request struct {
	ID                    string     `json:"id" db:"id"`
	Type                  string     `json:"type" db:"type"`
	Title                 string     `json:"title" db:"title"`
	Status                string     `json:"status" db:"status"`
	RequesterID           string     `json:"requester_id" db:"requester_id"`
	ReviewerID            *string    `json:"reviewer_id" db:"reviewer_id"`
	ProjectID             *string    `json:"project_id" db:"project_id"`
	ProjectName           string     `json:"project_name" db:"project_name"`
	ProjectURL            string     `json:"project_url" db:"project_url"`
	License               string     `json:"license" db:"license"`
	Role                  string     `json:"role" db:"requested_role"`
	ApprovedProjectID     *string    `json:"approved_project_id" db:"approved_project_id"`
	BusinessJustification *string    `json:"business_justification" db:"business_justification"`
	ApprovedAt            *time.Time `json:"approved_at" db:"approved_at"`
	RejectedAt            *time.Time `json:"rejected_at" db:"rejected_at"`
	RejectionReason       *string    `json:"rejection_reason" db:"rejection_reason"`
	CreatedAt             time.Time  `json:"created_at" db:"created_at"`
	UpdatedAt             time.Time  `json:"updated_at" db:"updated_at"`
}

// ApprovedProject represents a pre-approved open source project for contributions
type ApprovedProject struct {
	ID                       string    `json:"id" db:"id"`
	Name                     string    `json:"name" db:"name"`
	Description              string    `json:"description" db:"description"`
	RepositoryURL            string    `json:"repository_url" db:"repository_url"`
	License                  string    `json:"license" db:"license"`
	ContributionType         string    `json:"contribution_type" db:"contribution_type"`
	MaintainerContact        string    `json:"maintainer_contact" db:"maintainer_contact"`
	ApprovalDate             time.Time `json:"approval_date" db:"approval_date"`
	IsActive                 bool      `json:"is_active" db:"is_active"`
	AllowedContributionTypes []string  `json:"allowed_contribution_types" db:"allowed_contribution_types"`
	CreatedAt                time.Time `json:"created_at" db:"created_at"`
	UpdatedAt                time.Time `json:"updated_at" db:"updated_at"`
}

// ProjectContributor represents the many-to-many relationship between users and projects
type ProjectContributor struct {
	ID             string    `json:"id" db:"id"`
	ProjectID      string    `json:"project_id" db:"project_id"`
	UserID         string    `json:"user_id" db:"user_id"`
	Role           string    `json:"role" db:"role"`
	Permissions    []string  `json:"permissions" db:"permissions"`
	CorporateID    string    `json:"corporate_id" db:"corporate_id"`
	GithubUsername string    `json:"github_username" db:"github_username"`
	FullName       string    `json:"full_name" db:"full_name"`
	JoinedAt       time.Time `json:"joined_at" db:"joined_at"`
}

// RequestComment represents a comment on a request
type RequestComment struct {
	ID             string    `json:"id" db:"id"`
	RequestID      string    `json:"request_id" db:"request_id"`
	UserID         string    `json:"user_id" db:"user_id"`
	Comment        string    `json:"comment" db:"comment"`
	IsInternal     bool      `json:"is_internal" db:"is_internal"`
	GithubUsername string    `json:"github_username" db:"github_username"`
	FullName       string    `json:"full_name" db:"full_name"`
	CreatedAt      time.Time `json:"created_at" db:"created_at"`
}
