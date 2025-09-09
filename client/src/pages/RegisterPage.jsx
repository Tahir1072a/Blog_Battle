import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { RegisterForm } from "../components/auth/RegisterForm";
import api from "../utils/api";

function RegisterPage() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const handleRegister = async (data) => {
    setIsLoading(true);
    setError(null);

    try {
      await api.post("/auth/register", data);

      navigate("/login", {
        state: { successMessage: "Hesabınız başarıyla oluşturulmuştur" },
      });
    } catch (err) {
      const errorMessage = err.response?.data?.message || "Bir hata oluştu.";
      setError(errorMessage);
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div>
        <RegisterForm onFormSubmit={handleRegister} isLoading={isLoading} />
        {error && <p className="mt-4 text-center text-red-500">{error}</p>}
      </div>
    </div>
  );
}

export default RegisterPage;
