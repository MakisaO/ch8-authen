import { Routes, Route, Link } from "react-router-dom";
import MainLayout from "../layouts/MainLayout";
import Menu from "../pages/menus/Menu";

function AppRoutes() {
  return (
    <Routes>
      <Route element={<MainLayout />}>
        {/* ตั้งให้หน้าแรก (/) โหลดคอมโพเนนต์ Menu ขึ้นมาเลย */}
        <Route path="/" element={<Menu />} />
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
