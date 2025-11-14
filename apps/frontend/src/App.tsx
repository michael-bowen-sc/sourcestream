import { useState, useEffect } from "react";
import {
  Box,
  Grid,
  GridItem,
  Heading,
  Text,
  VStack,
  HStack,
  Icon,
  Button,
  useDisclosure,
} from "@chakra-ui/react";
import {
  FiUser,
  FiGitBranch,
  FiStar,
  FiCheckCircle,
  FiClock,
  FiAlertTriangle,
  FiShield,
} from "react-icons/fi";
import DashboardWidget from "./components/DashboardWidget";
import PendingRequestsCard from "./components/PendingRequestsCard";
import OpenSourceActionModal, {
  type OpenSourceActionType,
  type OpenSourceFormData,
} from "./components/OpenSourceActionModal";
import {
  mockUser,
  mockAuthoredProjects,
  mockContributedProjects,
  mockApprovedProjects,
  mockPendingRequests,
  type User,
  type Project,
  type Request,
} from "./data/mockData";
import { useRequests } from "./hooks/useRequests";

function App() {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [authoredProjects, setAuthoredProjects] = useState<Project[]>([]);
  const [contributedProjects, setContributedProjects] = useState<Project[]>([]);
  const [approvedProjects, setApprovedProjects] = useState<Project[]>([]);
  const [pendingRequests, setPendingRequests] = useState<Request[]>([]);
  const [modalOpen, setModalOpen] = useState(false);
  const [currentActionType, setCurrentActionType] =
    useState<OpenSourceActionType>("permission");
  const { onOpen } = useDisclosure();

  // Use requests hook for real-time data management
  const { requests: liveRequests, submitNewRequest } = useRequests(
    currentUser?.corporateId || "USER001",
  );

  const handleOpenSourceAction = (type: OpenSourceActionType) => {
    setCurrentActionType(type);
    setModalOpen(true);
  };

  const handleModalSubmit = async (data: OpenSourceFormData) => {
    console.log("Submitting form data:", data);
    try {
      // Map form data to request format
      const requestData = {
        type:
          currentActionType === "permission"
            ? ("access" as const)
            : ("project" as const),
        title: data.title,
        projectName: data.projectName,
        projectUrl: data.repositoryUrl,
      };

      const success = await submitNewRequest(requestData);
      if (success) {
        console.log("Form submitted successfully");
        // Dashboard will automatically refresh via useRequests hook
      } else {
        console.error("Form submission failed");
      }
    } catch (error) {
      console.error("Error submitting form:", error);
    }
  };

  useEffect(() => {
    // Check if we're in development mode and no real data exists
    const isDev = import.meta.env.DEV;
    const hasRealData = false; // This would be replaced with actual API check

    if (isDev && !hasRealData) {
      // Load mock data only in development when no real state exists
      setCurrentUser(mockUser);
      setAuthoredProjects(mockAuthoredProjects);
      setContributedProjects(mockContributedProjects);
      setApprovedProjects(mockApprovedProjects);
      setPendingRequests(mockPendingRequests);
    } else {
      // In production or when real data exists, load from API
      // TODO: Replace with actual API calls
      // loadUserData();
      // loadProjectsData();
    }
  }, []);

  // Show loading state if no user data is available yet
  if (!currentUser) {
    return (
      <Box minH="100vh" bg="gray.50">
        <Flex
          as="header"
          position="fixed"
          top={0}
          left={0}
          right={0}
          zIndex={1000}
          h="64px"
          bg="white"
          px={4}
          align="center"
          justify="space-between"
          boxShadow="0 2px 8px rgba(0,0,0,0.15)"
        >
          <HStack gap="3">
            {currentUser && (currentUser as User).role === "ospo_admin" && (
              <IconButton
                aria-label="Open menu"
                onClick={onOpen}
                variant="ghost"
                color="gray.700"
                size="md"
              >
                <FiMenu />
              </IconButton>
            )}
            <Heading size="md" color="gray.700" fontWeight="bold">
              SourceStream
            </Heading>
          </HStack>
          <HStack gap="2">
            <IconButton
              aria-label="Notifications"
              variant="ghost"
              color="gray.700"
              size="md"
            >
              <FiBell />
            </IconButton>
            <IconButton
              aria-label="Profile"
              variant="ghost"
              color="gray.700"
              size="md"
              onClick={() => alert("Profile management coming soon!")}
            >
              <FiUser />
            </IconButton>
          </HStack>
        </Flex>
        <Flex
          as="main"
          direction="column"
          align="center"
          justify="center"
          h="100vh"
        >
          <VStack gap="4">
            <Spinner size="xl" color="blue.500" />
            <Text color="gray.600">Loading your dashboard...</Text>
          </VStack>
        </Flex>
      </Box>
    );
  }

  return (
    <Box minH="100vh" bg="gray.50">
      {/* Header */}
      <Flex
        as="header"
        position="fixed"
        top={0}
        left={0}
        right={0}
        zIndex={1000}
        h="64px"
        bg="white"
        px={4}
        align="center"
        justify="space-between"
        boxShadow="0 2px 8px rgba(0,0,0,0.15)"
      >
        <HStack gap="3">
          {currentUser && (currentUser as User).role === "ospo_admin" && (
            <IconButton
              aria-label="Open menu"
              onClick={onOpen}
              variant="ghost"
              color="gray.700"
              size="md"
            >
              <FiMenu />
            </IconButton>
          )}
          <Heading size="md" color="gray.700" fontWeight="bold">
            SourceStream
          </Heading>
        </HStack>
        <HStack gap="2">
          <IconButton
            aria-label="Notifications"
            variant="ghost"
            color="gray.700"
            size="md"
          >
            <FiBell />
          </IconButton>
          <IconButton
            aria-label="Profile"
            variant="ghost"
            color="gray.700"
            size="md"
            onClick={() => alert("Profile management coming soon!")}
          >
            <FiUser />
          </IconButton>
        </HStack>
      </Flex>

      {/* Main Content */}
      <Box pt="80px" px={6} pb={6}>
        <Box maxW="1200px" mx="auto">
          {/* Quick Actions Section */}
          <Box bg="white" borderRadius="lg" boxShadow="md" p={6} mb={8}>
            <Heading size="md" mb={4} color="gray.800">
              Quick Actions
            </Heading>
            <Grid
              templateColumns={{
                base: "repeat(1, 1fr)",
                sm: "repeat(2, 1fr)",
                md: "repeat(4, 1fr)",
              }}
              gap="4"
            >
              <GridItem>
                <Button
                  size="lg"
                  w="full"
                  h="auto"
                  py={4}
                  border="2px"
                  borderColor="orange.200"
                  color="orange.600"
                  bg="white"
                  _hover={{ bg: "orange.50", borderColor: "orange.300" }}
                  transition="all 0.3s"
                  onClick={() => handleOpenSourceAction("permission")}
                >
                  <VStack gap="1">
                    <FiShield size={20} />
                    <Text fontWeight="semibold" textAlign="center">
                      Request Permission
                    </Text>
                    <Text fontSize="xs" color="gray.500" textAlign="center">
                      Make open source contributions
                    </Text>
                  </VStack>
                </Button>
              </GridItem>
              <GridItem>
                <Button
                  size="lg"
                  w="full"
                  h="auto"
                  py={4}
                  border="2px"
                  borderColor="blue.200"
                  color="blue.600"
                  bg="white"
                  _hover={{ bg: "blue.50", borderColor: "blue.300" }}
                  transition="all 0.3s"
                  onClick={() => handleOpenSourceAction("create")}
                >
                  <VStack gap="1">
                    <FiPlus size={20} />
                    <Text fontWeight="semibold" textAlign="center">
                      Create New Project
                    </Text>
                    <Text fontSize="xs" color="gray.500" textAlign="center">
                      New open source project
                    </Text>
                  </VStack>
                </Button>
              </GridItem>
              <GridItem>
                <Button
                  size="lg"
                  w="full"
                  h="auto"
                  py={4}
                  border="2px"
                  borderColor="green.200"
                  color="green.600"
                  bg="white"
                  _hover={{ bg: "green.50", borderColor: "green.300" }}
                  transition="all 0.3s"
                  onClick={() => handleOpenSourceAction("contribute")}
                >
                  <VStack gap="1">
                    <FiUsers size={20} />
                    <Text fontWeight="semibold" textAlign="center">
                      Request to Contribute
                    </Text>
                    <Text fontSize="xs" color="gray.500" textAlign="center">
                      Existing open source project
                    </Text>
                  </VStack>
                </Button>
              </GridItem>
              <GridItem>
                <Button
                  size="lg"
                  w="full"
                  h="auto"
                  py={4}
                  border="2px"
                  borderColor="purple.200"
                  color="purple.600"
                  bg="white"
                  _hover={{ bg: "purple.50", borderColor: "purple.300" }}
                  transition="all 0.3s"
                  onClick={() => handleOpenSourceAction("pr-approval")}
                >
                  <VStack gap="1">
                    <FiGitPullRequest size={20} />
                    <Text fontWeight="semibold" textAlign="center">
                      PR Approval Request
                    </Text>
                    <Text fontSize="xs" color="gray.500" textAlign="center">
                      Contributing to open source
                    </Text>
                  </VStack>
                </Button>
              </GridItem>
            </Grid>
          </Box>

          {/* Stats Grid */}
          <Grid
            templateColumns={{
              base: "repeat(1, 1fr)",
              sm: "repeat(2, 1fr)",
              lg: "repeat(4, 1fr)",
            }}
            gap="6"
            mb={8}
          >
            <GridItem>
              <Box
                bg="white"
                p={6}
                borderRadius="lg"
                boxShadow="md"
                aspectRatio={1}
                display="flex"
                flexDirection="column"
                alignItems="center"
                justifyContent="center"
              >
                <Text fontSize="md" color="gray.600" textAlign="center" mb={2}>
                  Projects Authored
                </Text>
                <Text fontSize="4xl" fontWeight="bold" color="blue.600">
                  {authoredProjects.length}
                </Text>
              </Box>
            </GridItem>
            <GridItem>
              <Box
                bg="white"
                p={6}
                borderRadius="lg"
                boxShadow="md"
                aspectRatio={1}
                display="flex"
                flexDirection="column"
                alignItems="center"
                justifyContent="center"
              >
                <Text fontSize="md" color="gray.600" textAlign="center" mb={2}>
                  Contributed To
                </Text>
                <Text fontSize="4xl" fontWeight="bold" color="green.600">
                  {contributedProjects.length}
                </Text>
              </Box>
            </GridItem>
            <GridItem>
              <Box
                bg="white"
                p={6}
                borderRadius="lg"
                boxShadow="md"
                aspectRatio={1}
                display="flex"
                flexDirection="column"
                alignItems="center"
                justifyContent="center"
              >
                <Text fontSize="md" color="gray.600" textAlign="center" mb={2}>
                  Approved Access
                </Text>
                <Text fontSize="4xl" fontWeight="bold" color="purple.600">
                  {approvedProjects.length}
                </Text>
              </Box>
            </GridItem>
            <GridItem>
              <Box
                bg="white"
                p={6}
                borderRadius="lg"
                boxShadow="md"
                aspectRatio={1}
                display="flex"
                flexDirection="column"
                alignItems="center"
                justifyContent="center"
              >
                <Text fontSize="md" color="gray.600" textAlign="center" mb={2}>
                  Pending Requests
                </Text>
                <Text fontSize="4xl" fontWeight="bold" color="orange.600">
                  {pendingRequests.length}
                </Text>
              </Box>
            </GridItem>
          </Grid>

          {/* Dashboard Widgets Grid */}
          <Grid
            templateColumns={{
              base: "repeat(1, 1fr)",
              lg: "repeat(2, 1fr)",
            }}
            gap="6"
            mb={8}
          >
            <GridItem>
              <DashboardWidget
                title="My Projects"
                projects={authoredProjects}
                type="authored"
              />
            </GridItem>
            <GridItem>
              <PendingRequestsCard requests={pendingRequests} />
            </GridItem>
          </Grid>
        </Box>
      </Box>

      {/* Open Source Action Modal */}
      <OpenSourceActionModal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        actionType={currentActionType}
        onSubmit={handleModalSubmit}
      />
    </Box>
  );
}

export default App;
