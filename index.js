const db = require('./db.js')
const inquirer = require('inquirer')

// 1. 添加任务
module.exports.add = async (title) => {
  // 读之前的任务
  const list = await db.read()
  // 添加title任务
  list.push({title, done: false})
  // 保存任务文件
  await db.write(list)
}

// 2. 清除所有任务
module.exports.clear = async () => {
  await db.write([])
}

// 3. 展示所有任务
module.exports.showAll = async () => {
  const list = await db.read()
  // 打印任务列表
  printTasks(list)
}

function printTasks(list) {
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
      if (index >= 0) {
        // 询问任务操作
        askForAction(list, index)
      } else if (index === -2) {
        // 添加任务
        askForCreateTask(list)
      }
    })
}

function askForAction(list, index) {
  const actions = {markAsDone, markAsUndone, updateTitle, remove}
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
  }).then(answers => {
    const action = actions[answers.action]
    action && action(list, index)
  })
}

function askForCreateTask(list) {
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

function markAsDone(list, index) {
  list[index].done = true
  db.write(list)
}

function markAsUndone(list, index) {
  list[index].done = false
  db.write(list)
}

function updateTitle(list, index) {
  inquirer.prompt({
    type: 'input',
    name: 'title',
    message: '请输入新的标题名称',
    default: list[index].title
  },).then(answer => {
    list[index].title = answer.title
    db.write(list)
  })
}

function remove(list, index) {
  list.splice(index, 1)
  db.write(list)
}
