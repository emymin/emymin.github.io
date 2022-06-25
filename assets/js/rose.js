const width=300;
const height=300;

const pi = 3.141592;

const c = SVG().addTo("#roseContainer").size(width,height);

function isodd(n){
    return n%2!=0;
}

function getRandomInt(min, max) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min) + min);
}
function polarToEuler(r,theta){
    return {y:(r*Math.cos(theta)),x:(r*Math.sin(theta))}
}

function pick_k(){
    n = getRandomInt(1,15);
    d = getRandomInt(1,15);
    if(d==n){d+=1;}
    k=n/d;
}

let n=2;
let d=1;
let k = 2;
pick_k();


let r = (width/2);

function rose(theta,k,mult=9/10){
    return r*Math.cos(k*theta)*mult;
}

const domain = (isodd(n)&&isodd(d)) ? pi*d : 2*pi*d;


let speed = 0.001*domain;
previousTime=0;
currentTheta=0;

const startPos = polarToEuler(rose(0,k),0);
let curPos = polarToEuler(rose(0,k),0);

console.log("Drawing rose "+n+"/"+d+" with domain "+domain+" at speed "+speed+" radians/frame");


function draw(time){
    //deltaTime = time-previousTime;
    
    currentR = rose(currentTheta,k);
    
    newPos = polarToEuler(currentR,currentTheta);
    

    c.line(r+curPos.x,r+curPos.y,r+newPos.x,r+newPos.y).stroke({color:"#000000",width:1.5});


    //formula = "\\[\\theta = "+currentTheta.toFixed(1)+"\\] \\[r = R * cos(\\frac{"+n+"}{"+d+"} * \\theta) = "+(currentR/100).toFixed(1)+"\\]";
    //p.innerHTML = formula;
    //MathJax.typeset();

    curPos={x:newPos.x,y:newPos.y};
    currentTheta+=speed;
    previousTime = time;

    if(currentTheta<=(domain+speed)){
        //console.log(currentTheta+", domain is "+domain);
        window.requestAnimationFrame(draw);
    }else{
        console.log("Rose has finished drawing");
    }
}

window.addEventListener('load', function () {
    window.requestAnimationFrame(draw);

  })
