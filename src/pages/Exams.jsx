import React from 'react';
// import useAuth from '../hooks/useAuth';

// ✅ New (Named)
import { useAuth } from '../hooks/useAuth';
import ExamManager from '../components/exams/ExamManager';

const Exams = () => {
  const { userRole } = useAuth();
  return <ExamManager userRole={userRole} />;
};

export default Exams;
