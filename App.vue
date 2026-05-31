<script>
import { getLoginStatus } from "./utils/storage"

export default {
  onLaunch: function() {
    console.log("EduMate 启动")
    // 检查登录状态
    const isLoggedIn = getLoginStatus()
    if (!isLoggedIn) {
      uni.reLaunch({
        url: "/pages/login/login"
      })
    }
  },
  onShow: function() {
    console.log("App Show")
  },
  onHide: function() {
    console.log("App Hide")
  }
}
</script>

<style>
page {
  font-family: "PingFang SC", "Noto Sans SC", -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif;
  font-size: 28rpx;
  color: #2D264B;
  background: #F8F6F0;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
}
button {
  padding: 0;
  line-height: inherit;
  background: none;
  border-radius: 0;
}
button::after {
  border: none;
}
::-webkit-scrollbar {
  width: 0;
  height: 0;
}
::selection {
  background: #EEF1FF;
  color: #4338CA;
}
</style>


