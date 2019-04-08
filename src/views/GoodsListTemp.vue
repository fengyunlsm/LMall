<template lang="html">
  <div class="">
    这是商品列表页面<br>
    <router-link to='/goods/title'>标题</router-link>
    <router-link to='/goods/image'>图片</router-link>
    <div>
      <router-view></router-view>
    </div>
    <router-link to="/cart">购物车</router-link>
    <button @click="jump">购物车按钮</button>
    <router-link v-bind:to="{ name: 'cart', params: {cartId: 123} }">命名路由</router-link>
  </div>
</template>

<script>
export default {
  data () {
    return {
      msg: 'hello vue'
    }
  },
  methods: {
    jump () {
      console.log('click')
      // this.$router.push({path: "/cart?goodId=123"})
      this.$router.go(-2) // 后退两步
    }
  }
}
</script>

<style lang="css">
</style>
