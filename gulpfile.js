
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

function miniJs() {
    return src('src/js/*.js')
        .pipe(uglify())
        .pipe(dest('dist/js'))
}

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
    return src('src/images/*.*')
    .pipe(imagemin([
        imagemin.mozjpeg({quality: 70, progressive: true}) // 壓縮品質      quality越低 -> 壓縮越大 -> 品質越差 
    ]))
    .pipe(dest('dist/images/min'))
}


exports.minify = min_images;


exports.default =  series(parallel(sassstyle, includeHTML , miniJs ,mvimages), browser) 




