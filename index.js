const db = require('./db.js')

module.exports.add = async (title) => {
  // 读之前的任务
  const list = await db.read()
  // 添加title任务
  list.push({title, done: false})
  // 保存任务文件
  await db.write(list)
}