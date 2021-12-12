const Order = require('../models/orderModel');
const Product = require('../models/productModel');
const ErrorHander = require('../utils/errorHander');
const typeErrors = require('../utils/typeErrors');

//Create new order
exports.createOrder = async(req,res,next)=>{

    try{

        const cart = req.cookies.cart;

        if(!cart){
            return res.redirect('/cart');
        }
        
        let order = {};
        
        order.shippingInfo = {
            address: req.body.address,
            city: req.body.city,
            province : req.body.province,
            phoneNo : req.body.phoneNo
        };

        order.orderItems = [];
        for(let i=0;i<cart.length;i++){
            let pr = await Product.findById(cart[i].product_id);
            if(pr){
                let newOrder = {
                    name: pr.name,
                    price: pr.price,
                    quantity: cart[i].quantity,
                    image: pr.images[0].url,
                    product: pr._id
                }
                order.orderItems.push(newOrder);
                pr.Stock -= cart[i].quantity;
                pr.amountSold += cart[i].quantity;
                await pr.save({vailidateBeforeSave:false});
            }
        }

        order.totalPrice = req.body.total;

        order.user = req.user._id;
        
        order.paymentInfo = {
            method: req.body.paymethod,
        };
        if(order.paymentInfo.method !== "cash"){
            order.paymentInfo.status = "paid";
            order.paidAt = Date.now();
        }
        
        await Order.create(order);
        res.cookie("cart",null,{
            expires: new Date(Date.now()),
            httpOnly: true, 
        });
        
        return next(new ErrorHander('Order Success','/','homeMessage'));

    }catch(error){
        const message = typeErrors(error);
        return next(new ErrorHander(message,'/cart','cartMessage'));
    }

}

//Get All My Order
exports.getMyOrder = async(req,res,next)=>{

    try{
        
        const orders = await Order.find({user:req.user._id}).sort({createAt:-1});

        const message = req.flash('myorderMessage')
        return res.render('user/order/',{message:message,orders:orders});

    }catch(error){
        const message = typeErrors(error);
        return next(new ErrorHander(message,'/','homeMessage'));
    }

}

//Get my order details
exports.getMyOrderDetails = async(req,res,next)=>{

    try{

        const order = await Order.findOne({_id:req.params.id,user:req.user._id}).populate("user","name email");

        if(!order){
            return next(new ErrorHander('Can not found order','/order/me','myorderMessage'));
        }

        const message = req.flash('myorderDetailsMessage');
        return res.render('user/order/orderDetails',{message:message,order:order});


    }catch(error){
        const message = typeErrors(error);
        return next(new ErrorHander(message,'/order/me','myorderMessage'));

    }

}

//Cancel my order
exports.cancelOrder = async(req,res,next)=>{

    try{

        const order = await Order.findOne({_id:req.params.id,user:req.user._id});

        if(!order){
            return res.redirect('/orders/me');
        }

        if(order.orderStatus.toLowerCase() === 'processing'){
            await Order.findByIdAndUpdate(req.params.id,{orderStatus: "Canceled"});
            order.orderItems.forEach(async (ord)=>{
                await updateStock(ord.product,ord.quantity);
            });
            return next(new ErrorHander('Order canceled','/orders/me','myorderMessage'));
        }else{
            return res.redirect(`/order/${req.params.id}`);
        }


    }catch(error){

        const message = typeErrors(error);
        return next(new ErrorHander(message,'/orders/me','myorderMessage'));

    }

}

//!ADMIN

//Get All Order -- Admin
exports.getAllOrders = async(req,res,next)=>{

    try{
        const orders = await Order.find().populate("user","name").sort({createAt:-1});

        const message = req.flash('adminOrderMessage');
        return res.render('admin/order/',{message,orders});

    }catch(error){
        const message = typeErrors(error);
        return next(new ErrorHander(message));
    }

}

//Get single Order -- Admin
exports.getSingleOrder = async(req,res,next)=>{

    try{

        const order = await Order.findById(req.params.id).populate("user","name");

        if(!order){
            return next(new ErrorHander("Order not found with this Id",'/admin/orders','adminOrderMessage'));
        }
    
        const message = req.flash('adminOrderDetailMessage');
        res.render('admin/order/details',{message,order});

    }catch(error){

        const message = typeErrors(error);
        return next(new ErrorHander(message,'/admin/orders','adminOrderMessage'));

    }

}

//Delete Order --Admin
exports.deleteOrder = async(req,res,next)=>{

    try{

        const order = await Order.findById(req.params.id);

        if(!order){
            return next(new ErrorHander("Order not found with this Id",'/admin/orders','adminOrderMessage'));
        }

        await Order.findByIdAndDelete(req.params.id);
    
        res.redirect('/admin/orders');

    }catch(error){

        const message = typeErrors(error);
        return next(new ErrorHander(message,'/admin/orders','adminOrderMessage'));

    }

}

//Update Order -- Admin
exports.updateOrder = async(req,res,next)=>{

    try{

        const order = await Order.findById(req.params.id);

        if(!order){
            return next(new ErrorHander("Order cannot find",'/admin/orders','adminOrderMessage'));
        }
    
        if(order.orderStatus === "Delivered" ){
            return next(new ErrorHander("You have already delivered this order",`/admin/order/${req.params.id}`,'adminOrderDetailMessage'));
        }
        if(order.orderStatus === "Canceled" ){
            return next(new ErrorHander("You have already Canceled this order",`/admin/order/${req.params.id}`,'adminOrderDetailMessage'));
        }
    
        order.orderStatus = req.body.status;
    
        if(req.body.status === "Delivered"){
            order.deliveredAt = Date.now()
        }
        await order.save({vailidateBeforeSave:false});
        res.redirect(`/admin/order/${req.params.id}`);

    }catch(error){
        const message = typeErrors(error);
        return next(new ErrorHander(message,'/admin/orders','adminOrderMessage'));
    }

}
async function updateStock(id,quantity){

    const product = await Product.findById(id);

    if(!product){
        return next(new ErrorHander('Product cannot found',`/order/${id}`,'myorderMessage'));
    }

    product.Stock += quantity;
    product.amountSold -=quantity;

    await product.save({vailidateBeforeSave:false});

}