<template lang="html">
  <div>
    <nav-header></nav-header>
    <nav-bread>
      <span>My Order</span>
    </nav-bread>
    <!-- <svg style="position: absolute; width: 0; height: 0; overflow: hidden;" version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink">
    </svg> -->
    <div class="container">
      <div class="checkout-order">
        <div class="page-title-normal">
          <h2 class="page-title-h2"><span>check out</span></h2>
        </div>
        <!-- process step -->
        <div class="check-step">
          <ul>
            <li class="cur"><span>Confirm</span> address</li>
            <li class="cur"><span>View your</span> order</li>
            <li><span>Make</span> payment</li>
            <li><span>Order</span> confirmation</li>
          </ul>
        </div>

        <!-- order list -->
        <div class="page-title-normal checkout-title">
          <h2><span>Order content</span></h2>
        </div>
        <div class="item-list-wrap confirm-item-list-wrap">
          <div class="cart-item order-item">
            <div class="cart-item-head">
              <ul>
                <li>Order contents</li>
                <li>Price</li>
                <li>Quantity</li>
                <li>Subtotal</li>
              </ul>
            </div>
            <ul class="cart-item-list">
              <li v-for="item in cartList">
                <div class="cart-tab-1">
                  <div class="cart-item-pic">
                    <img v-bind:src="'static/img/' + item.productImage" alt="">
                  </div>
                  <div class="cart-item-title">
                    <div class="item-name">{{item.productName}}</div>

                  </div>
                </div>
                <div class="cart-tab-2">
                  <div class="item-price">{{item.salePrice}}</div>
                </div>
                <div class="cart-tab-3">
                  <div class="item-quantity">
                    <div class="select-self">
                      <div class="select-self-area">
                        <span class="select-ipt">x {{item.productNum}}</span>
                      </div>
                    </div>
                    <div class="item-stock item-stock-no">In Stock</div>
                  </div>
                </div>
                <div class="cart-tab-4">
                  <div class="item-price-total">${{item.productNum * item.salePrice}}</div>
                </div>
              </li>
            </ul>
          </div>
        </div>

        <!-- Price count -->
        <div class="price-count-wrap" >
          <div class="price-count">
            <ul>
              <li>
                <span>Item subtotal:</span>
                <span>${{subtotal}}</span>
              </li>
              <li>
                <span>Shipping:</span>
                <span>${{shipping}}</span>
              </li>
              <li>
                <span>Discount:</span>
                <span>${{discount}}</span>
              </li>
              <li>
                <span>Tax:</span>
                <span>${{tax}}</span>
              </li>
              <li class="order-total-price">
                <span>Order total:</span>
                <span>${{total}}</span>
              </li>
            </ul>
          </div>
        </div>

        <div class="order-foot-wrap">
          <div class="prev-btn-wrap">
            <router-link to="address" class="btn btn--m">Previous</router-link>
          </div>
          <div class="next-btn-wrap"  @click="payment">
            <router-link class="btn btn--m btn--red" :to="{'path': 'orderSuccess', 'query': {orderId: orderId}}">Proceed to payment</router-link>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import './../assets/css/base.css'
import './../assets/css/product.css'
import './../assets/css/login.css'
import './../assets/css/checkout.css'
import NavHeader from '@/components/NavHeader.vue'
import NavFooter from '@/components/NavFooter.vue'
import NavBread from '@/components/NavBread.vue'
import Modal from '@/components/Modal.vue'
import axios from 'axios'


export default {
  data() {
    return {
      cartList: [],
      subtotal: 0,
      shipping: 0,
      discount: 20,
      tax: 10,
      total: 0,
      orderId: ''
    }
  },
  mounted() {
    this.init()
  },
  methods: {
    init() {
      // 加载商品数据
      axios.get('/users/cartList').then((response) => {
        let res = response.data
        if (res.status === '0') {
          var result = res.result
          result.forEach((item) => {
            if (item.checked === '1') {
              this.cartList.push(item)
              this.subtotal += item.salePrice * item.productNum
            }
          })
          this.total = this.subtotal + this.shipping - this.discount + this.tax
        }
      })
    },
    shot() {
      console.log('shot')
    },
    payment() {
      // 创建订单
      console.log('payment start')
      var addressId = this.$route.query.addressId

      axios.post('/users/payment', {
        addressId: addressId,
        total: this.total
      }).then((response) => {
        let res = response.data
        if (res.status === '0') {
          console.log('创建订单成功')
          // 获取相应的参数
          this.orderId = res.result.orderId
          console.log('this.orderId1: ' + this.orderId)
        }
      })
    }
  },
  components: {
    'NavHeader': NavHeader,
    'NavFooter': NavFooter,
    'NavBread': NavBread,
    'Modal': Modal
  }
}
</script>

<style lang="css">
</style>
