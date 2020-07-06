#!/usr/bin/env node

const { program } = require('commander')
const api = require('./index')
const pkg = require('./package.json')

program
  .version(pkg.version)
program
  .option('-A, --add', '添加任务')
program
  .option('-C, --clear', '清空任务')

program
  .command('add <taskName>')
  .description('添加任务')
  .action((obj) => {
    api.add(obj.args.join(' ')).then(() => console.log('添加成功！'), () => console.log('添加失败！'))
  })

program
  .command('clear')
  .description('[危险] 清空任务列表')
  .action(() => {
    api.clear().then(() => console.log('清除成功！'), () => console.log('清除失败！'))
  })

program
  .arguments('')
  .action(() => {
    void api.showAll() // 去除不加then的警告
  })

program.parse(process.argv)
