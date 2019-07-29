<template lang="html">
<div>
  <div class="md-modal modal-msg md-modal-transition" v-bind:class="{'md-show': confirmModalFlag || loginModalFlag || mdShow}">
    <div class="md-modal-inner">
      <div class="md-top">
        <slot name="title"></slot>
        <button class="md-close" @click="closeModal" >Close</button>
      </div>
      <div class="md-content">
        <div class="confirm-tips">
            <slot name="message"></slot>
        </div>
        <div class="btn-wrap">
            <slot name="btnGroup"></slot>
        </div>
      </div>
    </div>
  </div>
  <div class="md-overlay" v-if="mdShow || loginModalFlag || confirmModalFlag" @click="closeModal()"></div>
</div>
</template>

<script>
  export default {
    props: ["mdShow", "loginModalFlag", "confirmModalFlag"],
    methods: {
      closeModal () {
        // 功能： 将模态框设置回默认值
        console.log('close Modal')
        this.$emit('closes')
      },
      closeLoginModal () {
        console.log('close login Modal')
        this.$emit('closes')    // 实际上不一样
      }
    }
  }
</script>

<style lang="css">
</style>
