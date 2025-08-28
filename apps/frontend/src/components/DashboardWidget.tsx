import { useState } from "react";
import {
  Box,
  VStack,
  HStack,
  Text,
  Heading,
  Badge,
  Button,
  Flex,
} from "@chakra-ui/react";
import { FiChevronLeft, FiChevronRight } from "react-icons/fi";

interface Project {
  id: string;
  name: string;
  description: string;
  status: "active" | "pending" | "approved" | "archived";
  lastActivity: string;
}

interface DashboardWidgetProps {
  title: string;
  projects: Project[];
  type: "authored" | "contributed" | "approved";
}

const getStatusColor = (status: string) => {
  switch (status) {
    case "active":
      return "green";
    case "pending":
      return "orange";
    case "approved":
      return "blue";
    case "archived":
      return "gray";
    default:
      return "gray";
  }
};

const DashboardWidget = ({ title, projects }: DashboardWidgetProps) => {
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 3;
  const startIndex = (currentPage - 1) * pageSize;
  const endIndex = startIndex + pageSize;
  const currentProjects = projects.slice(startIndex, endIndex);

  return (
    <Box bg="white" borderRadius="lg" boxShadow="md" h="400px" p={6}>
      <Heading size="md" color="gray.800" mb={4}>
        {title}
      </Heading>

      <Box flex="1" overflowY="auto" minH="200px">
        <VStack gap="3" align="stretch">
          {currentProjects.map((project) => (
            <Box
              key={project.id}
              p={3}
              borderBottom="1px solid"
              borderColor="gray.100"
              _hover={{ bg: "blue.50" }}
              borderRadius="lg"
              transition="all 0.2s"
              cursor="pointer"
            >
              <Flex justify="space-between" align="start">
                <Box flex="1" minW="0">
                  <Text fontWeight="semibold" color="gray.800" truncate>
                    {project.name}
                  </Text>
                  <Text fontSize="sm" color="gray.600" mt={1}>
                    {project.description}
                  </Text>
                </Box>
                <VStack gap="2" align="end" ml={3} flexShrink={0}>
                  <Badge
                    colorScheme={getStatusColor(project.status)}
                    fontSize="xs"
                  >
                    {project.status.charAt(0).toUpperCase() +
                      project.status.slice(1)}
                  </Badge>
                  <Text
                    fontSize="xs"
                    color="gray.500"
                    bg="gray.100"
                    px={2}
                    py={1}
                    borderRadius="md"
                  >
                    {project.lastActivity}
                  </Text>
                </VStack>
              </Flex>
            </Box>
          ))}
        </VStack>
      </Box>

      <Box
        mt="auto"
        pt={3}
        borderTop="1px solid"
        borderColor="gray.100"
        bg="gray.50"
        borderRadius="lg"
        minH="50px"
      >
        {projects.length > pageSize ? (
          <HStack justify="center" gap="2">
            <Button
              size="sm"
              variant="ghost"
              onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
              disabled={currentPage === 1}
            >
              <FiChevronLeft />
            </Button>
            <Text fontSize="sm" color="gray.600">
              {currentPage} of {Math.ceil(projects.length / pageSize)}
            </Text>
            <Button
              size="sm"
              variant="ghost"
              onClick={() =>
                setCurrentPage(
                  Math.min(
                    Math.ceil(projects.length / pageSize),
                    currentPage + 1,
                  ),
                )
              }
              disabled={currentPage === Math.ceil(projects.length / pageSize)}
            >
              <FiChevronRight />
            </Button>
          </HStack>
        ) : (
          <Flex justify="center" align="center" h="24px">
            <Text fontSize="xs" color="gray.500">
              {projects.length === 0
                ? "No items yet"
                : `${projects.length} item${projects.length !== 1 ? "s" : ""}`}
            </Text>
          </Flex>
        )}
      </Box>
    </Box>
  );
};

export default DashboardWidget;
