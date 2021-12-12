const express = require('express');
const { isAuthenticationUser, authorizeRoles } = require('../middlewares/auth');

const {
    getBrandPage,
    createBrand,
    deleteBrand,
    getDetailsBrand,
    updateBrand
} = require('../controllers/brandController');

const router = express.Router();

router.route('/admin/brands')
.get(isAuthenticationUser,authorizeRoles("admin"),getBrandPage)

router.route('/admin/brand/new')
.post(isAuthenticationUser,authorizeRoles("admin"),createBrand)

router.route('/admin/brand/:id')
.delete(isAuthenticationUser,authorizeRoles("admin"),deleteBrand)
.get(isAuthenticationUser,authorizeRoles("admin"),getDetailsBrand)
.put(isAuthenticationUser,authorizeRoles("admin"),updateBrand)

module.exports = router;