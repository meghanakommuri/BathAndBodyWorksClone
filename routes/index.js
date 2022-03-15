var express = require('express');
var router = express.Router();
var passport = require('passport');
var Account = require('../models/account');

var alert = require('alert');

var monk = require('monk');
var db = monk('localhost:27017/BBEternity');

// Home page
router.get('/', function(req, res, next) {
  res.render('home', { user : req.user });
});

//Sign In
router.get('/register', function(req, res) {
  res.render('register', { user : req.user });
});

router.post('/register', function(req, res) {
  Account.register(new Account({ name: req.body.name, username : req.body.username , phone : req.body.phone}), req.body.password, function(err, account) {
    if (err) {
        return res.render('register', { account : account });
    }
    passport.authenticate('local')(req, res, function () {

      var cart_collection = db.get('Cart');

      cart_collection.insert({
        username: req.body.username,
        products: []
        }, (err, cart) =>{
            if(err) throw err;
      });
      res.redirect('/');
    });
  });
});

//Login 
router.get('/login', function(req, res) {
  res.render('login', { user : req.user });
});

router.post('/login', passport.authenticate('local'), function(req, res) {
  res.redirect('/');
});

//Logout
router.get('/logout', function(req, res) {
  req.logout();
  res.redirect('/');
});

//Profile
router.get('/profile', function(req, res) {
  var user = req.user;
  var order_collection = db.get('Order');
  order_collection.find({username : req.user.username}, function(err, orders){
    if(err) throw err;
    res.render('account', { user : user , results : orders});
  });
});

//Aboutus
router.get('/about', function(req, res, next) {
  res.render('aboutus', { user : req.user });
});

//Privacy Policy
router.get('/pp', function(req, res, next) {
  res.render('policy', { user : req.user });
});

//Terms & Conditions
router.get('/tu', function(req, res, next) {
  res.render('terms', { user : req.user });
});

//list all products
router.get('/products', function(req, res) {
  var collection = db.get('Product');
  collection.find({isDeleted : false}, function(err,products){
    if(err) throw err;
    res.render('productlist',{user : req.user, results : products});
  });
});

//Single product
router.get('/products/:id', function(req, res) {
  var collection = db.get('Product');
  collection.findOne({_id : req.params.id}, function(err,product){
    if(err) throw err;
    res.render('product',{user : req.user, product : product});
  });
});

//product categories
router.get('/bathshower', function(req, res) {
  var collection = db.get('Product');
  collection.find({tag:"bath&shower", isDeleted : false}, function(err,products){
    if(err) throw err;
    res.render('productlist',{user : req.user, results : products});
  });
});

router.get('/moisturizer', function(req, res) {
  var collection = db.get('Product');
  collection.find({tag:"Moisturizer", isDeleted : false}, function(err,products){
    if(err) throw err;
    res.render('productlist',{user : req.user, results : products});
  });
});

router.get('/fragrance', function(req, res) {
  var collection = db.get('Product');
  collection.find({tag:"fragnance", isDeleted : false}, function(err,products){
    if(err) throw err;
    res.render('productlist',{user : req.user, results : products});
  });
});

// get cart for user
router.get('/cart', function(req, res) {
  var cart_collection = db.get('Cart');
  cart_collection.findOne({ username: req.user.username }, function(err, cart){
      if (err) throw err;
      res.render('cart',{user : req.user, results : cart.products});
  });
});

// update cart :id should be product id
router.post('/cart/:id', function(req, res){
  var product_collection = db.get('Product');
  var cart_collection = db.get('Cart');
  var username = req.user.username;
  if(username == null){
    res.redirect('/login');
  }
  product_collection.findOne({_id : req.params.id}, function(err,product){
    if(err) throw err;
    cart_collection.update({ username: username},
      {
        $push : {
          products : {
            _id: product._id,
            name: product.name,
            volume: product.volume,
            type: product.type,
            price: product.price,
            img: product.img,
            desc: product.desc,
            qty:1
          }
        }
      }, function(err, cart){
          if (err) throw err;
          console.log("Item added to cart")
          res.redirect('/cart');
      });
  });
});

//checkout
router.get('/checkout/:username', function(req,res){
  res.render('checkout',{user : req.user});
});

//payment
router.post('/payment/:username', function(req,res) {
  var cart_collection = db.get('Cart');
  var order_collection = db.get('Order');
  var address = req.body.address;
  var username = req.params.username;
  cart_collection.findOne({username: username}, function(err, cart){
    if (err) throw err;
    var userCart = cart.products;
    var orderItems = [];
    for(var i=0;i<userCart.length;i++){
      orderItems.push(userCart[i]);
    }
    console.log(userCart);
    order_collection.insert({
      username: username,
      date: Date.now(),
      address: address,
      order: orderItems
    }, function(err,order){
      if(err) throw err;
      alert("Order placed successfully");
      cart_collection.findOneAndUpdate({ username: username},
        {
          $pull : {
            products : {}
          }
        }, function(err, cart){
          if (err) throw err;
          console.log("Cart empty");
      });
      res.redirect('/');
    });
  });
});

//delete product from cart
router.post('/cart/:id/delete', function(req, res){
  var cart_collection = db.get('Cart');
  cart_collection.findOneAndUpdate({ username: req.user.username},
    {
      $pull : {
        products : {
          _id: req.params.id
        }
      }
    }, function(err, cart){
      if (err) throw err;
      console.log("Item deleted from cart");
      res.redirect('/cart');
  });
});

//search
router.get('/search', function(req,res){
  var product_collection = db.get('Product'); 
  var search = req.body.search;
  product_collection.find({tag: search, isDeleted : false}, function(err,products){
    if(err) throw err;
    res.render('productlist',{user : req.user, results : products});
  });
});

module.exports = router;
