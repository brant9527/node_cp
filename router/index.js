let express = require('express')
let app = express()

const path = require('path')
let logger = require('morgan');

const segfaultHandler = require('segfault-handler');
segfaultHandler.registerHandler("crash.log");
let mongoDo = require('../mongodb/index')
let bodyParser = require('body-parser');
const smsUtil = require('../config/index.js')
const jwt = require('jsonwebtoken'); //用来生成token
const keyConfig = require('../config/secretKey')
    // const uid = require('uid')
const {
    setExKey,
    getKey
} = require('../config/redis')
const xss = require('node-xss').clean;
const session = require('express-session')
const cookieParser = require('cookie-parser')
const order = require('../config/path')
    // const random = require('string-random')
const middleLogin = require('../middlewares/checklogin')

const admin = require('./admin/index')
const lottery = require('./lottery/index')
const main = require('./main/index')

app.use('/', express.static('soul'))
app.use('/soul', express.static('soul'));
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({
    extended: false
}));

// app.use(logger('dev'))

// app.all('*', function(req, res, next) {
//     res.header("Access-Control-Allow-Origin", "*");
//     res.header("Access-Control-Allow-Headers", "Content-Type");
//     res.header("Access-Control-Allow-Methods", "PUT,POST,GET,DELETE,OPTIONS");
//     next();
// })
// app.use(session({
//     secret: keyConfig.secretKey,
//     cookie: {
//         maxAge: 3600 * 1000 * 24 * 7
//     },
//     resave: true,
//     saveUninitialized: true
// }))
// app.use(cookieParser())
//     // router.use(middleLogin)
// app.use(function(req, res, next) {
//     // let token = req.get("Authorization")
//     // jwt.verify(token, keyConfig.secretKey, (error, decoded) => {
//     //     if (order.order.whites.includes(req.path) || /\/css\/|\/js\//.test(req.path)) {
//     //         next()
//     //     } else {
//     //         if (error) {
//     //             return res.status(401).send({
//     //                 code: 401,
//     //                 result: false
//     //             })
//     //         } else {
//     //             next()
//     //         }
//     //     }
//     // })

// })


// /**
//  * 注册
//  */
// app.post('/register', function(request, reply) {

//         mongoDo.accountModel.find({
//             num: request.body.num
//         }).then(async doc => {
//             if (doc.length > 0) return reply.send({
//                 code: 422,
//                 result: false,
//                 message: '账号已被注册'
//             })
//             let code = await getKey(request.body.num)
//             if (request.body.code && !code) {
//                 return reply.send({
//                     code: 422,
//                     result: false,
//                     message: '验证码已过期'
//                 })
//             }
//             if (code != request.body.code) {
//                 return reply.send({
//                     code: 422,
//                     result: false,
//                     message: '输入验证码有误'
//                 })
//             }
//             request.body.role = 2
//             mongoDo.accountModel.create(request.body).then(() => {
//                 reply.send({
//                     result: true,
//                     code: 200
//                 })
//             }).catch(err => {
//                 reply.send(err)
//             })
//         }).catch(err => {
//             reply.send(err)
//         })
//     })
//     /**
//      * 注册
//      */
// app.post('/change', function(request, reply) {
//     let num = request.body.num
//     let psw = request.body.psw
//     let oldPsw = request.body.oldPsw
//     mongoDo.accountModel.find({
//         num: num
//     }).then(async doc => {
//         if (doc.length < 1) return reply.send({
//             code: 422,
//             result: false,
//             message: '账号异常'
//         })

//         if (doc[0].psw != oldPsw) {
//             return reply.send({
//                 code: 422,
//                 result: false,
//                 message: '输入的旧密码有误，请重新输入'
//             })
//         }
//         mongoDo.accountModel.update({
//             num
//         }, {
//             $set: {
//                 psw
//             }
//         }).then(() => {
//             reply.send({
//                 result: true,
//                 code: 200
//             })
//         }).catch(err => {
//             reply.send(err)
//         })
//     }).catch(err => {
//         reply.send(err)
//     })
// })

// /**
//  * 
//  * 登陆
//  */
// app.post('/login', function(request, reply) {

//         let body = xss(request.body)
//         mongoDo.accountModel.find(body).then((docs) => {
//             if (docs.length > 0) {
//                 jwt.sign({
//                     name: request.body.num,
//                 }, keyConfig.secretKey, (err, token) => {
//                     return reply.send({
//                         result: true,
//                         code: 200,
//                         data: {
//                             token: token,
//                             userInfo: docs[0].num
//                         }
//                     })
//                 })
//             } else {
//                 return reply.status(422).send({
//                     result: true,
//                     code: 422,
//                     message: '此账号待注册'
//                 })
//             }

//         }).catch(err => {
//             return reply.status(401).send({
//                 result: false,
//                 message: '用户账号或密码错误',
//                 code: 401
//             })
//         })
//     })
//     /**
//      * 删除行程
//      */
// app.post('/deleteTrip', function(request, reply) {
//         mongoDo.tripModel.findByIdAndRemove(request.body.id, function(err, docs) {
//             if (err) {
//                 reply.send(err)
//             }
//             if (docs) {
//                 reply.send({
//                     result: true
//                 })
//             } else {
//                 reply.status(500).send({
//                     result: false,
//                     message: '没有记录'
//                 })
//             }
//         })
//     })
//     /**
//      * 模糊搜索相关形成
//      */
// app.get('/address/about', function(request, reply) {
//         let params = {}
//         if (request.query.startAddress) {
//             params.startAddress = reg(request.query.startAddress)
//         } else if (request.query.endAddress) {
//             params.endAddress = reg(request.query.endAddress)
//         }
//         mongoDo.tripModel.find(params, null, {
//             limit: 20
//         }, function(err, docs) {
//             if (err) {
//                 reply.send(err)
//             }
//             if (docs) {
//                 reply.send({
//                     result: true,
//                     list: docs
//                 })
//             }
//         })
//     })
//     /**
//      * 随机code
//      */
// function randomCode() {
//     let code = ''
//     for (let index = 0; index < 4; index++) {
//         code += Math.floor(Math.random() * 10)
//     }
//     return code
// }
// /**
//  * 
//  * @param {*} num 
//  */

// app.post('/sms', function(request, reply) {
//     let code = randomCode()
//     let params = code
//     let num = request.body.num
//     smsUtil.getResult(params, num).then(async res => {
//         if (res.data.code !== '000000') {
//             return reply.status(200).send({
//                 result: false,
//                 code: 503,
//                 msg: res.msg
//             })
//         }
//         let result = await setExKey(num, 180, code)
//         if (result === 'OK') {
//             return reply.status(200).send({
//                 result: true,
//                 code: 200
//             })
//         } else {
//             return reply.status(200).send({
//                 result: false,
//                 code: 503,
//                 msg: '注册太频繁，请稍等'
//             })
//         }

//         // client.setex(phoneNum, 120, code, function (err, rep) {
//         //   if (err) {
//         //     return reply.status(200).send({
//         //       result: false,
//         //       code: 503,
//         //       msg: '注册太频繁，请稍等'
//         //     })
//         //   }
//         // })

//     }).catch(err => {
//         return reply.status(503).send({
//             result: false,
//             msg: err,
//             code: 503,
//         })
//     })

// })
// app.use('/admin', admin)
// app.use('/lottery', lottery)
// app.use('/main', main)


module.exports = app