var express = require('express');
var router = express.Router(); //可使用 express.Router 类创建模块化、可挂载的路由句柄
let mongoDo = require('../../mongodb/index')

const jwt = require('jsonwebtoken'); //用来生成token
const keyConfig = require('../../config/secretKey')
const xss = require('node-xss').clean;



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
            token: token,
            userInfo: docs[0]
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