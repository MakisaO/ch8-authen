const MenuList = ({ menuList, deleteMenu, startEdit, role }) => {
  return (
    <div>
      <h3>Our Menu</h3>
      <ul style={{ lineHeight: "2.2", fontSize: "18px" }}>
        {menuList.map((item) => (
          <li key={item.menuId}>
            {item.name} - {item.price} baht{" "}
            {item.type && `(${item.type.name}) `}
            {item.isBestSeller && "🎖️ "}
            {/* แสดงปุ่ม Edit/Del เฉพาะ Role Admin */}
            {role === "admin" && (
              <>
                <button
                  onClick={() => startEdit(item)}
                  style={{ marginLeft: "8px", cursor: "pointer" }}
                >
                  Edit
                </button>
                <button
                  onClick={() => deleteMenu(item.menuId)}
                  style={{ marginLeft: "5px", cursor: "pointer" }}
                >
                  Del
                </button>
              </>
            )}
            {/* แสดง Dropdown ให้คะแนน เฉพาะ Role User */}
            {role === "user" && (
              <span
                style={{
                  marginLeft: "10px",
                  background: "#7fffd4",
                  padding: "2px 5px",
                  borderRadius: "4px",
                  fontSize: "14px",
                }}
              >
                Choose rating:
                <select style={{ marginLeft: "5px" }}>
                  <option value="5">5</option>
                  <option value="4">4</option>
                  <option value="3">3</option>
                  <option value="2">2</option>
                  <option value="1">1</option>
                </select>
              </span>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default MenuList;
