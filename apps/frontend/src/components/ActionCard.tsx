import React from 'react';
import { Card, Button, Typography, Form, Input, Select } from 'antd';
import { PlusOutlined, FileTextOutlined, BranchesOutlined } from '@ant-design/icons';

const { Title, Text } = Typography;
const { TextArea } = Input;
const { Option } = Select;

interface ActionCardProps {
  type: 'project' | 'pullrequest' | 'access';
  onSubmit: (data: any) => void;
}

const ActionCard: React.FC<ActionCardProps> = ({ type, onSubmit }) => {
  const [form] = Form.useForm();

  const getCardConfig = () => {
    switch (type) {
      case 'project':
        return {
          title: 'Request New Open Source Project',
          icon: <PlusOutlined className="text-green-600" />,
          description: 'Submit a request to create or contribute to a new open source project',
          buttonText: 'Submit Project Request',
          buttonType: 'primary' as const,
        };
      case 'pullrequest':
        return {
          title: 'Request Pull Request Approval',
          icon: <BranchesOutlined className="text-blue-600" />,
          description: 'Get approval for contributing to an existing open source project',
          buttonText: 'Request PR Approval',
          buttonType: 'default' as const,
        };
      case 'access':
        return {
          title: 'Request Project Access',
          icon: <FileTextOutlined className="text-orange-600" />,
          description: 'Request access to contribute to an existing approved project',
          buttonText: 'Request Access',
          buttonType: 'default' as const,
        };
    }
  };

  const config = getCardConfig();

  const handleSubmit = (values: any) => {
    onSubmit({ type, ...values });
    form.resetFields();
  };

  const renderFormFields = () => {
    const commonFields = (
      <>
        <Form.Item
          name="title"
          label="Title"
          rules={[{ required: true, message: 'Please enter a title' }]}
        >
          <Input placeholder="Brief title for your request" />
        </Form.Item>
        <Form.Item
          name="description"
          label="Description"
          rules={[{ required: true, message: 'Please enter a description' }]}
        >
          <TextArea 
            rows={3} 
            placeholder="Detailed description of your request"
          />
        </Form.Item>
      </>
    );

    switch (type) {
      case 'project':
        return (
          <>
            {commonFields}
            <Form.Item
              name="projectUrl"
              label="Project URL"
              rules={[{ required: true, message: 'Please enter the project URL' }]}
            >
              <Input placeholder="https://github.com/org/repo" />
            </Form.Item>
            <Form.Item
              name="license"
              label="License"
              rules={[{ required: true, message: 'Please select a license' }]}
            >
              <Select placeholder="Select project license">
                <Option value="MIT">MIT</Option>
                <Option value="Apache-2.0">Apache 2.0</Option>
                <Option value="GPL-3.0">GPL 3.0</Option>
                <Option value="BSD-3-Clause">BSD 3-Clause</Option>
                <Option value="other">Other</Option>
              </Select>
            </Form.Item>
          </>
        );
      case 'pullrequest':
        return (
          <>
            {commonFields}
            <Form.Item
              name="projectName"
              label="Project Name"
              rules={[{ required: true, message: 'Please enter the project name' }]}
            >
              <Input placeholder="Project you want to contribute to" />
            </Form.Item>
            <Form.Item
              name="prUrl"
              label="Pull Request URL"
            >
              <Input placeholder="https://github.com/org/repo/pull/123 (if already created)" />
            </Form.Item>
          </>
        );
      case 'access':
        return (
          <>
            {commonFields}
            <Form.Item
              name="projectName"
              label="Project Name"
              rules={[{ required: true, message: 'Please enter the project name' }]}
            >
              <Input placeholder="Approved project you want access to" />
            </Form.Item>
            <Form.Item
              name="role"
              label="Requested Role"
              rules={[{ required: true, message: 'Please select a role' }]}
            >
              <Select placeholder="Select your intended role">
                <Option value="contributor">Contributor</Option>
                <Option value="maintainer">Maintainer</Option>
                <Option value="reviewer">Reviewer</Option>
              </Select>
            </Form.Item>
          </>
        );
    }
  };

  return (
    <Card className="h-full">
      <div className="flex items-center gap-3 mb-4">
        {config.icon}
        <div>
          <Title level={4} className="mb-1">{config.title}</Title>
          <Text type="secondary">{config.description}</Text>
        </div>
      </div>
      
      <Form
        form={form}
        layout="vertical"
        onFinish={handleSubmit}
        className="space-y-4"
      >
        {renderFormFields()}
        
        <Form.Item className="mb-0 pt-4">
          <Button 
            type={config.buttonType}
            htmlType="submit" 
            size="large"
            className="w-full"
          >
            {config.buttonText}
          </Button>
        </Form.Item>
      </Form>
    </Card>
  );
};

export default ActionCard;
