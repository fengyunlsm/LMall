<template lang="html">
  <div>
    <nav-header></nav-header>
    <div class="nav-breadcrumb-wrap" >
      <div class="container">
        <nav-bread slot="two">Goods</nav-bread>
      </div>
    </div>
    <div class="accessory-result-page accessory-page">
      <div class="container">
        <div class="filter-nav">
          <span class="sortby">Sort by:</span>
          <a href="javascript:void(0)" @click="getGoodsList(1)" class="default cur">Default</a>
          <a href="javascript:void(0)" @click="sortGoodsList()" class="price">Price
            <svg class="icon icon-arrow-short" v-bind:class="{'sort-up':!sortFlag }">
            <use xlink:href="#icon-arrow-short"></use></svg></a>
          <a href="javascript:void(0)" class="filterby stopPop" @click="showFilterPop">Filter by</a>
        </div>
        <div class="accessory-result">
          <!-- filter -->
          <div class="filter stopPop" id="filter" :class="{'filterby-show': filterBy}" >
            <dl class="filter-price" @click="closePane()">
              <dt>Price:</dt>
              <dd><a href="javascript:void(0)" :class="{'cur': priceListIndex === 'all'}" @click="setDefaultPriceList()">All</a></dd>
              <dd v-for="(item, index) in priceList">
                <a href="javascript:void(0)" @click="setPriceList(index)" :class="{'cur': priceListIndex === index}">{{item.startPrice}} - {{item.endPrice}}</a>
              </dd>
            </dl>
          </div>

          <!-- search result accessories list -->
          <div class="accessory-list-wrap">
            <div class="accessory-list col-4">
              <ul>
                <li v-for="(item, index) in goodsList">
                  <div class="pic">
                    <a href="#"><img v-lazy="'/static/img/' + item.productImage" :key="'/static/img/' + item.productImage"></a>
                  </div>
                  <div class="main">
                    <div class="name">{{item.productName}}</div>
                    <div class="price">{{item.salePrice}}</div>
                    <div class="btn-area">
                      <a href="javascript:;" class="btn btn--m" @click="addCart(item.productId)">加入购物车</a>
                    </div>
                  </div>
                </li>
              </ul>
              <div v-infinite-scroll="loadMore" infinite-scroll-disabled="busy" infinite-scroll-distance="10">
                  <img src="/static/loading/loading-balls.svg" v-show="this.loading">
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    <modal v-bind:mdShow="mdShow" v-on:close="closeModal">
      <p slot="message" >
        请先登录，否则无法加入购物车!
      </p>
      <div slot="btnGroup">
        <a class="btn btn--m" @click="closeModal">关闭</a>
      </div>
    </modal>
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
      goodsList: [],
      priceList: [
        {
          startPrice: '0.00',
          endPrice: '500.00'
        },
        {
          startPrice: '500.00',
          endPrice: '1000.00'
        },
        {
          startPrice: '1000.00',
          endPrice: '1500.00'
        },
        {
          startPrice: '1500.00',
          endPrice: '2000.00'
        }
      ],
      priceListIndex: 'all',
      filterBy: false,
      overLayFlag: false,
      sortFlag: true,
      page: 1,
      pageSize: 8,
      busy: false,
      loading: true,
      mdShow: false
    }
  },
  created () {
    this.getGoodsList()
  },
  methods: {
    loadMore () {
      this.busy = true  // 禁止加载
      this.loading = false
      setTimeout(() => {
        this.page = this.page + 1
        this.getGoodsList()
      }, 1000)
    },
    getGoodsList () {
      let flag = this.sortFlag ? 1 : -1
      let param = {
        page: this.page,
        pageSize: this.pageSize,
        sort: flag,
        priceLevel: this.priceListIndex
      }
      this.loading = true
      axios.get("/goods/list", {
        params: param
      }).then((res) => {
        length = res.data.result.list.length
        if (length < this.pageSize) {
          console.log('page start: ', this.page)
          console.log('禁止加载')
          this.goodsList = this.goodsList.concat(res.data.result.list)
          this.busy = true
          this.loading = false
        } else {
          this.goodsList = this.goodsList.concat(res.data.result.list)
          this.busy = false
          this.loading = false
        }
      })
    },
    addCart (productId) {
      // 功能: 将商品加入到购物车
      axios.post("/goods/addCart", {
        productId: productId
      }).then ((response) => {
        let res = response.data
        if (res.status === '0') {
          alert ("加入成功")
          this.$store.commit('updateCartCount', 1)
        } else {
          this.mdShow = true
          console.log(this.mdShow)
        }
      })
    },
    sortGoodsList () {
      // 点击price 按钮，商品列表进行排序
      // 即使从第二页，也是要从第一页开始请求
      // 改变状态(先按照升序进行排序)，再重新进行请求

      if (this.sortFlag === true) {
        this.sortFlag = false
      } else {
        this.sortFlag = true
      }
      this.getGoodsList()
    },
    setPriceList (index) {
      // 设置价格的
      this.priceListIndex = index
      this.page = 1
      this.goodsList = []
      this.getGoodsList()
    },
    showFilterPop () {
      // 显示价格区间 和 面板
      this.filterBy = true,
      this.overLayFlag = true
    },
    closePane () {
      this.filterBy = false,
      this.overLayFlag = false
    },
    setDefaultPriceList () {
      this.priceListIndex = 'all'
      this.sortFlag = true
      this.getGoodsList()
    },
    closeModal () {
      console.log('cccc')
      this.mdShow = false
    }
  },
  components: {
    'NavHeader': NavHeader,
    'NavFooter': NavFooter,
    'NavBread': NavBread,
    'Modal': Modal
  },
  mounted: function () {

  }
}
</script>

<style>
</style>
