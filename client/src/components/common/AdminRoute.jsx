import { useSelector } from "react-redux";
import { Navigate, Outlet } from "react-router-dom";
import { selectCurrentUser } from "@/store/slices/authSlice";

function AdminRoute() {
  const currentUser = useSelector(selectCurrentUser);

  return currentUser?.role === "admin" ? (
    <Outlet />
  ) : (
    <Navigate to="/" replace />
  );
}

export default AdminRoute;
