const express = require('express');
const router = express.Router();

const { isAuthenticationUser, authorizeRoles } = require('../middlewares/auth');

const {
    createOrder,
    getMyOrder,
    getMyOrderDetails
} = require('../controllers/orderController');

router.route('/order/new')
.post(isAuthenticationUser,createOrder);

router.route('/orders/me')
.get(isAuthenticationUser,getMyOrder);

router.route('/order/:id')
.get(isAuthenticationUser,getMyOrderDetails)

module.exports = router;