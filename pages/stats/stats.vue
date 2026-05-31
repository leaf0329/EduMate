<template>
  <view class="stats-page">
    <!-- 数据卡片 -->
    <view class="stats-grid">
      <StatCard icon="📋" :value="completedPlans" label="已完成任务" bgColor="#4CAF50" />
      <StatCard icon="📌" :value="pendingPlans" label="未完成任务" bgColor="#FF9800" />
      <StatCard icon="📝" :value="noteCount" label="笔记数量" bgColor="#4A90D9" />
      <StatCard icon="🤖" :value="aiCount" label="AI问答次数" bgColor="#9C27B0" />
    </view>

    <!-- 图表区域 -->
    <view class="chart-section">
      <text class="section-title">学习统计概览</text>
      <view class="chart-container">
        <!-- 柱状图 -->
        <view class="bar-chart">
          <view class="bar-item">
            <view class="bar" :style="{ height: barHeight(completedPlans, maxVal) + '%' }" style="background: #4CAF50;">
              <text class="bar-value">{{ completedPlans }}</text>
            </view>
            <text class="bar-label">已完成</text>
          </view>
          <view class="bar-item">
            <view class="bar" :style="{ height: barHeight(pendingPlans, maxVal) + '%' }" style="background: #FF9800;">
              <text class="bar-value">{{ pendingPlans }}</text>
            </view>
            <text class="bar-label">未完成</text>
          </view>
          <view class="bar-item">
            <view class="bar" :style="{ height: barHeight(noteCount, maxVal) + '%' }" style="background: #4A90D9;">
              <text class="bar-value">{{ noteCount }}</text>
            </view>
            <text class="bar-label">笔记</text>
          </view>
          <view class="bar-item">
            <view class="bar" :style="{ height: barHeight(aiCount, maxVal) + '%' }" style="background: #9C27B0;">
              <text class="bar-value">{{ aiCount }}</text>
            </view>
            <text class="bar-label">AI问答</text>
          </view>
        </view>
      </view>
    </view>
  </view>
</template>

<script>
import { getPlans, getNotes, getChatHistory } from "../../utils/storage"
import StatCard from "../../components/StatCard.vue"

export default {
  components: { StatCard },
  data() {
    return {
      completedPlans: 0,
      pendingPlans: 0,
      noteCount: 0,
      aiCount: 0
    }
  },
  computed: {
    maxVal() {
      return Math.max(this.completedPlans, this.pendingPlans, this.noteCount, this.aiCount, 1)
    }
  },
  onShow() {
    this.loadStats()
  },
  methods: {
    loadStats() {
      const plans = getPlans()
      this.completedPlans = plans.filter(p => p.status === 1).length
      this.pendingPlans = plans.filter(p => p.status === 0).length
      this.noteCount = getNotes().length
      this.aiCount = getChatHistory().length
    },
    barHeight(val, max) {
      return Math.max((val / max) * 70, 5)
    }
  }
}
</script>

<style scoped>
.stats-page {
  min-height: 100vh;
  background: #F8F6F0;
  padding: 30rpx;
}
.stats-grid {
  display: flex;
  flex-wrap: wrap;
  gap: 20rpx;
  margin-bottom: 40rpx;
}
.chart-section {
  background: #FFFDF8;
  border-radius: 22rpx;
  padding: 32rpx;
  box-shadow: 0 8rpx 24rpx rgba(45, 38, 75, 0.07), inset 0 -2rpx 4rpx rgba(255, 255, 255, 0.6), inset 0 2rpx 4rpx rgba(45, 38, 75, 0.04);
  border: 2rpx solid #E8E3D8;
}
.section-title {
  font-size: 32rpx;
  font-weight: 700;
  color: #2D264B;
  margin-bottom: 30rpx;
  display: block;
}
.chart-container {
  padding: 20rpx 0;
}
.bar-chart {
  display: flex;
  justify-content: space-around;
  align-items: flex-end;
  height: 300rpx;
  padding: 0 20rpx;
}
.bar-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 100rpx;
}
.bar {
  width: 64rpx;
  border-radius: 12rpx 12rpx 0 0;
  display: flex;
  align-items: flex-start;
  justify-content: center;
  min-height: 16rpx;
  transition: height 0.6s cubic-bezier(0.34, 1.56, 0.64, 1);
  box-shadow: 0 -2rpx 8rpx rgba(0,0,0,0.1);
}
.bar-value {
  font-size: 22rpx;
  color: #FFFFFF;
  font-weight: 700;
  margin-top: 4rpx;
}
.bar-label {
  font-size: 24rpx;
  color: #7C758B;
  margin-top: 12rpx;
  font-weight: 500;
}
</style>


