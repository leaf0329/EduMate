<template>
  <view class="ai-page">
    <view class="ai-header">
      <text class="ai-header-title">AI 学习助手</text>
      <text class="ai-header-desc">遇到学习难题？随时向我提问</text>
    </view>

    <scroll-view class="chat-area" scroll-y="true" :scroll-into-view="scrollToId" scroll-with-animation>
      <view class="chat-container">
        <view class="welcome-msg" v-if="messages.length === 0">
          <text class="welcome-icon">🤖</text>
          <text class="welcome-title">你好！我是EduMate学习助手</text>
          <text class="welcome-hint">你可以问我学习问题、知识点解释，或让我帮你制定学习计划</text>
        </view>
        <view v-for="(msg, idx) in messages" :key="msg.id || idx">
          <ChatBubble :content="msg.content" :role="msg.role" :time="msg.time" />
        </view>
        <ThinkingAnimation :visible="isThinking" />
        <view id="bottom"></view>
      </view>
    </scroll-view>

    <view class="history-bar">
      <text class="history-btn" @tap="showHistoryPopup = true" v-if="chatHistory.length > 0">查看历史记录（{{ chatHistory.length }}）</text>
    </view>

    <view class="input-area">
      <input class="msg-input" v-model="question" placeholder="输入你想问的学习问题..." placeholder-class="ph" confirm-type="send" @confirm="sendMessage" :disabled="isThinking" />
      <button class="send-btn" @tap="sendMessage" :disabled="isThinking || !question.trim()">
        <text>{{ isThinking ? "..." : "发送" }}</text>
      </button>
    </view>

    <ModalDialog :visible.sync="showHistoryPopup">
      <view class="history-dialog-inner">
        <text class="dialog-title">历史对话（{{ chatHistory.length }}）</text>
        <scroll-view class="history-list" scroll-y="true">
          <view class="history-item" v-for="(item, idx) in chatHistory" :key="item.id">
            <view class="history-content" @tap="loadHistory(item)">
              <text class="history-q">Q: {{ item.question?.substring(0, 30) }}{{ item.question?.length > 30 ? "..." : "" }}</text>
            </view>
            <text class="history-delete" @tap.stop="deleteHistoryItem(item, $event)">删除</text>
          </view>
          <view class="empty-inline" v-if="chatHistory.length === 0">
            <text class="empty-sm">暂无历史记录</text>
          </view>
        </scroll-view>
        <view class="dialog-footer">
          <button class="dialog-btn clear-all" @tap="clearAllHistory">清空全部</button>
          <button class="dialog-btn close-btn" @tap="showHistoryPopup = false">关闭</button>
        </view>
      </view>
    </ModalDialog>
  </view>
</template>

<script>
import { sendAIMessage } from "../../utils/request"
import { getChatHistory, addChatRecord, clearChatHistory } from "../../utils/storage"
import ChatBubble from "../../components/ChatBubble.vue"
import ModalDialog from "../../components/ModalDialog.vue"
import ThinkingAnimation from "../../components/ThinkingAnimation.vue"

export default {
  components: { ChatBubble, ThinkingAnimation, ModalDialog },
  data() {
    return {
      question: "",
      messages: [],
      isThinking: false,
      scrollToId: "bottom",
      chatHistory: [],
      showHistoryPopup: false
    }
  },
  // 组件销毁前清理流式输出定时器，防止内存泄漏
  beforeDestroy() {
    if (this._streamTimer) {
      clearInterval(this._streamTimer)
      this._streamTimer = null
    }
  },
  onShow() {
    this.chatHistory = getChatHistory()
  },
  methods: {
    async sendMessage() {
      const q = this.question.trim()
      if (!q || this.isThinking) return

      this.messages.push({
        id: Date.now().toString(),
        content: q,
        role: "user",
        time: new Date().toISOString()
      })
      this.question = ""
      this.scrollToBottom()

      this.isThinking = true

      try {
        const apiMessages = this.messages
          .filter(m => m.role !== "system")
          .map(m => ({ role: m.role, content: m.content }))

        const res = await sendAIMessage(apiMessages)
        const fullAnswer = res.choices?.[0]?.message?.content || "抱歉，我没有理解你的问题，请重新描述一下。"

        this.isThinking = false

        const msgId = Date.now().toString()
        this.messages.push({
          id: msgId,
          content: "",
          role: "assistant",
          time: new Date().toISOString()
        })
        this.scrollToBottom()

        let displayedLen = 0
        const step = 7
        this._streamTimer = setInterval(() => {
          const nextLen = Math.min(displayedLen + step, fullAnswer.length)
          const msg = this.messages.find(m => m.id === msgId)
          if (msg) {
            msg.content = fullAnswer.substring(0, nextLen)
          }
          displayedLen = nextLen
          this.scrollToBottom()
          if (displayedLen >= fullAnswer.length) {
            clearInterval(this._streamTimer)
            this._streamTimer = null
            this.messages = this.messages.map(m => m.id === msgId ? { ...m, content: fullAnswer } : m)
            addChatRecord({ question: q, answer: fullAnswer })
            this.chatHistory = getChatHistory()
          }
        }, 40)
      } catch (e) {
        const errMsg = e?.message || e?.errMsg || "网络异常或API连接失败"
        this.messages.push({
          id: Date.now().toString(),
          content: "[AI服务连接失败] " + errMsg,
          role: "assistant",
          time: new Date().toISOString()
        })
        addChatRecord({ question: q, answer: "[AI服务连接失败] " + errMsg })
        this.chatHistory = getChatHistory()
      }
      this.isThinking = false
      this.scrollToBottom()
    },
    scrollToBottom() {
      setTimeout(() => {
        this.scrollToId = "bottom"
      }, 100)
    },
    toggleHistory() {
      this.chatHistory = getChatHistory()
      this.showHistoryPopup = true
    },
    loadHistory(item) {
      this.messages = [
        { id: "h-" + item.id, content: item.question, role: "user", time: item.createdAt },
        { id: "h-" + item.id + "-r", content: item.answer, role: "assistant", time: item.createdAt }
      ]
      this.showHistoryPopup = false
      this.scrollToBottom()
    },
    deleteHistoryItem(item, e) {
      if (e) e.stopPropagation()
      const history = getChatHistory()
      const newHistory = history.filter(h => h.id !== item.id)
      uni.setStorageSync("edumate_chat_history", newHistory)
      const updated = getChatHistory()
      this.chatHistory = updated
      if (updated.length === 0) {
        this.showHistoryPopup = false
      }
      if (this.messages.length === 2 && this.messages[0]?.id === "h-" + item.id) {
        this.messages = []
      }
      uni.showToast({ title: "已删除", icon: "none" })
    },
    clearAllHistory() {
      uni.showModal({
        title: "确认清空",
        content: "确定要清空所有历史对话记录吗？",
        success: (res) => {
          if (res.confirm) {
            clearChatHistory()
            this.chatHistory = []
            this.messages = []
            this.showHistoryPopup = false
            uni.showToast({ title: "已清空", icon: "success" })
          }
        }
      })
    },
    formatTime(t) {
      if (!t) return ""
      const d = new Date(t)
      return `${d.getMonth()+1}/${d.getDate()} ${String(d.getHours()).padStart(2,"0")}:${String(d.getMinutes()).padStart(2,"0")}`
    }
  }
}
</script>

<style scoped>
.ai-page {
  display: flex;
  flex-direction: column;
  height: 100vh;
  background: #F8F6F0;
}
.ai-header {
  background: linear-gradient(145deg, #4338CA, #6366F1);
  padding: 40rpx 30rpx;
  padding-bottom: 50rpx;
  border-bottom-left-radius: 28rpx;
  border-bottom-right-radius: 28rpx;
}
.ai-header-title {
  font-size: 40rpx;
  font-weight: 700;
  color: #FFFFFF;
  display: block;
}
.ai-header-desc {
  font-size: 26rpx;
  color: rgba(255,255,255,0.8);
  margin-top: 8rpx;
  display: block;
}
.chat-area {
  flex: 1;
  padding: 20rpx 30rpx;
}
.chat-container {
  display: flex;
  flex-direction: column;
  min-height: 100%;
}
.welcome-msg {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 80rpx 40rpx;
  text-align: center;
}
.welcome-icon {
  font-size: 80rpx;
  margin-bottom: 20rpx;
}
.welcome-title {
  font-size: 32rpx;
  font-weight: 700;
  color: #2D264B;
  margin-bottom: 16rpx;
}
.welcome-hint {
  font-size: 26rpx;
  color: #B0A9BE;
  line-height: 1.6;
}
.history-bar {
  text-align: center;
  padding: 12rpx 0;
  background: #F8F6F0;
}
.history-btn {
  font-size: 24rpx;
  color: #4338CA;
  font-weight: 500;
}
.input-area {
  display: flex;
  align-items: center;
  padding: 20rpx 30rpx;
  background: #FFFDF8;
  border-top: 2rpx solid #E8E3D8;
  padding-bottom: calc(20rpx + env(safe-area-inset-bottom));
}
.msg-input {
  flex: 1;
  height: 72rpx;
  background: #F8F6F0;
  border-radius: 36rpx;
  padding: 0 30rpx;
  font-size: 28rpx;
  color: #2D264B;
  border: 2rpx solid #E8E3D8;
}
.ph { color: #B0A9BE; }
.send-btn {
  width: 120rpx;
  height: 72rpx;
  background: linear-gradient(145deg, #4338CA, #6366F1);
  color: #FFFFFF;
  font-size: 28rpx;
  font-weight: 600;
  border-radius: 36rpx;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-left: 16rpx;
  border: none;
  box-shadow: 0 4rpx 12rpx rgba(67, 56, 202, 0.2);
}
.send-btn[disabled] {
  background: #C0B9C8;
  box-shadow: none;
}
.history-dialog-inner {
  max-height: 70vh;
}
.dialog-title {
  font-size: 34rpx;
  font-weight: 700;
  color: #2D264B;
  margin-bottom: 20rpx;
  display: block;
  text-align: center;
}
.history-list {
  max-height: 500rpx;
  margin-bottom: 20rpx;
}
.history-item {
  display: flex;
  align-items: center;
  padding: 24rpx 0;
  border-bottom: 2rpx solid #F0EDE6;
}
.history-content {
  flex: 1;
  padding: 8rpx 0;
}
.history-q {
  font-size: 28rpx;
  color: #2D264B;
  display: block;
  margin-bottom: 8rpx;
}
.history-t {
  font-size: 22rpx;
  color: #B0A9BE;
  display: block;
}
.history-delete {
  font-size: 24rpx;
  color: #EF4444;
  padding: 8rpx 16rpx;
  font-weight: 500;
}
.dialog-footer {
  display: flex;
  gap: 20rpx;
}
.dialog-btn {
  flex: 1;
  height: 72rpx;
  border-radius: 36rpx;
  font-size: 28rpx;
  font-weight: 600;
  display: flex;
  align-items: center;
  justify-content: center;
  border: none;
}
.dialog-btn.clear-all {
  background: #FEF2F2;
  color: #EF4444;
}
.dialog-btn.close-btn {
  background: #F0EDE6;
  color: #7C758B;
}
.empty-inline {
  text-align: center;
  padding: 40rpx 0;
}
.empty-sm {
  font-size: 26rpx;
  color: #B0A9BE;
}
</style>
