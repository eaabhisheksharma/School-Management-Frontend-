import React from 'react';
// import useAuth from '../hooks/useAuth';

// ✅ New (Named)
import { useAuth } from '../hooks/useAuth';
import FeeManager from '../components/fees/FeeManager';

const Fees = () => {
  const { userRole } = useAuth();
  return <FeeManager userRole={userRole} />;
};

export default Fees;
