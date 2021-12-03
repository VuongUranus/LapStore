const express = require('express');
const router = express.Router();

const { isAuthenticationUser, authorizeRoles } = require('../middlewares/auth');

const {
    getAllProducts,
    createProduct,
    getProductDetail,
    addProductToCart,
    getProductsFromCart,
    deleteCart,
    deleteProductFromCart
} = require('../controllers/productController');

router.route('/products')
.get(getAllProducts)

router.route('/product/new')
.post(createProduct)

router.route('/product/:id')
.get(getProductDetail)

router.route('/cart')
.post(isAuthenticationUser,addProductToCart)
.get(isAuthenticationUser,getProductsFromCart)

router.route('/cart/:product_id')
.delete(isAuthenticationUser,deleteProductFromCart);

router.route('/delete/cart')
.get(deleteCart)

module.exports = router;