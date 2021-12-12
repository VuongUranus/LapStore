const multer  = require('multer');
const path = require('path')


var storage = multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, path.join(__dirname,'../public/images/products'));
    },
    filename: function (req, file, cb) {
      cb(null, Date.now()  + "-" + file.originalname)
    }
});  
exports.upload = multer({ 
    storage: storage,
    fileFilter: function (req, file, cb) {
        // console.log(file);
        if(file.mimetype=="image/jpg" || file.mimetype=="image/png" || file.mimetype =="image/jpeg"){
            cb(null, true)
        }else{
            return cb(new Error('Only image are allowed!'))
        }
    }
}).single('image');
