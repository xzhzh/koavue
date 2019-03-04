const Koa = require('koa')
const app = new Koa()
const views = require('koa-views')
const json = require('koa-json')
const onerror = require('koa-onerror')
const bodyparser = require('koa-bodyparser')
const logger = require('koa-logger')
const cors = require('koa2-cors');

const index = require('./routes/index')
const users = require('./routes/users')
const postlist = require('./routes/postsList')
const comment = require('./routes/comment')

// error handler
onerror(app)

app.use(cors({
      origin: 'http://localhost:8080',
      exposeHeaders: ['WWW-Authenticate', 'Server-Authorization'],
      maxAge: 5,
      credentials: true,
      allowMethods: ['GET', 'POST'],
      allowHeaders: ['Content-Type', 'Authorization', 'Accept'],
  })
); // 设置跨域
// middlewares
app.use(bodyparser({
   formLimit: '1mb'
}))
app.use(json())
app.use(logger())
app.use(require('koa-static')(__dirname + '/public'))

app.use(views(__dirname + '/views', {
  extension: 'pug'
}))

// logger
app.use(async (ctx, next) => {
	// console.log(ctx)
  const start = new Date()
  await next()
  const ms = new Date() - start
  // console.log(`${ctx.method} ${ctx.url} - ${ms}ms`)
})

// routes
app.use(index.routes(), index.allowedMethods())
app.use(users.routes(), users.allowedMethods())
app.use(postlist.routes(), postlist.allowedMethods())
app.use(comment.routes(), comment.allowedMethods())

// error-handling
app.on('error', (err, ctx) => {
  console.error('server error', err, ctx)
});

module.exports = app
