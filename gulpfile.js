
const {
    src,
    dest,
    series,
    parallel,
    watch
} = require('gulp');

//test console 列印終端機上
function tasklog(cb){
   console.log('gulp ok')
   cb();
}

exports.log = tasklog

// src dest
// copy html
function mvfile(){
   return src('./*.html').pipe(dest('dist'));
}
exports.mvhtml = mvfile;

// copy images
function mvimages(){
    return src('images/*.*').pipe(dest('dist/images'));
 }

 exports.mvimg = mvimages;


 // 同步跟異步


function taskA(cb){
   console.log('A 任務')
   cb();
}

function taskB(cb){
    console.log('B 任務')
    cb();
 }

 exports.async = series(taskA ,taskB);//
 exports.sync =parallel(taskA ,taskB);//



