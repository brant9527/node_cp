var express = require('express');
var router = express.Router(); //可使用 express.Router 类创建模块化、可挂载的路由句柄
let mongoDo = require('../../mongodb/index')
const xss = require('node-xss').clean;


/**
 * 新增公告
 */
router.post('/addNotice', function (request, reply) {
  let body = xss(request.body)
  body.createTime = new Date().getTime()

  mongoDo.noticeModel.create(body).then(res => {
    reply.send({
      code: 200,
      message: '成功'
    })
  }).catch(err => {
    reply.send({
      code: 402,
      message: '失败'
    })
  })
})
/**
 * 删除公告
 */
router.post('/delNotice', function (request, reply) {
  let body = request.body
  let list = body.list
  let ids = list.map(item => item._id)
  mongoDo.noticeModel.remove({
    _id: {
      $in: ids
    }
  }).then(res => {
    reply.send({
      code: 200,
      message: '成功'
    })
  }).catch(err => {
    reply.send({
      code: 400,
      message: err
    })
  })
})
/**
 * 查询彩种
 */
router.get('/getNotice', function (request, reply) {
  mongoDo.noticeModel.find().then(docs => {
    reply.send({
      code: 200,
      data: docs,
      message: '成功'
    })
  }).catch(err => {
    reply.send({
      code: 402,
      message: '失败'
    })
  })
})
//配置路由
/**
 * 新增彩种
 */
router.post('/addNews', function (request, reply) {
  let body = xss(request.body)
  body.createTime = new Date().getTime()
  mongoDo.newsModel.create(body).then(res => {
    reply.send({
      code: 200,
      message: '成功'
    })
  }).catch(err => {
    reply.send({
      code: 402,
      message: '失败'
    })
  })
})
/**
 * 删除公告
 */
router.post('/delNews', function (request, reply) {
  let body = request.body
  let list = body.list
  let ids = list.map(item => item._id)
  mongoDo.newsModel.remove({
    _id: {
      $in: ids
    }
  }).then(res => {
    reply.send({
      code: 200,
      message: '成功'
    })
  }).catch(err => {
    reply.send({
      code: 400,
      message: err
    })
  })
})
/**
 * 查询新闻
 */
router.get('/getNews', function (request, reply) {
  let body = xss(request.query)
  mongoDo.newsModel.find(body).then(docs => {
    reply.send({
      code: 200,
      data: docs,
      message: '成功'
    })
  }).catch(err => {
    reply.send({
      code: 402,
      message: '失败'
    })
  })
})

module.exports = router; //暴露这个 router模块