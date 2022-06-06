function aa(x){
 return x*10 
}
console.log(aa(5));

// jquery
// import $ from 'jquery';
import { gsap } from "gsap";
import Vue from "vue";

new Vue({
  el : "#app",
  data : {
    text : "logo"  
  }
})



// gsap 
gsap.to('.logo' ,{
   duration:1 ,
x: 300,
y :10,
repeat: 2,
yoyo : true,
rotation:360
})



import './css/header.css';
import './css/footer.css';
import './css/style.css';
import './sass/main.scss';


$('body').css('background-color' , "#010027");