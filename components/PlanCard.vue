<template>
  <view class="plan-card" :class="{ overdue: isOverdue }" @tap="onClick">
    <view class="plan-header">
      <text class="plan-title">{{ plan.title }}</text>
      <view class="plan-status-wrapper">
        <view class="plan-overdue-badge" v-if="isOverdue">已过期</view>
        <view class="plan-status" :class="{ completed: plan.status === 1 }" @tap.stop="onToggleStatus">
          <text>{{ plan.status === 1 ? "已完成" : "未完成" }}</text>
        </view>
      </view>
    </view>
    <text class="plan-desc" v-if="plan.description">{{ plan.description }}</text>
    <view class="plan-footer">
      <text class="plan-deadline" :class="{ overdue: isOverdue }" v-if="plan.deadline">截止: {{ formatDate(plan.deadline) }}</text>
      <view class="plan-actions">
        <text class="plan-toggle-btn" @tap.stop="onToggleStatus">{{ plan.status === 1 ? "标记未完成" : "标记完成" }}</text>
        <text class="plan-delete" @tap.stop="onDelete">删除</text>
      </view>
    </view>
  </view>
</template>

<script>
export default {
  name: "PlanCard",
  props: {
    plan: { type: Object, required: true }
  },
  emits: ["click", "toggle-status", "delete"],
  computed: {
    isOverdue() {
      if (!this.plan.deadline || this.plan.status === 1) return false
      const today = new Date()
      today.setHours(0, 0, 0, 0)
      const deadline = new Date(this.plan.deadline)
      return deadline < today
    }
  },
  methods: {
    onClick() { this.$emit("click", this.plan) },
    onToggleStatus(e) {
      if (e) e.stopPropagation()
      this.$emit("toggle-status", this.plan)
    },
    onDelete(e) {
      if (e) e.stopPropagation()
      this.$emit("delete", this.plan)
    },
    formatDate(date) {
      if (!date) return ""
      const d = new Date(date)
      return d.getFullYear() + "-" + String(d.getMonth()+1).padStart(2,"0") + "-" + String(d.getDate()).padStart(2,"0")
    }
  }
}
</script>

<style scoped>
.plan-card {
  background: #FFFDF8;
  border-radius: 22rpx;
  padding: 32rpx;
  margin-bottom: 24rpx;
  box-shadow: 0 8rpx 24rpx rgba(45, 38, 75, 0.07), inset 0 -2rpx 4rpx rgba(255, 255, 255, 0.6), inset 0 2rpx 4rpx rgba(45, 38, 75, 0.04);
  border: 2rpx solid #E8E3D8;
  transition: transform 0.2s ease;
}
.plan-card:active {
  transform: scale(0.98);
}
.plan-card.overdue {
  border-color: #EF4444;
  background: #FEF2F2;
}
.plan-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 16rpx;
}
.plan-title {
  font-size: 32rpx;
  font-weight: 600;
  color: #2D264B;
  flex: 1;
}
.plan-status {
  background: #FFFBEB;
  padding: 8rpx 20rpx;
  border-radius: 20rpx;
  font-size: 24rpx;
  color: #F59E0B;
  min-width: 100rpx;
  text-align: center;
  font-weight: 500;
}
.plan-status.completed {
  background: #ECFDF5;
  color: #10B981;
}
.plan-desc {
  font-size: 28rpx;
  color: #7C758B;
  line-height: 1.6;
  margin-bottom: 16rpx;
  display: block;
}
.plan-footer {
  display: flex;
  justify-content: space-between;
  align-items: center;
  flex-wrap: wrap;
  gap: 12rpx;
}
.plan-deadline {
  font-size: 24rpx;
  color: #B0A9BE;
}
.plan-actions {
  display: flex;
  gap: 16rpx;
  align-items: center;
}
.plan-toggle-btn {
  font-size: 26rpx;
  color: #4338CA;
  padding: 8rpx 20rpx;
  background: #EEF1FF;
  border-radius: 16rpx;
  font-weight: 500;
}
.plan-delete {
  font-size: 26rpx;
  color: #EF4444;
  padding: 8rpx 16rpx;
  font-weight: 500;
}
.plan-overdue-badge {
  background: #EF4444;
  color: #FFFFFF;
  font-size: 20rpx;
  padding: 4rpx 14rpx;
  border-radius: 12rpx;
  margin-right: 12rpx;
  font-weight: 600;
}
.plan-deadline.overdue {
  color: #EF4444;
  font-weight: 600;
}
.plan-status-wrapper {
  display: flex;
  align-items: center;
}
</style>
