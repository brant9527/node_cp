var express = require('express');
var router = express.Router(); //可使用 express.Router 类创建模块化、可挂载的路由句柄
let mongoDo = require('../../mongodb/index')

const jwt = require('jsonwebtoken'); //用来生成token
const keyConfig = require('../../config/secretKey')
const xss = require('node-xss').clean;
/**
 * 发布咨询
 */
router.post('/notice', function (request, reply) {
  console.log('公告')
  // mongoDo.tripModel.create(request.body, function (err, docs) {
  //   if (err) {
  //     reply.send(err)
  //   }
  //   reply.send({
  //     result: true
  //   })
  // })

})

/**
 *修改行程
 */
router.post('/updatetrip', function (request, reply) {
  mongoDo.tripModel.update({
    _id: request.body._id
  }, request.body, function (err, docs) {
    if (err) {
      reply.send(err)
    }
    reply.send({
      result: true
    })
  })

})


/**
 * 
 * 登陆
 */
router.post('/login', function (request, reply) {
  let body = xss(request.body)

  body.role = 1

  mongoDo.accountModel.find(body).then(docs => {
    if (docs.length > 0) {
      jwt.sign({
        name: request.body.num,
      }, keyConfig.secretKey, (err, token) => {
        return reply.send({
          result: true,
          code: 200,
          data: {
            token: token
          }
        })
      });
    } else {
      reply.status(200).send({
        result: false,
        message: '用户账号或密码错误',
        code: 401
      })
    }
  }).catch(err => {
    reply.status(500).send(err)
  })
})

module.exports = router; //暴露这个 router模块