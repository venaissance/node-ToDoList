const homedir = require('os').homedir() // 系统HOME目录
const home = process.env.HOME || homedir // HOME变量
const fs = require('fs')
const path = require('path')
const dbPath = path.join(home, '.todo')

const db = {
  read(path = dbPath) {
    return new Promise((resolve, reject) => {
      fs.readFile(path, {flag: 'a+'}, (err, data) => {
        if (err) return reject(err)
        let list
        console.log('data', data.toString())
        try {
          list = JSON.parse(data.toString())
        } catch (e) {
          list = []
        }
        resolve(list)
      })
    })
  },
  write(list, path = dbPath) {
    return new Promise((resolve, reject) => {
      const string = JSON.stringify(list)
      fs.writeFile(path, string + '\n', (err) => {
        if (err) return reject(err)
        resolve()
      })
    })
  }
}

module.exports = db
