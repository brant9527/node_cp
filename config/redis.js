const redis = require('redis')
const client = redis.createClient(6379, 'localhost')

let setKey = (key, value) => {
  return new Promise((resolve, reject) => {
    client.set(key, value, function (err, reply) {
      if (err) {
        reject(err)
      }
      resolve(reply)
    })
  })
}
let setExKey = (key, seconds, value) => {
  return new Promise((resolve, reject) => {
    client.setex(key, seconds, value, function (err, reply) {
      if (err) {
        reject(err)
      }
      resolve(reply)
    })
  })
}
let getKey = (key) => {
  return new Promise((resolve, reject) => {
    client.get(key, function (err, res) {
      if (err) {
        reject(err)
      }
      resolve(res)
    })
  })
}
module.exports = {
  setKey,
  getKey,
  setExKey
}