import { useNavigate } from "react-router-dom";
import { RegisterForm } from "../components/auth/RegisterForm";
import { useRegisterMutation } from "@/store/api/authApi";
import { ErrorMessage } from "@/components/common/ErrorMessage";

function RegisterPage() {
  const [register, { isLoading, error }] = useRegisterMutation();
  const navigate = useNavigate();

  const handleRegister = async (data) => {
    try {
      await register(data).unwrap();
      navigate("/login", {
        state: { successMessage: "Hesabınız başarıyla oluşturulmuştur" },
      });
    } catch (err) {
      console.error("Kayıt başarısız:", err);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div>
        <RegisterForm onFormSubmit={handleRegister} isLoading={isLoading} />
        {error && (
          <ErrorMessage
            message={error.data?.message || "Bir hata oluştu."}
            className="mt-4"
          />
        )}
      </div>
    </div>
  );
}

export default RegisterPage;
