import { Link, useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { useState, useEffect } from "react";
import {
  logOut,
  selectIsAuthenticated,
  selectCurrentUser,
} from "@/store/slices/authSlice";
import { Button } from "@/components/ui/button";
import { Bell } from "lucide-react";
import api from "@/utils/api";

function Navbar() {
  const isAuthenticated = useSelector(selectIsAuthenticated);
  const currentUser = useSelector(selectCurrentUser);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [notifications, setNotifications] = useState([]);
  const [showNotifications, setShowNotifications] = useState(false);

  useEffect(() => {
    if (isAuthenticated) {
      const fetchNotifications = async () => {
        try {
          const { data } = await api.get("/notifications");
          setNotifications(data);
        } catch (error) {
          console.error("Bildirimler alınamadı:", error);
        }
      };
      fetchNotifications();
    }
  }, [isAuthenticated]);

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
            <>
              {/* --- YENİ BİLDİRİM İKONU VE DROPDOWN --- */}
              <div className="relative">
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => setShowNotifications(!showNotifications)}
                >
                  <Bell className="h-5 w-5" />
                  {notifications.length > 0 && (
                    <span className="absolute top-0 right-0 h-2 w-2 rounded-full bg-red-500"></span>
                  )}
                </Button>
                {showNotifications && (
                  <div className="absolute right-0 mt-2 w-80 bg-white border rounded-lg shadow-lg z-10">
                    <div className="p-4 font-bold border-b">Bildirimler</div>
                    <ul>
                      {notifications.length > 0 ? (
                        notifications.map((notif) => (
                          <li
                            key={notif._id}
                            className="p-4 border-b hover:bg-gray-50 text-sm"
                          >
                            {notif.message}
                          </li>
                        ))
                      ) : (
                        <li className="p-4 text-sm text-gray-500">
                          Yeni bildiriminiz yok.
                        </li>
                      )}
                    </ul>
                  </div>
                )}
              </div>

              <span className="text-gray-700 hidden md:block">
                Hoş geldin, {currentUser?.name || "Kullanıcı"}!
              </span>
              <Link to="/profile">
                <Button variant="ghost">Profilim</Button>
              </Link>
              <Button onClick={handleLogout} variant="destructive">
                Çıkış Yap
              </Button>
            </>
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
