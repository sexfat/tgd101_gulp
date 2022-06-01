
const {
    src,
    dest,
    series,
    parallel,
    watch
} = require('gulp');

// copy images
function mvimages() {
    return src(['./src/images/*.*','./src/images/**/*.*']).pipe(dest('dist/images'));
}

exports.mvimg = mvimages;


// 同步跟異步




// mini js 壓縮js 順便檢查js

const uglify = require('gulp-uglify');
const babel = require('gulp-babel');

function miniJs() {
    return src('src/js/*.js')
        .pipe(uglify())
        .pipe(babel({
            presets: ['@babel/env']
        }))
        .pipe(dest('dist/js'))
}


// test js babel6 -> 5
function babel5() {
    return src('src/js/*.js')
        .pipe(babel({
            presets: ['@babel/env']
        }))
        .pipe(dest('dist/js/test'));
}

exports.jsex =babel5
exports.js = miniJs

// sass 編譯

const sass = require('gulp-sass')(require('sass'));
const sourcemaps = require('gulp-sourcemaps');
const autoprefixer = require('gulp-autoprefixer');

function sassstyle() {
    return src('src/sass/*.scss')
        .pipe(sourcemaps.init())
        .pipe(sass({ outputStyle: 'compressed' }).on('error', sass.logError)) //壓縮
        //.pipe(sass.sync().on('error', sass.logError))
        //.pipe(cleanCSS())
        //   .pipe(rename({
        //     extname: '.min.css'
        //    }))
        .pipe(autoprefixer({
            cascade: false
        }))
        .pipe(sourcemaps.write())
        .pipe(dest('./dist/css'));

}

exports.style = sassstyle;

//html template
const fileinclude = require('gulp-file-include');

 function includeHTML() {
    return src('src/*.html') //  來源
        .pipe(fileinclude({
            prefix: '@@',
            basepath: '@file'
        }))
        .pipe(dest('dist')); // 目的地
}

exports.html = includeHTML; // 任務輸出 js module

exports.all = parallel(includeHTML , sassstyle, miniJs);// 同步


// 監看

function watchfile(){
  // watch(['','',''] , callback)
  watch(['src/sass/*.scss' , 'src/sass/**/*.scss'] , sassstyle)// sass
  watch(['./src/*.html' , './src/layout/*.html'] , includeHTML) // html
  watch('./src/js/*.js' , miniJs) // js
  watch(['./src/images/*.*','./src/images/**/*.*'],  mvimages)
}

exports.w = series(parallel(sassstyle, includeHTML , miniJs ,mvimages), watchfile) 
// 先執行sass/ html/ js /images編譯  在執行warchfile監看


//瀏覽器同步
const browserSync = require('browser-sync');
const reload = browserSync.reload;


function browser(done) {
    browserSync.init({
        server: {
            baseDir: "./dist",
            index: "index.html"
        },
        port: 3000
    });
    watch(['src/sass/*.scss' , 'src/sass/**/*.scss'] , sassstyle).on('change' , reload)// sass
    watch(['./src/*.html' , './src/layout/*.html'] , includeHTML).on('change' , reload) // html
    watch('./src/js/*.js' , miniJs).on('change' , reload) // js
    watch(['./src/images/*.*','./src/images/**/*.*'],  mvimages).on('change' , reload)
    done();
}

const imagemin = require('gulp-imagemin');

function min_images(){
    return src(['src/images/*.*' , 'src/images/**/*.*'])
    .pipe(imagemin([
        imagemin.mozjpeg({quality: 50, progressive: true}) // 壓縮品質      quality越低 -> 壓縮越大 -> 品質越差 
    ]))
    .pipe(dest('dist/images'))
}


//打包上線用 清除舊檔案
const clean = require('gulp-clean');

function clear() {
  return src('dist' ,{ read: false ,allowEmpty: true })//不去讀檔案結構，增加刪除效率  / allowEmpty : 允許刪除空的檔案
  .pipe(clean({force: true})); //強制刪除檔案 
}

//test
exports.c = clear; 

exports.minify = min_images;

//開發用
exports.default =  series(parallel(sassstyle, includeHTML , miniJs ,mvimages), browser) 

//上線用
exports.package = series(clear , parallel(sassstyle , includeHTML , miniJs , min_images))



