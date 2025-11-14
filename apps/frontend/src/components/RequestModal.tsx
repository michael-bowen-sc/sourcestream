import React, { useState, useEffect } from "react";
import {
  Box,
  Button,
  FormControl,
  FormLabel,
  Input,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  Select,
  VStack,
  HStack,
  IconButton,
  Text,
  FormErrorMessage,
  Alert,
  AlertIcon,
  AlertTitle,
  AlertDescription,
} from "@chakra-ui/react";
import { FiFolder, FiGitPullRequest, FiKey, FiX } from "react-icons/fi";
import {
  validateProjectRequest,
  validateAccessRequest,
  validatePullRequestRequest,
  type ValidationError,
} from "../utils/validation";

export interface RequestFormData {
  type: "project" | "pullrequest" | "access";
  title: string;
  projectName?: string;
  projectUrl?: string;
  license?: string;
  role?: string;
}

export interface RequestModalProps {
  visible: boolean;
  onCancel: () => void;
  onSubmit: (data: RequestFormData) => void;
  initialData?: Partial<RequestFormData>;
}

const RequestModal: React.FC<RequestModalProps> = ({
  visible,
  onCancel,
  onSubmit,
  initialData,
}) => {
  const [requestType, setRequestType] = useState<
    "project" | "pullrequest" | "access"
  >("project");
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState<Partial<RequestFormData>>({
    title: "",
    projectName: "",
    projectUrl: "",
    license: "",
    role: "",
  });

  useEffect(() => {
    if (visible && initialData) {
      setFormData(initialData);
      if (initialData.type) {
        setRequestType(initialData.type);
      }
    }
  }, [visible, initialData]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setLoading(true);
      const submitData: RequestFormData = {
        type: requestType,
        title: formData.title || "",
        ...(requestType === "project" && {
          projectName: formData.projectName,
          projectUrl: formData.projectUrl,
          license: formData.license,
        }),
        ...(requestType === "access" && {
          role: formData.role,
        }),
      };

      await onSubmit(submitData);
      handleCancel();
    } catch (error) {
      console.error("Failed to submit request:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    setFormData({
      title: "",
      projectName: "",
      projectUrl: "",
      license: "",
      role: "",
    });
    setRequestType("project");
    onCancel();
  };

  const handleInputChange = (field: keyof RequestFormData, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleSelectChange = (
    field: keyof RequestFormData,
    e: React.ChangeEvent<HTMLSelectElement>,
  ) => {
    setFormData((prev) => ({ ...prev, [field]: e.target.value }));
  };

  const getIcon = (type: string) => {
    switch (type) {
      case "project":
        return <FiFolder size={20} />;
      case "pullrequest":
        return <FiGitPullRequest size={20} />;
      case "access":
        return <FiKey size={20} />;
      default:
        return <FiFolder size={20} />;
    }
  };

  const getTitle = (type: string) => {
    switch (type) {
      case "project":
        return "New Project Request";
      case "pullrequest":
        return "Pull Request Review";
      case "access":
        return "Access Request";
      default:
        return "New Request";
    }
  };

  const renderTypeSpecificFields = () => {
    switch (requestType) {
      case "project":
        return (
          <VStack gap="4" align="stretch">
            <Box>
              <Text mb={2} fontWeight="medium">
                Project Name *
              </Text>
              <Input
                placeholder="Enter project name"
                value={formData.projectName || ""}
                onChange={(e) =>
                  handleInputChange("projectName", e.target.value)
                }
              />
            </Box>
            <Box>
              <Text mb={2} fontWeight="medium">
                Project URL *
              </Text>
              <Input
                placeholder="https://github.com/username/project"
                value={formData.projectUrl || ""}
                onChange={(e) =>
                  handleInputChange("projectUrl", e.target.value)
                }
              />
            </Box>
            <Box>
              <Text mb={2} fontWeight="medium">
                License *
              </Text>
              <select
                style={{
                  width: "100%",
                  padding: "8px",
                  border: "1px solid #E2E8F0",
                  borderRadius: "6px",
                  fontSize: "16px",
                }}
                value={formData.license || ""}
                onChange={(e) => handleSelectChange("license", e)}
              >
                <option value="">Select license type</option>
                <option value="MIT">MIT License</option>
                <option value="Apache-2.0">Apache License 2.0</option>
                <option value="GPL-3.0">GNU General Public License v3.0</option>
                <option value="BSD-3-Clause">BSD 3-Clause License</option>
                <option value="Other">Other</option>
              </select>
            </Box>
          </VStack>
        );
      case "access":
        return (
          <Box>
            <Text mb={2} fontWeight="medium">
              Requested Role *
            </Text>
            <select
              style={{
                width: "100%",
                padding: "8px",
                border: "1px solid #E2E8F0",
                borderRadius: "6px",
                fontSize: "16px",
              }}
              value={formData.role || ""}
              onChange={(e) => handleSelectChange("role", e)}
            >
              <option value="">Select role</option>
              <option value="viewer">Viewer</option>
              <option value="contributor">Contributor</option>
              <option value="maintainer">Maintainer</option>
              <option value="admin">Admin</option>
            </select>
          </Box>
        );
      default:
        return null;
    }
  };

  if (!visible) return null;

  return (
    <Box
      position="fixed"
      top={0}
      left={0}
      right={0}
      bottom={0}
      bg="blackAlpha.600"
      display="flex"
      alignItems="center"
      justifyContent="center"
      zIndex={1000}
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
            <Box p={2} borderRadius="lg" bg="blue.50">
              {getIcon(requestType)}
            </Box>
            <Heading size="md">{getTitle(requestType)}</Heading>
          </HStack>
          <Button variant="ghost" onClick={handleCancel}>
            <FiX size={20} />
          </Button>
        </Flex>

        <Grid templateColumns="repeat(3, 1fr)" gap={4} mb={6}>
          {(["project", "pullrequest", "access"] as const).map((type) => (
            <GridItem key={type}>
              <Box
                p={4}
                borderRadius="lg"
                border="2px"
                borderColor={requestType === type ? "blue.500" : "gray.200"}
                bg={requestType === type ? "blue.50" : "white"}
                cursor="pointer"
                transition="all 0.2s"
                _hover={{
                  borderColor: requestType === type ? "blue.500" : "gray.300",
                  bg: requestType === type ? "blue.50" : "gray.50",
                }}
                onClick={() => setRequestType(type)}
              >
                <VStack gap="2">
                  <Box
                    p={2}
                    borderRadius="lg"
                    bg={requestType === type ? "blue.100" : "gray.100"}
                  >
                    {getIcon(type)}
                  </Box>
                  <Text
                    fontSize="sm"
                    fontWeight="medium"
                    color={requestType === type ? "blue.700" : "gray.600"}
                    textTransform="capitalize"
                  >
                    {type === "pullrequest" ? "Pull Request" : type}
                  </Text>
                </VStack>
              </Box>
            </GridItem>
          ))}
        </Grid>

        <Box as="form" onSubmit={handleSubmit}>
          <VStack gap="4" align="stretch">
            <Box>
              <Text mb={2} fontWeight="medium">
                Title *
              </Text>
              <Input
                placeholder="Enter request title"
                value={formData.title || ""}
                onChange={(e) => handleInputChange("title", e.target.value)}
                required
              />
            </Box>

            {renderTypeSpecificFields()}

            <HStack
              justify="flex-end"
              gap="3"
              pt={4}
              borderTop="1px"
              borderColor="gray.200"
            >
              <Button variant="outline" onClick={handleCancel}>
                Cancel
              </Button>
              <Button
                type="submit"
                colorScheme="blue"
                loading={loading}
                loadingText="Submitting..."
              >
                Submit Request
              </Button>
            </HStack>
          </VStack>
        </Box>
      </Box>
    </Box>
  );
};

export default RequestModal;
