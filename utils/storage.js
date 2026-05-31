/**
 * 鏈湴瀛樺偍宸ュ叿妯″潡
 * 灏佽 uni-app Storage 鎿嶄綔锛岀鐞嗙敤鎴?璁″垝/绗旇/AI瀵硅瘽鏁版嵁
 */

const STORAGE_KEYS = {
  USER: 'edumate_user',
  PLANS: 'edumate_plans',
  NOTES: 'edumate_notes',
  CHAT_HISTORY: 'edumate_chat_history',
  LOGIN_STATUS: 'edumate_login_status'
}

/**
 * 鑾峰彇瀛樺偍鏁版嵁
 */
function getData(key) {
  try {
    const data = uni.getStorageSync(key)
    return data || null
  } catch (e) {
    console.error('璇诲彇瀛樺偍澶辫触:', e)
    return null
  }
}

/**
 * 璁剧疆瀛樺偍鏁版嵁
 */
function setData(key, value) {
  try {
    uni.setStorageSync(key, value)
    return true
  } catch (e) {
    console.error('鍐欏叆瀛樺偍澶辫触:', e)
    return false
  }
}

/**
 * 绉婚櫎瀛樺偍鏁版嵁
 */
function removeData(key) {
  try {
    uni.removeStorageSync(key)
    return true
  } catch (e) {
    console.error('鍒犻櫎瀛樺偍澶辫触:', e)
    return false
  }
}

// ==================== 鐢ㄦ埛鐩稿叧 ====================

export function saveUser(userInfo) {
  return setData(STORAGE_KEYS.USER, userInfo)
}

export function getUser() {
  return getData(STORAGE_KEYS.USER)
}

export function removeUser() {
  return removeData(STORAGE_KEYS.USER)
}

export function saveLoginStatus(status) {
  return setData(STORAGE_KEYS.LOGIN_STATUS, status)
}

export function getLoginStatus() {
  return getData(STORAGE_KEYS.LOGIN_STATUS) || false
}

export function clearLoginStatus() {
  return removeData(STORAGE_KEYS.LOGIN_STATUS)
}

// ==================== 瀛︿範璁″垝鐩稿叧 ====================

export function getPlans() {
  return getData(STORAGE_KEYS.PLANS) || []
}

export function savePlans(plans) {
  return setData(STORAGE_KEYS.PLANS, plans)
}

export function addPlan(plan) {
  const plans = getPlans()
  plan.id = Date.now().toString()
  plan.createdAt = new Date().toISOString()
  plan.status = 0 // 0:鏈畬鎴?1:宸插畬鎴?
  plans.push(plan)
  return savePlans(plans)
}

export function updatePlan(id, updates) {
  const plans = getPlans()
  const index = plans.findIndex(p => p.id === id)
  if (index !== -1) {
    plans[index] = { ...plans[index], ...updates }
    savePlans(plans)
    return plans[index]
  }
  return null
}

export function deletePlan(id) {
  const plans = getPlans().filter(p => p.id !== id)
  return savePlans(plans)
}

export function togglePlanStatus(id) {
  const plans = getPlans()
  const plan = plans.find(p => p.id === id)
  if (plan) {
    plan.status = plan.status === 0 ? 1 : 0
    savePlans(plans)
    return plan
  }
  return null
}

// ==================== 瀛︿範绗旇鐩稿叧 ====================

export function getNotes() {
  return getData(STORAGE_KEYS.NOTES) || []
}

export function saveNotes(notes) {
  return setData(STORAGE_KEYS.NOTES, notes)
}

export function addNote(note) {
  const notes = getNotes()
  note.id = Date.now().toString()
  note.createdAt = new Date().toISOString()
  note.updatedAt = note.createdAt
  notes.unshift(note)
  return saveNotes(notes)
}

export function updateNote(id, updates) {
  const notes = getNotes()
  const index = notes.findIndex(n => n.id === id)
  if (index !== -1) {
    updates.updatedAt = new Date().toISOString()
    notes[index] = { ...notes[index], ...updates }
    saveNotes(notes)
    return notes[index]
  }
  return null
}

export function deleteNote(id) {
  const notes = getNotes().filter(n => n.id !== id)
  return saveNotes(notes)
}

export function searchNotes(keyword) {
  const notes = getNotes()
  const kw = keyword.toLowerCase()
  return notes.filter(n =>
    n.title.toLowerCase().includes(kw) ||
    n.content.toLowerCase().includes(kw)
  )
}

// ==================== AI瀵硅瘽鐩稿叧 ====================

export function getChatHistory() {
  return getData(STORAGE_KEYS.CHAT_HISTORY) || []
}

export function saveChatHistory(history) {
  return setData(STORAGE_KEYS.CHAT_HISTORY, history)
}

export function addChatRecord(record) {
  const history = getChatHistory()
  record.id = Date.now().toString()
  record.createdAt = new Date().toISOString()
  history.push(record)
  saveChatHistory(history)
  return record
}

export function clearChatHistory() {
  return removeData(STORAGE_KEYS.CHAT_HISTORY)
}


// ==================== 姣忔棩鎵撳崱鐩稿叧 ====================

export function getCheckinDates() {
  return getData("edumate_checkin_dates") || []
}

export function saveCheckinDate(dateStr) {
  const dates = getCheckinDates()
  if (!dates.includes(dateStr)) {
    dates.push(dateStr)
    setData("edumate_checkin_dates", dates)
    return true
  }
  return false
}

export function isCheckedInToday() {
  const today = new Date()
  const dateStr = today.getFullYear() + "-" + String(today.getMonth()+1).padStart(2,"0") + "-" + String(today.getDate()).padStart(2,"0")
  return getCheckinDates().includes(dateStr)
}

export function getCheckinCount() {
  return getCheckinDates().length
}

export function getCheckinStreak() {
  const dates = getCheckinDates().sort()
  if (dates.length === 0) return 0
  let streak = 1
  for (let i = dates.length - 1; i > 0; i--) {
    const curr = new Date(dates[i])
    const prev = new Date(dates[i-1])
    const diffDays = (curr - prev) / (1000 * 60 * 60 * 24)
    if (diffDays === 1) {
      streak++
    } else {
      break
    }
  }
  return streak
}
// ==================== 娓呯┖鎵€鏈夋暟鎹?====================

export function clearAllData() {
  try {
    uni.clearStorageSync()
    return true
  } catch (e) {
    console.error('娓呯┖缂撳瓨澶辫触:', e)
    return false
  }
}

