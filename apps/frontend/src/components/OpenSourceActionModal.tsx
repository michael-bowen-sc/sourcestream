import React, { useState } from "react";
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
  description: string;
  justification?: string;
  projectName?: string;
  repositoryUrl?: string;
  pullRequestUrl?: string;
  contributionType?: string;
  businessImpact?: string;
  timeline?: string;
  securityConsiderations?: string;
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
    description: "",
  });
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

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

    if (!formData.description.trim()) {
      newErrors.description = "Description is required";
    }

    // Action-specific validation
    switch (actionType) {
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
      description: "",
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

            {/* Description Field */}
            <Box>
              <Text fontSize="sm" fontWeight="medium" mb={2}>
                Description *
              </Text>
              <Textarea
                rows={4}
                placeholder="Provide detailed information about your request"
                value={formData.description}
                onChange={(e) =>
                  handleInputChange("description", e.target.value)
                }
                borderColor={errors.description ? "red.300" : "gray.200"}
              />
              {errors.description && (
                <Text fontSize="sm" color="red.500" mt={1}>
                  {errors.description}
                </Text>
              )}
            </Box>

            {/* Action-specific fields */}
            {actionType === "permission" && (
              <>
                <Box>
                  <Text fontSize="sm" fontWeight="medium" mb={2}>
                    Business Justification
                  </Text>
                  <Textarea
                    rows={3}
                    placeholder="Explain the business value and need for open source contributions"
                    value={formData.justification || ""}
                    onChange={(e) =>
                      handleInputChange("justification", e.target.value)
                    }
                  />
                </Box>

                <Box>
                  <Text fontSize="sm" fontWeight="medium" mb={2}>
                    Security Considerations
                  </Text>
                  <Textarea
                    rows={2}
                    placeholder="Describe any security considerations or compliance requirements"
                    value={formData.securityConsiderations || ""}
                    onChange={(e) =>
                      handleInputChange(
                        "securityConsiderations",
                        e.target.value,
                      )
                    }
                  />
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
