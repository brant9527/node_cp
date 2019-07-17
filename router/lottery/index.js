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
        /**
         * 查询最后一期结果
         */
        let lastDoc = data.slice(-1)
        /**
         * 插入前几期未对比过的数据
         */
        mongoDo.lotteryModel.insertMany(data).then(res => {
          /**
           * 查询彩种下计划的数据
           */
          mongoDo.planPlaysModel.find({
            pcode: config.code
          }).then(async docs => {
            let results = []
            // let yc_results = []
            if (docs.length === 0) {
              console.log('没有计划数据')
              return false
            }
            /**
             * 获取所有计划下的所有玩法
             */
            let yc_expect_numisout = expectFormat(lastDoc[0])

            for (let docIdx = 0; docIdx < docs.length; docIdx++) {
              const item = docs[docIdx];
              let conditions = {
                pcode: config.code,
                code: item.code,
                playCode: item.playCode,
                currentExpect: lastDoc[0].expect
              }
              let index = item.index


              /**
               * 判断当前期数是否中奖
               */
              let obj = juagement(item, lastDoc[0])
              let getFalg = obj.flag
              let lotteryNum = obj.lotteryNum
              /**
               * 判断是否连续三次不中，或者一次中=》
               * 1.更新数据库结果，不做预测
               * 2.更新当前数据库预测结果
               */
              if ((getFalg === '挂' && (obj.currentExpect - obj.expect) >= (item.maxNum - 1)) || getFalg === '中') {
                if (item.list.length !== item.index + 1) {
                  index = item.index + 1
                } else {
                  index = 0
                }
                mongoDo.planResultModel.update(conditions, {
                  $set: {
                    flag: getFalg,
                    lotteryNum: lotteryNum
                  }
                }, {
                  upsert: true
                }).then(docs => {
                  console.log('更新当前数据flag', getFalg)
                })
                /**
                 * 判断已经进入下个预测，插入数据库
                 */
                let yc_currentNum = item.list[index]
                let yc_expect = yc_expect_numisout
                let yc_result = {
                  expect: yc_expect + '',
                  currentExpect: yc_expect + '',
                  pcode: item.pcode,
                  code: item.code,
                  name: item.name,
                  playName: item.playName,
                  playCode: item.playCode,
                  planNum: yc_currentNum,
                  maxNum: item.maxNum,
                  lotteryNum: '',
                  flag: '预测中',
                  createTime: new Date()
                }
                let yc_config = {
                  expect: yc_expect + '',
                  pcode: item.pcode,
                  code: item.code,
                  playCode: item.playCode,
                }
                await mongoDo.planResultModel.update(yc_config, {
                  $set: yc_result
                }, {
                  upsert: true
                }).then(res => {
                  console.log('新增预测内容')
                })
                /**
                 * 更新当前期数，和下次判断角标
                 */
                mongoDo.planPlaysModel.update({
                  _id: item.id,
                }, {
                  $set: {
                    'index': index,
                    indexExpect: yc_expect //更新的是起始期数
                  }
                }).then(res => {
                  console.log('更新计划下的某个玩法，index-当前期数')
                })
              }
              // else if ((getFalg === '挂' && (obj.currentExpect - obj.expect) < item.maxNum - 1)) {
              //   let extend = Object.assign({}, obj)
              //   mongoDo.planResultModel.insertMany(extend).then(docs => {
              //     console.log('插入数据')
              //   })
              // } 
              else {
                let extend = Object.assign({}, obj, {
                  flag: '预测中',
                  lotteryNum: '',
                  currentExpect: yc_expect_numisout + ''
                })

                mongoDo.planResultModel.update(conditions, {
                  $set: extend
                }, {
                  upsert: true
                }).then(docs => {
                  console.log('更新当前数据库成功')
                })
              }



              /**
               * 无论如何更新当前期数的开奖结果
               */



              // let obj = juagement(item, lastDoc[0])

              // let index = 0
              // if (obj) {
              //   if (item.list.length !== item.index + 1) {
              //     index = item.index + 1
              //   }
              //   await mongoDo.planPlaysModel.update({
              //     _id: item.id,
              //   }, {
              //     'index': index,
              //     currentExpect: item.currentExpect
              //   }).then(res => {
              //     console.log('更新成功')
              //   })
              //   await mongoDo.planResultModel.update(conditions)
              //   results.push(obj)
              // }
              /**
               * 移除上个开奖结果,
               * 由于多了期数，只能更新
               * 获取当前期数是否在中奖预测中有出现
               */
              // let conditions_yc_resuilt = Object.assign({}, conditions, {
              //   currentExpect: yc_expect_numisout
              // })
              // let currentResult = await mongoDo.planResultModel.findOne(conditions)
              // if (!currentResult) {

              // }
            }


          })
        })
      }).catch(err => {
        console.log(err)
      })
    }
  }).catch(err => {
    console.log('请求', err)

  })
}

/**
 *获取彩种
 */
router.get('/getLottery', function (request, reply) {
  let params = {
    code: request.query.code,
  }
  let pageSize = Number(request.query.pageSize)
  let pageNum = Number(request.query.pageNum)

  let config = {
    limit: pageSize || 1,
    skip: pageSize * pageNum,
    sort: {
      'opentimestamp': -1
    }
  }
  if (!pageSize * pageNum) {
    delete config.skip
  }
  mongoDo.lotteryModel.find(params, null, config).then(docs => {
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
        message: '已存在'
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

})

function timer() {
  getLotteryData({
    rows: 3,
    code: 'cqssc'
  })
  getLotteryData({
    rows: 3,
    code: 'xjssc'
  })
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
  let result = {
    expect: item.indexExpect || doc.expect,
    currentExpect: doc.expect,

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
      // lotterys = lottery.substr(-2, 2).split('')
      // currentNums = currentNum.split('*')
      // for (let index = 0; index < lotterys.length; index++) {
      //   const element = lotterys[index];
      //   if (currentNums[index] && !currentNums[index].indexOf(element)) {
      //     flag = false
      //   }
      // }
      if (zhixuanFn(currentNum, lottery.substr(-2, 2))) result.flag = '中'

      result.playName = '后二直选'

      break
    case 'q2zhix':
      // lotterys = lottery.substr(0, 2).split('')
      // currentNums = currentNum.split('*')
      // for (let index = 0; index < lotterys.length; index++) {
      //   const element = lotterys[index];
      //   if (currentNums[index] && !currentNums[index].indexOf(element)) {
      //     flag = false
      //   }
      // }
      if (zhixuanFn(currentNum, lottery.substr(0, 2))) result.flag = '中'
      result.playName = '前二直选'

      break
    case 'h3fs':
      if (fsFn(currentNum, lottery.substr(-3, 3).split(''))) result.flag = '中'
      result.playName = '后三复式'
      break
    case 'h3zhix':
      // lotterys = lottery.substr(-3, 3).split('')
      // currentNums = currentNum.split('*')
      // flag = true
      // for (let index = 0; index < lotterys.length; index++) {
      //   const element = lotterys[index];
      //   if (!currentNums.indexOf(element)) {
      //     flag = false
      //   }
      // }
      if (zhixuanFn(currentNum, lottery.substr(-3, 3))) result.flag = '中'
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

function zhixuanFn(currentNum, lottery) {
  let lotterys = lottery.split('')
  let currentNums = currentNum.split('*')
  let flag = true
  for (let index = 0; index < lotterys.length; index++) {
    const element = lotterys[index];
    if (currentNums[index].indexOf(element) < 0) {
      flag = false
    }
  }
  return flag
}

function expectFormat(str) {
  let expect = Number(str.expect)
  let tmp = str.expect
  let year = tmp.substr(0, 4)
  let month = tmp.substr(4, 2)
  let day = tmp.substr(6, 2)
  let dateTmp = year + '-' + month + '-' + day
  var timeStamp = new Date(dateTmp).getTime() + 86400000;
  let date = new Date(timeStamp)
  Y = date.getFullYear();
  M = (date.getMonth() + 1 < 10 ? '0' + (date.getMonth() + 1) : date.getMonth() + 1);
  D = date.getDate() < 10 ? ('0' + date.getDate()) : date.getDate()
  if (((expect + 1) % 100) > 59) {
    return ('' + Y + M + D + '001')
  } else {
    return (expect + 1)
  }
}
const timerInterval = setInterval(timer, 8000);
module.exports = router; //暴露这个 router模块