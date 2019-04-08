var express = require('express')
var router = express.Router()
var mongoose = require("mongoose")
var Goods = require('../models/goods')
var Users = require('../models/users')

// 连接数据库
mongoose.connect('mongodb://127.0.0.1:27017/db_demo')

mongoose.connection.on('connected', function() {
  console.log("MongoDB connected success.")
})
mongoose.connection.on('error', function() {
  console.log("MongoDB connected error.")
})
mongoose.connection.on('disconnected', function() {
  console.log("MongoDB connected disconnected.")
})

router.get("/list", function (req, res, next) {
  // find 的第一个参数查询条件
  console.log('sort start')
  let page = req.param("page")
  let pageSize = parseInt(req.param("pageSize"))
  let sort = req.param("sort")
  let skip = (page - 1) * pageSize
  let priceLevel = req.param("priceLevel")
  let params = {}
  if (priceLevel != 'all') {
    var minprice = 0
    var maxprice = 0
    switch (priceLevel) {

      case '0':
        minprice = 0, maxprice = 500
        break
      case '1':
        minprice = 500, maxprice = 1000
         break
      case '2':
        minprice = 1000, maxprice = 1500
        break
      case '3':
        minprice = 1500, maxprice = 2000
        break
    }
    params = {
      salePrice: {
        $gt: parseInt(minprice),
        $lte: parseInt(maxprice)
      }
    }
  } else {
    params = {}
  }
  let goodsModel = Goods.find(params).skip(skip).limit(pageSize)

  goodsModel.sort({'salePrice': sort})
  goodsModel.exec((err, doc) => {
    if (err) {
      res.json({
        status:'1',
        msg: err.message
      })
    } else {
      res.json({
        status: '0',
        msg: '',
        result: {
          count: doc.length,
          list: doc
        }
      })
    }
  })
})

function save(userDoc, res) {
  userDoc.save(function (err1, doc1) {
    if (err1) {
      res.json ({
        status: "1",
        msg: err1.message
      })
    } else {
      console.log('save successfully')
      res.json ({
        status: "0",
        msg: '',
        result: 'success'
      })
    }
  })
}

function addShopToCart (userDoc, res) {
  // 将商品添加到购物车
  Goods.findOne({productId: productId}, function(err0, goodsDoc) {
    goodsDoc.productNum = 1
    goodsDoc.checked = '1'
    userDoc.cartList.push(goodsDoc)  // 将商品加入购物车
    save(userDoc, res)  // 保存文档
  })
}

function changeShopCount (userDoc, item, res) {
  // 修改商品数量
  item.productNum = item.productNum + 1
  console.log('item: ' + item.productNum)
  save(userDoc, res)
}

function hasProduct (cartList) {
  var hasProductFlag = false
  for (var i = 0; i < cartList.length; i++) {
    var item = cartList[i]
    if (item.productId === productId) {
      hasProductFlag = true
    }
  }
  return hasProductFlag
}

function getProduct(cartList) {
  // 功能: 获取商品
  for (var i = 0; i < cartList.length; i++) {
    var item = cartList[i]
    if (item.productId === productId) {
      return item
    }
  }
}

router.post("/addCart", function (req, res, next) {
  // 功能： 将商品加入购物车
  // 功能一：如果用户存在，则将商品加入到购物车当中
  // 如果用户不存在，则报错
  // 功能二：如果商品相同，则只修改商品数量。
  // 如果商品不一样，则插入到数据库当中
  userId = String(req.cookies.userId)
  console.log(userId)
  productId = req.body.productId
  console.log('start addCart')
  Users.findOne({userId: userId}, function (err, userDoc) {
    if (err) {
      res.json ({
        status: "1",
        msg: err.message
      })
    } else {
      if (userDoc) {
        var cartList = userDoc.cartList
        if (hasProduct(cartList)) {
          // 如果购物车上存在该商品，修改商品的数量
          var item = getProduct(cartList)
          debugger
          changeShopCount(userDoc, item, res)
        } else {
          debugger
          // 如果购物车上不存在该商品,将商品添加的购物车
          addShopToCart(userDoc, res)
        }
      } else {
        res.json ({
          status: '0',
          msg: 'user is not exit',
          result: ''
        })
      }
    }
  })
})
module.exports = router
