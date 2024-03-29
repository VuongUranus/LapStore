const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema({
    shippingInfo:{
        address: {
            type: String,
            required: true
        },
        city: {
            type:String,
            required:true
        },
        province:{
            type: String,
            required:true
        },
        phoneNo: {
            type:String,
            required:true,
        },

    },
    orderItems: [
        {
            name:{
                type:String,
                required:true
            },
            price:{
                type:Number,
                required: true,
            },
            quantity:{
                type: Number,
                required: true
            },
            image:{
                type:String,
                required:true,
            },
            product:{
                type: mongoose.Schema.ObjectId,
                ref: "Product",
                required: true,
            },
        }
    ],
    user: {
        type: mongoose.Schema.ObjectId,
        ref:"User",
        required: true,
    },
    paymentInfo: {
        method:{
            type: String,
            required:true
        },
        status:{
            type: String,
            required: true,
            default: "Unpaid"
        }
    },
    paidAt: {
        type: Date,
    },
    totalPrice: {
        type:Number,
        default:0,
        required:true
    },
    orderStatus:{
        type: String,
        required:true,
        default: "Processing"
    },
    deliveredAt: Date,
    createAt: {
        type: Date,
        default: Date.now,
    },
});


module.exports = mongoose.model("Order",orderSchema);