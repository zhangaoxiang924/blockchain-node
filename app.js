const createError = require('http-errors')
const express = require('express')
const path = require('path')
const cookieParser = require('cookie-parser')
const bodyParser = require('body-parser')
const logger = require('morgan')
const fileStreamRotator = require('file-stream-rotator')
const fs = require('fs')

const proxyRouter = require('./routes/proxy')
const newsDetailRouter = require('./routes/newsDetail')
const indexRouter = require('./routes/index')
const newsRouter = require('./routes/news')
const liveNewsRouter = require('./routes/flashNews')
const hotNewsRouter = require('./routes/hotNews')
const newsAutnorRouter = require('./routes/newsAuthor')
const marketsRouter = require('./routes/markets')
const exchangeListRouter = require('./routes/exchangeList')
const projectRouter = require('./routes/marketsProject')
const liveNewsDetailRouter = require('./routes/liveNewsDetail')
const signtureRouter = require('./routes/signture')

const app = express()

// java接口代理
app.use('/info', proxyRouter)
app.use('/market', proxyRouter)
app.use('/passport', proxyRouter)
app.use('/lives', proxyRouter)

// view engine setup
app.set('views', path.join(__dirname, 'views'))
app.set('view engine', 'ejs')

// logger
const logDir = '/data/node_site/www.huoxing24.com/logs'
fs.existsSync(logDir) || fs.mkdirSync(logDir)
const accessLogStream = fileStreamRotator.getStream({
    date_format: 'YYYYMMDD',
    filename: path.join(logDir, 'logs-%DATE%.log'),
    frequency: 'daily',
    verbose: true
})

app.use(logger('dev'))
app.use(logger('common', {stream: accessLogStream}))

app.use(express.json())
app.use(express.urlencoded({extended: false}))
app.use(bodyParser.json({limit: '50mb'}))
app.use(bodyParser.urlencoded({limit: '50mb', extended: false}))
app.use(cookieParser())
app.use(express.static(path.join(__dirname, 'public'), {
    index: false
}))

app.use('/', indexRouter)
app.use('/newsdetail', newsDetailRouter)
app.use('/index', indexRouter)
app.use('/news', newsRouter)
app.use('/livenews', liveNewsRouter)
app.use('/liveNewsDetail', liveNewsDetailRouter)
app.use('/hot', hotNewsRouter)
app.use('/newsauthor', newsAutnorRouter)
app.use('/markets', marketsRouter)
app.use('/exchangelist', exchangeListRouter)
app.use('/projectProjectmaterial', projectRouter)
app.use('/project', projectRouter)
app.use('/signture', signtureRouter)

// react-router browserhistory
app.get([
    '/personal',
    '/primer',
    '/newcoins',
    '/newcoinsList',
    '/newcoinsDetail',
    '/projectInfo',
    '/projectRelatenews',
    '/copyright',
    '/about',
    '/user',
    '/userMyAttention',
    '/userMyAttentionProject',
    '/userMyAttentionAuthor',
    '/userMyArticle',
    '/userMyInfo',
    '/userBindingPhone',
    '/changePhoneEml',
    '/userChangePassword',
    '/userMyCollection',
    '/userCertification',
    '/edit',
    '/search',
    '/live',
    '/live/liveList',
    '/live/liveDetails',
    '/app',
    '/showSpecial',
    '/showSpecialNews',
    '/wbcworld',
    '/wbcworldNews'
], function (req, res) {
    res.sendFile(path.resolve(__dirname, 'public/static/index.html'))
})

// catch 404 and forward to error handler
app.use(function (req, res, next) {
    next(createError(404))
})

// error handler
app.use(function (err, req, res, next) {
    // set locals, only providing error in development
    res.locals.message = err.message
    res.locals.error = req.app.get('env') === 'development' ? err : {}

    // render the error page
    res.status(err.status || 500)
    res.render('error')
})

module.exports = app
