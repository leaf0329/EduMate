<template>
  <view class="stat-card">
    <view class="stat-icon" :style="{ background: bgColor }">
      <text class="stat-icon-text">{{ icon }}</text>
    </view>
    <view class="stat-info">
      <text class="stat-value">{{ value }}</text>
      <text class="stat-label">{{ label }}</text>
    </view>
  </view>
</template>

<script>
export default {
  name: "StatCard",
  props: {
    icon: { type: String, default: "" },
    value: { type: [String, Number], default: 0 },
    label: { type: String, default: "" },
    bgColor: { type: String, default: "#4A90D9" }
  }
}
</script>

<style scoped>
.stat-card {
  background: #FFFDF8;
  border-radius: 22rpx;
  padding: 32rpx;
  display: flex;
  align-items: center;
  box-shadow: 0 8rpx 24rpx rgba(45, 38, 75, 0.07), inset 0 -2rpx 4rpx rgba(255, 255, 255, 0.6), inset 0 2rpx 4rpx rgba(45, 38, 75, 0.04);
  border: 2rpx solid #E8E3D8;
  flex: 1;
  min-width: 40%;
  transition: transform 0.2s ease;
}
.stat-card:active {
  transform: scale(0.97);
}
.stat-icon {
  width: 80rpx;
  height: 80rpx;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-right: 20rpx;
  box-shadow: 0 4rpx 12rpx rgba(0,0,0,0.1);
}
.stat-icon-text {
  font-size: 36rpx;
  color: #FFFFFF;
}
.stat-info {
  display: flex;
  flex-direction: column;
}
.stat-value {
  font-size: 40rpx;
  font-weight: 700;
  color: #2D264B;
}
.stat-label {
  font-size: 24rpx;
  color: #7C758B;
  margin-top: 4rpx;
}
</style>
