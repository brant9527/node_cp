let express = require('express')
let app = express()
const path = require('path')
let logger = require('morgan');

const segfaultHandler = require('segfault-handler');
segfaultHandler.registerHandler("crash.log");
// let mongoDo = require('../mongodb/index')
let bodyParser = require('body-parser');
const smsUtil = require('../config/index.js')

app.use('/', express.static('public'))
app.use(bodyParser.json())
app.use(logger('dev'))
app.all('*', function (req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Content-Type");
  res.header("Access-Control-Allow-Methods", "PUT,POST,GET,DELETE,OPTIONS");
  next();
})
/**
 * 发布行程
 */
app.post('/car/settrip', function (request, reply) {
  mongoDo.tripModel.create(request.body, function (err, docs) {
    if (err) {
      reply.send(err)
    }
    reply.send({
      result: true
    })
  })

})
/**
 *修改行程
 */
app.post('/car/updatetrip', function (request, reply) {
  console.log(request.body)
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
 * 获取行程
 */
app.get('/car/gettrip', function (request, reply) {
  let params = {}
  console.log(request.query)
  if (request.query.startAddress) {
    params.startAddress = reg(request.query.startAddress)
  } else if (request.query.endAddress) {
    params.endAddress = reg(request.query.endAddress)
  }
  params.creatTime = {
    $lt: Number(request.query.now)
  }
  params.roleValue = request.query.roleValue
  mongoDo.tripModel.find(params, null, {
    skip: Number(request.query.currentIndex) * 10,
    limit: 10
  }, function (err, docs) {
    if (err) {
      reply.send(err)
    }
    if (docs.length > 0) {
      reply.status(200).send({
        result: true,
        data: docs
      })
    } else {
      reply.status(200).send({
        result: false
      })
    }

  })

})
/**
 * 通过手机好吗获取已经发布行程
 */
app.get('/car/gettripByPhone', function (request, reply) {
  mongoDo.tripModel.find({
    accountId: request.query.accountId
  }, function (err, docs) {
    if (err) {
      reply.send(err)
    }
    if (docs.length < 1) reply.status(500).send({
      message: '没有相关记录'
    })
    else reply.send({
      carList: docs
    })
  })

})
/**
 * 判断是否已经登陆
 */
app.get('/isLogin', function (request, reply) {
  mongoDo.accountModel.find({
    _id: request.query.accountId
  }, function (err, docs) {
    if (err) {
      reply.send(err)
    }
    if (docs.length > 0) reply.send({
      result: true
    })
    else reply.send({
      result: false
    })
  })

})
/**
 * 注册
 */
app.post('/resign', function (request, reply) {
  mongoDo.accountModel.find({
    num: request.body.num
  }, function (err, docs) {
    console.log(err, docs)
    if (err) {
      reply.send(err)
    }
    if (docs.length > 0) return reply.send({
      result: false
    })
    mongoDo.accountModel.create(request.body, function (err, docs) {
      if (err) {
        reply.send(err)
      }
      reply.send({
        result: true
      })
    })
  })

})
/**
 * 
 * 登陆
 */
app.post('/login', function (request, reply) {
  mongoDo.accountModel.find(request.body, function (err, docs) {
    if (err) {
      reply.send(err)
    }
    if (docs.length > 0) {
      console.log(docs)
      reply.send({
        result: true,
        accountId: docs[0]._id
      })
    } else {
      reply.status(500).send({
        result: false,
        message: '用户账号或密码错误'
      })
    }
  })
})
/**
 * 删除行程
 */
app.post('/deleteTrip', function (request, reply) {
  mongoDo.tripModel.findByIdAndRemove(request.body.id, function (err, docs) {
    if (err) {
      reply.send(err)
    }
    if (docs) {
      reply.send({
        result: true
      })
    } else {
      reply.status(500).send({
        result: false,
        message: '没有记录'
      })
    }
  })
})
/**
 * 模糊搜索相关形成
 */
app.get('/address/about', function (request, reply) {
  let params = {}
  if (request.query.startAddress) {
    params.startAddress = reg(request.query.startAddress)
  } else if (request.query.endAddress) {
    params.endAddress = reg(request.query.endAddress)
  }
  mongoDo.tripModel.find(params, null, {
    limit: 20
  }, function (err, docs) {
    if (err) {
      reply.send(err)
    }
    if (docs) {
      reply.send({
        result: true,
        list: docs
      })
    }
  })
})
/**
 * 
 * @param {*} phoneNum 
 */

app.post('/sms', function (request, reply) {
  let params = {}
  let mob= request.query.mob||'18959292098'
  smsUtil.getResult(params,mob).then(res=>{
    console.log(res)
  }).catch(err=>{
    console.log(err)
  })
  return reply.send({
    result: true,
  })
})

function reg(str) {
  return new RegExp(str)
}
module.exports = app