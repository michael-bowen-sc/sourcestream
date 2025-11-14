export interface ValidationError {
  field: string;
  message: string;
}

export interface RequestValidationResult {
  isValid: boolean;
  errors: ValidationError[];
}

export const validateProjectRequest = (data: {
  title: string;
  projectName?: string;
  projectUrl?: string;
  license?: string;
}): RequestValidationResult => {
  const errors: ValidationError[] = [];

  // Required field validation
  if (!data.title || data.title.trim().length === 0) {
    errors.push({ field: "title", message: "Title is required" });
  } else if (data.title.trim().length < 3) {
    errors.push({
      field: "title",
      message: "Title must be at least 3 characters long",
    });
  } else if (data.title.trim().length > 100) {
    errors.push({
      field: "title",
      message: "Title must be less than 100 characters",
    });
  }

  if (!data.projectName || data.projectName.trim().length === 0) {
    errors.push({ field: "projectName", message: "Project name is required" });
  } else if (data.projectName.trim().length < 2) {
    errors.push({
      field: "projectName",
      message: "Project name must be at least 2 characters long",
    });
  }

  if (!data.projectUrl || data.projectUrl.trim().length === 0) {
    errors.push({ field: "projectUrl", message: "Project URL is required" });
  } else if (!isValidUrl(data.projectUrl)) {
    errors.push({ field: "projectUrl", message: "Please enter a valid URL" });
  } else if (!isGitHubUrl(data.projectUrl)) {
    errors.push({
      field: "projectUrl",
      message: "Only GitHub URLs are currently supported",
    });
  }

  if (!data.license || data.license.trim().length === 0) {
    errors.push({ field: "license", message: "License selection is required" });
  }

  return {
    isValid: errors.length === 0,
    errors,
  };
};

export const validateAccessRequest = (data: {
  title: string;
  projectName?: string;
  role?: string;
}): RequestValidationResult => {
  const errors: ValidationError[] = [];

  // Required field validation
  if (!data.title || data.title.trim().length === 0) {
    errors.push({ field: "title", message: "Title is required" });
  } else if (data.title.trim().length < 3) {
    errors.push({
      field: "title",
      message: "Title must be at least 3 characters long",
    });
  } else if (data.title.trim().length > 100) {
    errors.push({
      field: "title",
      message: "Title must be less than 100 characters",
    });
  }

  if (!data.projectName || data.projectName.trim().length === 0) {
    errors.push({ field: "projectName", message: "Project name is required" });
  } else if (data.projectName.trim().length < 2) {
    errors.push({
      field: "projectName",
      message: "Project name must be at least 2 characters long",
    });
  }

  if (!data.role || data.role.trim().length === 0) {
    errors.push({ field: "role", message: "Role selection is required" });
  }

  return {
    isValid: errors.length === 0,
    errors,
  };
};

export const validatePullRequestRequest = (data: {
  title: string;
  projectName?: string;
  pullRequestUrl?: string;
}): RequestValidationResult => {
  const errors: ValidationError[] = [];

  // Required field validation
  if (!data.title || data.title.trim().length === 0) {
    errors.push({ field: "title", message: "Title is required" });
  } else if (data.title.trim().length < 3) {
    errors.push({
      field: "title",
      message: "Title must be at least 3 characters long",
    });
  } else if (data.title.trim().length > 100) {
    errors.push({
      field: "title",
      message: "Title must be less than 100 characters",
    });
  }

  if (!data.projectName || data.projectName.trim().length === 0) {
    errors.push({ field: "projectName", message: "Project name is required" });
  }

  if (!data.pullRequestUrl || data.pullRequestUrl.trim().length === 0) {
    errors.push({
      field: "pullRequestUrl",
      message: "Pull request URL is required",
    });
  } else if (!isValidUrl(data.pullRequestUrl)) {
    errors.push({
      field: "pullRequestUrl",
      message: "Please enter a valid URL",
    });
  } else if (!isGitHubPullRequestUrl(data.pullRequestUrl)) {
    errors.push({
      field: "pullRequestUrl",
      message: "Please enter a valid GitHub pull request URL",
    });
  }

  return {
    isValid: errors.length === 0,
    errors,
  };
};

// Helper functions
const isValidUrl = (url: string): boolean => {
  try {
    new URL(url);
    return true;
  } catch {
    return false;
  }
};

const isGitHubUrl = (url: string): boolean => {
  try {
    const parsedUrl = new URL(url);
    return parsedUrl.hostname === "github.com" && parsedUrl.pathname.length > 1;
  } catch {
    return false;
  }
};

const isGitHubPullRequestUrl = (url: string): boolean => {
  try {
    const parsedUrl = new URL(url);
    return (
      parsedUrl.hostname === "github.com" &&
      parsedUrl.pathname.includes("/pull/") &&
      /\/pull\/\d+/.test(parsedUrl.pathname)
    );
  } catch {
    return false;
  }
};
