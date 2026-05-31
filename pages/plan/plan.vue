<template>
  <view class="plan-page">
    <!-- 统计概览 -->
    <view class="plan-summary">
      <view class="summary-item">
        <text class="summary-value">{{ totalCount }}</text>
        <text class="summary-label">全部</text>
      </view>
      <view class="summary-item">
        <text class="summary-value">{{ doneCount }}</text>
        <text class="summary-label">已完成</text>
      </view>
      <view class="summary-item">
        <text class="summary-value">{{ pendingCount }}</text>
        <text class="summary-label">未完成</text>
      </view>
      <view class="summary-item" v-if="overdueCount > 0">
        <text class="summary-value" style="color:#FF5252;">{{ overdueCount }}</text>
        <text class="summary-label" style="color:rgba(255,82,82,0.8);">已超时</text>
      </view>
    </view>

    <!-- 新增按钮 -->
    <button class="add-btn" @tap="showAddDialog">+ 新增学习计划</button>

    <!-- 计划列表 -->
    <view class="plan-list" v-if="plans.length > 0">
      <PlanCard
        v-for="plan in plans"
        :key="plan.id"
        :plan="plan"
        @click="editPlan"
        @toggle-status="toggleStatus"
        @delete="confirmDelete"
      />
    </view>
    <view class="empty-state" v-else>
      <text class="empty-text">暂无学习计划</text>
      <text class="empty-sub">点击上方按钮创建你的第一个学习计划</text>
    </view>

    <!-- 新增/编辑弹窗 -->
    <ModalDialog :visible.sync="showPlanForm">
      <view class="plan-dialog">
        <text class="dialog-title">{{ editingPlan ? "编辑计划" : "新增计划" }}</text>
        <view class="dialog-form">
          <input class="dialog-input" v-model="form.title" placeholder="计划标题" placeholder-class="ph" />
          <textarea class="dialog-textarea" v-model="form.description" placeholder="计划描述（可选）" placeholder-class="ph" />
          <text class="form-hint">截止日期</text>
          <picker mode="date" :value="form.deadline" @change="onDateChange">
            <view class="dialog-input">{{ form.deadline || "请选择日期" }}</view>
          </picker>
        </view>
        <view class="dialog-btns">
          <button class="dialog-btn cancel" @tap="closeDialog">取消</button>
          <button class="dialog-btn confirm" @tap="savePlan">保存</button>
        </view>
      </view>
    </ModalDialog>

    <!-- 删除确认弹窗 -->
    <ModalDialog :visible.sync="showDeleteConfirm">
      <view class="delete-dialog">
        <text class="dialog-title">确认删除</text>
        <text class="delete-text">确定要删除计划"{{ deletingPlan?.title }}" 吗？</text>
        <view class="dialog-btns">
          <button class="dialog-btn cancel" @tap="cancelDelete">取消</button>
          <button class="dialog-btn delete-confirm" @tap="doDelete">删除</button>
        </view>
      </view>
    </ModalDialog>
  </view>
</template>

<script>
import { getPlans, addPlan, updatePlan, deletePlan, togglePlanStatus } from "../../utils/storage"
import PlanCard from "../../components/PlanCard.vue"
import ModalDialog from "../../components/ModalDialog.vue"

export default {
  components: { PlanCard, ModalDialog },
  data() {
    return {
      plans: [],
      form: { title: "", description: "", deadline: "" },
      editingPlan: null,
      deletingPlan: null,
      showPlanForm: false,
      showDeleteConfirm: false
    }
  },
  computed: {
    totalCount() { return this.plans.length },
    doneCount() { return this.plans.filter(p => p.status === 1).length },
    pendingCount() { return this.plans.filter(p => p.status === 0).length },
    overdueCount() { return this.plans.filter(p => p.status === 0 && p.deadline && new Date(p.deadline) < new Date(new Date().toDateString())).length }
  },
  onLoad() { this.loadPlans() },
  onShow() { this.loadPlans() },
  methods: {
    loadPlans() { this.plans = getPlans() },
    showAddDialog() {
      this.editingPlan = null
      this.form = { title: "", description: "", deadline: "" }
      this.showPlanForm = true
    },
    editPlan(plan) {
      this.editingPlan = plan
      this.form = { title: plan.title, description: plan.description || "", deadline: plan.deadline || "" }
      this.showPlanForm = true
    },
    onDateChange(e) { this.form.deadline = e.detail.value },
    closeDialog() { this.showPlanForm = false },
    savePlan() {
      if (!this.form.title.trim()) {
        uni.showToast({ title: "请输入计划标题", icon: "none" })
        return
      }
      if (this.form.deadline) {
        const today = new Date()
        today.setHours(0, 0, 0, 0)
        const deadline = new Date(this.form.deadline)
        if (deadline < today) {
          uni.showToast({ title: "截止时间不能小于当前日期", icon: "none" })
          return
        }
      }
      if (this.editingPlan) {
        updatePlan(this.editingPlan.id, this.form)
        uni.showToast({ title: "修改成功", icon: "success" })
      } else {
        addPlan({ ...this.form })
        uni.showToast({ title: "添加成功", icon: "success" })
      }
      this.closeDialog()
      this.loadPlans()
      uni.$emit("planDataChanged")
    },
    toggleStatus(plan) {
      togglePlanStatus(plan.id)
      this.loadPlans()
      uni.$emit("planDataChanged")
    },
    confirmDelete(plan) {
      this.deletingPlan = plan
      this.showDeleteConfirm = true
    },
    cancelDelete() {
      this.deletingPlan = null
      this.showDeleteConfirm = false
    },
    doDelete() {
      if (this.deletingPlan) {
        deletePlan(this.deletingPlan.id)
        uni.showToast({ title: "已删除", icon: "success" })
        this.deletingPlan = null
        this.showDeleteConfirm = false
        this.loadPlans()
        uni.$emit("planDataChanged")
      }
    }
  }
}
</script>

<style scoped>
.plan-page {
  min-height: 100vh;
  background: #F8F6F0;
  padding: 30rpx;
}
.plan-summary {
  display: flex;
  background: linear-gradient(145deg, #4338CA, #6366F1);
  border-radius: 22rpx;
  padding: 36rpx 20rpx;
  margin-bottom: 30rpx;
  box-shadow: 0 12rpx 36rpx rgba(67, 56, 202, 0.25);
}
.summary-item {
  flex: 1;
  text-align: center;
}
.summary-value {
  font-size: 44rpx;
  font-weight: 700;
  color: #FFFFFF;
  display: block;
}
.summary-label {
  font-size: 24rpx;
  color: rgba(255,255,255,0.8);
  margin-top: 8rpx;
  display: block;
}
.add-btn {
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
  margin-bottom: 30rpx;
  border: none;
  box-shadow: 0 8rpx 24rpx rgba(67, 56, 202, 0.25);
  transition: all 0.2s ease;
}
.add-btn:active {
  transform: scale(0.97);
  box-shadow: 0 4rpx 12rpx rgba(67, 56, 202, 0.15);
}
.plan-list { margin-bottom: 30rpx; }
.empty-state {
  text-align: center;
  padding: 100rpx 0;
}
.empty-text {
  font-size: 32rpx;
  color: #B0A9BE;
  display: block;
}
.empty-sub {
  font-size: 26rpx;
  color: #C0B9C8;
  margin-top: 16rpx;
  display: block;
}
.dialog-title {
  font-size: 34rpx;
  font-weight: 700;
  color: #2D264B;
  margin-bottom: 30rpx;
  display: block;
  text-align: center;
}
.dialog-form { margin-bottom: 30rpx; }
.dialog-input {
  height: 80rpx;
  background: #F8F6F0;
  border-radius: 16rpx;
  padding: 0 24rpx;
  font-size: 28rpx;
  color: #2D264B;
  margin-bottom: 20rpx;
  line-height: 80rpx;
  border: 2rpx solid #E8E3D8;
}
.dialog-textarea {
  width: 100%;
  height: 160rpx;
  background: #F8F6F0;
  border-radius: 16rpx;
  padding: 20rpx 24rpx;
  font-size: 28rpx;
  color: #2D264B;
  margin-bottom: 20rpx;
  box-sizing: border-box;
  border: 2rpx solid #E8E3D8;
}
.form-hint {
  font-size: 26rpx;
  color: #7C758B;
  margin-bottom: 12rpx;
  display: block;
  font-weight: 500;
}
.ph { color: #B0A9BE; }
.dialog-btns {
  display: flex;
  gap: 20rpx;
}
.dialog-btn {
  flex: 1;
  height: 80rpx;
  border-radius: 40rpx;
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
  background: linear-gradient(145deg, #4338CA, #6366F1);
  color: #FFFFFF;
  box-shadow: 0 4rpx 12rpx rgba(67, 56, 202, 0.2);
}
.dialog-btn.delete-confirm {
  background: #EF4444;
  color: #FFFFFF;
}
.delete-text {
  font-size: 28rpx;
  color: #7C758B;
  text-align: center;
  margin-bottom: 30rpx;
  display: block;
}
</style>
