// src/routes/RoleProtectedRoute.jsx
import { useSelector } from "react-redux";
import { Navigate, Outlet } from "react-router-dom";

const RoleProtectedRoute = ({ allowRoles }) => {
  const { isAuthenticated, user } = useSelector((state) => state.auth);

  // Nếu không có token hoặc chưa login, đá về login
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  // Nếu role không nằm trong danh sách cho phép, đá về access-denied
  if (allowRoles && !allowRoles.includes(user?.role)) {
    return <Navigate to="/access-denied" replace />;
  }

  // QUAN TRỌNG: Phải dùng Outlet để các route con trong App.jsx có thể hiển thị
  return <Outlet />;
};

export default RoleProtectedRoute;
