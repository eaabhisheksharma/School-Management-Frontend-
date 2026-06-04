import React from 'react';
// import useAuth from '../hooks/useAuth';

// ✅ New (Named)
import { useAuth } from '../hooks/useAuth';
import AttendanceManager from '../components/attendance/AttendanceManager';

const Attendance = () => {
  const { userRole } = useAuth();
  return <AttendanceManager userRole={userRole} />;
};

export default Attendance;
