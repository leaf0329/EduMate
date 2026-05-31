<template>
  <view class="home-page">
    <!-- 功能入口卡片 -->
    <view class="feature-grid">
      <view class="feature-card" @tap="goToPage('daily')">
        <view class="feature-icon" style="background: #FFF3E0;">
          <text class="feature-icon-text">⭐</text>
        </view>
        <text class="feature-label">每日学习打卡</text>
      </view>
      <view class="feature-card" @tap="goToPage('plan')">
        <view class="feature-icon" style="background: #E3F2FD;">
          <text class="feature-icon-text">📅</text>
        </view>
        <text class="feature-label">学习计划</text>
      </view>
      <view class="feature-card" @tap="goToPage('notes')">
        <view class="feature-icon" style="background: #E8F5E9;">
          <text class="feature-icon-text">📝</text>
        </view>
        <text class="feature-label">学习笔记</text>
      </view>
      <view class="feature-card" @tap="goToPage('ai')">
        <view class="feature-icon" style="background: #F3E5F5;">
          <text class="feature-icon-text">🤖</text>
        </view>
        <text class="feature-label">AI问答</text>
      </view>
      <view class="feature-card" @tap="goToPage('stats')">
        <view class="feature-icon" style="background: #E0F7FA;">
          <text class="feature-icon-text">📊</text>
        </view>
        <text class="feature-label">学习统计</text>
      </view>
    </view>

    <!-- 超时提醒横幅 -->
    <view class="overdue-banner" v-if="overdueCount > 0" @tap="goToPage('plan')">
      <text class="overdue-banner-icon">⏰</text>
      <text class="overdue-banner-text">你有 {{ overdueCount }} 个学习计划已超时，点击查看</text>
      <text class="overdue-banner-arrow">›</text>
    </view>

    <!-- 近期学习任务 -->
    <view class="section">
      <view class="section-header">
        <text class="section-title">近期学习任务</text>
      </view>
      <view class="task-list" v-if="recentPlans.length > 0">
        <view class="task-item" :class="{ overdue: isTaskOverdue(plan) }" v-for="plan in recentPlans" :key="plan.id" @tap="goToPage('plan')">
          <view class="task-dot" :class="{ done: plan.status === 1, overdue: isTaskOverdue(plan) }"></view>
          <text class="task-text" :class="{ done: plan.status === 1 }">{{ plan.title }}</text>
          <text class="task-deadline" v-if="isTaskOverdue(plan)">{{ plan.deadline }}</text>
          <text class="task-status" :class="{ done: plan.status === 1, overdue: isTaskOverdue(plan) }">{{ isTaskOverdue(plan) ? "已过期" : (plan.status === 1 ? "已完成" : "进行中") }}</text>
        </view>
      </view>
      <view class="empty-state" v-else>
        <text class="empty-text">暂无学习任务，快去创建一个吧</text>
      </view>
    </view>

    <!-- 每日打卡弹窗 -->
    <ModalDialog :visible.sync="showDaily">
      <view class="daily-popup">
        <text class="daily-title">📮 每日打卡</text>
        <text class="daily-date">{{ todayDate }}</text>
        <view class="daily-count">
          <view class="count-item">
            <text class="count-value">{{ checkinCount }}</text>
            <text class="count-label">累计打卡</text>
          </view>
          <view class="count-item">
            <text class="count-value">{{ checkinStreak }}</text>
            <text class="count-label">连续天数</text>
          </view>
        </view>
        <view class="daily-quote">
          <text class="quote-text" v-if="dailyChecked">✅ 今日已打卡！继续保持！</text>
          <text class="quote-text" v-else>{{ dailyQuote }}</text>
        </view>
        <button class="daily-btn" v-if="!dailyChecked" @tap="doCheckin">打卡</button>
        <button class="daily-btn checked" @tap="closeDaily">关闭</button>
      </view>
    </ModalDialog>
  </view>
</template>

<script>
import { getPlans, isCheckedInToday, saveCheckinDate, getCheckinCount, getCheckinStreak } from "../../utils/storage"
import ModalDialog from "../../components/ModalDialog.vue"

export default {
  components: { ModalDialog },
  data() {
    return {
      recentPlans: [],
      dailyChecked: false,
      showDaily: false,
      todayDate: "",
      dailyQuote: "学习是一场马拉松，不是冲刺。坚持就是胜利！",
      checkinCount: 0,
      checkinStreak: 0,
      overdueCount: 0
    }
  },
  onLoad() {
    uni.$on('planDataChanged', () => {
      this.loadRecentPlans()
    })
  },
  onUnload() {
    uni.$off('planDataChanged')
  },
  onShow() {
    this.loadRecentPlans()
    this.todayDate = this.formatToday()
    this.dailyChecked = isCheckedInToday()
    this.checkinCount = getCheckinCount()
    this.checkinStreak = getCheckinStreak()
  },
  methods: {
    isTaskOverdue(plan) {
      if (!plan.deadline || plan.status === 1) return false
      const today = new Date()
      today.setHours(0, 0, 0, 0)
      return new Date(plan.deadline) < today
    },
    loadRecentPlans() {
      const plans = getPlans()
      this.recentPlans = plans.filter(p => p.status === 0).slice(0, 5)
      this.overdueCount = plans.filter(p => p.status === 0 && p.deadline && new Date(p.deadline) < new Date(new Date().toDateString())).length
    },
    formatToday() {
      const d = new Date()
      const weekdays = ["日", "一", "二", "三", "四", "五", "六"]
      return `${d.getFullYear()}年${d.getMonth()+1}月${d.getDate()}日 星期${weekdays[d.getDay()]}`
    },
    goToPage(page) {
      if (page === "daily") {
        this.showDaily = true
        return
      }
      const routes = {
        plan: "/pages/plan/plan",
        notes: "/pages/notes/notes",
        ai: "/pages/ai/ai",
        stats: "/pages/stats/stats"
      }
      if (page === "plan" || page === "ai") {
        uni.switchTab({ url: routes[page] })
      } else {
        uni.navigateTo({ url: routes[page] })
      }
    },
    doCheckin() {
      const today = new Date()
      const dateStr = today.getFullYear() + "-" + String(today.getMonth()+1).padStart(2,"0") + "-" + String(today.getDate()).padStart(2,"0")
      saveCheckinDate(dateStr)
      this.dailyChecked = true
      this.checkinCount = getCheckinCount()
      this.checkinStreak = getCheckinStreak()
      uni.showToast({ title: "打卡成功！", icon: "success" })
    },
    closeDaily() {
      this.showDaily = false
    }
  }
}
</script>

<style scoped>
.home-page {
  min-height: 100vh;
  background: #F8F6F0;
  padding: 30rpx;
}
.feature-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 20rpx;
  margin-bottom: 40rpx;
}
.feature-card {
  background: #FFFDF8;
  border-radius: 22rpx;
  padding: 32rpx 16rpx;
  display: flex;
  flex-direction: column;
  align-items: center;
  box-shadow: 0 8rpx 24rpx rgba(45, 38, 75, 0.07), inset 0 -2rpx 4rpx rgba(255, 255, 255, 0.6), inset 0 2rpx 4rpx rgba(45, 38, 75, 0.04);
  border: 2rpx solid #E8E3D8;
  transition: all 0.2s ease;
}
.feature-card:active {
  transform: scale(0.95);
}
.feature-card:last-child {
  grid-column: 2;
}
.feature-icon {
  width: 96rpx;
  height: 96rpx;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 16rpx;
  box-shadow: 0 4rpx 12rpx rgba(0,0,0,0.08);
}
.feature-icon-text {
  font-size: 38rpx;
}
.feature-label {
  font-size: 26rpx;
  color: #2D264B;
  font-weight: 600;
}
.section {
  background: #FFFDF8;
  border-radius: 22rpx;
  padding: 32rpx;
  box-shadow: 0 8rpx 24rpx rgba(45, 38, 75, 0.07), inset 0 -2rpx 4rpx rgba(255, 255, 255, 0.6), inset 0 2rpx 4rpx rgba(45, 38, 75, 0.04);
  border: 2rpx solid #E8E3D8;
}
.section-header {
  margin-bottom: 20rpx;
}
.section-title {
  font-size: 32rpx;
  font-weight: 600;
  color: #2D264B;
}
.task-list {
  display: flex;
  flex-direction: column;
  gap: 4rpx;
}
.task-item {
  display: flex;
  align-items: center;
  padding: 20rpx 0;
  border-bottom: 2rpx solid #F0EDE6;
}
.task-item:last-child {
  border-bottom: none;
}
.task-dot {
  width: 18rpx;
  height: 18rpx;
  border-radius: 50%;
  background: #F59E0B;
  margin-right: 20rpx;
  box-shadow: 0 0 0 4rpx rgba(245, 158, 11, 0.15);
}
.task-dot.done {
  background: #10B981;
  box-shadow: 0 0 0 4rpx rgba(16, 185, 129, 0.15);
}
.overdue-banner {
  background: #FEF2F2;
  border: 2rpx solid #EF4444;
  border-radius: 18rpx;
  padding: 24rpx 28rpx;
  display: flex;
  align-items: center;
  margin-bottom: 24rpx;
  gap: 16rpx;
  box-shadow: 0 4rpx 12rpx rgba(239, 68, 68, 0.08);
}
.overdue-banner:active {
  opacity: 0.8;
  transform: scale(0.98);
}
.overdue-banner-icon {
  font-size: 36rpx;
}
.overdue-banner-text {
  flex: 1;
  font-size: 26rpx;
  color: #B91C1C;
  font-weight: 500;
}
.overdue-banner-arrow {
  font-size: 40rpx;
  color: #EF4444;
}
.task-item.overdue {
  background: #FEF2F2;
  border-radius: 14rpx;
  padding: 20rpx 16rpx;
  margin: 4rpx -16rpx;
}
.task-dot.overdue {
  background: #EF4444;
  box-shadow: 0 0 0 4rpx rgba(239, 68, 68, 0.15);
}
.task-status.overdue {
  color: #EF4444;
  background: #FEF2F2;
}
.task-deadline {
  font-size: 22rpx;
  color: #EF4444;
  font-weight: 500;
  margin-right: 12rpx;
}
.task-text {
  flex: 1;
  font-size: 28rpx;
  color: #2D264B;
}
.task-text.done {
  color: #B0A9BE;
  text-decoration: line-through;
}
.task-status {
  font-size: 24rpx;
  color: #F59E0B;
  padding: 4rpx 16rpx;
  background: #FFFBEB;
  border-radius: 20rpx;
  font-weight: 500;
}
.task-status.done {
  color: #10B981;
  background: #ECFDF5;
}
.empty-state {
  padding: 40rpx 0;
  text-align: center;
}
.empty-text {
  font-size: 28rpx;
  color: #B0A9BE;
}
.daily-popup {
  text-align: center;
}
.daily-title {
  font-size: 40rpx;
  font-weight: 700;
  color: #2D264B;
  margin-bottom: 16rpx;
  display: block;
}
.daily-date {
  font-size: 26rpx;
  color: #7C758B;
  margin-bottom: 30rpx;
  display: block;
}
.daily-quote {
  background: #F8F6F0;
  border-radius: 18rpx;
  padding: 30rpx;
  margin-bottom: 40rpx;
  border: 2rpx solid #E8E3D8;
}
.quote-text {
  font-size: 28rpx;
  color: #7C758B;
  line-height: 1.6;
}
.daily-btn {
  width: 300rpx;
  height: 80rpx;
  background: linear-gradient(145deg, #4338CA, #6366F1);
  color: #FFFFFF;
  font-size: 30rpx;
  border-radius: 40rpx;
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 16rpx auto;
  border: none;
  box-shadow: 0 6rpx 16rpx rgba(67, 56, 202, 0.2);
  transition: transform 0.2s ease;
}
.daily-btn:active {
  transform: scale(0.96);
}
.daily-btn.checked {
  background: linear-gradient(145deg, #10B981, #34D399);
  box-shadow: 0 6rpx 16rpx rgba(16, 185, 129, 0.25);
}
.daily-count {
  display: flex;
  justify-content: center;
  gap: 60rpx;
  margin-bottom: 30rpx;
}
.count-item {
  text-align: center;
}
.count-value {
  font-size: 48rpx;
  font-weight: 700;
  color: #4338CA;
  display: block;
}
.count-label {
  font-size: 24rpx;
  color: #7C758B;
  margin-top: 4rpx;
  display: block;
}
</style>
