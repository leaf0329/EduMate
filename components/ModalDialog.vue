<template>
  <view class="modal-overlay" v-if="visible" @tap="onOverlayTap">
    <view class="modal-content" @tap.stop>
      <slot></slot>
    </view>
  </view>
</template>

<script>
export default {
  name: "ModalDialog",
  props: {
    visible: { type: Boolean, default: false }
  },
  emits: ["update:visible"],
  methods: {
    onOverlayTap() {
      // 点击蒙层外部关闭弹窗
      this.$emit("update:visible", false)
    }
  }
}
</script>

<style scoped>
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(45, 38, 75, 0.45);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 999;
  backdrop-filter: blur(6rpx);
}
.modal-content {
  background: #FFFDF8;
  border-radius: 28rpx;
  padding: 40rpx;
  width: 560rpx;
  max-width: 85%;
  box-shadow: 0 12rpx 36rpx rgba(45, 38, 75, 0.12), inset 0 -2rpx 4rpx rgba(255, 255, 255, 0.6), inset 0 2rpx 4rpx rgba(45, 38, 75, 0.04);
  animation: modalPop 0.25s cubic-bezier(0.34, 1.56, 0.64, 1);
}
@keyframes modalPop {
  0% { opacity: 0; transform: scale(0.92) translateY(16rpx); }
  100% { opacity: 1; transform: scale(1) translateY(0); }
}
</style>
