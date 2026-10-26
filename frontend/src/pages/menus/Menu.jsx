import { useState, useEffect } from "react";
import { useOutletContext } from "react-router-dom";
import { menuApi } from "../../services/menuApi";
import { typeApi } from "../../services/typeApi";
import MenuList from "./MenuList";
import MenuForm from "./MenuForm";

function Menu() {
  const [menuList, setMenuList] = useState([]);
  const [typeList, setTypeList] = useState([]);
  const [editingItem, setEditingItem] = useState(null);
  const { user } = useOutletContext();

  const fetchMenus = async () => {
    try {
      const data = await menuApi.getAll();
      setMenuList(data);
    } catch (error) {
      console.error("Failed to fetch menus:", error);
    }
  };

  const fetchTypes = async () => {
    try {
      const data = await typeApi.getAll();
      setTypeList(data);
    } catch (error) {
      console.error("Failed to fetch types:", error);
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      await fetchMenus();
      await fetchTypes();
    };
    fetchData();
  }, []);

  const addMenu = async (newMenu) => {
    try {
      await menuApi.create(newMenu);
      await fetchMenus();
    } catch (error) {
      console.error("Failed to add menu:", error);
    }
  };

  const updateMenu = async (id, updatedData) => {
    try {
      await menuApi.update(id, updatedData);
      setEditingItem(null);
      await fetchMenus();
    } catch (error) {
      console.error("Failed to update menu:", error);
    }
  };

  const deleteMenu = async (id) => {
    try {
      await menuApi.delete(id);
      setMenuList((prev) => prev.filter((item) => item.menuId !== id));
    } catch (error) {
      console.error("Failed to delete menu:", error);
    }
  };

  return (
    <div>
      <MenuList
        menuList={menuList}
        deleteMenu={deleteMenu}
        startEdit={(item) => setEditingItem(item)}
        role={user?.role} // ส่ง role ไปเช็คเงื่อนไข
      />
      <MenuForm
        addMenu={addMenu}
        updateMenu={updateMenu}
        editingItem={editingItem}
        cancelEdit={() => setEditingItem(null)}
        typeList={typeList}
        role={user?.role} // ส่ง role ไปเช็คเงื่อนไข
      />
    </div>
  );
}

export default Menu;
