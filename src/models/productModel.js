const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
    name:{
        type: String,
        required: [true,"Please enter product name"],
        trim: true
    },
    description:{
        type: String,
        required: [true,"Please enter description"]
    },
    price:{
        type: Number,
        required: [true,"Please enter product Price"],
        maxlength: [8,"Price cannot exceed 8 characters"]
    },
    ratings:{
        type: Number,
        default: 0
    },
    images: [
        {
            url:{
                type: String,
                required: true
            }
        }
    ],
    brand: {
        type: String,
        required:[true,"Please enter product brand"],
    },
    Stock:{
        type: Number,
        required:[true,"Please enter product Stock"],
        maxlength: [4,"Stock cannot exceed 4 character"],
        default: 1
    },
    numOfReviews:{
        type: Number,
        default:0
    },
    reviews:[
        {
            user:{
                type:mongoose.Schema.ObjectId,
                ref: "User",
                // required: true
            },
            name:{
                type: String,
                // required:true
            },
            rating:{
                type: Number,
                // required:true
            },
            comment: {
                type:String,
                // required:true
            }
        }
    ],
    amountSold:{
        type: Number,
        required: true,
        default: 0
    },
    createAt:{
        type: Date,
        default: Date.now
    }
});

module.exports = mongoose.model("Product",productSchema);