import React, { useState, useEffect } from 'react';
import { Modal, Form, Input, Select, Button, Typography, message } from 'antd';
import { ProjectOutlined, PullRequestOutlined, KeyOutlined } from '@ant-design/icons';

const { TextArea } = Input;
const { Option } = Select;
const { Title } = Typography;

export interface RequestFormData {
  type: 'project' | 'pullrequest' | 'access';
  title: string;
  description: string;
  projectName?: string;
  projectUrl?: string;
  license?: string;
  role?: string;
}

interface RequestModalProps {
  visible: boolean;
  type: 'project' | 'pullrequest' | 'access';
  onClose: () => void;
  onSubmit: (data: RequestFormData) => void;
  onUnsavedChanges: (hasChanges: boolean) => void;
}

const getModalTitle = (type: string) => {
  switch (type) {
    case 'project':
      return 'Submit Project Request';
    case 'pullrequest':
      return 'Submit Pull Request Approval';
    case 'access':
      return 'Request Project Access';
    default:
      return 'Submit Request';
  }
};

const getModalIcon = (type: string) => {
  switch (type) {
    case 'project':
      return <ProjectOutlined className="text-green-600" />;
    case 'pullrequest':
      return <PullRequestOutlined className="text-blue-600" />;
    case 'access':
      return <KeyOutlined className="text-purple-600" />;
    default:
      return null;
  }
};

const RequestModal: React.FC<RequestModalProps> = ({
  visible,
  type,
  onClose,
  onSubmit,
  onUnsavedChanges
}) => {
  const [form] = Form.useForm();
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Track form changes
  const handleFormChange = () => {
    const values = form.getFieldsValue();
    const hasData = Object.values(values).some(value => value && value.toString().trim() !== '');
    setHasUnsavedChanges(hasData);
    onUnsavedChanges(hasData);
  };

  // Reset form when modal closes
  useEffect(() => {
    if (!visible) {
      form.resetFields();
      setHasUnsavedChanges(false);
      onUnsavedChanges(false);
    }
  }, [visible, form, onUnsavedChanges]);

  const handleSubmit = async () => {
    try {
      setIsSubmitting(true);
      const values = await form.validateFields();
      
      const formData: RequestFormData = {
        type,
        title: values.title,
        description: values.description,
        projectName: values.projectName,
        projectUrl: values.projectUrl,
        license: values.license,
        role: values.role,
      };

      await onSubmit(formData);
      
      // Reset form after successful submission
      form.resetFields();
      setHasUnsavedChanges(false);
      onUnsavedChanges(false);
      message.success('Request submitted successfully!');
      onClose();
    } catch (error) {
      console.error('Form validation failed:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCancel = () => {
    if (hasUnsavedChanges) {
      Modal.confirm({
        title: 'Unsaved Changes',
        content: 'You have unsaved changes. Are you sure you want to close without saving?',
        okText: 'Yes, discard changes',
        cancelText: 'No, keep editing',
        onOk: () => {
          form.resetFields();
          setHasUnsavedChanges(false);
          onUnsavedChanges(false);
          onClose();
        },
      });
    } else {
      onClose();
    }
  };

  const renderFormFields = () => {
    switch (type) {
      case 'project':
        return (
          <>
            <Form.Item
              name="title"
              label="Project Title"
              rules={[{ required: true, message: 'Please enter project title' }]}
            >
              <Input placeholder="Enter project title" />
            </Form.Item>
            
            <Form.Item
              name="description"
              label="Project Description"
              rules={[{ required: true, message: 'Please enter project description' }]}
            >
              <TextArea rows={4} placeholder="Describe your project" />
            </Form.Item>
            
            <Form.Item
              name="projectUrl"
              label="Repository URL"
              rules={[{ required: true, message: 'Please enter repository URL' }]}
            >
              <Input placeholder="https://github.com/..." />
            </Form.Item>
            
            <Form.Item
              name="license"
              label="License"
              rules={[{ required: true, message: 'Please select a license' }]}
            >
              <Select placeholder="Select license">
                <Option value="MIT">MIT</Option>
                <Option value="Apache-2.0">Apache 2.0</Option>
                <Option value="GPL-3.0">GPL 3.0</Option>
                <Option value="BSD-3-Clause">BSD 3-Clause</Option>
                <Option value="Other">Other</Option>
              </Select>
            </Form.Item>
          </>
        );

      case 'pullrequest':
        return (
          <>
            <Form.Item
              name="title"
              label="Pull Request Title"
              rules={[{ required: true, message: 'Please enter PR title' }]}
            >
              <Input placeholder="Enter pull request title" />
            </Form.Item>
            
            <Form.Item
              name="projectName"
              label="Target Project"
              rules={[{ required: true, message: 'Please enter project name' }]}
            >
              <Input placeholder="Project name" />
            </Form.Item>
            
            <Form.Item
              name="projectUrl"
              label="Pull Request URL"
              rules={[{ required: true, message: 'Please enter PR URL' }]}
            >
              <Input placeholder="https://github.com/.../pull/123" />
            </Form.Item>
            
            <Form.Item
              name="description"
              label="Description"
              rules={[{ required: true, message: 'Please describe the changes' }]}
            >
              <TextArea rows={4} placeholder="Describe the changes made" />
            </Form.Item>
          </>
        );

      case 'access':
        return (
          <>
            <Form.Item
              name="title"
              label="Request Title"
              rules={[{ required: true, message: 'Please enter request title' }]}
            >
              <Input placeholder="Enter request title" />
            </Form.Item>
            
            <Form.Item
              name="projectName"
              label="Project Name"
              rules={[{ required: true, message: 'Please enter project name' }]}
            >
              <Input placeholder="Project name" />
            </Form.Item>
            
            <Form.Item
              name="role"
              label="Requested Role"
              rules={[{ required: true, message: 'Please select a role' }]}
            >
              <Select placeholder="Select role">
                <Option value="contributor">Contributor</Option>
                <Option value="maintainer">Maintainer</Option>
                <Option value="reviewer">Reviewer</Option>
              </Select>
            </Form.Item>
            
            <Form.Item
              name="description"
              label="Justification"
              rules={[{ required: true, message: 'Please explain why you need access' }]}
            >
              <TextArea rows={4} placeholder="Explain why you need access to this project" />
            </Form.Item>
          </>
        );

      default:
        return null;
    }
  };

  return (
    <Modal
      title={
        <div className="flex items-center gap-2">
          {getModalIcon(type)}
          <Title level={4} className="mb-0">{getModalTitle(type)}</Title>
        </div>
      }
      open={visible}
      onCancel={handleCancel}
      width={600}
      footer={[
        <Button key="cancel" onClick={handleCancel}>
          Cancel
        </Button>,
        <Button
          key="submit"
          type="primary"
          loading={isSubmitting}
          onClick={handleSubmit}
        >
          Submit Request
        </Button>,
      ]}
      maskClosable={false}
      closable={!hasUnsavedChanges}
    >
      <Form
        form={form}
        layout="vertical"
        onValuesChange={handleFormChange}
        className="mt-4"
      >
        {renderFormFields()}
      </Form>
    </Modal>
  );
};

export default RequestModal;
