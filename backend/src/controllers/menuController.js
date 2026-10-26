const prisma = require('../db/prisma');

const getMenus = async (req, res) => {
    const { keyword } = req.query;
    try {
        let menus;
        if (keyword) {
            menus = await prisma.menu.findMany({
                where: {
                    name: { contains: keyword }
                },
                include: { type: true }
            });
        } else {
            menus = await prisma.menu.findMany({
                include: { type: true }
            });
        }
        res.json(menus);
    } catch (err) {
        console.error('Error fetching menus:', err);
        res.status(500).json({ error: 'Database error' });
    }
};

const getMenuById = async (req, res) => {
    const { id } = req.params;
    try {
        const menuItem = await prisma.menu.findUnique({
            where: { menuId: Number(id) },
            include: { type: true }
        });
        if (!menuItem) {
            return res.status(404).json({ error: 'Menu not found' });
        }
        res.json(menuItem);
    } catch (err) {
        console.error('Error fetching menu:', err);
        res.status(500).json({ error: 'Database error' });
    }
};

const createMenu = async (req, res) => {
    const { name, price, isBestSeller, typeId } = req.body;
    if (!name || price === undefined || !typeId) {
        return res.status(400).json({ error: 'Name, price, and typeId are required' });
    }
    try {
        const newMenu = await prisma.menu.create({
            data: {
                name: name,
                price: Number(price),
                isBestSeller: isBestSeller === true || isBestSeller === 'true' || isBestSeller === 1,
                typeId: Number(typeId)
            }
        });
        res.status(201).json(newMenu);
    } catch (err) {
        console.error('Error creating menu:', err);
        res.status(500).json({ error: 'Database error' });
    }
};

const updateMenu = async (req, res) => {
    const { id } = req.params;
    const { name, price, isBestSeller, typeId } = req.body;
    try {
        const updatedMenu = await prisma.menu.update({
            where: { menuId: Number(id) },
            data: {
                name: name,
                price: Number(price),
                isBestSeller: isBestSeller === true || isBestSeller === 'true' || isBestSeller === 1,
                typeId: Number(typeId)
            }
        });
        res.json(updatedMenu);
    } catch (err) {
        console.error('Error updating menu:', err);
        res.status(404).json({ error: 'Menu not found or database error' });
    }
};

const deleteMenu = async (req, res) => {
    const { id } = req.params;
    try {
        await prisma.menu.delete({
            where: { menuId: Number(id) }
        });
        res.json({ message: 'Menu deleted successfully', menuId: Number(id) });
    } catch (err) {
        console.error('Error deleting menu:', err);
        res.status(404).json({ error: 'Menu not found' });
    }
};

module.exports = {
    getMenus,
    getMenuById,
    createMenu,
    updateMenu,
    deleteMenu
};