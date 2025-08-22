package repository

import (
	"database/sql"
	"fmt"
	"sourcestream/backend/models"

	"github.com/google/uuid"
)

type UserRepository struct {
	db *sql.DB
}

func NewUserRepository(db *sql.DB) *UserRepository {
	return &UserRepository{db: db}
}

func (r *UserRepository) CreateUser(user *models.User) error {
	query := `
		INSERT INTO users (id, corporate_id, github_username, email, full_name, department, role)
		VALUES ($1, $2, $3, $4, $5, $6, $7)`
	
	if user.ID == "" {
		user.ID = uuid.New().String()
	}
	
	_, err := r.db.Exec(query, user.ID, user.CorporateID, user.GithubUsername, 
		user.Email, user.FullName, user.Department, user.Role)
	return err
}

func (r *UserRepository) GetUserByID(id string) (*models.User, error) {
	query := `
		SELECT id, corporate_id, github_username, email, full_name, department, role, is_active, created_at, updated_at
		FROM users WHERE id = $1`
	
	user := &models.User{}
	err := r.db.QueryRow(query, id).Scan(
		&user.ID, &user.CorporateID, &user.GithubUsername, &user.Email,
		&user.FullName, &user.Department, &user.Role, &user.IsActive,
		&user.CreatedAt, &user.UpdatedAt,
	)
	
	if err == sql.ErrNoRows {
		return nil, fmt.Errorf("user not found")
	}
	return user, err
}

func (r *UserRepository) GetUserByCorporateID(corporateID string) (*models.User, error) {
	query := `
		SELECT id, corporate_id, github_username, email, full_name, department, role, is_active, created_at, updated_at
		FROM users WHERE corporate_id = $1`
	
	user := &models.User{}
	err := r.db.QueryRow(query, corporateID).Scan(
		&user.ID, &user.CorporateID, &user.GithubUsername, &user.Email,
		&user.FullName, &user.Department, &user.Role, &user.IsActive,
		&user.CreatedAt, &user.UpdatedAt,
	)
	
	if err == sql.ErrNoRows {
		return nil, fmt.Errorf("user not found")
	}
	return user, err
}

func (r *UserRepository) GetUserByGithubUsername(username string) (*models.User, error) {
	query := `
		SELECT id, corporate_id, github_username, email, full_name, department, role, is_active, created_at, updated_at
		FROM users WHERE github_username = $1`
	
	user := &models.User{}
	err := r.db.QueryRow(query, username).Scan(
		&user.ID, &user.CorporateID, &user.GithubUsername, &user.Email,
		&user.FullName, &user.Department, &user.Role, &user.IsActive,
		&user.CreatedAt, &user.UpdatedAt,
	)
	
	if err == sql.ErrNoRows {
		return nil, fmt.Errorf("user not found")
	}
	return user, err
}

func (r *UserRepository) UpdateUser(user *models.User) error {
	query := `
		UPDATE users 
		SET github_username = $2, email = $3, full_name = $4, department = $5, role = $6, is_active = $7
		WHERE id = $1`
	
	_, err := r.db.Exec(query, user.ID, user.GithubUsername, user.Email,
		user.FullName, user.Department, user.Role, user.IsActive)
	return err
}

func (r *UserRepository) DeleteUser(id string) error {
	query := `DELETE FROM users WHERE id = $1`
	_, err := r.db.Exec(query, id)
	return err
}

func (r *UserRepository) ListUsers(limit, offset int) ([]*models.User, error) {
	query := `
		SELECT id, corporate_id, github_username, email, full_name, department, role, is_active, created_at, updated_at
		FROM users 
		ORDER BY created_at DESC
		LIMIT $1 OFFSET $2`
	
	rows, err := r.db.Query(query, limit, offset)
	if err != nil {
		return nil, err
	}
	defer rows.Close()
	
	var users []*models.User
	for rows.Next() {
		user := &models.User{}
		err := rows.Scan(
			&user.ID, &user.CorporateID, &user.GithubUsername, &user.Email,
			&user.FullName, &user.Department, &user.Role, &user.IsActive,
			&user.CreatedAt, &user.UpdatedAt,
		)
		if err != nil {
			return nil, err
		}
		users = append(users, user)
	}
	
	return users, rows.Err()
}
