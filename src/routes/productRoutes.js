const express = require('express');
const router = express.Router();

const { isAuthenticationUser, authorizeRoles } = require('../middlewares/auth');
// const {upload} = require('../utils/upload');

const {
    getHome,
    getAllProducts,
    createProduct,
    getProductDetail,
    addProductToCart,
    getProductsFromCart,
    deleteProductFromCart,
    updateProductFromCart,
    getConfirmPage,
    createReviewPage,
    createProductReview,
    deleteReview,
    getAllProductsAdmin,
    deleteProduct,
    getProductDetailAdmin,
    getProductReview,
    getEditProduct,
    updateProduct,
    getAddProduct,
    topSell
} = require('../controllers/productController');

router.route('/')
.get(getHome);

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

//!ADMIN
router.route('/admin/products')
.get(isAuthenticationUser,authorizeRoles('admin'),getAllProductsAdmin)

router.route('/admin/product/:id')
.delete(isAuthenticationUser,authorizeRoles('admin'),deleteProduct)
.get(isAuthenticationUser,authorizeRoles('admin'),getProductDetailAdmin)
.put(isAuthenticationUser,authorizeRoles('admin'),updateProduct)

router.route('/admin/reviews')
.get(isAuthenticationUser,authorizeRoles('admin'),getProductReview);

router.route('/admin/product/edit/:id')
.get(isAuthenticationUser,authorizeRoles('admin'),getEditProduct)

router.route('/admin/products/new')
.get(isAuthenticationUser,authorizeRoles('admin'),getAddProduct)
.post(isAuthenticationUser,authorizeRoles('admin'),createProduct)

//Reports
router.route('/admin/report/topSell')
.get(isAuthenticationUser,authorizeRoles('admin'),topSell);

module.exports = router;