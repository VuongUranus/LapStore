const Brand = require('../models/brandModel');
const ErrorHander = require('../utils/errorHander');
const typeErrors = require('../utils/typeErrors');

exports.getBrandPage = async(req,res,next)=>{

    const brands = await Brand.find();

    const message = req.flash('adminBrandMessage');
    res.render('admin/brand/',{message:message,brands});
}

exports.getDetailsBrand = async(req,res,next)=>{

    try{

        const brand = await Brand.findById(req.params.id);
        if(!brand){
            return next(new ErrorHander('Can not found brand','/admin/brands','adminBrandMessage'));
        }

        const message = req.flash('adminBrandDetailMessage');
        res.render('admin/brand/details',{message,brand});

    }catch(error){
        const message = typeErrors(error);
        return next(new ErrorHander(message,'/admin/brands','adminBrandMessage'));
    }
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

        const brand = await Brand.findById(req.params.id);
        if(!brand){
            return next(new ErrorHander('Can not found brand','/admin/brands','adminBrandMessage'));
        }

        if(req.body.name === brand.name && req.body.description === brand.description){
            return next(new ErrorHander('The new infomation can\'t be the same with the old one',`/admin/brand/${req.params.id}`,'adminBrandDetailMessage'));
        }

        const newData = {
            name:req.body.name,
            description: req.body.description
        };

        await Brand.findByIdAndUpdate(req.params.id,newData,{
            new:true,
            runValidators:true,
            useFindAndModify: false,
        });
        res.redirect('/admin/brands');

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