import { useState, useEffect } from "react";

const MenuForm = ({
  addMenu,
  updateMenu,
  editingItem,
  cancelEdit,
  typeList,
}) => {
  const [inputs, setInputs] = useState({
    name: "",
    price: "",
    isBestSeller: "true",
    typeId: "",
  });

  useEffect(() => {
    if (editingItem) {
      setInputs({
        name: editingItem.name,
        price: editingItem.price,
        isBestSeller: String(editingItem.isBestSeller),
        typeId: editingItem.typeId || (typeList[0]?.typeId ?? ""),
      });
    } else {
      setInputs({
        name: "",
        price: "",
        isBestSeller: "true",
        typeId: typeList[0]?.typeId ?? "",
      });
    }
  }, [editingItem, typeList]);

  function handleChange(e) {
    const { name, value } = e.target;
    setInputs((prev) => ({ ...prev, [name]: value }));
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!inputs.name || inputs.price === "") return;

    const payload = {
      name: inputs.name,
      price: Number(inputs.price),
      isBestSeller: inputs.isBestSeller === "true",
      typeId: Number(inputs.typeId || typeList[0]?.typeId || 1),
    };

    if (editingItem) {
      await updateMenu(editingItem.menuId, payload);
    } else {
      await addMenu(payload);
    }

    setInputs({
      name: "",
      price: "",
      isBestSeller: "true",
      typeId: typeList[0]?.typeId ?? "",
    });
  };

  return (
    <div style={{ marginTop: "20px" }}>
      <h4>{editingItem ? "Edit Food" : "New Food"}</h4>
      <form
        onSubmit={handleSubmit}
        style={{
          display: "flex",
          flexDirection: "column",
          gap: "8px",
          maxWidth: "300px",
        }}
      >
        <label>
          name :{" "}
          <input
            type="text"
            name="name"
            value={inputs.name}
            onChange={handleChange}
          />
        </label>

        <label>
          price :{" "}
          <input
            type="number"
            name="price"
            value={inputs.price}
            onChange={handleChange}
          />
        </label>

        <label>
          Best Seller :{" "}
          <select
            name="isBestSeller"
            value={inputs.isBestSeller}
            onChange={handleChange}
          >
            <option value="true">BestSeller</option>
            <option value="false">Normal</option>
          </select>
        </label>

        <label>
          Type :{" "}
          <select name="typeId" value={inputs.typeId} onChange={handleChange}>
            {typeList.map((t) => (
              <option key={t.typeId} value={t.typeId}>
                {t.name}
              </option>
            ))}
          </select>
        </label>

        <div style={{ display: "flex", gap: "8px", marginTop: "5px" }}>
          <button
            type="submit"
            style={{ cursor: "pointer", padding: "4px 10px" }}
          >
            {editingItem ? "Update menu" : "Add menu"}
          </button>
          {editingItem && (
            <button
              type="button"
              onClick={cancelEdit}
              style={{ cursor: "pointer", padding: "4px 10px" }}
            >
              Cancel
            </button>
          )}
        </div>
      </form>
    </div>
  );
};

export default MenuForm;
