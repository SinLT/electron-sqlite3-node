class Sqlite3Db {
  constructor () {
    this.sq3 = require('sqlite3')
    this.path = require('path')
    this.sqPath = 'C:\\app'
    this.table = 'storage'
    this.dbPath = this.path.join(this.sqPath, 'chindeo.app')
    this.sqlite3 = this.sq3.verbose()
    this.connected = false
  }
  async createPath () {
    await files.dirExists(this.sqPath)
  }
  seletcKey (table, value) {
    return new Promise((resolve, reject) => {
      this.db.get(`select key from ${table} where key like '${value}'`, (err, res) => {
        if (err) {
          console.err(err)
          reject(err)
        } else {
          resolve(res)
        }
      })
    })
  }
  seletcValue (table, key) {
    return new Promise((resolve, reject) => {
      this.db.get(`select value from ${table} where key like '${key}'`, (err, res) => {
        if (err) {
          console.err(err)
          reject(err)
        } else {
          if (res) {
            resolve(res.value)
          } else {
            resolve('')
          }
        }
      })
    })
  }
  insertKey (table, value) {
    return new Promise((resolve, reject) => {
      this.db.run(`insert into ${table} (key) values('${value}')`, (err, res) => {
        if (err) {
          console.err(err)
          reject(err)
        } else {
          resolve(res)
        }
      })
    })
  }
  updateValue (table, key, value) {
    return new Promise((resolve, reject) => {
      this.db.run(`update ${table} set value='${value}' where key='${key}'`, (err, res) => {
        if (err) {
          console.err(err)
          reject(err)
        } else {
          resolve(res)
        }
      })
    })
  }
  deleteKey (table, key) {
    return new Promise((resolve, reject) => {
      this.db.run(`delete from ${table} where key='${key}'`, (err, res) => {
        if (err) {
          console.err(err)
          reject(err)
        } else {
          resolve(res)
        }
      })
    })
  }
  async setItem (key, value) {
    const isValue = await this.seletcKey(this.table, key)
    if (!isValue) {
      await this.insertKey(this.table, key)
    }
    this.updateValue(this.table, key, value)
  }
  async getItem (key) {
    const value = this.seletcValue(this.table, key)
    return value
  }
  removeItem (key) {
    this.deleteKey(this.table, key)
  }
  async init () {
    await this.createPath()
    this.db = new this.sqlite3.Database(this.dbPath)
    this.db.serialize(async () => {
      this.db.prepare(`create table if not exists ${this.table} (key text,value text)`).run().finalize()
      this.connected = true
      console.log('sqlite3初始化成功')
    })
  }
}

const sqlite3 = new Sqlite3Db()
window.Sqlite3Db = sqlite3
sqlite3.init()
