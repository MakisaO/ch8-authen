const MenuList = ({ menuList, deleteMenu, startEdit }) => {
  return (
    <div>
      <h3>Our Menu</h3>
      <ul style={{ lineHeight: "2.2", fontSize: "18px" }}>
        {menuList.map((item) => (
          <li key={item.menuId}>
            {item.name} - {item.price} baht{" "}
            {item.type && `(${item.type.name}) `}
            {item.isBestSeller && "🎖️ "}
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
          </li>
        ))}
      </ul>
    </div>
  );
};

export default MenuList;
