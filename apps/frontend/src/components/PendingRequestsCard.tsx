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
import {
  FiChevronLeft,
  FiChevronRight,
  FiClock,
  FiFolder,
  FiGitPullRequest,
  FiKey,
} from "react-icons/fi";
import { type Request } from "../data/mockData";

interface PendingRequestsCardProps {
  requests: Request[];
}

const getRequestIcon = (type: Request["type"]) => {
  switch (type) {
    case "project":
      return <FiFolder color="#16a34a" />;
    case "pullrequest":
      return <FiGitPullRequest color="#2563eb" />;
    case "access":
      return <FiKey color="#9333ea" />;
    default:
      return <FiClock />;
  }
};

const getStatusColor = (status: Request["status"]) => {
  switch (status) {
    case "pending":
      return "orange";
    case "in_review":
      return "blue";
    case "approved":
      return "green";
    case "rejected":
      return "red";
    default:
      return "default";
  }
};

const getTypeLabel = (type: Request["type"]) => {
  switch (type) {
    case "project":
      return "Project Request";
    case "pullrequest":
      return "Pull Request";
    case "access":
      return "Access Request";
    default:
      return "Request";
  }
};

const formatDate = (dateString: string) => {
  const date = new Date(dateString);
  const now = new Date();
  const diffTime = Math.abs(now.getTime() - date.getTime());
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

  if (diffDays === 1) return "1 day ago";
  if (diffDays < 7) return `${diffDays} days ago`;
  if (diffDays < 30) return `${Math.ceil(diffDays / 7)} weeks ago`;
  return date.toLocaleDateString();
};

const PendingRequestsCard = ({ requests }: PendingRequestsCardProps) => {
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 4;
  const pendingRequests = requests.filter(
    (req) => req.status === "pending" || req.status === "in_review",
  );

  const startIndex = (currentPage - 1) * pageSize;
  const endIndex = startIndex + pageSize;
  const currentRequests = pendingRequests.slice(startIndex, endIndex);

  return (
    <Box bg="white" borderRadius="lg" boxShadow="md" h="400px" p={6}>
      <Flex justify="space-between" align="center" mb={4}>
        <HStack gap="2">
          <FiClock color="#f56500" />
          <Heading size="md">Pending Requests</Heading>
        </HStack>
        <Badge colorScheme="orange" borderRadius="full">
          {pendingRequests.length}
        </Badge>
      </Flex>

      {pendingRequests.length === 0 ? (
        <Flex direction="column" align="center" justify="center" h="300px">
          <Text color="gray.500" fontSize="sm">
            No pending requests
          </Text>
        </Flex>
      ) : (
        <>
          <Box flex="1" overflowY="auto" minH="240px">
            <VStack gap="3" align="stretch">
              {currentRequests.map((request) => (
                <Box
                  key={request.id}
                  p={3}
                  borderBottom="1px solid"
                  borderColor="gray.100"
                  _hover={{ bg: "gray.50" }}
                  borderRadius="lg"
                  transition="all 0.2s"
                >
                  <Flex justify="space-between" align="start" mb={2}>
                    <HStack gap="2">
                      {getRequestIcon(request.type)}
                      <Text fontWeight="semibold" fontSize="sm">
                        {request.title}
                      </Text>
                    </HStack>
                    <Badge
                      colorScheme={getStatusColor(request.status)}
                      fontSize="xs"
                    >
                      {request.status.replace("_", " ")}
                    </Badge>
                  </Flex>

                  <Box ml={6}>
                    <Text fontSize="xs" color="gray.600" mb={1}>
                      {getTypeLabel(request.type)}
                      {request.projectName && ` • ${request.projectName}`}
                    </Text>

                    <Text fontSize="xs" color="gray.500">
                      {formatDate(request.createdAt)}
                    </Text>
                  </Box>
                </Box>
              ))}
            </VStack>
          </Box>

          <Box
            mt="auto"
            pt={3}
            borderTop="1px solid"
            borderColor="gray.100"
            minH="40px"
          >
            {pendingRequests.length > pageSize ? (
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
                  {currentPage} of{" "}
                  {Math.ceil(pendingRequests.length / pageSize)}
                </Text>
                <Button
                  size="sm"
                  variant="ghost"
                  onClick={() =>
                    setCurrentPage(
                      Math.min(
                        Math.ceil(pendingRequests.length / pageSize),
                        currentPage + 1,
                      ),
                    )
                  }
                  disabled={
                    currentPage === Math.ceil(pendingRequests.length / pageSize)
                  }
                >
                  <FiChevronRight />
                </Button>
              </HStack>
            ) : (
              <Box h="24px" />
            )}
          </Box>
        </>
      )}
    </Box>
  );
};

export default PendingRequestsCard;
