/**
 * EduMate 应用配置
 *
 * 敏感信息（API Key 等）统一管理，避免散落在各模块中。
 * 生产环境建议通过环境变量或后端代理注入，不硬编码在客户端。
 */
const CONFIG = {
  AI: {
    // 硅基流动 OpenAI 兼容 API 地址
    BASE_URL: 'https://api.siliconflow.cn/v1',
    // API Key — deepseek-ai/DeepSeek-V3.2
    API_KEY: 'sk-irw*********************************************',
    MODEL: 'deepseek-ai/DeepSeek-V3.2'
  }
}

export default CONFIG
