<template>
  <view class="profile-page">
    <!-- 用户信息 -->
    <view class="user-section">
      <view class="user-avatar">
        <text class="avatar-text">{{ avatarText }}</text>
      </view>
      <view class="user-info">
        <text class="user-name">{{ userInfo.nickname || "未设置昵称" }}</text>
        <text class="user-id">ID: {{ userInfo.id || "" }}</text>
      </view>
    </view>

    <!-- 功能菜单 -->
    <view class="menu-section">
      <view class="menu-item" @tap="goToStats">
        <text class="menu-icon">📊</text>
        <text class="menu-label">学习数据</text>
        <text class="menu-arrow">›</text>
      </view>
      <view class="menu-item" @tap="clearCache">
        <text class="menu-icon">🗑️</text>
        <text class="menu-label">清空缓存</text>
        <text class="menu-arrow">›</text>
      </view>
      <view class="menu-item" @tap="goToAbout">
        <text class="menu-icon">ℹ️</text>
        <text class="menu-label">关于系统</text>
        <text class="menu-arrow">›</text>
      </view>
    </view>

    <!-- 退出登录 -->
    <button class="logout-btn" @tap="showLogout = true">退出登录</button>

    <!-- 退出确认弹窗 -->
    <ModalDialog :visible.sync="showLogout">
      <view class="logout-dialog">
        <text class="dialog-title">确认退出</text>
        <text class="dialog-text">确定要退出登录吗？</text>
        <view class="dialog-btns">
          <button class="dialog-btn cancel" @tap="showLogout = false">取消</button>
          <button class="dialog-btn confirm" @tap="doLogout">退出</button>
        </view>
      </view>
    </ModalDialog>
  </view>
</template>

<script>
import { getUser, clearAllData, clearLoginStatus } from "../../utils/storage"
import ModalDialog from "../../components/ModalDialog.vue"

export default {
  components: { ModalDialog },
  data() {
    return {
      userInfo: {},
      showLogout: false
    }
  },
  computed: {
    avatarText() {
      const name = this.userInfo.nickname || this.userInfo.username || "U"
      return name.charAt(0).toUpperCase()
    }
  },
  onShow() {
    this.userInfo = getUser() || {}
  },
  methods: {
    goToStats() {
      uni.navigateTo({ url: "/pages/stats/stats" })
    },
    goToAbout() {
      uni.navigateTo({ url: "/pages/profile/about" })
    },
    clearCache() {
      uni.showModal({
        title: "提示",
        content: "确定要清空所有缓存数据吗？（不会影响账号信息）",
        success: (res) => {
          if (res.confirm) {
            const user = getUser()
            clearAllData()
            if (user) {
              uni.setStorageSync("edumate_user", user)
            }
            uni.showToast({ title: "缓存已清空", icon: "success" })
          }
        }
      })
    },
    doLogout() {
      clearLoginStatus()
      this.showLogout = false
      uni.reLaunch({ url: "/pages/login/login" })
    }
  }
}
</script>

<style scoped>
.profile-page {
  min-height: 100vh;
  background: #F8F6F0;
  padding: 30rpx;
}
.user-section {
  background: linear-gradient(145deg, #4338CA, #6366F1);
  border-radius: 22rpx;
  padding: 40rpx;
  display: flex;
  align-items: center;
  margin-bottom: 30rpx;
  box-shadow: 0 12rpx 36rpx rgba(67, 56, 202, 0.25);
}
.user-avatar {
  width: 120rpx;
  height: 120rpx;
  border-radius: 50%;
  background: rgba(255,255,255,0.2);
  display: flex;
  align-items: center;
  justify-content: center;
  margin-right: 30rpx;
  box-shadow: 0 4rpx 12rpx rgba(0,0,0,0.1);
}
.avatar-text {
  font-size: 48rpx;
  color: #FFFFFF;
  font-weight: 700;
}
.user-info {
  flex: 1;
}
.user-name {
  font-size: 36rpx;
  font-weight: 700;
  color: #FFFFFF;
  display: block;
}
.user-id {
  font-size: 24rpx;
  color: rgba(255,255,255,0.7);
  margin-top: 8rpx;
  display: block;
}
.menu-section {
  background: #FFFDF8;
  border-radius: 22rpx;
  overflow: hidden;
  margin-bottom: 40rpx;
  box-shadow: 0 8rpx 24rpx rgba(45, 38, 75, 0.07), inset 0 -2rpx 4rpx rgba(255, 255, 255, 0.6), inset 0 2rpx 4rpx rgba(45, 38, 75, 0.04);
  border: 2rpx solid #E8E3D8;
}
.menu-item {
  display: flex;
  align-items: center;
  padding: 30rpx;
  border-bottom: 2rpx solid #F0EDE6;
}
.menu-item:last-child {
  border-bottom: none;
}
.menu-item:active {
  background: #F8F6F0;
}
.menu-icon {
  font-size: 36rpx;
  margin-right: 24rpx;
}
.menu-label {
  flex: 1;
  font-size: 30rpx;
  color: #2D264B;
  font-weight: 500;
}
.menu-arrow {
  font-size: 40rpx;
  color: #C0B9C8;
}
.logout-btn {
  width: 100%;
  height: 88rpx;
  background: #FFFFFF;
  color: #EF4444;
  font-size: 30rpx;
  font-weight: 600;
  border-radius: 44rpx;
  display: flex;
  align-items: center;
  justify-content: center;
  border: 2rpx solid #EF4444;
  margin-top: 0;
  transition: all 0.2s ease;
}
.logout-btn:active {
  background: #FEF2F2;
}
.logout-dialog {
  text-align: center;
}
.dialog-title {
  font-size: 34rpx;
  font-weight: 700;
  color: #2D264B;
  margin-bottom: 16rpx;
  display: block;
}
.dialog-text {
  font-size: 28rpx;
  color: #7C758B;
  margin-bottom: 30rpx;
  display: block;
}
.dialog-btns {
  display: flex;
  gap: 20rpx;
}
.dialog-btn {
  flex: 1;
  height: 72rpx;
  border-radius: 36rpx;
  font-size: 28rpx;
  display: flex;
  align-items: center;
  justify-content: center;
  border: none;
  font-weight: 600;
}
.dialog-btn.cancel {
  background: #F0EDE6;
  color: #7C758B;
}
.dialog-btn.confirm {
  background: #EF4444;
  color: #FFFFFF;
}
</style>

