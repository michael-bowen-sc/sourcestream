import React, { useState } from 'react';
import { Card, List, Tag, Typography, Empty, Pagination } from 'antd';
import { ClockCircleOutlined, ProjectOutlined, PullRequestOutlined, KeyOutlined } from '@ant-design/icons';
import { type Request } from '../data/mockData';

const { Text, Title } = Typography;

interface PendingRequestsCardProps {
  requests: Request[];
}

const getRequestIcon = (type: Request['type']) => {
  switch (type) {
    case 'project':
      return <ProjectOutlined className="text-green-600" />;
    case 'pullrequest':
      return <PullRequestOutlined className="text-blue-600" />;
    case 'access':
      return <KeyOutlined className="text-purple-600" />;
    default:
      return <ClockCircleOutlined />;
  }
};

const getStatusColor = (status: Request['status']) => {
  switch (status) {
    case 'pending':
      return 'orange';
    case 'in_review':
      return 'blue';
    case 'approved':
      return 'green';
    case 'rejected':
      return 'red';
    default:
      return 'default';
  }
};

const getTypeLabel = (type: Request['type']) => {
  switch (type) {
    case 'project':
      return 'Project Request';
    case 'pullrequest':
      return 'Pull Request';
    case 'access':
      return 'Access Request';
    default:
      return 'Request';
  }
};

const formatDate = (dateString: string) => {
  const date = new Date(dateString);
  const now = new Date();
  const diffTime = Math.abs(now.getTime() - date.getTime());
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  
  if (diffDays === 1) return '1 day ago';
  if (diffDays < 7) return `${diffDays} days ago`;
  if (diffDays < 30) return `${Math.ceil(diffDays / 7)} weeks ago`;
  return date.toLocaleDateString();
};

const PendingRequestsCard: React.FC<PendingRequestsCardProps> = ({ requests }) => {
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 4;
  const pendingRequests = requests.filter(req => req.status === 'pending' || req.status === 'in_review');
  
  const startIndex = (currentPage - 1) * pageSize;
  const endIndex = startIndex + pageSize;
  const currentRequests = pendingRequests.slice(startIndex, endIndex);

  return (
    <Card 
      className="h-96 shadow-sm hover:shadow-md transition-shadow"
      title={
        <div className="flex items-center gap-2">
          <ClockCircleOutlined className="text-orange-500" />
          <Title level={4} className="mb-0">Pending Requests</Title>
        </div>
      }
      extra={
        <Tag color="orange" className="rounded-full">
          {pendingRequests.length}
        </Tag>
      }
      bodyStyle={{ padding: '16px', height: 'calc(100% - 57px)', display: 'flex', flexDirection: 'column' }}
    >
      {pendingRequests.length === 0 ? (
        <Empty 
          description="No pending requests"
          image={Empty.PRESENTED_IMAGE_SIMPLE}
          className="py-8"
        />
      ) : (
        <>
          <div className="flex-1 overflow-hidden min-h-0" style={{ minHeight: '240px' }}>
            <List
              dataSource={currentRequests}
              renderItem={(request) => (
                <List.Item className="px-0 py-3 border-b border-gray-100 last:border-b-0">
                  <div className="w-full">
                    <div className="flex items-start justify-between mb-2">
                      <div className="flex items-center gap-2">
                        {getRequestIcon(request.type)}
                        <Text strong className="text-sm">{request.title}</Text>
                      </div>
                      <Tag color={getStatusColor(request.status)}>
                        {request.status.replace('_', ' ')}
                      </Tag>
                    </div>
                    
                    <div className="ml-6">
                      <Text type="secondary" className="text-xs block mb-1">
                        {getTypeLabel(request.type)}
                        {request.projectName && ` • ${request.projectName}`}
                      </Text>
                      
                      <Text type="secondary" className="text-xs">
                        {formatDate(request.createdAt)}
                      </Text>
                    </div>
                  </div>
                </List.Item>
              )}
            />
          </div>
          
          <div className="mt-auto flex-shrink-0 pt-2 border-t border-gray-100" style={{ minHeight: '40px' }}>
            {pendingRequests.length > pageSize ? (
              <Pagination
                current={currentPage}
                total={pendingRequests.length}
                pageSize={pageSize}
                onChange={setCurrentPage}
                size="small"
                showSizeChanger={false}
                className="text-center"
              />
            ) : (
              <div className="h-6"></div>
            )}
          </div>
        </>
      )}
    </Card>
  );
};

export default PendingRequestsCard;
