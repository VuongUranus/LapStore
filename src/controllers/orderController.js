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
                pr.save();
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
        
        const ok = await Order.create(order);
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
        
        const orders = await Order.find({user:req.user._id});

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

        const order = await Order.findOne({_id:req.params.id,user:req.user._id});

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