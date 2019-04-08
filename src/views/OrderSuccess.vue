<template lang="html">
  <div>
    <nav-header></nav-header>
    <div class="nav-breadcrumb-wrap" >
      <div class="container">
        <nav-bread slot="two">Goods</nav-bread>
      </div>
    </div>
    <div class="container">
      <div class="page-title-normal">
        <h2 class="page-title-h2"><span>check out</span></h2>
      </div>
      <!-- 进度条 -->
      <div class="check-step">
        <ul>
          <li class="cur"><span>Confirm</span> address</li>
          <li class="cur"><span>View your</span> order</li>
          <li class="cur"><span>Make</span> payment</li>
          <li class="cur"><span>Order</span> confirmation</li>
        </ul>
      </div>

      <div class="order-create">
        <div class="order-create-pic"><img src="static/img/ok-2.png" alt=""></div>
        <div class="order-create-main">
          <h3>Congratulations! <br>Your order is under processing!</h3>
          <p>
            <span>Order ID：{{orderId}}</span>
            <span>Order total：{{orderTotal}}</span>
          </p>
          <div class="order-create-btn-wrap">
            <div class="btn-l-wrap">
              <router-link href="javascript:;" class="btn btn--m" to="/cart">Cart List</router-link>
            </div>
            <div class="btn-r-wrap">
              <router-link href="javascript:;" class="btn btn--m" to="/">Goods List</router-link>
            </div>
          </div>
        </div>
      </div>
    </div>
    <nav-footer></nav-footer>
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
  data () {
    return {
      orderTotal: '',
      orderId: ''
    }
  },
  mounted() {
    this.init()
  },
  methods: {
    init() {
      // var orderId = this.$route.query.orderId
      var orderId = '6225201904051714168'
      axios.get('/users/orderDetail', {
        params: {
          orderId: orderId
        }
      }).then((response) => {
          let res = response.data
          if (res.status === '0') {
            this.orderTotal = res.result.orderTotal
            this.orderId = res.result.orderId
            console.log('this.orderTotal: ' + this.orderTotal)
            console.log('this.orderId: ' + this.orderId)
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
