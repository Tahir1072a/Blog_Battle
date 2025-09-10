import { useSelector, useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import {
  logOut,
  selectIsAuthenticated,
  selectCurrentUser,
} from "@/store/slices/authSlice";

export const useAuth = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const isAuthenticated = useSelector(selectIsAuthenticated);
  const currentUser = useSelector(selectCurrentUser);

  const logout = () => {
    dispatch(logOut());
    navigate("/login");
  };

  return { isAuthenticated, currentUser, logout };
};
