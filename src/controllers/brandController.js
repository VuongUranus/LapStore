const Brand = require('../models/brandModel');
const ErrorHander = require('../utils/errorHander');
const typeErrors = require('../utils/typeErrors');

exports.getBrandPage = async(req,res,next)=>{

    const brands = await Brand.find();

    const message = req.flash('adminBrandMessage');
    res.render('admin/brand/',{message:message,brands});
}

exports.deleteBrand = async(req,res,next)=>{

    try{

        await Brand.findByIdAndDelete(req.params.id);

        res.redirect('/admin/brands');

    }catch(error){
        const message = typeErrors(error);
        return next(new ErrorHander(message,'/admin/brands','adminBrandMessage'));
    }

}

exports.updateBrand = async(req,res,next)=>{

    try{

        

    }catch(error){
        const message = typeErrors(error);
        return next(new ErrorHander(message,'/admin/brands','adminBrandMessage'));
    }
}

exports.createBrand = async(req,res,next)=>{

    try{

       const brand = {
           name: req.body.name,
           description:req.body.description
       }

       await Brand.create(brand);
       res.redirect('/admin/brands');

    }catch(error){
        const message = typeErrors(error);
        return next(new ErrorHander(message,'/admin/brands','adminBrandMessage'));
    }
}