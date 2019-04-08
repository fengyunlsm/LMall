<template lang="html">
<div>
  <nav-header></nav-header>
  <nav-bread>
    <span>My cart</span>
  </nav-bread>
  <svg style="position: absolute; width: 0; height: 0; overflow: hidden;" version="1.1"
     xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink">
   </svg>
   <div class="container">
  <div class="cart">
    <div class="page-title-normal">
      <h2 class="page-title-h2"><span>My Cart</span></h2>
    </div>
    <div class="item-list-wrap">
      <div class="cart-item">
        <div class="cart-item-head">
          <ul>
            <li>Items</li>
            <li>Price</li>
            <li>Quantity</li>
            <li>Subtotal</li>
            <li>Edit</li>
          </ul>
        </div>
        <ul class="cart-item-list">
          <li v-for="item in cartList">
            <div class="cart-tab-1">
              <div class="cart-item-check" >
                <a href="javascipt:;" class="checkbox-btn item-check-btn" :class="{'check': item.checked == '1'}" @click="editCart('check', item)">
                  <svg class="icon icon-ok">
                    <use xlink:href="#icon-ok"></use>
                  </svg>
                </a>
              </div>
              <div class="cart-item-pic">
                <img v-bind:src="'static/img/' + item.productImage">
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
                <div class="select-self select-self-open">
                  <div class="select-self-area">
                    <a class="input-sub" @click="editCart('minus', item)">-</a>
                    <span class="select-ipt">{{item.productNum}}</span>
                    <a class="input-add" @click="editCart('add', item)">+</a>
                  </div>
                </div>
              </div>
            </div>
            <div class="cart-tab-4">
              <div class="item-price-total">100</div>
            </div>
            <div class="cart-tab-5"  @click="showModal(item.productId)">
              <div class="cart-item-opration">
                <a href="javascript:;" class="item-edit-btn">
                  <svg class="icon icon-del">
                    <use xlink:href="#icon-del"></use>
                  </svg>del
                </a>
              </div>
            </div>
          </li>
        </ul>
      </div>
    </div>
    <div class="cart-foot-wrap">
      <div class="cart-foot-inner">
        <div class="cart-foot-l">
          <div class="item-all-check" @click="checkAllToggle" >
            <a href="javascipt:;">
              <span class="checkbox-btn item-check-btn" v-bind:class="{'check': this.checkAllFlag === true}">
                  <svg class="icon icon-ok"><use xlink:href="#icon-ok"/></svg>
              </span>
              <span>Select all</span>
            </a>
          </div>
        </div>
        <div class="cart-foot-r">
          <div class="item-total">
            Item total: <span class="total-price">{{totalPrice}}</span>
          </div>
          <div class="btn-wrap">
            <a class="btn btn--red" :class="{'btn--dis': hasCheckedCount === 0}" @click="checkout">Checkout</a>
          </div>
        </div>
      </div>
    </div>
  </div>
</div>
<modal v-bind:confirmModalFlag="confirmModal" v-on:close="closeConfirmModal">
  <p slot="message" >
    确认是否删除该商品!
  </p>
  <div slot="btnGroup">
    <a href="javascipt:;" class="btn btn--m" @click="delCart">确认</a>
    <a href="javascipt:;" class="btn btn--m" @click="confirmModal=false">关闭</a>
  </div>
</modal>
<nav-footer></nav-footer>
</div>
</template>

<script>
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
      confirmModal: false,
      productId: ''
    }
  },
  mounted() {
    this.init()
  },
  computed: {
    checkAllFlag() {
      // 计算属性 or 实时计算这两个属性来进行计算
      // 实时计算的一种属性
      // console.log('this.equal: ' + this.equal)
      return this.equal
    },
    equal() {
      if (this.cartList.length === this.hasCheckedCount) {
        return true
      } else {
        return false
      }
    },
    hasCheckedCount() {
      var count = 0
      this.cartList.forEach((item) => {
        if (item.checked === '1') {
          count += 1
        }
      })
      return count
    },
    totalPrice() {
      // 实时计算总价
      // console.log('计算价格')
      var total = 0
      this.cartList.forEach((item) => {
        if (item.checked === '1') {
          var salePrice = Number(item.salePrice)
          total = salePrice * item.productNum + total
        }
        console.log('total price: ' + total)
      })
      return total
    }
  },
  methods: {
    init() {
      axios.get('/users/cartList').then((response) => {
        let res = response.data
        if (res.status === '0') {
          console.log('查看购物车')
          this.cartList = res.result
          var totalCartCount = 0
          this.cartList.forEach((item) => {
            totalCartCount += item.productNum
          })
          this.$store.commit('initCartCount', totalCartCount)
        } else {
          // 查看购物车
          console.log('查看购物车失败')
        }
      })
    },
    checkout() {
      // 结算时，能否跳转到地址页面
      if (this.hasCheckedCount === 0) {
        // 不能跳转到地址页面
        // 提示，暂时还没做好
      } else {
        // 跳转到地址页面
        this.$router.push({
          path: '/address'
        })
      }
    },
    editCartCount(productNum, check, item) {
      console.log('edit cart')
      axios.post('/users/cart/edit', {
        productNum: productNum,
        checked: check,
        productId: item.productId
      }).then((response) => {
        let res = response.data
        if (res.status === '0') {
          console.log('init success')
          this.init()
        }
      })
    },
    checkAllToggle() {
      // 功能: 全选切换
      var checkAllFlag = (this.checkAllFlag === false? true : false)
      console.log('start checkAlltoglle')
      axios.post('/users/cart/checkAllToggle', {
        checkAll: checkAllFlag
      }).then((response) => {
        let res = response.data
        if (res.status === '0') {
          this.checkAllFlag = checkAllFlag
          this.init()
          console.log('this.checkAllFlag: ' +  this.checkAllFlag)
        }
      })
    },
    editCart(type, item) {
      if (type === 'check') {
        // 检查是否已勾选
        var check = (item.checked == '1' ? '0':'1')
        var productNum = item.productNum
        console.log(check)
      } else if (type === 'minus') {
        // item.productNum --
        var productNum = item.productNum - 1
        var check = item.checked
      } else if (type === 'add') {
        // item.productNum ++
        var productNum = item.productNum + 1
        var check = item.checked
        console.log(productNum)
      } else {
          console.log('error')
      }
      this.editCartCount(productNum, check, item)
    },
    closeConfirmModal() {
      // 关闭模态弹窗
      this.confirmModal = false
    },
    showModal(productId) {
      console.log('showModal')
      this.confirmModal = true
      this.productId = productId
      console.log('showModal: ' + this.confimModal)
    },
    delCart() {
      axios.post('/users/cart/del', {
        productId: this.productId
      }).then((response) => {
        let res = response.data
        if (res.status === '0') {
          this.init()
          this.confirmModal = false
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

<style>
  .input-sub,.input-add{
    min-width: 40px;
    height: 100%;
    border: 0;
    color: #605F5F;
    text-align: center;
    font-size: 16px;
    overflow: hidden;
    display: inline-block;
    background: #f0f0f0;
  }
  .item-quantity .select-self-area{
    background:none;
    border: 1px solid #f0f0f0;
  }
  .item-quantity .select-self-area .select-ipt{
    display: inline-block;
    padding:0 3px;
    width: 30px;
    min-width: 30px;
    text-align: center;
  }
</style>
