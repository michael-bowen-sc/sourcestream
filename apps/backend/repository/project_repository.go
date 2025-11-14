// Package repository provides the data access layer for backend models.
package repository

import (
	"database/sql"
	"fmt"

	"sourcestream/backend/models"

	"github.com/google/uuid"
	"github.com/lib/pq"
)

// ProjectRepository provides DB operations for projects.
type ProjectRepository struct {
	db *sql.DB
}

// NewProjectRepository creates a new ProjectRepository with the given DB.
func NewProjectRepository(db *sql.DB) *ProjectRepository {
	return &ProjectRepository{db: db}
}

// CreateProject inserts a new project into the database.
func (r *ProjectRepository) CreateProject(project *models.Project) error {
	query := `
		INSERT INTO projects (id, name, description, url, license, owner_id, language, stars, forks, is_public)
		VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)`

	if project.ID == "" {
		project.ID = uuid.New().String()
	}

	_, err := r.db.Exec(query, project.ID, project.Name, project.Description,
		project.URL, project.License, project.OwnerID, project.Language,
		project.Stars, project.Forks, project.IsPublic)

	return err
}

// GetProjectByID returns a project by its ID.
func (r *ProjectRepository) GetProjectByID(id string) (*models.Project, error) {
	query := `
		SELECT id, name, description, url, license, status, owner_id, language, stars, forks, is_public, created_at, updated_at
		FROM projects WHERE id = $1`

	project := &models.Project{}
	err := r.db.QueryRow(query, id).Scan(
		&project.ID, &project.Name, &project.Description, &project.URL,
		&project.License, &project.Status, &project.OwnerID, &project.Language,
		&project.Stars, &project.Forks, &project.IsPublic,
		&project.CreatedAt, &project.UpdatedAt,
	)

	if err == sql.ErrNoRows {
		return nil, fmt.Errorf("project not found")
	}

	return project, err
}

// GetProjectsByOwnerID returns projects owned by a specific user.
func (r *ProjectRepository) GetProjectsByOwnerID(ownerID string, limit, offset int) ([]*models.Project, error) {
	query := `
		SELECT id, name, description, url, license, status, owner_id, language, stars, forks, is_public, created_at, updated_at
		FROM projects 
		WHERE owner_id = $1
		ORDER BY created_at DESC
		LIMIT $2 OFFSET $3`

	rows, err := r.db.Query(query, ownerID, limit, offset)
	if err != nil {
		return nil, err
	}

	defer func() { _ = rows.Close() }()

	return r.scanProjects(rows)
}

// GetProjectsByContributorID returns projects a user contributes to (non-owner).
func (r *ProjectRepository) GetProjectsByContributorID(userID string, limit, offset int) ([]*models.Project, error) {
	query := `
		SELECT p.id, p.name, p.description, p.url, p.license, p.status, p.owner_id, p.language, p.stars, p.forks, p.is_public, p.created_at, p.updated_at
		FROM projects p
		INNER JOIN project_contributors pc ON p.id = pc.project_id
		WHERE pc.user_id = $1 AND pc.role != 'owner'
		ORDER BY pc.joined_at DESC
		LIMIT $2 OFFSET $3`

	rows, err := r.db.Query(query, userID, limit, offset)
	if err != nil {
		return nil, err
	}

	defer func() { _ = rows.Close() }()

	return r.scanProjects(rows)
}

// GetApprovedProjectsByUserID returns approved projects for the given user.
func (r *ProjectRepository) GetApprovedProjectsByUserID(userID string, limit, offset int) ([]*models.Project, error) {
	query := `
		SELECT DISTINCT p.id, p.name, p.description, p.url, p.license, p.status, p.owner_id, p.language, p.stars, p.forks, p.is_public, p.created_at, p.updated_at
		FROM projects p
		INNER JOIN requests r ON p.id = r.project_id OR p.name = r.project_name
		WHERE r.requester_id = $1 AND r.status = 'approved'
		ORDER BY p.created_at DESC
		LIMIT $2 OFFSET $3`

	rows, err := r.db.Query(query, userID, limit, offset)
	if err != nil {
		return nil, err
	}
	defer func() { _ = rows.Close() }()

	return r.scanProjects(rows)
}

// UpdateProject updates an existing project's fields.
func (r *ProjectRepository) UpdateProject(project *models.Project) error {
	query := `
		UPDATE projects 
		SET name = $2, description = $3, url = $4, license = $5, status = $6, language = $7, stars = $8, forks = $9, is_public = $10
		WHERE id = $1`

	_, err := r.db.Exec(query, project.ID, project.Name, project.Description,
		project.URL, project.License, project.Status, project.Language,
		project.Stars, project.Forks, project.IsPublic)

	return err
}

// DeleteProject deletes a project by its ID.
func (r *ProjectRepository) DeleteProject(id string) error {
	query := `DELETE FROM projects WHERE id = $1`
	_, err := r.db.Exec(query, id)

	return err
}

// AddContributor adds or updates a contributor for a project.
func (r *ProjectRepository) AddContributor(projectID, userID, role string, permissions []string) error {
	query := `
		INSERT INTO project_contributors (project_id, user_id, role, permissions)
		VALUES ($1, $2, $3, $4)
		ON CONFLICT (project_id, user_id) 
		DO UPDATE SET role = $3, permissions = $4`

	_, err := r.db.Exec(query, projectID, userID, role, pq.Array(permissions))

	return err
}

// RemoveContributor removes a contributor from a project.
func (r *ProjectRepository) RemoveContributor(projectID, userID string) error {
	query := `DELETE FROM project_contributors WHERE project_id = $1 AND user_id = $2`
	_, err := r.db.Exec(query, projectID, userID)

	return err
}

// GetProjectContributors lists contributors for a given project.
func (r *ProjectRepository) GetProjectContributors(projectID string) ([]*models.ProjectContributor, error) {
	query := `
		SELECT pc.id, pc.project_id, pc.user_id, pc.role, pc.permissions, pc.joined_at,
			   u.corporate_id, u.github_username, u.full_name
		FROM project_contributors pc
		INNER JOIN users u ON pc.user_id = u.id
		WHERE pc.project_id = $1
		ORDER BY pc.joined_at ASC`

	rows, err := r.db.Query(query, projectID)
	if err != nil {
		return nil, err
	}

	defer func() { _ = rows.Close() }()

	var contributors []*models.ProjectContributor

	for rows.Next() {
		contributor := &models.ProjectContributor{}

		var permissions pq.StringArray

		err := rows.Scan(
			&contributor.ID, &contributor.ProjectID, &contributor.UserID,
			&contributor.Role, &permissions, &contributor.JoinedAt,
			&contributor.CorporateID, &contributor.GithubUsername, &contributor.FullName,
		)
		if err != nil {
			return nil, err
		}

		contributor.Permissions = []string(permissions)
		contributors = append(contributors, contributor)
	}

	return contributors, rows.Err()
}

// SearchProjects searches public projects by name/description.
func (r *ProjectRepository) SearchProjects(query string, limit, offset int) ([]*models.Project, error) {
	searchQuery := `
		SELECT id, name, description, url, license, status, owner_id, language, stars, forks, is_public, created_at, updated_at
		FROM projects 
		WHERE (name ILIKE $1 OR description ILIKE $1) AND is_public = true
		ORDER BY stars DESC, created_at DESC
		LIMIT $2 OFFSET $3`

	searchTerm := "%" + query + "%"

	rows, err := r.db.Query(searchQuery, searchTerm, limit, offset)
	if err != nil {
		return nil, err
	}

	defer func() { _ = rows.Close() }()

	return r.scanProjects(rows)
}

func (r *ProjectRepository) scanProjects(rows *sql.Rows) ([]*models.Project, error) {
	var projects []*models.Project

	for rows.Next() {
		project := &models.Project{}

		err := rows.Scan(
			&project.ID, &project.Name, &project.Description, &project.URL,
			&project.License, &project.Status, &project.OwnerID, &project.Language,
			&project.Stars, &project.Forks, &project.IsPublic,
			&project.CreatedAt, &project.UpdatedAt,
		)
		if err != nil {
			return nil, err
		}

		projects = append(projects, project)
	}

	return projects, rows.Err()
}
