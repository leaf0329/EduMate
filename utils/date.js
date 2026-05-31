/**
 * 日期/时间工具函数
 */

/**
 * 格式化日期为 YYYY-MM-DD HH:mm
 */
export function formatDateTime(date) {
  if (!date) return ''
  const d = new Date(date)
  return d.getFullYear() + '-' +
    String(d.getMonth() + 1).padStart(2, '0') + '-' +
    String(d.getDate()).padStart(2, '0') + ' ' +
    String(d.getHours()).padStart(2, '0') + ':' +
    String(d.getMinutes()).padStart(2, '0')
}

/**
 * 格式化日期为 YYYY-MM-DD
 */
export function formatDate(date) {
  if (!date) return ''
  const d = new Date(date)
  return d.getFullYear() + '-' +
    String(d.getMonth() + 1).padStart(2, '0') + '-' +
    String(d.getDate()).padStart(2, '0')
}

/**
 * 格式化时间为 HH:mm
 */
export function formatTime(t) {
  if (!t) return ''
  const d = new Date(t)
  return String(d.getHours()).padStart(2, '0') + ':' +
    String(d.getMinutes()).padStart(2, '0')
}

/**
 * 格式化中文日期：2024年1月15日 星期一
 */
export function formatChineseDate(date) {
  const d = new Date(date)
  const weekdays = ['日', '一', '二', '三', '四', '五', '六']
  return `${d.getFullYear()}年${d.getMonth() + 1}月${d.getDate()}日 星期${weekdays[d.getDay()]}`
}

/**
 * 判断计划是否逾期
 */
export function isPlanOverdue(plan) {
  if (!plan.deadline || plan.status === 1) return false
  const today = new Date()
  today.setHours(0, 0, 0, 0)
  return new Date(plan.deadline) < today
}

/**
 * 判断日期字符串是否在今天之前
 */
export function isBeforeToday(dateStr) {
  if (!dateStr) return false
  const today = new Date()
  today.setHours(0, 0, 0, 0)
  return new Date(dateStr) < today
}
