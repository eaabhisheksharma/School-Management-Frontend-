import React from 'react';

import { useAuth } from '../hooks/useAuth';
import NoticeBoard from '../components/notices/NoticeBoard';

const Notices = () => {
  const { userRole } = useAuth();
  return <NoticeBoard userRole={userRole} />;
};

export default Notices;
