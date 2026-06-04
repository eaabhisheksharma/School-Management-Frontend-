import React from 'react';
import { useAuth } from '../hooks/useAuth';
import TeacherList from '../components/teachers/TeacherList';

const Teachers = () => {
  const { userRole } = useAuth();
  return <TeacherList userRole={userRole} />;
};

export default Teachers;
