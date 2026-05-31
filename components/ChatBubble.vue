<template>
  <view class="chat-bubble" :class="role">
    <view class="bubble-content">
      <text>{{ content }}</text>
    </view>
    <text class="bubble-time">{{ formatTime(time) }}</text>
  </view>
</template>

<script>
export default {
  name: "ChatBubble",
  props: {
    content: { type: String, required: true },
    role: { type: String, default: "user" },
    time: { type: String, default: "" }
  },
  methods: {
    formatTime(t) {
      if (!t) return ""
      const d = new Date(t)
      return `${String(d.getHours()).padStart(2,"0")}:${String(d.getMinutes()).padStart(2,"0")}`
    }
  }
}
</script>

<style scoped>
.chat-bubble {
  display: flex;
  flex-direction: column;
  margin-bottom: 30rpx;
  max-width: 85%;
  animation: bubbleIn 0.3s ease-out;
}
@keyframes bubbleIn {
  0% { opacity: 0; transform: translateY(12rpx); }
  100% { opacity: 1; transform: translateY(0); }
}
.chat-bubble.user {
  align-self: flex-end;
  align-items: flex-end;
}
.chat-bubble.assistant {
  align-self: flex-start;
  align-items: flex-start;
}
.bubble-content {
  background: #EEF1FF;
  padding: 24rpx 30rpx;
  border-radius: 22rpx;
  font-size: 28rpx;
  color: #2D264B;
  line-height: 1.6;
  word-break: break-word;
  box-shadow: 0 4rpx 12rpx rgba(67, 56, 202, 0.08);
}
.chat-bubble.user .bubble-content {
  background: linear-gradient(145deg, #4338CA, #6366F1);
  color: #FFFFFF;
  border-bottom-right-radius: 4rpx;
  box-shadow: 0 6rpx 16rpx rgba(67, 56, 202, 0.25);
}
.chat-bubble.assistant .bubble-content {
  background: #FFFDF8;
  border: 2rpx solid #E8E3D8;
  border-bottom-left-radius: 4rpx;
  box-shadow: 0 4rpx 12rpx rgba(45, 38, 75, 0.06);
}
.bubble-time {
  font-size: 22rpx;
  color: #B0A9BE;
  margin-top: 8rpx;
}
</style>
