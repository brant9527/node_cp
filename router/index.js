let express = require('express')
let app = express()
// let router = express.router()
const path = require('path')
let logger = require('morgan');

const segfaultHandler = require('segfault-handler');
segfaultHandler.registerHandler("crash.log");
let mongoDo = require('../mongodb/index')
let bodyParser = require('body-parser');
const smsUtil = require('../config/index.js')
const jwt = require('jsonwebtoken'); //用来生成token

const {
  setExKey,
  getKey
} = require('../config/redis')
const xss = require('node-xss').clean;
const session = require('express-session')
const cookieParser = require('cookie-parser')
// const random = require('string-random')
const middleLogin = require('../middlewares/checklogin')
app.use('/', express.static('public'))
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({
  extended: false
}));

app.use(logger('dev'))

app.all('*', function (req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Content-Type");
  res.header("Access-Control-Allow-Methods", "PUT,POST,GET,DELETE,OPTIONS");
  next();
})
app.use(session({
  secret: 'zhangyubin',
  cookie: {
    maxAge: 3600 * 1000 * 24 * 7
  },
  resave: true,
  saveUninitialized: true
}))
app.use(cookieParser())
// router.use(middleLogin)
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
app.post('/register', function (request, reply) {

  mongoDo.accountModel.find({
    num: request.body.num
  }, async function (err, docs) {
    if (err) {
      reply.send(err)
    }
    if (docs.length > 0) return reply.send({
      code: 422,
      result: false,
      message: '账号已被注册'
    })
    let code = await getKey(request.body.num)
    if (code != request.body.code) {
      return reply.send({
        code: 422,
        result: false,
        message: '输入验证码有误'
      })
    }
    mongoDo.accountModel.create(request.body, function (err, docs) {
      if (err) {
        reply.send(err)
      }
      reply.send({
        result: true,
        code: 200
      })
    })
  })

})
/**
 * 验证短信code
 */

/**
 * 
 * 登陆
 */
app.post('/login', function (request, reply) {
  let body = xss(request.body)
  mongoDo.accountModel.find(body, function (err, docs) {
    if (err) {
      reply.send(err)
    }
    if (docs.length > 0) {
      console.log(docs)
      reply.send({
        result: true,
        code: 200,
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
 * 随机code
 */
function randomCode() {
  let code = ''
  for (let index = 0; index < 4; index++) {
    code += Math.floor(Math.random() * 10)
  }
  return code
}
/**
 * 
 * @param {*} num 
 */

app.post('/sms', function (request, reply) {
  let code = randomCode()
  let params = code + ',120'
  let num = request.query.num || '18959292098'
  smsUtil.getResult(params, num).then(async res => {
    let result = await setExKey(num, 120, code)
    if (result === 'OK') {
      return reply.status(200).send({
        result: true,
        code: 200
      })
    } else {
      return reply.status(200).send({
        result: false,
        code: 503,
        msg: '注册太频繁，请稍等'
      })
    }

    // client.setex(phoneNum, 120, code, function (err, rep) {
    //   if (err) {
    //     return reply.status(200).send({
    //       result: false,
    //       code: 503,
    //       msg: '注册太频繁，请稍等'
    //     })
    //   }
    // })

  }).catch(err => {
    return reply.status(503).send({
      result: false,
      msg: err,
      code: 503,
    })
  })

})

function reg(str) {
  return new RegExp(str)
}
module.exports = app