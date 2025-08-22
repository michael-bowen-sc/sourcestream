import React, { useState, useEffect } from 'react';
import { Layout, Typography, Row, Col, Avatar, notification } from 'antd';
import { UserOutlined, ProjectOutlined, TeamOutlined, CheckCircleOutlined } from '@ant-design/icons';
import DashboardWidget from './components/DashboardWidget';
import PendingRequestsCard from './components/PendingRequestsCard';
import RequestToolbar from './components/RequestToolbar';
import { 
  type Project, 
  type User, 
  type Request,
  mockUser, 
  mockAuthoredProjects, 
  mockContributedProjects, 
  mockApprovedProjects,
  mockPendingRequests
} from './data/mockData';

const { Header, Content } = Layout;
const { Title, Text } = Typography;

function App() {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [authoredProjects, setAuthoredProjects] = useState<Project[]>([]);
  const [contributedProjects, setContributedProjects] = useState<Project[]>([]);
  const [approvedProjects, setApprovedProjects] = useState<Project[]>([]);
  const [pendingRequests, setPendingRequests] = useState<Request[]>([]);

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

  const handleActionSubmit = (data: any) => {
    // Add new request to pending requests state
    const newRequest = {
      id: `req-${Date.now()}`,
      type: data.type,
      title: data.title,
      description: data.description,
      status: 'pending' as const,
      projectName: data.projectName,
      createdAt: new Date().toISOString(),
    };
    
    setPendingRequests(prev => [newRequest, ...prev]);
    
    notification.success({
      message: 'Request Submitted',
      description: `Your ${data.type} request "${data.title}" has been submitted for review.`,
      placement: 'topRight',
    });
  };

  // Show loading state if no user data is available yet
  if (!currentUser) {
    return (
      <Layout className="min-h-screen bg-gray-50">
        <Header className="bg-white shadow-sm border-b">
          <div className="flex items-center justify-between h-full max-w-7xl mx-auto px-4">
            <Title level={3} className="mb-0 text-black">Sourcestream</Title>
          </div>
        </Header>
        <Content className="max-w-7xl mx-auto w-full px-5 py-6">
          <div className="flex items-center justify-center h-64">
            <Text>Loading...</Text>
          </div>
        </Content>
      </Layout>
    );
  }

  return (
    <Layout className="min-h-screen bg-gray-50">
      <Header className="!bg-white shadow-sm border-b" style={{ backgroundColor: 'white' }}>
        <div className="flex items-center justify-between h-full max-w-7xl mx-auto px-4">
          <Title level={3} className="mb-0 text-black">Sourcestream</Title>
          <div className="flex items-center gap-6">
            <RequestToolbar onSubmit={handleActionSubmit} />
            <div className="flex items-center gap-4">
              <div className="text-right">
                <Text strong className="block">{currentUser.name}</Text>
                <Text type="secondary" className="text-sm">{currentUser.department}</Text>
              </div>
              <Avatar size="large" icon={<UserOutlined />} className="bg-blue-500" />
            </div>
          </div>
        </div>
      </Header>

      <Content className="max-w-7xl mx-auto w-full px-5 py-6">
        {/* Welcome Section */}
        <div className="mb-8">
          <Title level={2} className="mb-2">Welcome back, {currentUser.name}!</Title>
          <Text type="secondary" className="text-lg">
            Manage your open source contributions and project approvals
          </Text>
        </div>

        {/* Dashboard Widgets - Top 1/3 */}
        <div className="mb-8">
          <Title level={3} className="mb-6">Your Dashboard</Title>
          <Row gutter={[24, 24]} className="mb-4">
            <Col xs={24} lg={6}>
              <div className="px-2">
                <DashboardWidget
                  title="Projects Authored"
                  icon={<ProjectOutlined className="text-green-600" />}
                  projects={authoredProjects}
                  type="authored"
                />
              </div>
            </Col>
            <Col xs={24} lg={6}>
              <div className="px-2">
                <DashboardWidget
                  title="Contributed To"
                  icon={<TeamOutlined className="text-blue-600" />}
                  projects={contributedProjects}
                  type="contributed"
                />
              </div>
            </Col>
            <Col xs={24} lg={6}>
              <div className="px-2">
                <DashboardWidget
                  title="Approved Access"
                  icon={<CheckCircleOutlined className="text-purple-600" />}
                  projects={approvedProjects}
                  type="approved"
                />
              </div>
            </Col>
            <Col xs={24} lg={6}>
              <div className="px-2">
                <PendingRequestsCard requests={pendingRequests} />
              </div>
            </Col>
          </Row>
        </div>

      </Content>
    </Layout>
  );
}

export default App;