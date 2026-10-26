import { useState, useEffect } from "react";
import axios from "axios";
import { useOutletContext } from "react-router-dom";

function Users() {
  const { user } = useOutletContext();
  const [userList, setUserList] = useState([]);

  useEffect(() => {
    const fetchUsers = async () => {
      const token = localStorage.getItem("token");
      // เช็คว่ามี token และเป็น admin ถึงจะดึงข้อมูลได้
      if (token && user?.role === "admin") {
        try {
          const response = await axios.get(
            "http://localhost:5000/api/authen/users",
            {
              headers: { Authorization: `Bearer ${token}` },
            },
          );
          setUserList(response.data);
        } catch (err) {
          console.error("Failed to fetch users", err);
        }
      }
    };
    fetchUsers();
  }, [user]);

  const handleRoleChange = async (userId, newRole) => {
    const token = localStorage.getItem("token");
    try {
      await axios.put(
        `http://localhost:5000/api/authen/users/${userId}/role`,
        { role: newRole },
        { headers: { Authorization: `Bearer ${token}` } },
      );
      // อัปเดตข้อมูลบนหน้าจอโดยไม่ต้องโหลดใหม่
      setUserList(
        userList.map((u) =>
          u.userId === userId ? { ...u, role: newRole } : u,
        ),
      );
      alert("เปลี่ยนสิทธิ์สำเร็จ!");
    } catch (err) {
      console.error("Failed to update role", err);
      alert("เปลี่ยนสิทธิ์ไม่สำเร็จ");
    }
  };

  // ป้องกันกรณี user พิมพ์ URL เข้ามาเอง
  if (user?.role !== "admin") {
    return <h3>ไม่มีสิทธิ์เข้าถึงหน้านี้ (เฉพาะ Admin เท่านั้น)</h3>;
  }

  return (
    <div>
      <h2>User</h2>
      <ul style={{ lineHeight: "2.2", fontSize: "18px" }}>
        {userList.map((u) => (
          <li key={u.userId}>
            {u.userName} {u.email}{" "}
            <select
              value={u.role}
              onChange={(e) => handleRoleChange(u.userId, e.target.value)}
              style={{
                marginLeft: "10px",
                padding: "2px 5px",
                fontSize: "16px",
              }}
            >
              <option value="user">user</option>
              <option value="admin">admin</option>
            </select>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default Users;
