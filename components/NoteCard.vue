<template>
  <view class="note-card" @tap="onClick">
    <view class="note-title">{{ note.title }}</view>
    <text class="note-summary" v-if="note.summary">{{ note.summary }}</text>
    <text class="note-content-preview" v-else>{{ note.content.substring(0, 80) }}{{ note.content.length > 80 ? "..." : "" }}</text>
    <view class="note-footer">
      <text class="note-date">{{ formatDate(note.updatedAt || note.createdAt) }}</text>
    </view>
  </view>
</template>

<script>
export default {
  name: "NoteCard",
  props: {
    note: { type: Object, required: true }
  },
  emits: ["click"],
  methods: {
    onClick() { this.$emit("click", this.note) },
    formatDate(date) {
      if (!date) return ""
      const d = new Date(date)
      return d.getFullYear() + "-" + String(d.getMonth()+1).padStart(2,"0") + "-" + String(d.getDate()).padStart(2,"0") + " " + String(d.getHours()).padStart(2,"0") + ":" + String(d.getMinutes()).padStart(2,"0")
    }
  }
}
</script>

<style scoped>
.note-card {
  background: #FFFDF8;
  border-radius: 22rpx;
  padding: 32rpx;
  margin-bottom: 24rpx;
  box-shadow: 0 8rpx 24rpx rgba(45, 38, 75, 0.07), inset 0 -2rpx 4rpx rgba(255, 255, 255, 0.6), inset 0 2rpx 4rpx rgba(45, 38, 75, 0.04);
  border: 2rpx solid #E8E3D8;
  transition: transform 0.2s ease, box-shadow 0.2s ease;
}
.note-card:active {
  transform: scale(0.98);
  box-shadow: 0 4rpx 12rpx rgba(45, 38, 75, 0.06);
}
.note-title {
  font-size: 32rpx;
  font-weight: 600;
  color: #2D264B;
  margin-bottom: 12rpx;
  letter-spacing: 0.5rpx;
}
.note-summary, .note-content-preview {
  font-size: 28rpx;
  color: #7C758B;
  line-height: 1.7;
  margin-bottom: 16rpx;
  display: block;
}
.note-footer {
  display: flex;
  justify-content: flex-end;
}
.note-date {
  font-size: 22rpx;
  color: #B0A9BE;
  background: #F0EDE6;
  padding: 4rpx 16rpx;
  border-radius: 12rpx;
}
</style>
