import React, { useState, useEffect } from "react";
import {
  Box,
  Button,
  Flex,
  Heading,
  HStack,
  Input,
  Textarea,
  VStack,
  Text,
} from "@chakra-ui/react";
import {
  FiX,
  FiShield,
  FiPlus,
  FiUsers,
  FiGitPullRequest,
} from "react-icons/fi";

export type OpenSourceActionType =
  | "permission"
  | "create"
  | "contribute"
  | "pr-approval";

export interface OpenSourceFormData {
  title: string;
  justification?: string;
  projectName?: string;
  repositoryUrl?: string;
  pullRequestUrl?: string;
  contributionType?: string;
  businessImpact?: string;
  timeline?: string;
  securityConsiderations?: string;
  approvedProjectId?: string;
  businessJustification?: string;
}

export interface ApprovedProject {
  id: string;
  name: string;
  description: string;
  repository_url: string;
  license: string;
  contribution_type: string; // CLA, CCLA, DCO
  maintainer_contact: string;
  approval_date: string;
  is_active: boolean;
  allowed_contribution_types: string[];
}

interface OpenSourceActionModalProps {
  isOpen: boolean;
  onClose: () => void;
  actionType: OpenSourceActionType;
  onSubmit: (data: OpenSourceFormData) => Promise<void>;
}

const OpenSourceActionModal: React.FC<OpenSourceActionModalProps> = ({
  isOpen,
  onClose,
  actionType,
  onSubmit,
}) => {
  const [formData, setFormData] = useState<OpenSourceFormData>({
    title: "",
  });
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [approvedProjects, setApprovedProjects] = useState<ApprovedProject[]>(
    [],
  );
  const [loadingProjects, setLoadingProjects] = useState(false);

  // Fetch approved projects when modal opens for permission requests
  useEffect(() => {
    if (isOpen && actionType === "permission") {
      fetchApprovedProjects();
    }
  }, [isOpen, actionType]);

  const fetchApprovedProjects = async () => {
    setLoadingProjects(true);
    try {
      // TODO: Replace with actual gRPC API call to GetApprovedProjectsList
      // For now using mock data that matches the backend service response
      const mockProjects: ApprovedProject[] = [
        {
          id: "1",
          name: "React",
          description: "A JavaScript library for building user interfaces",
          repository_url: "https://github.com/facebook/react",
          license: "MIT",
          contribution_type: "CLA",
          maintainer_contact: "react-team@meta.com",
          approval_date: "2024-01-15T00:00:00Z",
          is_active: true,
          allowed_contribution_types: [
            "bug-fix",
            "feature",
            "documentation",
            "testing",
          ],
        },
        {
          id: "2",
          name: "Vue.js",
          description: "The Progressive JavaScript Framework",
          repository_url: "https://github.com/vuejs/vue",
          license: "MIT",
          contribution_type: "DCO",
          maintainer_contact: "team@vuejs.org",
          approval_date: "2024-01-10T00:00:00Z",
          is_active: true,
          allowed_contribution_types: [
            "bug-fix",
            "feature",
            "documentation",
            "testing",
            "maintenance",
          ],
        },
        {
          id: "3",
          name: "Angular",
          description: "Deliver web apps with confidence",
          repository_url: "https://github.com/angular/angular",
          license: "MIT",
          contribution_type: "CLA",
          maintainer_contact: "angular-team@google.com",
          approval_date: "2024-01-20T00:00:00Z",
          is_active: true,
          allowed_contribution_types: [
            "bug-fix",
            "feature",
            "documentation",
            "testing",
          ],
        },
        {
          id: "4",
          name: "Node.js",
          description: "Node.js JavaScript runtime",
          repository_url: "https://github.com/nodejs/node",
          license: "MIT",
          contribution_type: "DCO",
          maintainer_contact: "nodejs-team@nodejs.org",
          approval_date: "2024-01-25T00:00:00Z",
          is_active: true,
          allowed_contribution_types: [
            "bug-fix",
            "feature",
            "documentation",
            "testing",
            "maintenance",
          ],
        },
        {
          id: "5",
          name: "TypeScript",
          description: "TypeScript is a superset of JavaScript",
          repository_url: "https://github.com/microsoft/TypeScript",
          license: "Apache-2.0",
          contribution_type: "CLA",
          maintainer_contact: "typescript@microsoft.com",
          approval_date: "2024-02-01T00:00:00Z",
          is_active: true,
          allowed_contribution_types: [
            "bug-fix",
            "feature",
            "documentation",
            "testing",
          ],
        },
        {
          id: "6",
          name: "Kubernetes",
          description: "Production-Grade Container Scheduling and Management",
          repository_url: "https://github.com/kubernetes/kubernetes",
          license: "Apache-2.0",
          contribution_type: "CLA",
          maintainer_contact: "kubernetes-dev@googlegroups.com",
          approval_date: "2024-02-05T00:00:00Z",
          is_active: true,
          allowed_contribution_types: [
            "bug-fix",
            "feature",
            "documentation",
            "testing",
            "maintenance",
          ],
        },
      ];
      setApprovedProjects(mockProjects);
    } catch (error) {
      console.error("Failed to fetch approved projects:", error);
    } finally {
      setLoadingProjects(false);
    }
  };

  const handleInputChange = (
    field: keyof OpenSourceFormData,
    value: string,
  ) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: "" }));
    }
  };

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!formData.title.trim()) {
      newErrors.title = "Title is required";
    }

    // Action-specific validation
    switch (actionType) {
      case "permission":
        if (!formData.approvedProjectId?.trim()) {
          newErrors.approvedProjectId = "Please select an approved project";
        }
        if (!formData.businessJustification?.trim()) {
          newErrors.businessJustification =
            "Business justification is required";
        }
        break;
      case "create":
        if (!formData.projectName?.trim()) {
          newErrors.projectName = "Project name is required";
        }
        break;
      case "contribute":
        if (!formData.repositoryUrl?.trim()) {
          newErrors.repositoryUrl = "Repository URL is required";
        }
        break;
      case "pr-approval":
        if (!formData.pullRequestUrl?.trim()) {
          newErrors.pullRequestUrl = "Pull Request URL is required";
        }
        if (!formData.repositoryUrl?.trim()) {
          newErrors.repositoryUrl = "Repository URL is required";
        }
        break;
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    setLoading(true);
    try {
      await onSubmit(formData);
      alert("Request submitted successfully!");
      handleClose();
    } catch (error) {
      alert("Error submitting request. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    setFormData({
      title: "",
    });
    setErrors({});
    onClose();
  };

  const getIcon = () => {
    switch (actionType) {
      case "permission":
        return <FiShield size={20} />;
      case "create":
        return <FiPlus size={20} />;
      case "contribute":
        return <FiUsers size={20} />;
      case "pr-approval":
        return <FiGitPullRequest size={20} />;
    }
  };

  const getTitle = () => {
    switch (actionType) {
      case "permission":
        return "Request Permission for Open Source Contributions";
      case "create":
        return "Create New Open Source Project";
      case "contribute":
        return "Request to Contribute to Existing Project";
      case "pr-approval":
        return "PR Approval Request";
    }
  };

  const getColorScheme = () => {
    switch (actionType) {
      case "permission":
        return "orange";
      case "create":
        return "blue";
      case "contribute":
        return "green";
      case "pr-approval":
        return "purple";
    }
  };

  if (!isOpen) return null;

  return (
    <Box
      position="fixed"
      top={0}
      left={0}
      right={0}
      bottom={0}
      bg="rgba(0, 0, 0, 0.5)"
      display="flex"
      alignItems="center"
      justifyContent="center"
      zIndex={1000}
      p={4}
    >
      <Box
        bg="white"
        borderRadius="lg"
        boxShadow="xl"
        maxW="600px"
        w="90%"
        maxH="90vh"
        overflow="auto"
        p={6}
      >
        <Flex justify="space-between" align="center" mb={6}>
          <HStack gap="3">
            <Box p={2} borderRadius="lg" bg={`${getColorScheme()}.50`}>
              {getIcon()}
            </Box>
            <Heading size="md">{getTitle()}</Heading>
          </HStack>
          <Button variant="ghost" onClick={handleClose}>
            <FiX size={20} />
          </Button>
        </Flex>

        <Box as="form" onSubmit={handleSubmit}>
          <VStack gap="4" align="stretch">
            {/* Title Field */}
            <Box>
              <Text fontSize="sm" fontWeight="medium" mb={2}>
                Title *
              </Text>
              <Input
                placeholder="Enter request title"
                value={formData.title}
                onChange={(e) => handleInputChange("title", e.target.value)}
                borderColor={errors.title ? "red.300" : "gray.200"}
              />
              {errors.title && (
                <Text fontSize="sm" color="red.500" mt={1}>
                  {errors.title}
                </Text>
              )}
            </Box>

            {/* Action-specific fields */}
            {actionType === "permission" && (
              <>
                <Box>
                  <Text fontSize="sm" fontWeight="medium" mb={2}>
                    Approved Project *
                  </Text>
                  <select
                    style={{
                      width: "100%",
                      padding: "8px",
                      borderRadius: "6px",
                      border: `1px solid ${errors.approvedProjectId ? "#FC8181" : "#E2E8F0"}`,
                      fontSize: "14px",
                      backgroundColor: loadingProjects ? "#F7FAFC" : "white",
                    }}
                    value={formData.approvedProjectId || ""}
                    onChange={(e: React.ChangeEvent<HTMLSelectElement>) =>
                      handleInputChange("approvedProjectId", e.target.value)
                    }
                    disabled={loadingProjects}
                  >
                    <option value="">
                      {loadingProjects
                        ? "Loading projects..."
                        : "Select an approved project"}
                    </option>
                    {approvedProjects.map((project) => (
                      <option key={project.id} value={project.id}>
                        {project.name} ({project.contribution_type}) -{" "}
                        {project.license}
                      </option>
                    ))}
                  </select>
                  {errors.approvedProjectId && (
                    <Text fontSize="sm" color="red.500" mt={1}>
                      {errors.approvedProjectId}
                    </Text>
                  )}
                  {formData.approvedProjectId && (
                    <Box mt={2} p={3} bg="gray.50" borderRadius="md">
                      {(() => {
                        const selectedProject = approvedProjects.find(
                          (p) => p.id === formData.approvedProjectId,
                        );
                        return selectedProject ? (
                          <VStack align="start" gap="1">
                            <Text fontSize="sm" fontWeight="medium">
                              {selectedProject.name}
                            </Text>
                            <Text fontSize="xs" color="gray.600">
                              {selectedProject.description}
                            </Text>
                            <Text fontSize="xs">
                              <strong>Repository:</strong>{" "}
                              {selectedProject.repository_url}
                            </Text>
                            <Text fontSize="xs">
                              <strong>License:</strong>{" "}
                              {selectedProject.license} |{" "}
                              <strong>Contribution Type:</strong>{" "}
                              {selectedProject.contribution_type}
                            </Text>
                            <Text fontSize="xs">
                              <strong>Allowed Contributions:</strong>{" "}
                              {selectedProject.allowed_contribution_types.join(
                                ", ",
                              )}
                            </Text>
                          </VStack>
                        ) : null;
                      })()}
                    </Box>
                  )}
                </Box>

                <Box>
                  <Text fontSize="sm" fontWeight="medium" mb={2}>
                    Business Justification *
                  </Text>
                  <Textarea
                    rows={4}
                    placeholder="Explain the business value and need for contributing to this open source project. Include how this contribution aligns with company goals and benefits."
                    value={formData.businessJustification || ""}
                    onChange={(e) =>
                      handleInputChange("businessJustification", e.target.value)
                    }
                    borderColor={
                      errors.businessJustification ? "red.300" : "gray.200"
                    }
                  />
                  {errors.businessJustification && (
                    <Text fontSize="sm" color="red.500" mt={1}>
                      {errors.businessJustification}
                    </Text>
                  )}
                </Box>
              </>
            )}

            {actionType === "create" && (
              <>
                <Box>
                  <Text fontSize="sm" fontWeight="medium" mb={2}>
                    Project Name *
                  </Text>
                  <Input
                    placeholder="Enter the name of your new project"
                    value={formData.projectName || ""}
                    onChange={(e) =>
                      handleInputChange("projectName", e.target.value)
                    }
                    borderColor={errors.projectName ? "red.300" : "gray.200"}
                  />
                  {errors.projectName && (
                    <Text fontSize="sm" color="red.500" mt={1}>
                      {errors.projectName}
                    </Text>
                  )}
                </Box>

                <Box>
                  <Text fontSize="sm" fontWeight="medium" mb={2}>
                    Business Impact
                  </Text>
                  <Textarea
                    rows={3}
                    placeholder="Describe the expected business impact and benefits"
                    value={formData.businessImpact || ""}
                    onChange={(e) =>
                      handleInputChange("businessImpact", e.target.value)
                    }
                  />
                </Box>

                <Box>
                  <Text fontSize="sm" fontWeight="medium" mb={2}>
                    Timeline
                  </Text>
                  <select
                    style={{
                      width: "100%",
                      padding: "8px",
                      borderRadius: "6px",
                      border: "1px solid #E2E8F0",
                      fontSize: "14px",
                    }}
                    value={formData.timeline || ""}
                    onChange={(e) =>
                      handleInputChange("timeline", e.target.value)
                    }
                  >
                    <option value="">Select expected timeline</option>
                    <option value="1-3 months">1-3 months</option>
                    <option value="3-6 months">3-6 months</option>
                    <option value="6-12 months">6-12 months</option>
                    <option value="12+ months">12+ months</option>
                  </select>
                </Box>
              </>
            )}

            {actionType === "contribute" && (
              <>
                <Box>
                  <Text fontSize="sm" fontWeight="medium" mb={2}>
                    Repository URL *
                  </Text>
                  <Input
                    placeholder="https://github.com/owner/repository"
                    value={formData.repositoryUrl || ""}
                    onChange={(e) =>
                      handleInputChange("repositoryUrl", e.target.value)
                    }
                    borderColor={errors.repositoryUrl ? "red.300" : "gray.200"}
                  />
                  {errors.repositoryUrl && (
                    <Text fontSize="sm" color="red.500" mt={1}>
                      {errors.repositoryUrl}
                    </Text>
                  )}
                </Box>

                <Box>
                  <Text fontSize="sm" fontWeight="medium" mb={2}>
                    Contribution Type
                  </Text>
                  <select
                    style={{
                      width: "100%",
                      padding: "8px",
                      borderRadius: "6px",
                      border: "1px solid #E2E8F0",
                      fontSize: "14px",
                    }}
                    value={formData.contributionType || ""}
                    onChange={(e) =>
                      handleInputChange("contributionType", e.target.value)
                    }
                  >
                    <option value="">Select type of contribution</option>
                    <option value="bug-fix">Bug Fix</option>
                    <option value="feature">New Feature</option>
                    <option value="documentation">Documentation</option>
                    <option value="testing">Testing</option>
                    <option value="maintenance">Maintenance</option>
                    <option value="other">Other</option>
                  </select>
                </Box>

                <Box>
                  <Text fontSize="sm" fontWeight="medium" mb={2}>
                    Business Justification
                  </Text>
                  <Textarea
                    rows={3}
                    placeholder="Explain how this contribution benefits the business"
                    value={formData.justification || ""}
                    onChange={(e) =>
                      handleInputChange("justification", e.target.value)
                    }
                  />
                </Box>
              </>
            )}

            {actionType === "pr-approval" && (
              <>
                <Box>
                  <Text fontSize="sm" fontWeight="medium" mb={2}>
                    Pull Request URL *
                  </Text>
                  <Input
                    placeholder="https://github.com/owner/repository/pull/123"
                    value={formData.pullRequestUrl || ""}
                    onChange={(e) =>
                      handleInputChange("pullRequestUrl", e.target.value)
                    }
                    borderColor={errors.pullRequestUrl ? "red.300" : "gray.200"}
                  />
                  {errors.pullRequestUrl && (
                    <Text fontSize="sm" color="red.500" mt={1}>
                      {errors.pullRequestUrl}
                    </Text>
                  )}
                </Box>

                <Box>
                  <Text fontSize="sm" fontWeight="medium" mb={2}>
                    Repository URL *
                  </Text>
                  <Input
                    placeholder="https://github.com/owner/repository"
                    value={formData.repositoryUrl || ""}
                    onChange={(e) =>
                      handleInputChange("repositoryUrl", e.target.value)
                    }
                    borderColor={errors.repositoryUrl ? "red.300" : "gray.200"}
                  />
                  {errors.repositoryUrl && (
                    <Text fontSize="sm" color="red.500" mt={1}>
                      {errors.repositoryUrl}
                    </Text>
                  )}
                </Box>

                <Box>
                  <Text fontSize="sm" fontWeight="medium" mb={2}>
                    Business Impact
                  </Text>
                  <Textarea
                    rows={3}
                    placeholder="Describe the business value of this contribution"
                    value={formData.businessImpact || ""}
                    onChange={(e) =>
                      handleInputChange("businessImpact", e.target.value)
                    }
                  />
                </Box>
              </>
            )}

            <HStack
              justify="flex-end"
              gap="3"
              pt={4}
              borderTop="1px"
              borderColor="gray.200"
            >
              <Button variant="outline" onClick={handleClose}>
                Cancel
              </Button>
              <Button
                type="submit"
                colorScheme={getColorScheme()}
                loading={loading}
              >
                {loading ? "Submitting..." : "Submit Request"}
              </Button>
            </HStack>
          </VStack>
        </Box>
      </Box>
    </Box>
  );
};

export default OpenSourceActionModal;
