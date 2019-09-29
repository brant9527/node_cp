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
 * 查询公告列表
 */
router.get('/getNotice', function (request, reply) {
  let pageSize = Number(request.query.pageSize)
  let pageNum = Number(request.query.pageNum)

  let config = {
    limit: pageSize || 1,
    skip: pageSize * pageNum,
    sort: {
      'opentimestamp': -1
    }
  }
  if (!(pageSize * pageNum)) {
    delete config.skip
  }
  mongoDo.noticeModel.find({}, null, config).then(docs => {
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
/**
 * 查询公告列表
 */
router.get('/getNoticeById', function (request, reply) {
  let id = request.query.id
  mongoDo.noticeModel.find({
    _id: id
  }).then(docs => {
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
 * 新增新闻
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
 * 删除新闻
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
  let pageSize = Number(request.query.pageSize)
  let pageNum = Number(request.query.pageNum)

  let config = {
    limit: pageSize || 1,
    skip: pageSize * pageNum,
    sort: {
      'opentimestamp': -1
    }
  }
  if (!(pageSize * pageNum)) {
    delete config.skip
  }
  mongoDo.newsModel.find({}, null, config).then(docs => {
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
/**
 * 新增专家
 */
router.post('/addExpert', function (request, reply) {
  let body = xss(request.body)
  body.createTime = new Date().getTime()
  mongoDo.expertModel.create(body).then(res => {
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
 * 删除专家
 */
router.post('/delExpert', function (request, reply) {
  let body = request.body
  let list = body.list
  let ids = list.map(item => item._id)
  mongoDo.expertModel.remove({
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
 * 查询茶砖
 */
router.get('/getExpert', function (request, reply) {
  let body = xss(request.query)
  mongoDo.expertModel.find(body).then(docs => {
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

/**
 * 查询茶砖
 */
router.get('/getProduct', function (request, reply) {
  let body = xss(request.query)
  mongoDo.productModel.find(body).then(docs => {
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

/**
 * 新增产品
 */
router.post('/addProduct', function (request, reply) {
  let body = xss(request.body)
  body.createTime = new Date().getTime()
  mongoDo.productModel.create(body).then(res => {
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
 * 删除产品
 */
router.post('/delProduct', function (request, reply) {
  let body = request.body
  let list = body.list
  let ids = list.map(item => item._id)
  mongoDo.productModel.remove({
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
 * 新增产品
 */
router.post('/addContact', function (request, reply) {
  let body = xss(request.body)
  let wx = {
    type: body.wx ? 1 : 2,
    contact: body.wx
  }
  let qq = {
    type: body.wx ? 1 : 2,
    contact: body.qq
  }
  let arys = []
  arys.push(wx, qq)
  mongoDo.contactModel.remove()
  mongoDo.contactModel.insertMany(arys).then(res => {
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
 * 查询联系方式
 */
router.get('/getContact', function (request, reply) {
  mongoDo.contactModel.find().then(docs => {
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
/**
 * 新增玩法
 */
router.post('/addPlays', function (request, reply) {
  let body = xss(request.body)
  body.createTime = new Date().getTime()

  mongoDo.playsModel.create(body).then(res => {
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
 * 删除技巧
 */
router.post('/delPlays', function (request, reply) {
  let body = request.body
  let list = body.list
  let ids = list.map(item => item._id)
  mongoDo.playsModel.remove({
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
 * 查询技巧列表
 */
router.get('/getPlays', function (request, reply) {
  let pageSize = Number(request.query.pageSize)
  let pageNum = Number(request.query.pageNum)

  let config = {
    limit: pageSize || 1,
    skip: pageSize * pageNum,
    sort: {
      'opentimestamp': -1
    }
  }
  if (!(pageSize * pageNum)) {
    delete config.skip
  }
  mongoDo.playsModel.find({}, null, config).then(docs => {
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
/**
 * 查询技巧列表byid
 */
router.get('/getPlaysById', function (request, reply) {
  let id = request.query.id
  mongoDo.playsModel.find({
    _id: id
  }).then(docs => {
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
/**
 * 新增答疑
 */
router.post('/addAnswer', function (request, reply) {
  let body = xss(request.body)
  body.createTime = new Date().getTime()

  mongoDo.answerModel.create(body).then(res => {
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
 * 删除答疑
 */
router.post('/delAnswer', function (request, reply) {
  let body = request.body
  let list = body.list
  let ids = list.map(item => item._id)
  mongoDo.answerModel.remove({
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
 * 查询答疑列表
 */
router.get('/getAnswer', function (request, reply) {
  let pageSize = Number(request.query.pageSize)
  let pageNum = Number(request.query.pageNum)

  let config = {
    limit: pageSize || 1,
    skip: pageSize * pageNum,
    sort: {
      'opentimestamp': -1
    }
  }
  if (!(pageSize * pageNum)) {
    delete config.skip
  }
  mongoDo.answerModel.find({}, null, config).then(docs => {
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