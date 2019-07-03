var express = require('express');
var router = express.Router(); //可使用 express.Router 类创建模块化、可挂载的路由句柄
let mongoDo = require('../../mongodb/index')

const jwt = require('jsonwebtoken'); //用来生成token
const xss = require('node-xss').clean;

const cp_config = require('../../config/cpConfig')
const axios = require('axios')
const url = 'http://a.apiplus.net/newly.do'

async function getLotteryData(out_config, ) {
  let config = Object.assign({}, cp_config, out_config)
  // console.log('请求', config)
  axios.get(url, {
    params: config
  }).then(res => {
    let data = []
    if (res.data && res.data.data) {
      data = res.data.data

      let expects = data.map(item => item.expect)
      let seconds = 3600 * 12
      mongoDo.lotteryModel.find({
        opentimestamp: {
          $gte: Math.floor(new Date().getTime() / 1000) - seconds,
        },
        $or: data,
        code: config.code
      }).then(docs => {
        data.reverse()
        if (docs.length > 0) {
          if (docs.length >= data.length) {
            return false
          }
          data.splice(0, docs.length)
        }

        for (let index = 0; index < data.length; index++) {
          data[index].code = config.code;
        }
        let lastDoc = data.slice(-1)
        mongoDo.lotteryModel.insertMany(data).then(res => {
          mongoDo.planPlaysModel.find({
            pcode: config.code
          }).then(async docs => {
            let results = []
            // let yc_results = []
            for (let docIdx = 0; docIdx < docs.length; docIdx++) {
              const item = docs[docIdx];
              let conditions = {
                pcode: config.code,
                code: item.code,
                playCode: item.playCode,
                expect: lastDoc[0].expect
              }
              await mongoDo.planResultModel.remove(conditions).then(docs => {
                console.log('删除')
              })
              let obj = juagement(item, lastDoc[0])

              let index = 0
              if (obj) {
                if (item.list.length !== item.index + 1) {
                  index = item.index + 1
                }
                await mongoDo.planPlaysModel.update({
                  _id: item.id
                }, {
                  'index': index,
                }).then(res => {
                  console.log('更新成功')
                })
                results.push(obj)
              }
              let last_doc = lastDoc[0]
              let yc_currentNum = item.list[index]
              let yc_expect_numisout = (Number(last_doc.expect) + 1) % 100 > 59 ? (Number(last_doc.expect) + 42) : (Number(last_doc.expect) + 1)
              let yc_expect = yc_expect_numisout
              let yc_result = {
                expect: yc_expect + '',
                pcode: item.pcode,
                code: item.code,
                name: item.name,
                playName: item.playName,
                playCode: item.playCode,
                planNum: yc_currentNum,
                lotteryNum: '',
                flag: '预测中',
                createTime: new Date()
              }
              results.push(yc_result)
            }
            // await docs.forEach(async item => {
            //   let conditions = {
            //     pcode: config.code,
            //     code: item.code,
            //     playCode: item.playCode,
            //     expect: lastDoc[0].expect
            //   }
            //   await mongoDo.planResultModel.remove(conditions).then(async docs => {
            //     await console.log('删除')
            //   })
            //   let obj = juagement(item, lastDoc[0])
            //   let index = 0
            //   if (obj) {
            //     if (item.list.length !== item.index + 1) {
            //       index = item.index + 1
            //     }
            //     await mongoDo.planPlaysModel.update({
            //       _id: item.id
            //     }, {
            //       'index': index,
            //     }).then(res => {
            //       console.log('更新成功')
            //     })
            //     results.push(obj)
            //   }
            //   let last_doc = lastDoc[0]
            //   let yc_currentNum = item.list[index]
            //   let yc_expect_numisout = (Number(last_doc.expect) + 1) % 100 > 59 ? (Number(last_doc.expect) + 42) : (Number(last_doc.expect) + 1)
            //   let yc_expect = yc_expect_numisout
            //   let yc_result = {
            //     expect: yc_expect + '',
            //     pcode: item.pcode,
            //     code: item.code,
            //     name: item.name,
            //     playName: item.playName,
            //     playCode: item.playCode,
            //     planNum: yc_currentNum,
            //     lotteryNum: '',
            //     flag: '预测中',
            //     createTime: new Date()
            //   }
            //   results.push(yc_result)
            // })
            // 打算更新多条index 
            // let ids = docs.map(item => item._id)
            // mongoDo.planModel.updateMany({
            //   _id: {
            //     $or: ids
            //   }
            // }, docs)
            await mongoDo.planResultModel.insertMany(results).then(res => {
              console.log('新增')
            })
          })
        })
      }).catch(err => {
        console.log(err)
      })
    }
  }).catch(err => {

  })
}

/**
 *获取彩种
 */
router.get('/getLottery', function (request, reply) {
  let params = {
    code: request.query.code,
  }
  mongoDo.lotteryModel.find(params, null, {
    limit: 1,
    sort: {
      'opentimestamp': -1
    }
  }).then(docs => {
    return reply.send({
      code: 200,
      data: docs
    })
  }).catch(err => {
    return reply.status(500).send(err)
  })

})


/**
 * 新增彩种
 */
router.post('/addLotteryType', function (request, reply) {
  let body = xss(request.body)
  mongoDo.lotteryTypeModel.find({
    code: body.code
  }).then(docs => {
    if (docs.length === 0) {
      mongoDo.lotteryTypeModel.create(body).then(res => {
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
    } else {
      reply.send({
        code: 402,
        message: '失败'
      })
    }

  })
})
/**
 * 删除彩种
 */
router.post('/delLotteryType', function (request, reply) {
  let body = request.body
  let list = body.list
  let ids = list.map(item => item._id)
  mongoDo.lotteryTypeModel.remove({
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
router.get('/getLotteryType', function (request, reply) {
  mongoDo.lotteryTypeModel.find().then(docs => {
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
 * 新增计划
 */
router.post('/addPlan', function (request, reply) {
  let body = xss(request.body)
  mongoDo.planModel.find({
    code: body.code,
    pcode: body.pcode
  }).then(docs => {
    if (docs.length === 0) {
      mongoDo.planModel.create(body).then(res => {
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
    } else {
      reply.send({
        code: 506,
        message: '失败'
      })
    }

  })
})
/**
 * 查询当前彩种的计划
 */
router.get('/getPlan', function (request, reply) {
  let params = {
    pcode: request.query.pcode
  }
  mongoDo.planModel.find(params.pcode ? params : {}).then(docs => {
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
 * 删除计划
 */
router.post('/delPlan', function (request, reply) {
  let body = request.body
  let list = body.list
  let ids = list.map(item => item._id)
  mongoDo.planModel.remove({
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
 *  更新计划的玩法与模板内容
 */
router.post('/updatePlan', function (request, reply) {

  // let body = xss(request.body)
  let id = request.body._id
  delete request.body._id
  mongoDo.planModel.update({
    _id: id
  }, request.body).then(docs => {

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
 * 新增计划下的玩法
 * 
 */

router.post('/addPlanPlays', function (request, reply) {
  let body = request.body
  mongoDo.planPlaysModel.find({
    code: body.code,
    pcode: body.pcode,
    playCode: body.playCode
  }).then(docs => {
    if (docs.length === 0) {
      mongoDo.planPlaysModel.create(body).then(res => {
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
    } else {
      reply.send({
        code: 506,
        message: '失败'
      })
    }

  })
})
/**
 * 查询当前彩种下玩法的计划
 */
router.get('/getPlanPlays', function (request, reply) {
  let params = {
    pcode: request.query.pcode,
    code: request.query.code
  }
  mongoDo.planPlaysModel.find(params.pcode ? params : {}).then(docs => {
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
 * 删除计划
 */
router.post('/delPlanPlays', function (request, reply) {
  let body = request.body
  let list = body.list
  let ids = list.map(item => item._id)
  mongoDo.planPlaysModel.remove({
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
 *  更新计划的玩法与模板内容
 */
router.post('/updatePlanPlays', function (request, reply) {

  // let body = xss(request.body)
  let id = request.body._id
  delete request.body._id
  mongoDo.planPlaysModel.update({
    _id: id
  }, request.body).then(docs => {

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
 * 新增码库模板
 */
router.post('/addNumTemp', function (request, reply) {
  let body = xss(request.body)
  mongoDo.numTempModel.find({
    name: body.name
  }).then(docs => {
    if (docs.length === 0) {
      mongoDo.numTempModel.create(body).then(res => {
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
    } else {
      reply.send({
        code: 506,
        message: '失败'
      })
    }

  })
})
/**
 * 查询所有模板
 */
router.get('/getNumTemp', function (request, reply) {
  let params = {
    type: request.query.type
  }
  mongoDo.numTempModel.find(params.type ? params : {}).then(docs => {
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
 * 删除模板
 */
router.post('/delNumTemp', function (request, reply) {
  let body = request.body
  let list = body.list
  let ids = list.map(item => item._id)
  mongoDo.numTempModel.remove({
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
 *获取开奖结果
 */
router.get('/getPlanPlaysResult', async function (request, reply) {
  let params = {
    code: request.query.code,
    pcode: request.query.pcode
  }
  let count = await mongoDo.planPlaysModel.count(params)
  // const total = await query.count().exec()
  let docs = await mongoDo.planResultModel.find(params).limit(10 * count).sort({
    'createTime': -1
  }).then(docs => {
    return reply.send({
      code: 200,
      data: docs
    })
  }).catch(err => {
    reply.status(500).send(err)
  })
  // mongoDo.planResultModel.find(params, null, {
  //   sort: {

  //   },
  //   limit: 10 * count,

  // }).then(docs => {
  //   return reply.send({
  //     code: 200,
  //     data: docs
  //   })
  // }).catch(err => {
  //   reply.status(500).send(err)
  // })

})

function timer() {
  getLotteryData({
    rows: 3,
    code: 'cqssc'
  })
  // getLotteryData({
  //   rows: 3,
  //   code: 'xjssc'
  // })
  // getLotteryData({
  //   rows: 3,
  //   code: 'bjpk10'
  // })
}



function juagement(item, doc) {
  let lottery = doc.opencode.replace(/\,/g, '')
  let index = item.index
  let list = item.list
  let currentNum = list[index]
  let flagIsZuxuan = currentNum.indexOf('*') > -1
  let result = {
    expect: doc.expect,
    pcode: item.pcode,
    code: item.code,
    name: item.name,
    playName: item.playName,
    planNum: currentNum,
    playCode: item.playCode,
    lotteryNum: lottery,
    flag: '挂',
    createTime: new Date()
  }
  switch (item.playCode) {
    case 'h1':

      if (currentNum.indexOf(lottery.substr(-1, 1)) > -1) result.flag = '中'
      result.playName = '后一'
      break
    case 'h2fs':
      if (fsFn(currentNum, lottery.substr(-2, 2).split(''))) result.flag = '中'
      result.playName = '后二复式'
      break
    case 'h2zux':
      if (zuxFn(currentNum, lottery.substr(-2, 2).split(''))) result.flag = '中'
      result.playName = '后二组选'
      break
    case 'q2fs':
      if (fsFn(currentNum, lottery.substr(0, 2).split(''))) result.flag = '中'
      result.playName = '前二复式'
      break
    case 'h2zhix':

      if (currentNum.indexOf(lottery.substr(-2, 2)) > -1) result.flag = '中'
      result.playName = '后二直选'

      break
    case 'q2zhix':

      if (currentNum.indexOf(lottery.substr(0, 2)) > -1) result.flag = '中'
      result.playName = '前二直选'

      break
    case 'h3fs':
      if (fsFn(currentNum, lottery.substr(-3, 3).split(''))) result.flag = '中'
      result.playName = '后三复式'
      break
    case 'h3zhix':
      if (currentNum.indexOf(lottery.substr(-3, 3)) > -1) result.flag = '中'
      result.playName = '后三直选'

      break
    case 'h3zu6':
      if (zuliuFn(currentNum, lottery.substr(-3, 3).split(''))) result.flag = '中'
      result.playName = '后三组六'
      break
    case 'h3zu3':
      if (zusanFn(currentNum, lottery.substr(-3, 3).split(''))) result.flag = '中'
      result.playName = '后三组三'
      break
    case 'h3fs':
      if (fsFn(currentNum, lottery.substr(0, 3).split(''))) result.flag = '中'
      result.playName = '前三复式'
      break
    case 'q3zu6':
      if (zuliuFn(currentNum, lottery.substr(-3, 3).split(''))) result.flag = '中'
      result.playName = '前三组六'
      break
    case 'q3zu3':
      if (zusanFn(currentNum, lottery.substr(-3, 3).split(''))) result.flag = '中'
      result.playName = '前三组三'
      break
    case 'sxfs':
      if (fsFn(currentNum, lottery.substr(0, 4).split('')) || fsFn(currentNum, lottery.substr(1, 5).split(''))) result.flag = '中'
      result.playName = '四星复式'
      break
    case 'wxfs':
      if (fsFn(currentNum, lottery.split(''))) result.flag = '中'
      result.playName = '五星复式'
      break
    default:
      result = null
      break
  }
  return result
}

function fsFn(planNum, lotterys) {
  let flag = true
  lotterys.filter(item => {
    if (!(planNum.indexOf(item) > -1)) {
      flag = false
    }
  })
  return flag
}

function zuxFn(planNum, lotterys) {
  let isdouble = false
  let ary = lotterys.slice(0)
  let last = ''
  for (let index = 0; index < lotterys.length; index++) {
    // const item = array[index];
    if (!ary.includes(last)) {
      last = ary.splice(0, 1)
    } else {
      isdouble = true
    }
  }
  // lotterys.forEach((item, index) => {
  //   if (!ary.includes(last)) {
  //     last = ary.splice(0, 1)
  //   } else {
  //     isdouble = true
  //   }
  // })
  if (isdouble) {
    return flase
  }
  let flag = true
  lotterys.filter(item => {
    if (!(planNum.indexOf(item) > -1)) {
      flag = false
    }
  })
  return flag
}

function zusanFn(planNum, lotterys) {
  let isdouble = false
  let ary = lotterys.slice(0)
  let last = ''
  lotterys.forEach((item, index) => {
    if (!ary.includes(last)) {
      last = ary.splice(0, 1)
    } else {
      isdouble = true
    }
  })
  // 组三必须要对子情况下预测中数字
  if (!isdouble) {
    return flase
  }
  let flag = true
  lotterys.filter(item => {
    if (!(planNum.indexOf(item) > -1)) {
      flag = false
    }
  })
  return flag
}

function zuliuFn(planNum, lotterys) {
  let isthree = false
  let ary = lotterys.slice(0)
  let last = ''
  lotterys.forEach((item, index) => {
    if (!ary.includes(last)) {
      last = ary.splice(0, 1)
    } else {
      isthree = true
    }
  })
  // 组六必需要三个不同的数字情况下预测中数字
  if (isthree) {
    return flase
  }
  let flag = true
  lotterys.filter(item => {
    if (!(planNum.indexOf(item) > -1)) {
      flag = false
    }
  })
  return flag
}
const timerInterval = setInterval(timer, 8000);
module.exports = router; //暴露这个 router模块