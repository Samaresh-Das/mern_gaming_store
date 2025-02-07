const express = require('express');

const adminController = require('../controllers/adminController');

const router = express.Router()

router.post('/registerAdmin', adminController.registerAdmin);
router.post('/loginAdmin', adminController.loginAdmin);

module.exports = router