package repository

import (
	"database/sql"
	"fmt"
	"sourcestream/backend/models"

	"github.com/google/uuid"
)

type RequestRepository struct {
	db *sql.DB
}

func NewRequestRepository(db *sql.DB) *RequestRepository {
	return &RequestRepository{db: db}
}

func (r *RequestRepository) CreateRequest(request *models.Request) error {
	query := `
		INSERT INTO requests (id, type, title, description, status, requester_id, project_id, project_name, project_url, license, requested_role)
		VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11)`
	
	if request.ID == "" {
		request.ID = uuid.New().String()
	}
	
	_, err := r.db.Exec(query, request.ID, request.Type, request.Title,
		request.Description, request.Status, request.RequesterID,
		request.ProjectID, request.ProjectName, request.ProjectURL,
		request.License, request.Role)
	return err
}

func (r *RequestRepository) GetRequestByID(id string) (*models.Request, error) {
	query := `
		SELECT id, type, title, description, status, requester_id, reviewer_id, project_id, project_name, project_url, license, requested_role, approved_at, rejected_at, rejection_reason, created_at, updated_at
		FROM requests WHERE id = $1`
	
	request := &models.Request{}
	err := r.db.QueryRow(query, id).Scan(
		&request.ID, &request.Type, &request.Title, &request.Description,
		&request.Status, &request.RequesterID, &request.ReviewerID,
		&request.ProjectID, &request.ProjectName, &request.ProjectURL,
		&request.License, &request.Role, &request.ApprovedAt,
		&request.RejectedAt, &request.RejectionReason,
		&request.CreatedAt, &request.UpdatedAt,
	)
	
	if err == sql.ErrNoRows {
		return nil, fmt.Errorf("request not found")
	}
	return request, err
}

func (r *RequestRepository) GetRequestsByRequesterID(requesterID string, status string, limit, offset int) ([]*models.Request, error) {
	var query string
	var args []interface{}
	
	if status != "" {
		query = `
			SELECT id, type, title, description, status, requester_id, reviewer_id, project_id, project_name, project_url, license, requested_role, approved_at, rejected_at, rejection_reason, created_at, updated_at
			FROM requests 
			WHERE requester_id = $1 AND status = $2
			ORDER BY created_at DESC
			LIMIT $3 OFFSET $4`
		args = []interface{}{requesterID, status, limit, offset}
	} else {
		query = `
			SELECT id, type, title, description, status, requester_id, reviewer_id, project_id, project_name, project_url, license, requested_role, approved_at, rejected_at, rejection_reason, created_at, updated_at
			FROM requests 
			WHERE requester_id = $1
			ORDER BY created_at DESC
			LIMIT $2 OFFSET $3`
		args = []interface{}{requesterID, limit, offset}
	}
	
	rows, err := r.db.Query(query, args...)
	if err != nil {
		return nil, err
	}
	defer rows.Close()
	
	return r.scanRequests(rows)
}

func (r *RequestRepository) GetRequestsByType(requestType string, limit, offset int) ([]*models.Request, error) {
	query := `
		SELECT id, type, title, description, status, requester_id, reviewer_id, project_id, project_name, project_url, license, requested_role, approved_at, rejected_at, rejection_reason, created_at, updated_at
		FROM requests 
		WHERE type = $1
		ORDER BY created_at DESC
		LIMIT $2 OFFSET $3`
	
	rows, err := r.db.Query(query, requestType, limit, offset)
	if err != nil {
		return nil, err
	}
	defer rows.Close()
	
	return r.scanRequests(rows)
}

func (r *RequestRepository) GetPendingRequests(limit, offset int) ([]*models.Request, error) {
	query := `
		SELECT id, type, title, description, status, requester_id, reviewer_id, project_id, project_name, project_url, license, requested_role, approved_at, rejected_at, rejection_reason, created_at, updated_at
		FROM requests 
		WHERE status = 'pending'
		ORDER BY created_at ASC
		LIMIT $1 OFFSET $2`
	
	rows, err := r.db.Query(query, limit, offset)
	if err != nil {
		return nil, err
	}
	defer rows.Close()
	
	return r.scanRequests(rows)
}

func (r *RequestRepository) GetRequestsByUser(userID string) ([]*models.Request, error) {
	query := `
		SELECT id, type, title, description, status, requester_id, reviewer_id, project_id, project_name, project_url, license, requested_role, approved_at, rejected_at, rejection_reason, created_at, updated_at
		FROM requests WHERE requester_id = $1 ORDER BY created_at DESC`
	
	rows, err := r.db.Query(query, userID)
	if err != nil {
		return nil, err
	}
	defer rows.Close()
	
	var requests []*models.Request
	for rows.Next() {
		request := &models.Request{}
		err := rows.Scan(
			&request.ID, &request.Type, &request.Title, &request.Description,
			&request.Status, &request.RequesterID, &request.ReviewerID,
			&request.ProjectID, &request.ProjectName, &request.ProjectURL,
			&request.License, &request.Role, &request.ApprovedAt,
			&request.RejectedAt, &request.RejectionReason,
			&request.CreatedAt, &request.UpdatedAt,
		)
		if err != nil {
			return nil, err
		}
		requests = append(requests, request)
	}
	
	return requests, rows.Err()
}

func (r *RequestRepository) UpdateRequestStatus(id string, status string, reviewerID *string, rejectionReason *string) error {
	query := `
		UPDATE requests 
		SET status = $2, reviewer_id = $3, rejection_reason = $4,
			approved_at = CASE WHEN $2 = 'approved' THEN CURRENT_TIMESTAMP ELSE approved_at END,
			rejected_at = CASE WHEN $2 = 'rejected' THEN CURRENT_TIMESTAMP ELSE rejected_at END
		WHERE id = $1`
	
	_, err := r.db.Exec(query, id, status, reviewerID, rejectionReason)
	return err
}

func (r *RequestRepository) UpdateRequest(request *models.Request) error {
	query := `
		UPDATE requests 
		SET title = $2, description = $3, status = $4, project_name = $5, project_url = $6, license = $7, requested_role = $8
		WHERE id = $1`
	
	_, err := r.db.Exec(query, request.ID, request.Title, request.Description,
		request.Status, request.ProjectName, request.ProjectURL,
		request.License, request.Role)
	return err
}

func (r *RequestRepository) DeleteRequest(id string) error {
	query := `DELETE FROM requests WHERE id = $1`
	_, err := r.db.Exec(query, id)
	return err
}

func (r *RequestRepository) AddRequestComment(requestID, userID, comment string, isInternal bool) error {
	query := `
		INSERT INTO request_comments (request_id, user_id, comment, is_internal)
		VALUES ($1, $2, $3, $4)`
	
	_, err := r.db.Exec(query, requestID, userID, comment, isInternal)
	return err
}

func (r *RequestRepository) GetRequestComments(requestID string) ([]*models.RequestComment, error) {
	query := `
		SELECT rc.id, rc.request_id, rc.user_id, rc.comment, rc.is_internal, rc.created_at,
			   u.github_username, u.full_name
		FROM request_comments rc
		INNER JOIN users u ON rc.user_id = u.id
		WHERE rc.request_id = $1
		ORDER BY rc.created_at ASC`
	
	rows, err := r.db.Query(query, requestID)
	if err != nil {
		return nil, err
	}
	defer rows.Close()
	
	var comments []*models.RequestComment
	for rows.Next() {
		comment := &models.RequestComment{}
		err := rows.Scan(
			&comment.ID, &comment.RequestID, &comment.UserID,
			&comment.Comment, &comment.IsInternal, &comment.CreatedAt,
			&comment.GithubUsername, &comment.FullName,
		)
		if err != nil {
			return nil, err
		}
		comments = append(comments, comment)
	}
	
	return comments, rows.Err()
}

func (r *RequestRepository) GetRequestStats(userID string) (map[string]int, error) {
	query := `
		SELECT status, COUNT(*) as count
		FROM requests 
		WHERE requester_id = $1
		GROUP BY status`
	
	rows, err := r.db.Query(query, userID)
	if err != nil {
		return nil, err
	}
	defer rows.Close()
	
	stats := make(map[string]int)
	for rows.Next() {
		var status string
		var count int
		err := rows.Scan(&status, &count)
		if err != nil {
			return nil, err
		}
		stats[status] = count
	}
	
	return stats, rows.Err()
}

func (r *RequestRepository) scanRequests(rows *sql.Rows) ([]*models.Request, error) {
	var requests []*models.Request
	for rows.Next() {
		request := &models.Request{}
		err := rows.Scan(
			&request.ID, &request.Type, &request.Title, &request.Description,
			&request.Status, &request.RequesterID, &request.ReviewerID,
			&request.ProjectID, &request.ProjectName, &request.ProjectURL,
			&request.License, &request.Role, &request.ApprovedAt,
			&request.RejectedAt, &request.RejectionReason,
			&request.CreatedAt, &request.UpdatedAt,
		)
		if err != nil {
			return nil, err
		}
		requests = append(requests, request)
	}
	
	return requests, rows.Err()
}
