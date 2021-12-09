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
    getConfirmPage,
    createReviewPage,
    createProductReview,
    deleteReview
} = require('../controllers/productController');

//Product
router.route('/products')
.get(getAllProducts)

router.route('/product/new')
.post(createProduct)

router.route('/product/:id')
.get(getProductDetail)


//Cart
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

//Reviews
router.route('/review/new')
.get(isAuthenticationUser,createReviewPage)
.post(isAuthenticationUser,createProductReview)

router.route('/review/delete')
.get(isAuthenticationUser,deleteReview)

module.exports = router;