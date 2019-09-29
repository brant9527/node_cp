var Mock = require('mockjs')

Mock.mock('http://a.apiplus.net/newly.do', function () {
  return {
    "_id": ObjectId("5d2e7f174b55fb670abd8214"),
    "expect": "20190717018",
    "opencode": "5,0,8,2,2",
    "opentime": "2019-07-17 09:51:18",
    "opentimestamp": 1563328278,
  }
})