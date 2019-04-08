import Vue from 'vue'
import Router from 'vue-router'
import HelloWorld from '@/components/HelloWorld'
import GoodsList from '@/views/GoodsList'
import GoodsListTemp from '@/views/GoodsListTemp'
import Title from '@/views/Title'
import Cart from '@/views/Cart'
import Address from '@/views/Address'
import OrderConfirm from '@/views/orderConfirm'
import OrderSuccess from '@/views/orderSuccess'

Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/goods',
      name: 'GoodsListTemp',
      component: GoodsListTemp
    },
    {
      path: '/',
      name: 'GoodsList',
      component: GoodsList
    },
    {
      path: '/cart',
      name: 'Cart',
      component: Cart
    },
    {
      path: '/address',
      name: 'Address',
      component: Address
    },
    {
      path: '/orderConfirm',
      name: 'orderConfirm',
      component: OrderConfirm
    },
    {
      path: '/orderSuccess',
      name: 'orderSuccess',
      component: OrderSuccess
    }
  ]
})
