// const MongoClient = require('mongodb').MongoClient
let mongoose = require('mongoose')
let url = "mongodb://127.0.0.1:27017/runoob";
const Promise = require("bluebird")
mongoose.Promise = Promise
let db = mongoose.connect(url, {
  useNewUrlParser: true
}, function (err) {
  if (err) {
    console.log('数据库链接失败')
  } else {
    console.log('数据库连接成功')
  }
})
let Scheme = mongoose.Schema

let mongoDo = {}
let tripScheme = Scheme({
  startAddress: String,
  endAddress: String,
  pickerVisible: String,
  contact: String,
  roleValue: Number,
  introduction: String,
  creatTime: Number,
  money: Number,
  accountId: String
})
let accountScheme = Scheme({
  num: String,
  psw: String,
  role: Number
})
let noticeScheme = Scheme({
  title: String,
  editorContent: String,
  createTime: Number
})
let newsScheme = Scheme({
  title: String,
  editorContent: String,
  createTime: Number
})
let expertScheme = Scheme({
  title: String,
  editorContent: String,
  createTime: Number
})


let lotteryScheme = Scheme({
  expect: String,
  opencode: String,
  opentime: String,
  opentimestamp: Number,
  code: String
})
let lotteryTypeScheme = Scheme({
  name: String,
  url: String,
  code: String
})
let planScheme = Scheme({
  name: String,
  url: String,
  code: String,
  pcode: String,
  pname: String,
  tempId: String,
})
let planPlaysScheme = Scheme({
  name: String,
  url: String,
  code: String,
  pcode: String,
  pname: String,
  tempId: String,
  playCode: String,
  playName: String,
  list: Array,
  index: Number,
  maxNum: Number,
  indexExpect: String,

})
let numTempScheme = Scheme({
  name: String,
  type: String,
  list: Array
})
let planResultScheme = Scheme({
  expect: String,
  code: String,
  pcode: String,
  planNum: String,
  planName: String,
  playCode: String,
  playName: String,
  name: String,
  pname: String,
  lotteryNum: String,
  flag: String,
  createTime: Number,
  currentExpect: String,
  maxNum: String

})
mongoDo.tripModel = mongoose.model('trip', tripScheme);

mongoDo.accountModel = mongoose.model('account', accountScheme);

mongoDo.lotteryModel = mongoose.model('lottery_all', lotteryScheme);
mongoDo.lotteryTypeModel = mongoose.model('lottery_type', lotteryTypeScheme);
planScheme.statics.juagement = function (item, doc) {
  let lottery = doc.replace(/\,/g, '')
  let index = item.index
  let list = item.list
  let currentNum = list[index]
  let flagIsZuxuan = currentNum.indexOf('*') > -1
  let result = {
    expect: doc.expect.splice(doc.expect.substr(-3, 3)),
    code: doc.code,
    pcode: doc.code,
    planNum: currentNum,
    lotteryNum: lottery,
    flag: '挂'
  }
  switch (item.code) {
    case 'h1':

      if (currentNum.indexOf(lottery.substr(-1, 1))) result.flag = '中'
      result.playName = '后一'
      break
    case 'h2fs':
      if (fsFn(currentNum, lottery.substr(-2, 2).split(''))) result.flag = '中'
      result.playName = '后二复式'
      break
    case 'h2zux':
      if (zuxFn(currentNum, lottery.split(''))) result.flag = '中'
      result.playName = '后二组选'
      break
    case 'q2fs':
      if (fsFn(currentNum, lottery.substr(0, 2).split(''))) result.flag = '中'
      result.playName = '前二复式'
      break
    case 'h2zhix':

      if (currentNum.indexOf(lottery.substr(-2, 2))) result.flag = '中'
      result.playName = '后二直选'

      break
    case 'q2zhix':

      if (currentNum.indexOf(lottery.substr(0, 2))) result.flag = '中'
      result.playName = '前二直选'

      break
    case 'h3fs':
      if (fsFn(currentNum, lottery.substr(-3, 3).split(''))) result.flag = '中'
      result.playName = '后三复式'
      break
    case 'h3zhix':
      if (currentNum.indexOf(lottery.substr(-3, 3))) result.flag = '中'
      result.playName = '后三直选'

      break
    case 'h3zu6':
      return {
        name: '后三组六',
      }
      break
    case 'h3zu3':
      return {
        name: '后三组三',
      }
      break
    case 'h3fs':
      if (fsFn(currentNum, lottery.substr(0, 3).split(''))) result.flag = '中'
      result.playName = '前三复式'
      break
    case 'q3zu6':
      return {
        name: '前三组六',
      }
      break
    case 'q3zu3':
      return {
        name: '前三组三',
      }
      break
    case 'sxfs':
      if (fsFn(currentNum, lottery.substr(0, 4).split('')) || fsFn(currentNum, lottery.substr(1, 5).split(''))) result.flag = '中'
      result.playName = '四星复式'

      break
    case 'wxfs':
      if (fsFn(currentNum, lottery.split(''))) result.flag = '中'
      result.playName = '五星复式'
      break
  }
  return result
}

mongoDo.planModel = mongoose.model('plan', planScheme);
mongoDo.planPlaysModel = mongoose.model('plan_plays', planPlaysScheme);

mongoDo.numTempModel = mongoose.model('num_temp', numTempScheme);


mongoDo.planResultModel = mongoose.model('plan_result', planResultScheme);
mongoDo.noticeModel = mongoose.model('notice', noticeScheme);
mongoDo.newsModel = mongoose.model('news', newsScheme);
mongoDo.expertModel = mongoose.model('expert', expertScheme);



module.exports = mongoDo