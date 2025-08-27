export interface Project {
  id: string;
  name: string;
  description: string;
  status: "active" | "pending" | "approved" | "archived";
  lastActivity: string;
}

export interface User {
  corporateId: string;
  githubUsername: string;
  name: string;
  department: string;
  role: "user" | "ospo_admin" | "admin";
}

export interface Request {
  id: string;
  type: "project" | "pullrequest" | "access";
  title: string;
  description: string;
  status: "pending" | "approved" | "rejected" | "in_review";
  projectName?: string;
  createdAt: string;
}

export const mockUser: User = {
  corporateId: "USER001",
  githubUsername: "john.doe",
  name: "John Doe",
  department: "Engineering",
  role: "user",
};

export const mockAuthoredProjects: Project[] = [
  {
    id: "1",
    name: "React Components Library",
    description: "Reusable UI components",
    status: "active",
    lastActivity: "2 days ago",
  },
  {
    id: "2",
    name: "API Gateway Service",
    description: "Microservices gateway",
    status: "approved",
    lastActivity: "1 week ago",
  },
  {
    id: "3",
    name: "Data Analytics Tool",
    description: "Business intelligence dashboard",
    status: "pending",
    lastActivity: "3 days ago",
  },
];

export const mockContributedProjects: Project[] = [
  {
    id: "4",
    name: "Open Source ML Framework",
    description: "Machine learning utilities",
    status: "active",
    lastActivity: "1 day ago",
  },
  {
    id: "5",
    name: "DevOps Automation",
    description: "CI/CD pipeline tools",
    status: "active",
    lastActivity: "4 days ago",
  },
  {
    id: "6",
    name: "Security Scanner",
    description: "Vulnerability assessment tool",
    status: "approved",
    lastActivity: "1 week ago",
  },
  {
    id: "7",
    name: "Documentation Generator",
    description: "Auto-generate API docs",
    status: "active",
    lastActivity: "2 days ago",
  },
];

export const mockApprovedProjects: Project[] = [
  {
    id: "8",
    name: "Cloud Infrastructure",
    description: "Kubernetes deployment configs",
    status: "approved",
    lastActivity: "5 days ago",
  },
  {
    id: "9",
    name: "Monitoring Dashboard",
    description: "System health monitoring",
    status: "approved",
    lastActivity: "1 week ago",
  },
  {
    id: "10",
    name: "Authentication Service",
    description: "OAuth2 implementation",
    status: "approved",
    lastActivity: "3 days ago",
  },
  {
    id: "11",
    name: "Logging Framework",
    description: "Centralized logging solution",
    status: "approved",
    lastActivity: "6 days ago",
  },
  {
    id: "12",
    name: "Testing Utilities",
    description: "Automated testing tools",
    status: "approved",
    lastActivity: "2 weeks ago",
  },
];

export const mockPendingRequests: Request[] = [
  {
    id: "req-1",
    type: "access",
    title: "request muppet access",
    description: "puppets",
    status: "pending",
    projectName: "the muppets",
    createdAt: "2025-08-22T15:09:47Z",
  },
  {
    id: "req-2",
    type: "project",
    title: "New Documentation Site",
    description: "Create a new documentation portal",
    status: "in_review",
    createdAt: "2025-08-20T10:30:00Z",
  },
  {
    id: "req-3",
    type: "pullrequest",
    title: "Bug fix for authentication",
    description: "Fix OAuth token refresh issue",
    status: "pending",
    projectName: "Authentication Service",
    createdAt: "2025-08-21T14:15:00Z",
  },
];
