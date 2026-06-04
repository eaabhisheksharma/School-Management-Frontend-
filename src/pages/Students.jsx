import React from 'react';
// import useAuth from '../hooks/useAuth';
import { useAuth } from '../hooks/useAuth';
import StudentList from '../components/students/StudentList';

const Students = () => {
  const { userRole } = useAuth();
  return <StudentList userRole={userRole} />;
};

export default Students;
