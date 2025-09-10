import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";
import Navbar from "./components/common/Navbar";
import PrivateRoute from "./components/common/PrivateRoute";
import CreateBlogPage from "./pages/CreateBlogPage";
import HomePage from "./pages/HomePage";
import BlogDetailPage from "./pages/BlogDetailPage";
import BattlePage from "./pages/BattlePage";

const ProfilePage = () => <div>Profil Sayfası (Korumalı)</div>;

function App() {
  return (
    <Router>
      <Navbar />
      <main className="container mx-auto p-4">
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />

          <Route path="/blog/:id" element={<BlogDetailPage />} />
          <Route path="/battle" element={<BattlePage />} />

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
