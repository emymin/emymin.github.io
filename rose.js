
const c = document.getElementById("roseCanvas");
//const p = document.getElementById("formula");
const ctx = c.getContext("2d");
ctx.imageSmoothingEnabled = true;


function getRandomInt(min, max) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min) + min);
}
function polarToEuler(r,theta){
    return {y:(r*Math.cos(theta)),x:(r*Math.sin(theta))}
}
function setpos(x,y){
    ctx.moveTo(r+x,r+y);
}
function rose(theta,k,mult=9/10){
    return r*Math.cos(k*theta)*mult;
}

let n=2;
let d=1;
let k = 2;

function pick_k(){
    n = getRandomInt(1,15);
    d = getRandomInt(1,15);
    if(d==n){d+=1;}
    k=n/d;
}

let r = (c.clientWidth/2);
let speed = 0.05;


previousTime=0;
currentTheta=0;

startPos = polarToEuler(rose(0,k),0);
pick_k();

setpos(startPos.x,startPos.y);

ctx.clearRect(0, 0, c.clientWidth,c.clientHeight);
ctx.lineWidth=1;

function draw(time){
    //deltaTime = time-previousTime;
    
    currentR = rose(currentTheta,k);
    newPos = polarToEuler(currentR,currentTheta);
    
    ctx.lineTo(r+newPos.x,r+newPos.y);
    ctx.stroke();


    //formula = "\\[\\theta = "+currentTheta.toFixed(1)+"\\] \\[r = R * cos(\\frac{"+n+"}{"+d+"} * \\theta) = "+(currentR/100).toFixed(1)+"\\]";
    //p.innerHTML = formula;
    //MathJax.typeset();

    setpos(newPos.x,newPos.y);
    currentTheta+=speed;
    previousTime = time;
    window.requestAnimationFrame(draw);
}

window.addEventListener('load', function () {
    window.requestAnimationFrame(draw);

  })
