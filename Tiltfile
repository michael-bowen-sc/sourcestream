load("ext://go_mod_dep.tilt_extension", "go_mod_dep")

# Backend Go service
go_mod_dep("apps/backend")

docker_build(
    'sourcestream-backend',
    context='apps/backend',
    dockerfile='apps/backend/Dockerfile',
    live_update=[
        sync('apps/backend', './apps/backend'),
    ],
)

k8s_yaml('apps/backend/kubernetes/backend-deployment.yaml')

# Frontend React service
docker_build(
    'sourcestream-frontend',
    context='apps/frontend',
    dockerfile='apps/frontend/Dockerfile',
    live_update=[
        sync('apps/frontend/src', './apps/frontend/src'),
        run('cd apps/frontend && yarn install'),
        run('cd apps/frontend && yarn build'),
    ],
)

k8s_yaml('apps/frontend/kubernetes/frontend-deployment.yaml')

# Expose frontend service
k8s_resource('frontend-service', port_forwards=8080)
