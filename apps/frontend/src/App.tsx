import React, { useEffect, useState } from 'react';
import { Button, Card, Input, Space, Typography } from 'antd';
import { UserServicePromiseClient } from '../pb/UserService_grpc_web_pb';
import { RegisterContributorRequest, GetContributorRequest } from '../pb/UserService_pb';

const { Title, Text } = Typography;

const client = new UserServiceClient('http://localhost:8080'); // gRPC-web gateway address

function App() {
  const [corporateId, setCorporateId] = useState('');
  const [githubUsername, setGithubUsername] = useState('');
  const [registrationMessage, setRegistrationMessage] = useState('');
  const [contributorInfo, setContributorInfo] = useState(null);

  const handleRegister = async () => {
    const request = new RegisterContributorRequest();
    request.setCorporateId(corporateId);
    request.setGithubUsername(githubUsername);

    try {
      const response = await client.registerContributor(request, {});
      setRegistrationMessage(response.getMessage());
    } catch (error) {
      console.error('Error registering contributor:', error);
      setRegistrationMessage('Error registering contributor.');
    }
  };

  const handleGetContributor = async () => {
    const request = new GetContributorRequest();
    request.setCorporateId(corporateId);

    try {
      const response = await client.getContributor(request, {});
      setContributorInfo({
        corporateId: response.getCorporateId(),
        githubUsername: response.getGithubUsername(),
        approvedProjects: response.getApprovedProjectsList(),
      });
    } catch (error) {
      console.error('Error getting contributor:', error);
      setContributorInfo(null);
    }
  };

  return (
    <div style={{ padding: '20px' }}>
      <Title level={2}>SourceStream Contributor Management</Title>

      <Space direction="vertical" size="large" style={{ width: '100%' }}>
        <Card title="Register Contributor">
          <Space direction="vertical" style={{ width: '100%' }}>
            <Input
              placeholder="Corporate ID"
              value={corporateId}
              onChange={(e) => setCorporateId(e.target.value)}
            />
            <Input
              placeholder="GitHub Username"
              value={githubUsername}
              onChange={(e) => setGithubUsername(e.target.value)}
            />
            <Button type="primary" onClick={handleRegister}>Register</Button>
            {registrationMessage && <Text type="success">{registrationMessage}</Text>}
          </Space>
        </Card>

        <Card title="Get Contributor Info">
          <Space direction="vertical" style={{ width: '100%' }}>
            <Input
              placeholder="Corporate ID"
              value={corporateId}
              onChange={(e) => setCorporateId(e.target.value)}
            />
            <Button onClick={handleGetContributor}>Get Info</Button>
            {contributorInfo && (
              <div>
                <Text>Corporate ID: {contributorInfo.corporateId}</Text><br/>
                <Text>GitHub Username: {contributorInfo.githubUsername}</Text><br/>
                <Text>Approved Projects: {contributorInfo.approvedProjects.join(', ')}</Text>
              </div>
            )}
          </Space>
        </Card>
      </Space>
    </div>
  );
}

export default App;