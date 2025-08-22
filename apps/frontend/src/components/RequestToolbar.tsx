import React, { useState, useEffect } from 'react';
import { Button, Space, Tooltip } from 'antd';
import { ProjectOutlined, PullRequestOutlined, KeyOutlined } from '@ant-design/icons';
import RequestModal, { type RequestFormData } from './RequestModal';

interface RequestToolbarProps {
  onSubmit: (data: RequestFormData) => void;
}

const RequestToolbar: React.FC<RequestToolbarProps> = ({ onSubmit }) => {
  const [activeModal, setActiveModal] = useState<'project' | 'pullrequest' | 'access' | null>(null);
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);

  // Block browser navigation when there are unsaved changes
  useEffect(() => {
    const handleBeforeUnload = (e: BeforeUnloadEvent) => {
      if (hasUnsavedChanges) {
        e.preventDefault();
        e.returnValue = 'You have unsaved changes. Are you sure you want to leave?';
        return e.returnValue;
      }
    };

    const handlePopState = () => {
      if (hasUnsavedChanges) {
        const confirmLeave = window.confirm('You have unsaved changes. Are you sure you want to leave?');
        if (!confirmLeave) {
          // Push the current state back to prevent navigation
          window.history.pushState(null, '', window.location.href);
        }
      }
    };

    if (hasUnsavedChanges) {
      window.addEventListener('beforeunload', handleBeforeUnload);
      window.addEventListener('popstate', handlePopState);
      
      // Push current state to enable popstate detection
      window.history.pushState(null, '', window.location.href);
    }

    return () => {
      window.removeEventListener('beforeunload', handleBeforeUnload);
      window.removeEventListener('popstate', handlePopState);
    };
  }, [hasUnsavedChanges]);

  const handleModalOpen = (type: 'project' | 'pullrequest' | 'access') => {
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

  const handleUnsavedChanges = (hasChanges: boolean) => {
    setHasUnsavedChanges(hasChanges);
  };

  return (
    <>
      <Space size="small">
        <Tooltip title="Submit new project request">
          <Button
            type="text"
            icon={<ProjectOutlined />}
            onClick={() => handleModalOpen('project')}
            className="flex items-center gap-1 text-gray-700 hover:bg-green-50 hover:text-green-600 border border-gray-200 hover:border-green-300"
          >
            Project
          </Button>
        </Tooltip>
        
        <Tooltip title="Submit pull request approval">
          <Button
            type="text"
            icon={<PullRequestOutlined />}
            onClick={() => handleModalOpen('pullrequest')}
            className="flex items-center gap-1 text-gray-700 hover:bg-blue-50 hover:text-blue-600 border border-gray-200 hover:border-blue-300"
          >
            Pull Request
          </Button>
        </Tooltip>
        
        <Tooltip title="Request project access">
          <Button
            type="text"
            icon={<KeyOutlined />}
            onClick={() => handleModalOpen('access')}
            className="flex items-center gap-1 text-gray-700 hover:bg-purple-50 hover:text-purple-600 border border-gray-200 hover:border-purple-300"
          >
            Access
          </Button>
        </Tooltip>
      </Space>

      {/* Modals */}
      {activeModal && (
        <RequestModal
          visible={true}
          type={activeModal}
          onClose={handleModalClose}
          onSubmit={handleSubmit}
          onUnsavedChanges={handleUnsavedChanges}
        />
      )}
    </>
  );
};

export default RequestToolbar;
