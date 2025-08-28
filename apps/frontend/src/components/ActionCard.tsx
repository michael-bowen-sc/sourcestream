import { useState } from "react";
import {
  Box,
  Button,
  Input,
  Textarea,
  VStack,
  HStack,
  Heading,
  Text,
} from "@chakra-ui/react";
import { FiPlus, FiFileText, FiGitBranch } from "react-icons/fi";

interface ActionCardProps {
  type: "project" | "pullrequest" | "access";
  onSubmit: (data: Record<string, string>) => void;
}

const ActionCard = ({ type, onSubmit }: ActionCardProps) => {
  const [formData, setFormData] = useState<Record<string, string>>({});

  const getCardConfig = () => {
    switch (type) {
      case "project":
        return {
          title: "Request New Open Source Project",
          icon: <FiPlus color="#16a34a" />,
          description:
            "Submit a request to create or contribute to a new open source project",
          buttonText: "Submit Project Request",
          colorScheme: "green",
        };
      case "pullrequest":
        return {
          title: "Request Pull Request Approval",
          icon: <FiGitBranch color="#2563eb" />,
          description:
            "Get approval for contributing to an existing open source project",
          buttonText: "Request PR Approval",
          colorScheme: "blue",
        };
      case "access":
        return {
          title: "Request Project Access",
          icon: <FiFileText color="#ea580c" />,
          description:
            "Request access to contribute to an existing approved project",
          buttonText: "Request Access",
          colorScheme: "orange",
        };
    }
  };

  const config = getCardConfig();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit({ type, ...formData });
    setFormData({});
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev: Record<string, string>) => ({
      ...prev,
      [field]: value,
    }));
  };

  const renderFormFields = () => {
    const commonFields = (
      <>
        <Box>
          <Text fontSize="sm" fontWeight="medium" mb={2}>
            Title
          </Text>
          <Input
            placeholder="Brief title for your request"
            value={formData.title || ""}
            onChange={(e) => handleInputChange("title", e.target.value)}
            required
          />
        </Box>
        <Box>
          <Text fontSize="sm" fontWeight="medium" mb={2}>
            Description
          </Text>
          <Textarea
            rows={3}
            placeholder="Detailed description of your request"
            value={formData.description || ""}
            onChange={(e) => handleInputChange("description", e.target.value)}
            required
          />
        </Box>
      </>
    );

    switch (type) {
      case "project":
        return (
          <>
            {commonFields}
            <Box>
              <Text fontSize="sm" fontWeight="medium" mb={2}>
                Project URL
              </Text>
              <Input
                placeholder="https://github.com/org/repo"
                value={formData.projectUrl || ""}
                onChange={(e) =>
                  handleInputChange("projectUrl", e.target.value)
                }
                required
              />
            </Box>
            <Box>
              <Text fontSize="sm" fontWeight="medium" mb={2}>
                License
              </Text>
              <select
                style={{
                  padding: "8px",
                  borderRadius: "6px",
                  border: "1px solid #e2e8f0",
                  width: "100%",
                }}
                value={formData.license || ""}
                onChange={(e: React.ChangeEvent<HTMLSelectElement>) =>
                  handleInputChange("license", e.target.value)
                }
                required
              >
                <option value="">Select project license</option>
                <option value="MIT">MIT</option>
                <option value="Apache-2.0">Apache 2.0</option>
                <option value="GPL-3.0">GPL 3.0</option>
                <option value="BSD-3-Clause">BSD 3-Clause</option>
                <option value="other">Other</option>
              </select>
            </Box>
          </>
        );
      case "pullrequest":
        return (
          <>
            {commonFields}
            <Box>
              <Text fontSize="sm" fontWeight="medium" mb={2}>
                Project Name
              </Text>
              <Input
                placeholder="Project you want to contribute to"
                value={formData.projectName || ""}
                onChange={(e) =>
                  handleInputChange("projectName", e.target.value)
                }
                required
              />
            </Box>
            <Box>
              <Text fontSize="sm" fontWeight="medium" mb={2}>
                Pull Request URL
              </Text>
              <Input
                placeholder="https://github.com/org/repo/pull/123 (if already created)"
                value={formData.prUrl || ""}
                onChange={(e) => handleInputChange("prUrl", e.target.value)}
              />
            </Box>
          </>
        );
      case "access":
        return (
          <>
            {commonFields}
            <Box>
              <Text fontSize="sm" fontWeight="medium" mb={2}>
                Project Name
              </Text>
              <Input
                placeholder="Approved project you want access to"
                value={formData.projectName || ""}
                onChange={(e) =>
                  handleInputChange("projectName", e.target.value)
                }
                required
              />
            </Box>
            <Box>
              <Text fontSize="sm" fontWeight="medium" mb={2}>
                Requested Role
              </Text>
              <select
                style={{
                  padding: "8px",
                  borderRadius: "6px",
                  border: "1px solid #e2e8f0",
                  width: "100%",
                }}
                value={formData.role || ""}
                onChange={(e: React.ChangeEvent<HTMLSelectElement>) =>
                  handleInputChange("role", e.target.value)
                }
                required
              >
                <option value="">Select your intended role</option>
                <option value="contributor">Contributor</option>
                <option value="maintainer">Maintainer</option>
                <option value="reviewer">Reviewer</option>
              </select>
            </Box>
          </>
        );
    }
  };

  return (
    <Box bg="white" borderRadius="lg" boxShadow="md" p={6} h="full">
      <HStack gap="3" mb={4}>
        {config.icon}
        <Box>
          <Heading size="md" mb={1}>
            {config.title}
          </Heading>
          <Text color="gray.600" fontSize="sm">
            {config.description}
          </Text>
        </Box>
      </HStack>

      <form onSubmit={handleSubmit}>
        <VStack gap="4" align="stretch">
          {renderFormFields()}

          <Button
            type="submit"
            colorScheme={config.colorScheme}
            size="lg"
            w="full"
            mt={4}
          >
            {config.buttonText}
          </Button>
        </VStack>
      </form>
    </Box>
  );
};

export default ActionCard;
