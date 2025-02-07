const express = require('express');
const checkAdminAuth = require('../middleware/checkAdmin');

const router = express.Router();

router.get("/dashboard", checkAdminAuth, (req, res) => {
    res.json({ message: "Welcome Admin" });
})

module.exports = router