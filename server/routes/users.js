var express = require('express');
var router = express.Router();
var Users = require('../models/users');
var mongoose = require("mongoose");
var Goods = require('../models/goods')
var Format = require('../util/util')


router.get('/', function (req, res, next) {
  res.send('response with a resource')
})

router.post('/login', function(req, res, next) {
  // 功能： 登录
  // 描述：查询账号密码是否正确，如果正确，则返回用户名; 如果不正确，则用户不存在
  console.log('login successfully')
  debugger

  var param = {
    userName: req.body.userName,
    userPwd: req.body.userPwd
  }

  // console.log('userName: ' + userName + ' ' + 'userPwd: ' + userPwd)
  Users.findOne(param, function(err, userDoc) {
    if (err) {
      res.json({
        status: '1',
        msg: err.message
      })
    } else {
      if (userDoc) {
        res.cookie('userId', userDoc.userId, {
          path: '/',
          maxAge: 60*1000*60
        })
        res.cookie('userName', userDoc.userName, {
          path: '/',
          maxAge: 60*1000*60
        })
        res.json({
          status: '0',
          msg: '',
          result: {
            userName: userDoc.userName
          }
        })
      } else {
        res.json ({
          status: '2',
          msg: 'user is not exist'
        })
      }
    }
  })
})

router.get('/logout', function(req, res, next) {
  debugger
  // 功能：退出登录
  // 描述: cookies 清空
  res.cookie('userId', '', {
    path: '/',
    maxAge: -1
  })
  res.json({
    status: '0',
    msg: '',
    result: ''
  })
})

router.get('/checkLogin', function(req, res, next) {
  debugger
  // 功能: 刷新之后还能显示登录的用户信息
  // 描述： 获取cookies 中的用户信息并返回；
  if (req.cookies.userId) {
    res.json({
      status: '0',
      msg: '',
      result: req.cookies.userName || ''
    })
  } else {
    res.json ({
      status: '1',
      msg: '未登录',
      result: ''
    })
  }
})

router.get('/cartList', function(req, res, next) {
  console.log('start lookup cartList')
  userId = String(req.cookies.userId)
  Users.findOne({userId: userId}, function(err, userDoc) {
    // 如果
    if (err) {
      res.json({
        status: '1',
        msg: err.message,
        result: ''
      })
    } else {
      if (userDoc) {
        res.json({
          status: '0',
          msg: '',
          result: userDoc.cartList
        })
      } else {
        res.json({
          status: '1',
          msg: '未登录',
          result: ''
        })
      }
    }
  })
})

function delCart(res, userId, productId) {
  // 删除购物车上的商品
  console.log('del productId:' + productId)
  Users.update({
    userId: userId
  },
  {
    // 使用$pull
    $pull: {
      cartList: {
        productId: productId
      }
    }
  }, (err, goodDoc) => {
    if (err) {
      res.json({
        status: '1',
        msg: err.message,
        result: ''
      })
    } else {
      if (goodDoc) {
        // 如果商品存在的话
        res.json({
          status: '0',
          msg: '删除成功',
          result: ''
        })
      }
    }
  }
)
}

router.post('/cart/del', function(req, res, next) {
  console.log('start del cart')
  userId = req.cookies.userId
  productId = req.body.productId
  Users.findOne({userId: userId}, function(err, userDoc) {
    if (err) {
      res.json({
        status: '1',
        msg: err.message,
        result: ''
      })
    } else {
      if (userDoc) {
        // 删除购物车上的某件商品
        // 将什么传进去比较好
        delCart(res, userId, productId)
      } else {
        res.json({
          status: '0',
          msg: '未登录',
          result: ''
        })
      }
    }

  })
})

router.post('/cart/edit', function(req, res, next) {
  console.log('edit cart')
  var userId = req.cookies.userId
  var productId = req.body.productId
  var checked = req.body.checked
  var productNum = req.body.productNum
  console.log('checked: ' + checked)
  Users.update({"userId": userId, "cartList.productId": productId},
    {
      "cartList.$.productNum": productNum,
      "cartList.$.checked": checked
    },
    function(err, userDoc) {
    if (err) {
      res.json({
        status: '1',
        msg: err.message,
        result: ''
      })
    } else {
      console.log('has not err')
      if (userDoc) {
        // 删除购物车上的某件商品
        // 将什么传进去比较好
        res.json({
          status: '0',
          msg: 'suc',
          result: ''
        })
      }
    }
  })
})

router.post('/cart/checkAllToggle', function(req, res, next) {
  var checkAll = (req.body.checkAll === true? '1':'0')
  var userId = req.cookies.userId
  console.log('start check all toggle')
  Users.findOne({'userId': userId}, function(err, userDoc) {
    if (err) {
      res.json({
        status: '1',
        msg: err.message,
        result: ''
      })
    } else {
      if (userDoc) {
        userDoc.cartList.forEach((item) => {
          item.checked = checkAll
          console.log(item.checked)
        })
        userDoc.save((err1, doc) => {
          if (err1) {
            res.json({
              status: '1',
              msg: err1.message,
              result: ''
            })
          } else {
            res.json({
              status: '0',
              msg: '',
              result: 'suc'
            })
          }
        })
      } else {
        res.json({
          status: '1',
          msg: '',
          result: ''
        })
      }
    }
  })
})

router.get('/addressList', function(req, res, next) {
  // 查询出对应用户的所有地址
  var userId = req.cookies.userId
  Users.findOne({'userId': userId}, (err, userDoc) => {
    if (err) {
      res.json({
        status: '1',
        msg: err.message,
        result: ''
      })
    } else {
      if (userDoc) {
        res.json({
          status: '0',
          msg: '',
          result: userDoc.addressList
        })
      }
    }
  })
})

router.post('/setDefaultAddress', function(req, res, next) {
  // 设置默认地址
  var userId = req.cookies.userId
  var addressId = req.body.addressId
  console.log('start set default address')
  Users.findOne({'userId': userId}, function(err, userDoc) {
    if (err) {
      res.json({
        status: '1',
        msg: err.message,
        result: ''
      })
    } else {
      var addressList = userDoc.addressList
      addressList.forEach((item) => {
        if (item.addressId === addressId) {
          // 设置默认地址
          item.isDefault = true
        } else {
          item.isDefault = false
        }
      })
    }
    userDoc.save((err1, doc) => {
      if (err1) {
        res.json({
          status: '1',
          msg: err.message,
          result: ''
        })
      } else {
        res.json({
          status: '0',
          msg: '',
          result: ''
        })
      }
    })
  })
})

router.post('/delAddress', function(req, res, next) {
  // 删除地址
  var userId = req.cookies.userId
  var addressId = req.body.addressId
  Users.findOne({"userId": userId}, (err, userDoc) => {
    if (err) {
      res.json({
        status: '1',
        msg: err.message,
        result: ''
      })
    } else {
      Users.update({
        userId: userId
      },
      {
        // 使用$pull
        $pull: {
          addressList: {
            addressId: addressId
          }
        }
      }, (err1, Doc) => {
        if (err1) {
          res.json({
            status: '1',
            msg: err1.message,
            result: ''
          })
        } else {
          if (Doc) {
            // 如果商品存在的话
            res.json({
              status: '0',
              msg: '删除成功',
              result: ''
            })
          }
        }
      }
    )
  }
  })
})

router.post('/payment', function(req, res, next) {
  // 创建订单
  var userId = req.cookies.userId
  var addressId = req.body.addressId
  var total = req.body.total
  console.log('payment start')
  Users.findOne({"userId": userId}, (err, userDoc) => {
    if (err) {
      res.json({
        status: '1',
        msg: err.message,
        result: ''
      })
    } else {
      // 获取地址信息
      var addressInfo = function () {
        var newItem = []
        userDoc.addressList.forEach((item) => {
          if (item.addressId === addressId) {
            newItem.push(item)
          }
        })
        return newItem
      }

      // 获取结算的商品
      var goodsList = function () {
        var goods = []
        userDoc.cartList.forEach((item) => {
         if (item.checked === '1') {
           goods.push(item)
         }
       })
       console.log('goodsList: ' + goods)
       return goods
      }

      // 日期
      var platform = '622'
      var r1 = Math.floor(Math.random()*10)
      var r2 = Math.floor(Math.random()*10)

      var sysDate = new Date().Format('yyyyMMddhhmmss')
      var createDate = new Date().Format('yyyy-MM-dd hh:mm:ss')

      var orderId = platform + r1 + sysDate + r2

      // 订单详细信息
      var order = {
        orderId: orderId,
        orderTotal: total,
        addressInfo: addressInfo(),
        goodsList: goodsList(),
        orderSatus: '1',
        createDate: createDate
      }

      userDoc.orderList.push(order)
      userDoc.save((err1, doc) => {
        if (err1) {
          res.json({
            status: '1',
            msg: err.message,
            result: ''
          })
        } else {
          res.json({
            status: '0',
            msg: 'suc',
            result: {
              orderId: orderId,
              orderTotal: total,
            }
          })
        }
      })
    }
  })
})

router.get('/orderDetail', function(req, res, next) {
  var orderId = req.param('orderId')
  var userId = req.cookies.userId
  console.log('recive data: ' + orderId)
  Users.findOne({userId: userId}, (err, userDoc) => {
    if (err) {
      res.json({
        status: '1',
        msg: err.message,
        result: ''
      })
    } else {
      // 判断有没有此订单
      // 如果有的话，则----， 如果没有的话，则---
      var orderTotal = ''
      userDoc.orderList.forEach((item) => {
        if (item.orderId === orderId) {
          // 如果订单号相同的话
          orderTotal = item.orderTotal
        }
      })
      if (orderId === '') {
        res.json({
          status: '10001',
          msg: '无此订单号',
          result: ''
        })
      } else {
        res.json({
          status: '0',
          msg: '',
          result: {
            orderId: orderId,
            orderTotal: orderTotal
          }
        })
      }
    }
  })
})

router.get('/cartCount', function(req, res, next) {
  // 获取购物车商品数量
  var userId = req.cookies.userId
  Users.findOne({userId: userId}, (err, userDoc) => {
    if (err) {
      res.json ({
        status: '1',
        msg: err.message,
        result: ''
      })
    } else {
        var totalCount = 0
        userDoc.cartList.forEach((item) => {
          totalCount += item.productNum
        })
        res.json ({
          status: '0',
          msg: '',
          result: totalCount
        })
    }
  })
})
module.exports = router
