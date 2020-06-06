const db = require('./db.js')
const inquirer = require('inquirer')

module.exports.add = async (title) => {
  // 读之前的任务
  const list = await db.read()
  // 添加title任务
  list.push({title, done: false})
  // 保存任务文件
  await db.write(list)
}

module.exports.clear = async () => {
  await db.write([])
}

module.exports.showAll = async () => {
  const list = await db.read()

  inquirer
    .prompt([
      {
        type: 'list',
        name: 'index',
        message: '请选择一个任务',
        choices: [{name: '退出', value: '-1'}, ...list.map((task, index) => {
          return {
            name: `${task.done ? '[√]' : '[ ]'} ${index + 1} - ${task.title}`,
            value: index.toString()
          }
        }), {name: '+ 创建任务', value: '-2'}]
      }
    ])
    .then(answers => {
      const index = parseInt(answers.index)
      console.log(index)
      // const actions = {quit, markAsDone, markAsUndone, updateTitle, remove}
      if (index >= 0) {
        // 选中任务
        inquirer.prompt({
          type: 'list',
          name: 'action',
          message: '请选择一个操作',
          choices: [
            {name: '退出', value: 'quit'},
            {name: '已完成', value: 'markAsDone'},
            {name: '未完成', value: 'markAsUndone'},
            {name: '更改任务名称', value: 'updateTitle'},
            {name: '删除任务', value: 'remove'},
          ]
        }).then(answers2 => {
          // const action = actions[answers2.action]
          // console.log(action)
          switch (answers2.action) {
            case 'markAsDone':
              list[index].done = true
              db.write(list)
              break
            case 'markAsUndone':
              list[index].done = false
              db.write(list)
              break
            case 'updateTitle':
              inquirer.prompt({
                type: 'input',
                name: 'title',
                message: '请输入新的标题名',
                default: list[index].title
              },).then(answer => {
                list[index].title = answer.title
                db.write(list)
              })
              break
            case 'remove':
              list.splice(index, 1)
              db.write(list)
              break
          }
        })
      } else if (index === -2) {
        // 添加任务
        inquirer.prompt({
          type: 'input',
          name: 'title',
          message: '请输入任务标题'
        },).then(answer => {
          list.push({
            title: answer.title,
            done: false
          })
          db.write(list)
        })
      }
    })
}