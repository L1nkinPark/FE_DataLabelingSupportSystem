import AdminContainer from "../../container/AdminContainer";
import ErrorBoundary from "../../components/ErrorBoundary";

import React from "react";

/**
 * AdminDashboard component that serves as the main entry point
 * for the Admin functionality. It wraps the AdminContainer inside
 * an ErrorBoundary to catch rendering issues.
 */
const AdminDashboard = () => {
  return (
    <div>
      <ErrorBoundary>
        <AdminContainer />
      </ErrorBoundary>
    </div>
  );
};

export default AdminDashboard;
