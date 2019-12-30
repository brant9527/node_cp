let app = require('./router/index')

// require('./mongodb/index')


var server = app.listen(8080, '0.0.0.0', function() {

    var host = server.address().address
    console.log(JSON.stringify(server.address()))
    var port = server.address().port

    console.log(`应用实例，访问地址为 http://${host}:${port}`, host, port)

})