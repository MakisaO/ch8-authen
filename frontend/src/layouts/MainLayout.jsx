import { Outlet, Link, useNavigate, useLocation } from "react-router-dom";
import { useState, useEffect } from "react";
import axios from "axios";

function MainLayout() {
  const [user, setUser] = useState(null);
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const fetchUser = async () => {
      const token = localStorage.getItem("token");
      if (token) {
        try {
          // ส่ง Token ไปตรวจกับ Backend
          const response = await axios.get(
            "http://localhost:5000/api/authen/me",
            {
              headers: { Authorization: `Bearer ${token}` },
            },
          );
          setUser(response.data.user);
        } catch (err) {
          localStorage.removeItem("token"); // ถ้า Token หมดอายุให้ลบทิ้ง
        }
      }
    };
    fetchUser();
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("token");
    setUser(null);
    navigate("/login");
  };

  return (
    <div
      style={{ display: "flex", minHeight: "100vh", fontFamily: "sans-serif" }}
    >
      <nav style={{ width: "220px", background: "#f0f0f0", padding: "20px" }}>
        <h3>Menu</h3>
        <ul style={{ lineHeight: "2" }}>
          <li>
            <Link to="/">Menu</Link>
          </li>
        </ul>
      </nav>

      <main style={{ flex: 1 }}>
        {/* แถบด้านบนมุมขวา สำหรับ Login / Logout และปุ่มสลับหน้า */}
        <div
          style={{
            display: "flex",
            justifyContent: "flex-end",
            padding: "15px 30px",
            background: "#e0e0e0",
          }}
        >
          {user ? (
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                alignItems: "flex-end",
              }}
            >
              <div style={{ marginBottom: "10px" }}>
                <span style={{ marginRight: "15px", fontWeight: "bold" }}>
                  {user.userName}{" "}
                  <span
                    style={{
                      background: "#7fffd4",
                      padding: "2px 8px",
                      borderRadius: "4px",
                      fontSize: "14px",
                    }}
                  >
                    {user.role}
                  </span>
                </span>
                <button
                  onClick={handleLogout}
                  style={{ padding: "5px 10px", cursor: "pointer" }}
                >
                  Logout
                </button>
              </div>

              {/* ปุ่มสลับโหมด User / Menu (แสดงเฉพาะ Admin) */}
              {user.role === "admin" &&
                (location.pathname === "/users" ? (
                  <Link to="/">
                    <button
                      style={{
                        padding: "5px 15px",
                        background: "#7fffd4",
                        border: "none",
                        cursor: "pointer",
                        borderRadius: "4px",
                        fontWeight: "bold",
                      }}
                    >
                      menu
                    </button>
                  </Link>
                ) : (
                  <Link to="/users">
                    <button
                      style={{
                        padding: "5px 15px",
                        background: "#7fffd4",
                        border: "none",
                        cursor: "pointer",
                        borderRadius: "4px",
                        fontWeight: "bold",
                      }}
                    >
                      user
                    </button>
                  </Link>
                ))}
            </div>
          ) : (
            <Link to="/login">
              <button style={{ padding: "5px 15px", cursor: "pointer" }}>
                Login
              </button>
            </Link>
          )}
        </div>

        {/* เนื้อหาหลัก */}
        <div style={{ padding: "30px" }}>
          <Outlet context={{ user }} />
        </div>
      </main>
    </div>
  );
}

export default MainLayout;
