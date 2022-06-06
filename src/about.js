import { gsap } from "gsap";
import './sass/main.scss';
$('body').css('background-color' , "#2a0040");

gsap.from('.opacity' , {
     y: 200,
     opacity : 0,
     duration: 1
})


