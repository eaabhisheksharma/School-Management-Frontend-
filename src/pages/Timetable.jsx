import React from 'react';
import { useAuth } from '../hooks/useAuth';

import TimetableView from '../components/timetable/TimetableView';

const Timetable = () => {
  const { userRole } = useAuth();
  return <TimetableView userRole={userRole} />;
};

export default Timetable;
