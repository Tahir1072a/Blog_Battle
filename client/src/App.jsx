import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";
import Navbar from "./components/common/Navbar";
import PrivateRoute from "./components/common/PrivateRoute";

const CreateBlogPage = () => <div>Yazı Oluşturma Sayfası (Korumalı)</div>;
const ProfilePage = () => <div>Profil Sayfası (Korumalı)</div>;

function App() {
  return (
    <Router>
      <Navbar />
      <main className="container mx-auto p-4">
        <Routes>
          <Route path="/" element={<div>Ana Sayfa</div>} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />

          <Route element={<PrivateRoute />}>
            <Route path="/create-blog" element={<CreateBlogPage />} />
            <Route path="/profile" element={<ProfilePage />} />
            {/* Buraya başka korumalı rotalar da ekleyebilirsiniz */}
          </Route>
        </Routes>
      </main>
    </Router>
  );
}

export default App;
