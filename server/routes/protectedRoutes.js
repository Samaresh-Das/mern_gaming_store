const express = require('express');
const checkAdminAuth = require('../middleware/checkAdmin');
const adminController = require('../controllers/adminController');

const router = express.Router();

router.get("/dashboard", checkAdminAuth, (req, res) => {
    res.json({ message: "Welcome Admin" });
})

router.post("/addProduct", checkAdminAuth, adminController.addProduct);

module.exports = router