<template>
  <view class="notes-page">
    <!-- 搜索栏 -->
    <view class="search-bar">
      <input class="search-input" v-model="keyword" placeholder="搜索笔记标题或内容" placeholder-class="ph" @confirm="doSearch" />
    </view>

    <!-- 新增按钮 -->
    <button class="add-btn" @tap="createNote">+ 写笔记</button>

    <!-- 笔记列表 -->
    <view class="notes-list" v-if="displayNotes.length > 0">
      <NoteCard v-for="note in displayNotes" :key="note.id" :note="note" @click="goToDetail" />
    </view>
    <view class="empty-state" v-else>
      <text class="empty-text">{{ keyword ? "未搜索到相关笔记" : "暂无学习笔记" }}</text>
      <text class="empty-sub" v-if="!keyword">点击上方按钮创建你的第一篇笔记</text>
    </view>
  </view>
</template>

<script>
import { getNotes, searchNotes } from "../../utils/storage"
import NoteCard from "../../components/NoteCard.vue"

export default {
  components: { NoteCard },
  data() {
    return {
      notes: [],
      keyword: "",
      displayNotes: []
    }
  },
  onShow() { this.loadNotes() },
  watch: {
    keyword() {
      this.doSearch()
    }
  },
  methods: {
    loadNotes() {
      this.notes = getNotes()
      this.doSearch()
    },
    doSearch() {
      if (this.keyword.trim()) {
        this.displayNotes = searchNotes(this.keyword.trim())
      } else {
        this.displayNotes = [...this.notes]
      }
    },
    createNote() {
      uni.navigateTo({ url: "/pages/notes/detail" })
    },
    goToDetail(note) {
      uni.navigateTo({ url: "/pages/notes/detail?id=" + note.id })
    }
  }
}
</script>

<style scoped>
.notes-page {
  min-height: 100vh;
  background: #F8F6F0;
  padding: 30rpx;
}
.search-bar {
  background: #FFFDF8;
  border-radius: 44rpx;
  padding: 0 30rpx;
  margin-bottom: 30rpx;
  box-shadow: 0 4rpx 12rpx rgba(45, 38, 75, 0.06);
  border: 2rpx solid #E8E3D8;
}
.search-input {
  height: 80rpx;
  font-size: 28rpx;
  color: #2D264B;
}
.ph { color: #B0A9BE; }
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
}
.notes-list { margin-bottom: 30rpx; }
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
</style>


