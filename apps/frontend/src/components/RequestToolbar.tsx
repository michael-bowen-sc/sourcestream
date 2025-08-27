import React, { useState, useEffect } from "react";
import { Button, HStack, Icon } from "@chakra-ui/react";
import { FiFolder, FiGitPullRequest, FiKey } from "react-icons/fi";
import RequestModal, { type RequestFormData } from "./RequestModal";

interface RequestToolbarProps {
  onSubmit: (data: RequestFormData) => void;
}

const RequestToolbar: React.FC<RequestToolbarProps> = ({ onSubmit }) => {
  const [activeModal, setActiveModal] = useState<
    "project" | "pullrequest" | "access" | null
  >(null);
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);

  // Block browser navigation when there are unsaved changes
  useEffect(() => {
    const handleBeforeUnload = (e: BeforeUnloadEvent) => {
      if (hasUnsavedChanges) {
        e.preventDefault();
        e.returnValue =
          "You have unsaved changes. Are you sure you want to leave?";
        return e.returnValue;
      }
    };

    const handlePopState = () => {
      if (hasUnsavedChanges) {
        const confirmLeave = window.confirm(
          "You have unsaved changes. Are you sure you want to leave?",
        );
        if (!confirmLeave) {
          // Push the current state back to prevent navigation
          window.history.pushState(null, "", window.location.href);
        }
      }
    };

    if (hasUnsavedChanges) {
      window.addEventListener("beforeunload", handleBeforeUnload);
      window.addEventListener("popstate", handlePopState);

      // Push current state to enable popstate detection
      window.history.pushState(null, "", window.location.href);
    }

    return () => {
      window.removeEventListener("beforeunload", handleBeforeUnload);
      window.removeEventListener("popstate", handlePopState);
    };
  }, [hasUnsavedChanges]);

  const handleModalOpen = (type: "project" | "pullrequest" | "access") => {
    setActiveModal(type);
  };

  const handleModalClose = () => {
    setActiveModal(null);
    setHasUnsavedChanges(false);
  };

  const handleSubmit = async (data: RequestFormData) => {
    await onSubmit(data);
    setActiveModal(null);
    setHasUnsavedChanges(false);
  };

  return (
    <>
      <HStack gap="2">
        <Button
          variant="outline"
          onClick={() => handleModalOpen("project")}
          size="sm"
          colorScheme="green"
          _hover={{ bg: "green.50", borderColor: "green.300" }}
        >
          <Icon as={FiFolder} mr={2} />
          Project
        </Button>

        <Button
          variant="outline"
          onClick={() => handleModalOpen("pullrequest")}
          size="sm"
          colorScheme="blue"
          _hover={{ bg: "blue.50", borderColor: "blue.300" }}
        >
          <Icon as={FiGitPullRequest} mr={2} />
          Pull Request
        </Button>

        <Button
          variant="outline"
          onClick={() => handleModalOpen("access")}
          size="sm"
          colorScheme="purple"
          _hover={{ bg: "purple.50", borderColor: "purple.300" }}
        >
          <Icon as={FiKey} mr={2} />
          Access
        </Button>
      </HStack>

      {/* Modals */}
      {activeModal && (
        <RequestModal
          visible={true}
          onCancel={handleModalClose}
          onSubmit={handleSubmit}
          initialData={{ type: activeModal }}
        />
      )}
    </>
  );
};

export default RequestToolbar;
