const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const prisma = require('../db/prisma'); 

// 1. Middleware สำหรับตรวจสอบ Token
const verifyToken = (req, res, next) => {
    try {
        const token = req.headers['authorization'].split(' ')[1];
        if (token === "null") {
            return res.status(403).json({ message: "no token provide" });
        } else {
            const decode = jwt.verify(token, process.env.JWT_KEY);
            req.userId = decode.userId;
            req.role = decode.role;
            next();
        }
    } catch (err) {
        return res.status(401).json({ message: "Invalid token" });
    }
};

// 2. API สำหรับสมัครสมาชิก (Register)
router.post('/register', async (req, res) => {
    const { userName, email, password } = req.body;
    try {
        const getUser = await prisma.user.findMany({
            where: {
                OR: [{ userName: userName }, { email: email }]
            }
        });

        if (getUser.length > 0) {
            return res.status(409).json({ message: "Duplicate Username or Email" });
        } else {
            const hashPassword = await bcrypt.hash(password, 10);
            
            await prisma.user.create({
                data: {
                    userName,
                    email,
                    password: hashPassword
                }
            });
            return res.status(201).json({ message: 'User created successfully' });
        }
    } catch (err) {
        console.error(err);
        return res.status(500).json({ message: "Server error" });
    }
});

// 3. API สำหรับเข้าสู่ระบบ (Login)
router.post('/login', async (req, res) => {
    const { userName, password } = req.body;
    try {
        const getUser = await prisma.user.findMany({
            where: { userName: userName }
        });

        if (getUser.length === 0) {
            return res.status(404).json({ message: "Unknown Username" });
        } else {
            const isMatch = await bcrypt.compare(password, getUser[0].password);
            if (!isMatch) {
                return res.status(404).json({ message: "Password Incorrect" });
            } else {
                const token = jwt.sign(
                    { userId: getUser[0].userId, role: getUser[0].role },
                    process.env.JWT_KEY,
                    { expiresIn: '1h' } 
                );
                return res.status(200).json({ message: "Login Success", token: token });
            }
        }
    } catch (err) {
        console.error(err);
        return res.status(500).json({ message: "Server error" });
    }
});

// 4. API สำหรับดึงข้อมูลผู้ใช้ปัจจุบัน (เช็คจาก Token)
router.get('/me', verifyToken, async (req, res) => {
    try {
        const user = await prisma.user.findUnique({
            where: { userId: req.userId },
            select: { userId: true, userName: true, email: true, role: true } 
        });
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }
        return res.status(200).json({ user: user });
    } catch (err) {
        return res.status(500).json({ message: "Server error" });
    }
});
// API สำหรับดึงข้อมูลผู้ใช้ทั้งหมด (เฉพาะ Admin)
router.get('/users', verifyToken, async (req, res) => {
    // ป้องกันไม่ให้ user ทั่วไปดึงข้อมูล
    if (req.role !== 'admin') {
        return res.status(403).json({ message: "Forbidden: Admins only" });
    }
    try {
        const users = await prisma.user.findMany({
            select: { userId: true, userName: true, email: true, role: true }
        });
        res.status(200).json(users);
    } catch (err) {
        res.status(500).json({ message: "Server error" });
    }
});

// API สำหรับเปลี่ยนสิทธิ์ (Role) ของผู้ใช้งาน
router.put('/users/:id/role', verifyToken, async (req, res) => {
    if (req.role !== 'admin') {
        return res.status(403).json({ message: "Forbidden: Admins only" });
    }
    const { id } = req.params;
    const { role } = req.body;
    try {
        const updatedUser = await prisma.user.update({
            where: { userId: Number(id) },
            data: { role: role }
        });
        res.status(200).json({ message: "Role updated successfully", user: updatedUser });
    } catch (err) {
        res.status(500).json({ message: "Server error" });
    }
});
// ส่งออก router และ middleware ไปใช้งาน
module.exports = { router, verifyToken };