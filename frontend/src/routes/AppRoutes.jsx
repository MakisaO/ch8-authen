import { Routes, Route, Link } from "react-router-dom";
import MainLayout from "../layouts/MainLayout";
import Menu from "../pages/menus/Menu";
import Login from "../pages/Login"; // นำเข้าคอมโพเนนต์ Login
import Register from "../pages/Register"; // นำเข้าคอมโพเนนต์ Register
import Users from "../pages/Users";
function AppRoutes() {
  return (
    <Routes>
      <Route element={<MainLayout />}>
        <Route path="/" element={<Menu />} />
        {/* เพิ่มเส้นทางใหม่ */}
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/users" element={<Users />} /> {/* <-- เพิ่มเส้นทางนี้ */}
      </Route>
      <Route
        path="*"
        element={
          <div style={{ textAlign: "center", marginTop: "50px" }}>
            <h1>404</h1>
            <p>ไม่พบหน้าที่คุณต้องการ</p>
            <Link to="/">กลับสู่หน้าหลัก</Link>
          </div>
        }
      />
    </Routes>
  );
}

export default AppRoutes;
