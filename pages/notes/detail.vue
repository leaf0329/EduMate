<template>
  <view class="detail-page">
    <view class="detail-form">
      <input class="title-input" v-model="form.title" placeholder="输入笔记标题..." placeholder-class="ph" />
      <textarea class="content-input" v-model="form.content" placeholder="开始记录你的学习内容..." placeholder-class="ph" />
    </view>

    <view class="detail-footer">
      <button class="save-btn" @tap="saveNote">保存</button>
      <button class="delete-btn" v-if="isEdit" @tap="confirmDelete">删除笔记</button>
    </view>

    <ModalDialog :visible.sync="showDeleteConfirm">
      <view class="delete-dialog">
        <text class="dialog-title">确认删除</text>
        <text class="delete-text">确定要删除这篇笔记吗？删除后不可恢复。</text>
        <view class="dialog-btns">
          <button class="dialog-btn cancel" @tap="cancelDelete">取消</button>
          <button class="dialog-btn confirm-delete" @tap="doDelete">删除</button>
        </view>
      </view>
    </ModalDialog>
  </view>
</template>

<script>
import { getNotes, addNote, updateNote, deleteNote } from "../../utils/storage"
import ModalDialog from "../../components/ModalDialog.vue"

export default {
  components: { ModalDialog },
  data() {
    return {
      noteId: "",
      isEdit: false,
      form: { title: "", content: "" },
      showDeleteConfirm: false
    }
  },
  onLoad(options) {
    if (options.id) {
      this.noteId = options.id
      this.isEdit = true
      this.loadNote()
    }
  },
  methods: {
    loadNote() {
      const notes = getNotes()
      const note = notes.find(n => n.id === this.noteId)
      if (note) {
        this.form = { title: note.title, content: note.content }
      }
    },
    saveNote() {
      if (!this.form.title.trim()) {
        uni.showToast({ title: "请输入笔记标题", icon: "none" })
        return
      }
      const noteData = {
        title: this.form.title.trim(),
        content: this.form.content,
        summary: this.form.content.substring(0, 100)
      }
      if (this.isEdit) {
        updateNote(this.noteId, noteData)
        uni.showToast({ title: "保存成功", icon: "success" })
      } else {
        addNote(noteData)
        uni.showToast({ title: "创建成功", icon: "success" })
      }
      setTimeout(() => { uni.navigateBack() }, 500)
    },
    confirmDelete() { this.showDeleteConfirm = true },
    cancelDelete() { this.showDeleteConfirm = false },
    doDelete() {
      deleteNote(this.noteId)
      this.showDeleteConfirm = false
      uni.showToast({ title: "已删除", icon: "success" })
      setTimeout(() => { uni.navigateBack() }, 500)
    }
  }
}
</script>

<style scoped>
.detail-page {
  min-height: 100vh;
  background: #FFFDF8;
  padding: 30rpx;
  display: flex;
  flex-direction: column;
}
.detail-form { flex: 1; }
.title-input {
  font-size: 36rpx;
  font-weight: 700;
  color: #2D264B;
  padding: 20rpx 0;
  border-bottom: 2rpx solid #E8E3D8;
  margin-bottom: 20rpx;
}
.content-input {
  width: 100%;
  min-height: 400rpx;
  font-size: 30rpx;
  color: #2D264B;
  line-height: 1.8;
  padding: 20rpx 0;
  box-sizing: border-box;
}
.ph { color: #B0A9BE; }
.detail-footer {
  padding: 30rpx 0;
  display: flex;
  gap: 20rpx;
}
.save-btn {
  flex: 1;
  height: 80rpx;
  background: linear-gradient(145deg, #4338CA, #6366F1);
  color: #FFFFFF;
  font-size: 30rpx;
  font-weight: 600;
  border-radius: 40rpx;
  display: flex;
  align-items: center;
  justify-content: center;
  border: none;
  box-shadow: 0 4rpx 12rpx rgba(67, 56, 202, 0.2);
}
.delete-btn {
  flex: 1;
  height: 80rpx;
  background: #FFFFFF;
  color: #EF4444;
  font-size: 30rpx;
  border-radius: 40rpx;
  display: flex;
  align-items: center;
  justify-content: center;
  border: 2rpx solid #EF4444;
  font-weight: 500;
}
.delete-dialog {
  background: #FFFFFF;
  border-radius: 24rpx;
  padding: 40rpx;
  width: 560rpx;
}
.dialog-title {
  font-size: 34rpx;
  font-weight: 600;
  color: #2D264B;
  margin-bottom: 20rpx;
  display: block;
  text-align: center;
}
.delete-text {
  font-size: 28rpx;
  color: #7C758B;
  text-align: center;
  margin-bottom: 30rpx;
  display: block;
}
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
.dialog-btn.confirm-delete {
  background: #EF4444;
  color: #FFFFFF;
}
</style>
