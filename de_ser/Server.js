let http = require('http')
let util = require('util')
let url = require('url')
let fs = require('fs')
let server = http.createServer((req, res) => {
  // res.statusCode = 200
  // res.setHeader('Content-Type', "text/plain; charset=utf-8")
  // 解析各种模块的可能性
  var pathname = url.parse(req.url).pathname
  console.log(pathname)
  //
  fs.readFile(pathname.substring(1), (err, data) => {
    console.log(err)
    if (err) {
      console.log(404)
      res.writeHead(404, {
        'Content-Type': 'text/html'
      })
    } else {
      console.log('hellow')
      res.writeHead(200, {
        'Content-Type': 'text/html'
      })
      res.write(data.toString())
    }
    res.end()   // 文本结束
  })
})

server.listen(3000, "127.0.0.1", () => {
  console.log('服务器已经运行，请打开浏览， 输入:http://127.0.0.1/ 来访问')
})
