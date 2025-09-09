import { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useDispatch } from "react-redux";
import { setCredentials } from "@/store/slices/authSlice";
import { LoginForm } from "@/components/auth/LoginForm";
import api from "@/utils/api";

function LoginPage() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(false);

  const navigate = useNavigate();
  const dispatch = useDispatch();
  const location = useLocation();

  const successMessage = location.state?.successMessage;
  const from = location.state?.from?.pathname || "/";

  const handleLogin = async (data) => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await api.post("/auth/login", data);

      dispatch(setCredentials(response.data));

      navigate(from, { replace: true });
    } catch (err) {
      const errorMessage =
        err.response?.data?.message ||
        "Giriş yapılamadı. Lütfen bilgilerinizi kontrol edin.";
      setError(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };
  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="flex flex-col items-center">
        {successMessage && (
          <div className="mb-4 p-3 bg-green-100 text-green-800 rounded-md w-[400px] text-center">
            {successMessage}
          </div>
        )}
        <LoginForm onFormSubmit={handleLogin} isLoading={isLoading} />
        {error && (
          <p className="mt-4 p-3 bg-red-100 text-red-700 rounded-md w-[400px] text-center">
            {error}
          </p>
        )}
      </div>
    </div>
  );
}

export default LoginPage;
