/**
 * 网络请求封装模块
 * 基于 uni.request 封装统一的 HTTP 请求方法
 */
import CONFIG from './config'

/**
 * AI 对话请求
 * 调用硅基流动的 OpenAI 兼容接口
 */
export function sendAIMessage(messages) {
  return new Promise((resolve, reject) => {
    uni.request({
      url: CONFIG.AI.BASE_URL + '/chat/completions',
      method: 'POST',
      data: {
        model: CONFIG.AI.MODEL,
        messages: [
          {
            role: 'system',
            content: '你是一个智能学习助手，帮助大学生解答学习问题、制定学习计划、解释知识点。请使用友好、专业的语气回复。'
          },
          ...messages
        ],
        temperature: 0.7,
        max_tokens: 2000,
        stream: false
      },
      header: {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer ' + CONFIG.AI.API_KEY
      },
      timeout: 60000,
      success: (res) => {
        if (res.statusCode === 200 && res.data) {
          resolve(res.data)
        } else {
          reject({
            code: res.statusCode,
            message: res.data?.error?.message || 'AI 服务响应异常'
          })
        }
      },
      fail: (err) => {
        reject({
          code: -1,
          message: err.errMsg || '网络异常，请检查网络连接'
        })
      }
    })
  })
}
