const Admin = require('../models/admin')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken');
const AdminProducts = require('../models/adminProducts');

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

//api for admin to add new products
const addProduct = async (req, res) => {
    try {
        const { name, description, price, imageUrls } = req.body;

        if (!name || !description || !price || !imageUrls) {
            return res.status(400).json({ message: 'All fields are required and one image is required' });
        }

        if (imageUrls.length > 3) {
            return res.status(400).json({ message: 'Only 3 images are allowed' });
        }

        const newProduct = new AdminProducts({ name, description, price, imageUrls });
        await newProduct.save();

        res.status(201).json({ message: 'Product added successfully', product: newProduct });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}

const updateProduct = async (req, res) => {

    try {
        const { id } = req.params;
        const updates = req.body

        //filtering updated fields which are empty if in case any of the field is empty
        const filteredUpdates = Object.fromEntries(Object.entries(updates).filter(([_, value]) => value !== ""));

        const updatedProduct = await AdminProducts.findByIdAndUpdate(id, filteredUpdates, { new: true });

        if (!updatedProduct) {
            return res.status(404).json({ message: 'Product not found' });
        }

        res.status(200).json({ message: 'Product updated successfully', product: updatedProduct });

    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}

module.exports = { registerAdmin, loginAdmin, addProduct, updateProduct }