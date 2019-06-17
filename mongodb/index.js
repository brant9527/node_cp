// const MongoClient = require('mongodb').MongoClient
let mongoose = require('mongoose')
let url = "mongodb://127.0.0.1:27017/runoob";
let db = mongoose.connect(url, {
    useNewUrlParser: true
},function(err){
    if(err){
        console.log('数据库链接失败')
    } else {
        console.log('数据库连接成功')
    }
})

let mongoDo = {}
let tripScheme = new mongoose.Schema({
    startAddress: String,
    endAddress: String,
    pickerVisible: String,
    contact: String,
    roleValue: Number,
    introduction: String,
    creatTime:Number,
    money:Number,
    accountId:String
})
let accountScheme = new mongoose.Schema({
    num: String,
    psw: String
})
mongoDo.tripModel = mongoose.model('trip', tripScheme);

mongoDo.accountModel = mongoose.model('account', accountScheme);


module.exports = mongoDo