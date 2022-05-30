
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

function mvfile(){
   return src('./*.html').pipe(dest('dist'));
}

exports.mv = mvfile;



