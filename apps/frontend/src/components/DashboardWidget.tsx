import React, { useState } from 'react';
import { Card, List, Badge, Typography, Pagination } from 'antd';

const { Text, Title } = Typography;

interface Project {
  id: string;
  name: string;
  description: string;
  status: 'active' | 'pending' | 'approved' | 'archived';
  lastActivity: string;
}

interface DashboardWidgetProps {
  title: string;
  icon: React.ReactNode;
  projects: Project[];
  type: 'authored' | 'contributed' | 'approved';
}

const getStatusColor = (status: string) => {
  switch (status) {
    case 'active': return 'green';
    case 'pending': return 'orange';
    case 'approved': return 'blue';
    case 'archived': return 'gray';
    default: return 'default';
  }
};

const DashboardWidget: React.FC<DashboardWidgetProps> = ({ title, icon, projects, type }) => {
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 4;
  const startIndex = (currentPage - 1) * pageSize;
  const endIndex = startIndex + pageSize;
  const currentProjects = projects.slice(startIndex, endIndex);

  return (
    <Card
      title={
        <div className="flex items-center gap-2">
          {icon}
          <Title level={4} className="mb-0">{title}</Title>
        </div>
      }
      className="h-96"
      bodyStyle={{ padding: '16px', height: 'calc(100% - 57px)', display: 'flex', flexDirection: 'column' }}
    >
      <div className="mb-4 flex-shrink-0">
        <Text className="text-2xl font-bold text-blue-600">{projects.length}</Text>
        <Text className="ml-2 text-gray-500">
          {type === 'authored' ? 'projects authored' : 
           type === 'contributed' ? 'contributions' : 'approved projects'}
        </Text>
      </div>
      
      <div className="flex-1 overflow-hidden min-h-0" style={{ minHeight: '240px' }}>
        <List
          size="small"
          dataSource={currentProjects}
          renderItem={(project) => (
            <List.Item className="px-0 py-2">
              <div className="flex justify-between items-start w-full">
                <div className="flex-1 min-w-0">
                  <Text strong className="block truncate">{project.name}</Text>
                  <Text type="secondary" className="text-sm line-clamp-2">{project.description}</Text>
                </div>
                <div className="flex flex-col items-end gap-1 ml-3 flex-shrink-0">
                  <Badge 
                    color={getStatusColor(project.status)} 
                    text={project.status}
                    className="text-xs"
                  />
                  <Text type="secondary" className="text-xs whitespace-nowrap">{project.lastActivity}</Text>
                </div>
              </div>
            </List.Item>
          )}
        />
      </div>
      
      <div className="mt-auto flex-shrink-0 pt-2 border-t border-gray-100" style={{ minHeight: '40px' }}>
        {projects.length > pageSize ? (
          <Pagination
            current={currentPage}
            total={projects.length}
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
    </Card>
  );
};

export default DashboardWidget;
