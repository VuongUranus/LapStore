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
    deleteProductFromCart,
    updateProductFromCart,
    getConfirmPage
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
.delete(isAuthenticationUser,deleteProductFromCart)
.put(isAuthenticationUser,updateProductFromCart)

router.route('/shipping')
.get(isAuthenticationUser,(req,res)=>{
    if(!req.cookies.cart){
        return res.redirect('/cart');
    }
    const message = req.flash('shippingMessage');
    return res.render('user/cart/shipping',{message:message});
});

router.route('/confirm')
.get(isAuthenticationUser,getConfirmPage);

module.exports = router;