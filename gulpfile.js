const gulp = require('gulp')
const clean = require('gulp-clean')
const cleanCSS = require('gulp-clean-css')
const sass = require('gulp-sass')
const postcss = require('gulp-postcss')
const autoprefixer = require('autoprefixer')
const sourcemaps = require('gulp-sourcemaps')
const webpack = require('webpack')
const gulpWebpack = require('gulp-webpack')
const runSequence = require('run-sequence')
const connect = require('gulp-connect')
const stylelint = require('gulp-stylelint')
const imagemin = require('gulp-imagemin')
const strReplace = require('./gulp-str-replace')

const webpackconfig = require('./webpack.config.js')
const config = require('./config.js')

/* ----------------------------------------处理css---------------------------------------- */
// stylelint检测
gulp.task('lintCss', () => {
    return gulp
        .src(['assets/css/*.scss', 'assets/css/*/*.scss'])
        .pipe(stylelint({
            reporters: [
                {formatter: 'string', console: true}
            ]
        }))
})
// sass处理
gulp.task('sass', ['lintCss'], () => {
    return gulp.src('assets/css/*.scss')
        .pipe(sourcemaps.init())
        .pipe(sass().on('error', sass.logError))
        .pipe(sourcemaps.write('.'))
        .pipe(gulp.dest('public/css'))
        .pipe(connect.reload())
})
// postcss处理css
gulp.task('postcss', ['sass'], () => {
    const plugins = [
        autoprefixer({browsers: ['last 2 versions', 'ie >= 8', '> 5% in CN']})
    ]
    return gulp.src('public/css/*.css')
        .pipe(sourcemaps.init())
        .pipe(postcss(plugins))
        .pipe(sourcemaps.write('.'))
        .pipe(gulp.dest('public/css'))
        .pipe(connect.reload())
})
// 压缩css
gulp.task('minifyCss', ['postcss'], () => {
    return gulp.src('public/css/*.css')
        .pipe(cleanCSS({compatibility: 'ie8'}))
        .pipe(strReplace({
            '../../': config.publicPath,
            '../': '../'
        }))
        .pipe(gulp.dest('public/css'))
})

/* ----------------------------------------处理js---------------------------------------- */
// 引用webpack对js进行操作
gulp.task('buildJs', () => {
    return gulp.src('assets/js/*.js')
        .pipe(gulpWebpack(webpackconfig, webpack))
        .pipe(gulp.dest('public'))
        .pipe(connect.reload())
})

/* ----------------------------------------处理img---------------------------------------- */
gulp.task('minifyImg', () => {
    return gulp.src(['assets/img/*', 'assets/img/*/*'])
        .pipe(imagemin({
            optimizationLevel: 5,
            progressive: true,
            interlaced: true,
            multipass: true
        }))
        .pipe(gulp.dest('public/img'))
        .pipe(connect.reload())
})

/* ----------------------------------------清除public---------------------------------------- */
// 清除public目录
gulp.task('cleanPublic', () => {
    return gulp.src(['public/css', 'public/js', 'public/img'], {read: false})
        .pipe(clean({force: true}))
})

/* ----------------------------------------监控与启动服务---------------------------------------- */
gulp.task('connect', () => {
    connect.server({
        root: ['public'],
        host: config.host,
        port: config.port,
        livereload: true
    })
})
gulp.task('watch', () => {
    gulp.watch(['assets/css/*.scss', 'assets/css/*/*.scss'], ['minifyCss'])
    gulp.watch(['assets/js/*.js', 'assets/js/*/*.js'], ['buildJs'])
    gulp.watch(['assets/img/*', 'assets/img/*/*'], ['minifyImg'])
})

/* ----------------------------------------开发与打包---------------------------------------- */
// 移动端
gulp.task('dev', (callback) => runSequence(
    'cleanPublic',
    ['buildJs', 'minifyCss', 'minifyImg'],
    ['watch', 'connect'],
    callback
))
