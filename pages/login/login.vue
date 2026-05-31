<template>
  <view class="login-page">
    <view class="login-brand">
      <view class="brand-icon">
        <text class="brand-emoji">📌</text>
      </view>
      <text class="brand-name">EduMate</text>
      <text class="brand-desc">智能学习助手</text>
    </view>

    <view class="login-card">
      <view class="card-tabs">
        <text class="tab-item" :class="{ active: isLogin }" @tap="isLogin = true">登录</text>
        <text class="tab-item" :class="{ active: !isLogin }" @tap="isLogin = false">注册</text>
      </view>

      <view class="card-body">
        <view class="input-group">
          <text class="input-label">用户</text>
          <input class="input-field" v-model="username" placeholder="请输入用户名" placeholder-class="ph" />
        </view>

        <view class="input-group">
          <text class="input-label">密码</text>
          <input class="input-field" v-model="password" type="password" password="true" placeholder="请输入密码" placeholder-class="ph" />
        </view>

        <view class="input-group" v-if="!isLogin">
          <text class="input-label">确认密码</text>
          <input class="input-field" v-model="confirmPassword" type="password" password="true" placeholder="请确认密码" placeholder-class="ph" />
        </view>

        <view class="input-error" v-if="errorMsg">{{ errorMsg }}</view>

        <button class="submit-btn" @tap="handleSubmit">{{ isLogin ? "登录" : "注册" }}</button>
      </view>
    </view>
  </view>
</template>

<script>
import { saveUser, saveLoginStatus } from "../../utils/storage"

export default {
  data() {
    return {
      isLogin: true,
      username: "",
      password: "",
      confirmPassword: "",
      errorMsg: ""
    }
  },
  methods: {
    handleSubmit() {
      this.errorMsg = ""

      if (!this.username.trim()) {
        this.errorMsg = "请输入用户名"
        return
      }
      if (!this.password || this.password.length < 6) {
        this.errorMsg = "密码至少6位"
        return
      }
      if (!this.isLogin && this.password !== this.confirmPassword) {
        this.errorMsg = "两次密码不一致"
        return
      }

      const userInfo = {
        id: Date.now().toString(),
        username: this.username.trim(),
        nickname: this.username.trim(),
        email: "",
        createdAt: new Date().toISOString()
      }

      saveUser(userInfo)
      saveLoginStatus(true)
      uni.switchTab({ url: "/pages/home/home" })
    }
  }
}
</script>

<style scoped>
.login-page {
  min-height: 100vh;
  background: #F8F6F0;
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 0 52rpx;
  justify-content: center;
}
.login-brand {
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-bottom: 60rpx;
}
.brand-icon {
  width: 130rpx;
  height: 130rpx;
  background: linear-gradient(145deg, #4338CA, #6366F1);
  border-radius: 34rpx;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 28rpx;
  box-shadow: 0 12rpx 36rpx rgba(67, 56, 202, 0.25), inset 0 -2rpx 4rpx rgba(255, 255, 255, 0.3);
}
.brand-emoji {
  font-size: 60rpx;
}
.brand-name {
  font-size: 52rpx;
  font-weight: 700;
  color: #2D264B;
  letter-spacing: 4rpx;
}
.brand-desc {
  font-size: 26rpx;
  color: #7C758B;
  margin-top: 10rpx;
  letter-spacing: 6rpx;
}
.login-card {
  background: #FFFDF8;
  border-radius: 32rpx;
  width: 100%;
  box-shadow: 0 12rpx 36rpx rgba(45, 38, 75, 0.1), inset 0 -2rpx 4rpx rgba(255, 255, 255, 0.6), inset 0 2rpx 4rpx rgba(45, 38, 75, 0.04);
  border: 2rpx solid #E8E3D8;
  overflow: hidden;
}
.card-tabs {
  display: flex;
  background: #F0EDE6;
  margin: 20rpx 20rpx 0;
  border-radius: 16rpx;
  padding: 4rpx;
}
.tab-item {
  flex: 1;
  text-align: center;
  font-size: 28rpx;
  color: #7C758B;
  padding: 24rpx 0;
  border-radius: 14rpx;
  transition: all 0.25s ease;
  font-weight: 500;
}
.tab-item.active {
  color: #4338CA;
  font-weight: 600;
  background: #FFFFFF;
  box-shadow: 0 2rpx 8rpx rgba(45, 38, 75, 0.06);
}
.card-body {
  padding: 40rpx 48rpx 48rpx;
}
.input-group {
  margin-bottom: 32rpx;
}
.input-label {
  font-size: 26rpx;
  color: #7C758B;
  margin-bottom: 12rpx;
  display: block;
  font-weight: 500;
}
.input-field {
  height: 90rpx;
  background: #F8F6F0;
  border-radius: 18rpx;
  padding: 0 28rpx;
  font-size: 28rpx;
  color: #2D264B;
  border: 2rpx solid #E8E3D8;
  transition: all 0.2s ease;
}
.input-field:focus {
  border-color: #4338CA;
  background: #EEF1FF;
  box-shadow: 0 0 0 4rpx rgba(67, 56, 202, 0.1);
}
.ph {
  color: #B0A9BE;
}
.input-error {
  color: #EF4444;
  font-size: 24rpx;
  margin-bottom: 24rpx;
  padding: 16rpx 20rpx;
  background: #FEF2F2;
  border-radius: 12rpx;
  border: 2rpx solid #FCA5A5;
}
.submit-btn {
  width: 100%;
  height: 90rpx;
  background: linear-gradient(145deg, #4338CA, #6366F1);
  color: #FFFFFF;
  font-size: 30rpx;
  font-weight: 600;
  border-radius: 45rpx;
  display: flex;
  align-items: center;
  justify-content: center;
  border: none;
  margin-top: 8rpx;
  box-shadow: 0 8rpx 24rpx rgba(67, 56, 202, 0.25);
  transition: all 0.2s ease;
}
.submit-btn:active {
  transform: scale(0.97);
  box-shadow: 0 4rpx 12rpx rgba(67, 56, 202, 0.15);
}
</style>
