import React from 'react';
// import useAuth from '../hooks/useAuth';
import AssignmentList from '../components/assignments/AssignmentList';
// ✅ New (Named)
import { useAuth } from '../hooks/useAuth';

const Assignments = () => {
  const { userRole } = useAuth();
  return <AssignmentList userRole={userRole} />;
};

export default Assignments;
