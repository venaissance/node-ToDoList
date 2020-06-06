const { program } = require('commander');
const api = require('./index')

program
  .option('-x, --xxx', 'what')

program
  .command('add')
  .description('add task')
  .action((obj) => {
    api.add(obj.args.join(' '))
  });

program
  .command('clear')
  .description('clear tasks')
  .action((obj) => {
    console.log(obj.args)
  });

program.parse(process.argv);

