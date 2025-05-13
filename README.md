# Book Library Kubernetes Project

This project demonstrates deploying a MERN (MongoDB, Express, React, Node.js) stack Book Library application on Kubernetes using Minikube.

## Project Structure

```
├── app/
│   ├── frontend/          # React frontend
│   └── backend/           # Node.js/Express backend
├── docker-compose.yml     # For local development
├── deployment.yaml        # Kubernetes deployment configuration
├── service.yaml           # Kubernetes service configuration
└── .github/
    └── workflows/
        └── deploy.yml     # GitHub Actions workflow
```

## Prerequisites

- Docker
- Minikube
- kubectl
- A GitHub account
- Docker Hub account

## Setup Instructions

### 1. Install Minikube and kubectl

```bash
# Install Minikube
curl -LO https://storage.googleapis.com/minikube/releases/latest/minikube-linux-amd64
sudo install minikube-linux-amd64 /usr/local/bin/minikube

# Install kubectl
curl -LO "https://dl.k8s.io/release/$(curl -L -s https://dl.k8s.io/release/stable.txt)/bin/linux/amd64/kubectl"
sudo install -o root -g root -m 0755 kubectl /usr/local/bin/kubectl
```

### 2. Start Minikube

```bash
minikube start
```

### 3. Set up Docker Hub Credentials

Add your Docker Hub credentials as GitHub repository secrets:
- DOCKER_USERNAME
- DOCKER_PASSWORD

### 4. Set up a GitHub Actions Self-Hosted Runner

Follow GitHub's instructions to set up a self-hosted runner on your local machine.

### 5. Run the Application Locally

```bash
# Start the application using Docker Compose
npm run dev

# Or use Docker Compose directly
docker-compose up
```

### 6. Deploy to Kubernetes

The GitHub Actions workflow will automatically build and deploy the application to Minikube when you push to the main branch.

You can also deploy manually:

```bash
# Replace ${DOCKER_USERNAME} with your Docker Hub username
sed -i "s/\${DOCKER_USERNAME}/your-dockerhub-username/g" deployment.yaml

# Create a namespace for the application
kubectl create namespace book-library

# Apply the Kubernetes configurations
kubectl apply -f deployment.yaml -n book-library
kubectl apply -f service.yaml -n book-library
```

### 7. Access the Application

```bash
minikube service frontend-service -n book-library
```

## Troubleshooting

If you encounter issues:

1. Check pod status:
```bash
kubectl get pods -n book-library
```

2. Check pod logs:
```bash
kubectl logs <pod-name> -n book-library
```

3. Check service status:
```bash
kubectl get services -n book-library
```

4. Verify that the images are correctly built and pushed to Docker Hub.