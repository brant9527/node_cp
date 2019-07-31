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
  createTime: Number,
  introduce: String
})
let expertScheme = Scheme({
  title: String,
  editorContent: String,
  createTime: Number,
  introduce: String

})
let productScheme = Scheme({
  title: String,
  editorContent: String,
  createTime: Number,
  introduce: String,
  url: String
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
let contactScheme = Scheme({
  type: Number,
  contact: String
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
mongoDo.contactModel = mongoose.model('contact', contactScheme);

mongoDo.lotteryModel = mongoose.model('lottery_all', lotteryScheme);
mongoDo.lotteryTypeModel = mongoose.model('lottery_type', lotteryTypeScheme);

mongoDo.planModel = mongoose.model('plan', planScheme);
mongoDo.planPlaysModel = mongoose.model('plan_plays', planPlaysScheme);

mongoDo.numTempModel = mongoose.model('num_temp', numTempScheme);


mongoDo.planResultModel = mongoose.model('plan_result', planResultScheme);
mongoDo.noticeModel = mongoose.model('notice', noticeScheme);
mongoDo.newsModel = mongoose.model('news', newsScheme);
mongoDo.expertModel = mongoose.model('expert', expertScheme);
mongoDo.productModel = mongoose.model('product', productScheme);




module.exports = mongoDo