<template>
  <view class="thinking-animation" v-if="visible">
    <view class="thinking-dots">
      <view class="dot" v-for="i in 3" :key="i" :style="{ animationDelay: (i * 0.3) + 's' }"></view>
    </view>
    <text class="thinking-text">{{ currentText }}</text>
  </view>
</template>

<script>
export default {
  name: "ThinkingAnimation",
  props: {
    visible: { type: Boolean, default: false }
  },
  data() {
    return {
      texts: ["思考中...", "提炼中...", "糅合中...", "调查中..."],
      currentText: "思考中...",
      textIndex: 0,
      timer: null
    }
  },
  watch: {
    visible(val) {
      if (val) {
        this.startAnimation()
      } else {
        this.stopAnimation()
      }
    }
  },
  methods: {
    startAnimation() {
      this.textIndex = 0
      this.currentText = this.texts[0]
      this.timer = setInterval(() => {
        this.textIndex = (this.textIndex + 1) % this.texts.length
        this.currentText = this.texts[this.textIndex]
      }, 2000)
    },
    stopAnimation() {
      if (this.timer) {
        clearInterval(this.timer)
        this.timer = null
      }
    }
  },
  beforeDestroy() {
    this.stopAnimation()
  }
}
</script>

<style scoped>
.thinking-animation {
  display: flex;
  align-items: center;
  padding: 30rpx 20rpx;
  gap: 20rpx;
  align-self: flex-start;
  background: #FFFDF8;
  border-radius: 22rpx;
  border: 2rpx solid #E8E3D8;
  box-shadow: 0 4rpx 12rpx rgba(45, 38, 75, 0.06);
  margin-bottom: 20rpx;
}
.thinking-dots {
  display: flex;
  gap: 8rpx;
}
.dot {
  width: 16rpx;
  height: 16rpx;
  border-radius: 50%;
  background: #4338CA;
  animation: dotBounce 1.2s ease-in-out infinite;
}
@keyframes dotBounce {
  0%, 80%, 100% { transform: scale(0.6); opacity: 0.3; }
  40% { transform: scale(1.1); opacity: 1; }
}
.thinking-text {
  font-size: 26rpx;
  color: #4338CA;
  font-weight: 600;
}
</style>
