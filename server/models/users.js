/**
 * Created by issuser on 2019/2/17 0017.
 */
var mongoose = require('mongoose')
var Schema = mongoose.Schema

var userSchema = new Schema({
  "userId": String,
  "userName": String,
  "userPwd": String,
  "orderList": Array,
  "cartList": [
    {
      "productImage": String,
      "salePrice": String,
      "productId": String,
      "productNum": Number,
      "checked": String,
      "productName": String
    }
  ],
  "addressList": [{
    "addressId": String,
    "userName": String,
    "streetName": String,
    "postCode":Number,
    "tel": Number,
    "isDefault": Boolean
  }]
})

module.exports = mongoose.model('User', userSchema, 'user')
