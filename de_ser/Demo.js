let http = require('http')
let server = http.createServer((req, res) => {
  res.statusCode = 200
  res.setHeader('Content-Type', "text/plain; charset=utf-8")
  res.end("Hello, Nodejs")
})

server.listen(3000, "127.0.0.1", () => {
  console.log('服务器已经运行，请打开浏览， 输入:http://127.0.0.1/ 来访问')
})
