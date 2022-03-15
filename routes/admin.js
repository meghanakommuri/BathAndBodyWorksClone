var express = require('express');
var router = express.Router();

var monk = require('monk');
var db = monk('localhost:27017/BBEternity');

var alert = require('alert');
const multer  = require('multer');

//add new product
router.get('/new', function(req, res){
    res.render('new', {user : req.user});
});

const imageStorage = multer.diskStorage({
  destination: '../public/images/', // Destination to store image 
  filename: (req, file, cb) => {
      console.log("Inside iamge storage");
      cb(null, req.body.name + path.extname(file.originalname))
      // file.fieldname is name of the field (image), path.extname get the uploaded file extension
  }
});

const imageUpload = multer({
  storage: imageStorage,
  limits: {
      fileSize: 10000000   // 1000000 Bytes = 1 MB
  },
  fileFilter(req, file, cb) {
      console.log("Inside file filter");
      if (!file.originalname.match(/\.(png|jpg)$/)) {     // upload only png and jpg format
          return cb(new Error('Please upload a Image'))
      }
      cb(undefined, true)
  }
});

//insert a new product
router.post('/add', imageUpload.single('image'), function(req,res) {
    const { filename: image } = req.body.product_name;
    var collection = db.get('Product');
    const tags = req.body.product_tag.split(",");

    collection.insert({ 
      name: req.body.product_name,
      volume: req.body.product_volume,
      type: req.body.product_type,
      price: req.body.product_price,
      img: req.body.product_name+".jpeg",
      desc: req.body.product_desc,
      tag: tags,
      stock: req.body.product_stock,
      isDeleted: false
    }, function(err,product){
      if(err) throw err;
      alert("Product "+req.body.product_name+" has been added to collection");
      res.redirect('/products');
    });
});

//update an existing product
router.get('/product/:id/edit', function(req, res) {
    var collection = db.get('Product');
    collection.findOne({ _id : req.params.id },
      function(err,product){
      if(err) throw err;
      res.render('edit',{user : req.user, Product : product});
    });
});

//update an existing product
router.post('/editproduct', function(req, res) {
  var collection = db.get('Product');
  const tags = req.body.product_tag.split(",");
  collection.update({ _id : req.body.id },
  { 
    $set: { 
    name: req.body.product_name,
      volume: req.body.product_volume,
      type: req.body.product_type,
      price: req.body.product_price,
      desc: req.body.product_desc,
      tag: tags,
      stock: req.body.product_stock
  }}, function(err,product){
    if(err) throw err;
    res.redirect('/products');
  });
});

//delete an existing product - Soft Delete
router.post('/product/:id/delete', function(req, res) {
  var collection = db.get('Product');
  collection.update({ _id : req.params.id }, {
    $set: { 
      isDeleted: true
  }}, function(err,video){
      if(err) throw err;
      res.redirect('/products');
  });
});

module.exports = router;