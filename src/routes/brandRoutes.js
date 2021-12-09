const express = require('express');
const { isAuthenticationUser, authorizeRoles } = require('../middlewares/auth');

const {
    getBrandPage,
    createBrand,
    deleteBrand
} = require('../controllers/brandController');

const router = express.Router();

router.route('/admin/brands')
.get(isAuthenticationUser,authorizeRoles("admin"),getBrandPage)

router.route('/admin/brand/new')
.post(isAuthenticationUser,authorizeRoles("admin"),createBrand)

router.route('/admin/brand/:id')
.delete(isAuthenticationUser,authorizeRoles("admin"),deleteBrand)

module.exports = router;