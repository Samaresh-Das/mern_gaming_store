const Admin = require('../models/admin')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')

const registerAdmin = async (req, res) => {
    const { email, password } = req.body;

    try {
        const existingAdmin = await Admin.findOne({ email });
        if (existingAdmin) return res.status(400).json({ message: 'Admin already exists' });

        const hashedPassword = await bcrypt.hash(password, 10);
        const newAdmin = new Admin({ email, password: hashedPassword });
        await newAdmin.save();

        return res.status(201).json({ message: 'Admin registered successfully' });

    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
}


const loginAdmin = async (req, res) => {
    const { email, password } = req.body;

    try {
        const existingAdmin = await Admin.findOne({ email });
        if (!existingAdmin) return res.status(400).json({ message: 'Admin does not exist' });

        const isPasswordCorrect = await bcrypt.compare(password, existingAdmin.password);
        if (!isPasswordCorrect) return res.status(400).json({ message: 'Invalid credentials' });

        const token = jwt.sign({ id: existingAdmin._id, role: 'admin' }, process.env.SECRET_ADMIN_JWT, { expiresIn: '2h' });

        res.json({ result: existingAdmin, token });

    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}

module.exports = { registerAdmin, loginAdmin }