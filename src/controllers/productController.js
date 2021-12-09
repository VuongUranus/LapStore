const Product = require('../models/productModel');
const Brand = require('../models/brandModel');
const ErrorHander = require('../utils/errorHander');
const typeErrors = require('../utils/typeErrors');
const ApiFeatures = require('../utils/apifeatures');
const User = require('../models/userModel');
const jwt = require('jsonwebtoken');


//Create Product -- Admin
exports.createProduct = async(req,res,next)=>{
    const product = await Product.create(req.body);
    res.status(201).json({
        success: true,
        product
    });
}

//Get all Products
exports.getAllProducts = async(req,res,next)=>{

    try{

        const resultPerpage = 8;
        const productsLength = (await Product.find()).length;
        const numberPage = Number(req.query.page) || 1;
        const brand = await Brand.find();
        
        const apifeature = new ApiFeatures(Product.find(),req.query)
        .search()
        .filter()
        .pagination(resultPerpage);

        const product = await apifeature.query;

        const message = req.flash('productMessage');
        return res.render('user/product/index',{products:product,brands:brand,productsLength:productsLength,numberPage:numberPage,message:message});

    }catch(error){
        const message = typeErrors(error);
        return next(new ErrorHander(message,"/products",'productMessage'));
    }

}

//Get Product Detail
exports.getProductDetail = async(req,res,next)=>{

    try{

        const product = await Product.findById(req.params.id);

        if(!product){
            return next(new ErrorHander("Product not found","/products","productMessage"));
        }

        const {token} = req.cookies;
        let user = [];
        if(token){
            const decodedData = jwt.verify(token,process.env.JWT_SECRET);
            req.user = await User.findById(decodedData.id);
            user = req.user;
        }
        const message = req.flash('productDetailMessage');
        return res.render('user/product/details',{product:product,message:message,user:user});

    }catch(error){

        const message = typeErrors(error);
        return next(new ErrorHander(message,"/products","productMessage"));

    }

}

//add product to cart
exports.addProductToCart = async(req,res,next)=>{

    try{

        const product = await Product.findById(req.body.product);
        if(!product){
            return next(new ErrorHander("Product can not found",`/product/${req.body.product}`,"productDetailMessage"));
        }

        let Cart = req.cookies.cart || [];

        const isAdded = Cart.find(prod => prod.product_id.toString() === req.body.product.toString());

        if(isAdded){
            Cart.forEach(prod => {
                if(prod.product_id.toString() === req.body.product.toString()){
                    if(prod.quantity + Number(req.body.quantity) > product.Stock){
                        return next(new ErrorHander("Don't have enough stock. Check cart,please",`/product/${req.body.product}`,"productDetailMessage"));
                    }else{
                        prod.quantity += Number(req.body.quantity);
                    }
                }
            });
        }else{
            const newProduct = {
                product_id: req.body.product,
                quantity: parseInt(req.body.quantity)
            }
            Cart.push(newProduct);
        }
        //Options for cookie
        const options = {
            expires: new Date(
            Date.now + process.env.COOKIE_EXPIRES * 24 *60*60*1000
            ),
            httpOnly: true,
        }
        return res.cookie('cart',Cart,options).redirect('/cart');


    }catch(error){

        const message = typeErrors(error);
        return next(new ErrorHander(message,`/product/${req.body.product}`,"productDetailMessage"));

    }

}

//get product from cart
exports.getProductsFromCart = async(req,res,next)=>{

    try{

        const cart = req.cookies.cart;

        if(!cart){
            return next(new ErrorHander('Please, add the product to the cart.','/products','productMessage'));
        }

        let products = [];

        for(let i=0;i<cart.length;i++){

            let pr = await Product.findById(cart[i].product_id);
            if(pr){
                pr.quantity = cart[i].quantity;
                products.push(pr);
            }
        }


        const message = req.flash('cartMessage');
        return res.render('user/cart/',{message:message,products:products});

    }catch(error){
        const message = typeErrors(error);
        return next(new ErrorHander(message,'/cart','cartMessage'));
    }

}

//delete product from cart
exports.deleteProductFromCart = async(req,res,next)=>{

    try{

        const product_id = req.params.product_id;
        
        const  cart = req.cookies.cart ;

        const Cart = cart.filter(prod => prod.product_id.toString() !== product_id.toString());
        console.log(Cart);

        if(Cart.length === 0){
            return res.cookie("cart",null,{
                expires: new Date(Date.now()),
                httpOnly: true, 
            }).redirect('/products');
        }

        //Options for cookie
        const options = {
            expires: new Date(
            Date.now + process.env.COOKIE_EXPIRES * 24 *60*60*1000
            ),
            httpOnly: true,
        }
        return res.cookie('cart',Cart,options).redirect('/cart');


    }catch(error){
        const message = typeErrors(error);
        return next(new ErrorHander(message,'/cart','cartMessage'));
    }

}

//update product from cart
exports.updateProductFromCart = async(req,res,next)=>{

    try{

        const product = await Product.findById(req.params.product_id);
        if(!product){
            return next(new ErrorHander("Product can not found",'/cart',"cartMessage"));
        }

        if(req.body.quantity > product.Stock){
            return next(new ErrorHander("Don't have enough stock",'/cart','cartMessage'));
        }

        let cart = req.cookies.cart || [];

        const quantity = req.body.quantity;

        if(quantity == 0 || !quantity)
            return res.redirect('/cart');

        cart.forEach(prod => {
            if(prod.product_id.toString() === req.params.product_id.toString()){
                prod.quantity = quantity;
            }
        });

        //Options for cookie
        const options = {
            expires: new Date(
            Date.now + process.env.COOKIE_EXPIRES * 24 *60*60*1000
            ),
            httpOnly: true,
        }
        return res.cookie('cart',cart,options).redirect('/cart');


    }catch(error){

        const message = typeErrors(error);
        return next(new ErrorHander(message,'/cart','cartMessage'));

    }

}

//confirm page
exports.getConfirmPage = async(req,res,next)=>{

    try{
        
        if(!/(84|0[3|5|7|8|9])+([0-9]{8})\b/.test(req.query.phoneNo.toString())){
            return next(new ErrorHander('Phone Number is not valid','/shipping','shippingMessage'));
        }

        const shippingInfo = {
            address: req.query.address,
            city: req.query.city,
            province: req.query.province,
            phoneNo : req.query.phoneNo
        };

        const cart = req.cookies.cart;
        if(!cart || !shippingInfo.address || !shippingInfo.city || !shippingInfo.province){
            return res.redirect('/cart');
        }

        let products = [];

        for(let i = 0;i<cart.length;i++){

            let pr = await Product.findById(cart[i].product_id);
            if(pr){
                pr.quantity = cart[i].quantity;
                products.push(pr);
            }
        }

        const message = req.flash('confirmMessage');
        return res.render('user/cart/confirm',{message:message,shippingInfo:shippingInfo,products:products,user:req.user});

    }catch(err){

        const message = typeErrors(err);
        return next(new ErrorHander(message,'/shipping','shippingMessage'));
    }

}

//!Review

//Get review page
exports.createReviewPage = async(req,res,next)=>{

    try{

        const product = await Product.findById(req.query.productId);
        if(!product){
            return next(new ErrorHander('Can not found product','/products','productMessage'));
        }

        const isReviewed = product.reviews.filter(rev => rev.user.toString() === req.user._id.toString());
        const data = {
            productId: req.query.productId,
        }
        if(isReviewed.length > 0){
            data.rating = isReviewed[0].rating;
            data.comment = isReviewed[0].comment;
        }else{
            data.rating = 0;
            data.comment = "";
        }

        const message = req.flash('reviewMessage');
        return res.render('user/review/addReview',{message:message,data:data});

    }catch(error){

        const message = typeErrors(error);
        return next(new ErrorHander(message,'/products','productMessage'));
    }

}

//Create Product Review or Update the review
exports.createProductReview = async(req,res,next)=>{

    try{

        const {rating,comment,productId} = req.body;

        if(rating < 1){
            return res.redirect(`/review/new?productId=${productId}`);
        }

        const review = {
            user: req.user._id,
            name: req.user.name,
            rating: Number(rating),
            comment,
        };
    
        const product = await Product.findById(productId);
    
        const isReviewed = product.reviews.find(rev => rev.user.toString() === req.user._id.toString());
    
        if (isReviewed) {
            product.reviews.forEach(rev => {
                if(rev.user.toString() === req.user._id.toString())
                    (rev.rating = rating),(rev.comment = comment);
            })
        } else {
            product.reviews.push(review);
            product.numOfReviews = product.reviews.length;
        }
    
        let avg = 0;
        product.reviews.forEach(rev =>{
            avg += rev.rating;
        });
        console.log(avg);
    
        product.ratings = avg/product.reviews.length;
        
        await product.save({validateBeforeSave:false});
    
        return res.redirect(`/product/${req.body.productId}`);

    }catch(error){

        const message = typeErrors(error);
        return next(new ErrorHander(message,`/product/${req.body.productId}`,'productDetailMessage'));
    }

}

//Delete Review
exports.deleteReview = async(req,res,next)=>{

    try{

        const product = await Product.findById(req.query.productId);

        if(!product){
            return next(new ErrorHander("Product not found",'/products','productMessage'));
        }
    
        const reviews = product.reviews.filter(rev => rev.user.toString() !== req.user.id.toString());
    
        let avg = 0;
        reviews.forEach(rev=>{
            avg += rev.rating;
        });
    
        product.ratings = avg / reviews.length || 0;
        product.numOfReviews = reviews.length || 0;
        product.reviews = reviews;
    
        await product.save({validateBeforeSave:false});
    
        return next(new ErrorHander('Delete Review Success',`/product/${req.query.productId}`,'productDetailMessage'));

    }catch(error){
        const message = typeErrors(error);
        return next(new ErrorHander(message,`/product/${req.query.productId}`,'productDetailMessage'));
    }

}