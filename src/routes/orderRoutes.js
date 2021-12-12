const express = require('express');
const router = express.Router();

const { isAuthenticationUser, authorizeRoles } = require('../middlewares/auth');

const {
    createOrder,
    getMyOrder,
    getMyOrderDetails,
    cancelOrder,
    getAllOrders,
    getSingleOrder,
    deleteOrder,
    updateOrder
} = require('../controllers/orderController');

router.route('/order/new')
.post(isAuthenticationUser,createOrder);

router.route('/orders/me')
.get(isAuthenticationUser,getMyOrder);

router.route('/order/:id')
.get(isAuthenticationUser,getMyOrderDetails)
.delete(isAuthenticationUser,cancelOrder)

//!ADMIN
router.route('/admin/orders')
.get(isAuthenticationUser,authorizeRoles('admin'),getAllOrders);

router.route('/admin/order/:id')
.get(isAuthenticationUser,authorizeRoles('admin'),getSingleOrder)
.delete(isAuthenticationUser,authorizeRoles('admin'),deleteOrder)
.put(isAuthenticationUser,authorizeRoles('admin'),updateOrder);

module.exports = router;