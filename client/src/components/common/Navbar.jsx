import { Link, useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import {
  logOut,
  selectIsAuthenticated,
  selectCurrentUser,
} from "@/store/slices/authSlice";
import { Button } from "@/components/ui/button";

function Navbar() {
  const isAuthenticated = useSelector(selectIsAuthenticated);
  const currentUser = useSelector(selectCurrentUser);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleLogout = () => {
    dispatch(logOut());
    navigate("/login");
  };

  return (
    <nav className="bg-white shadow-md">
      <div className="container mx-auto px-4 py-3 flex justify-between items-center">
        <Link to="/" className="text-xl font-bold text-gray-800">
          Blog Battle
        </Link>
        <Link to="/battle">
          <Button variant="ghost">Savaş Alanı</Button>
        </Link>
        <div>
          {isAuthenticated ? (
            <div className="flex items-center space-x-4">
              <span className="text-gray-700">
                Hoş geldin, {currentUser?.name || "Kullanıcı"}!
              </span>
              <Link to="/create-blog">
                <Button variant="ghost">Yazı Oluştur</Button>
              </Link>
              <Link to="/profile">
                <Button variant="ghost">Profilim</Button>
              </Link>
              <Button onClick={handleLogout} variant="destructive">
                Çıkış Yap
              </Button>
            </div>
          ) : (
            <div className="space-x-2">
              <Link to="/login">
                <Button variant="outline">Giriş Yap</Button>
              </Link>
              <Link to="/register">
                <Button>Kayıt Ol</Button>
              </Link>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
}

export default Navbar;
