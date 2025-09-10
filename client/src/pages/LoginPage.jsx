import { useNavigate, useLocation } from "react-router-dom";
import { useDispatch } from "react-redux";
import { setCredentials } from "@/store/slices/authSlice";
import { LoginForm } from "@/components/auth/LoginForm";
import { useLoginMutation } from "@/store/api/authApi";
import { ErrorMessage } from "@/components/common/ErrorMessage";

function LoginPage() {
  const [login, { isLoading, error }] = useLoginMutation();

  const navigate = useNavigate();
  const dispatch = useDispatch();
  const location = useLocation();

  const successMessage = location.state?.successMessage;
  const from = location.state?.from?.pathname || "/";

  const handleLogin = async (data) => {
    try {
      const response = await login(data).unwrap();

      dispatch(setCredentials(response));
      navigate(from, { replace: true });
    } catch (err) {
      console.error("Giriş başarısız:", err);
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
          <ErrorMessage
            message={
              error.data?.message ||
              "Giriş yapılamadı. Lütfen bilgilerinizi kontrol edin."
            }
            className="mt-4 w-[400px]"
          />
        )}
      </div>
    </div>
  );
}

export default LoginPage;
