<template>
  <view class="about-page">
    <view class="about-header">
      <image class="about-logo" src="/static/logo.png" mode="widthFix"></image>
      <text class="about-name">EduMate</text>
      <text class="about-version">版本 1.0.0</text>
    </view>

    <view class="about-info">
      <view class="info-item">
        <text class="info-label">应用名称</text>
        <text class="info-value">EduMate - AI 学习助手</text>
      </view>
      <view class="info-item">
        <text class="info-label">适用平台</text>
        <text class="info-value">iOS / Android / 微信小程序</text>
      </view>
      <view class="info-item">
        <text class="info-label">开发框架</text>
        <text class="info-value">Uniapp (Vue3)</text>
      </view>
      <view class="info-item">
        <text class="info-label">课程名称</text>
        <text class="info-value">移动开发与应用</text>
      </view>
    </view>

    <view class="about-desc">
      <text class="desc-title">应用简介</text>
      <text class="desc-content">
        EduMate 是一款面向大学生的智能学习助手应用，提供学习计划管理、笔记管理、AI问答、学习统计等功能，帮助用户提高学习效率，合理安排学习时间。
      </text>
    </view>
  </view>
</template>

<script>
export default {
  data() { return {} }
}
</script>

<style scoped>
.about-page {
  min-height: 100vh;
  background: #F8F6F0;
  padding: 40rpx 30rpx;
}
.about-header {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 60rpx 0;
}
.about-logo {
  width: 140rpx;
  height: 140rpx;
  margin-bottom: 20rpx;
  border-radius: 32rpx;
  box-shadow: 0 8rpx 24rpx rgba(45, 38, 75, 0.1);
}
.about-name {
  font-size: 48rpx;
  font-weight: 700;
  color: #2D264B;
}
.about-version {
  font-size: 28rpx;
  color: #B0A9BE;
  margin-top: 10rpx;
}
.about-info {
  background: #FFFDF8;
  border-radius: 22rpx;
  overflow: hidden;
  margin-bottom: 30rpx;
  box-shadow: 0 8rpx 24rpx rgba(45, 38, 75, 0.07), inset 0 -2rpx 4rpx rgba(255, 255, 255, 0.6), inset 0 2rpx 4rpx rgba(45, 38, 75, 0.04);
  border: 2rpx solid #E8E3D8;
}
.info-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 28rpx 30rpx;
  border-bottom: 2rpx solid #F0EDE6;
}
.info-item:last-child {
  border-bottom: none;
}
.info-label {
  font-size: 28rpx;
  color: #7C758B;
}
.info-value {
  font-size: 28rpx;
  color: #2D264B;
  font-weight: 500;
}
.about-desc {
  background: #FFFDF8;
  border-radius: 22rpx;
  padding: 30rpx;
  box-shadow: 0 8rpx 24rpx rgba(45, 38, 75, 0.07), inset 0 -2rpx 4rpx rgba(255, 255, 255, 0.6), inset 0 2rpx 4rpx rgba(45, 38, 75, 0.04);
  border: 2rpx solid #E8E3D8;
}
.desc-title {
  font-size: 30rpx;
  font-weight: 700;
  color: #2D264B;
  margin-bottom: 16rpx;
  display: block;
}
.desc-content {
  font-size: 28rpx;
  color: #7C758B;
  line-height: 1.8;
}
</style>

