var I=Object.defineProperty;var D=(o,t,e)=>t in o?I(o,t,{enumerable:!0,configurable:!0,writable:!0,value:e}):o[t]=e;var r=(o,t,e)=>(D(o,typeof t!="symbol"?t+"":t,e),e);(function(){const t=document.createElement("link").relList;if(t&&t.supports&&t.supports("modulepreload"))return;for(const i of document.querySelectorAll('link[rel="modulepreload"]'))n(i);new MutationObserver(i=>{for(const s of i)if(s.type==="childList")for(const h of s.addedNodes)h.tagName==="LINK"&&h.rel==="modulepreload"&&n(h)}).observe(document,{childList:!0,subtree:!0});function e(i){const s={};return i.integrity&&(s.integrity=i.integrity),i.referrerpolicy&&(s.referrerPolicy=i.referrerpolicy),i.crossorigin==="use-credentials"?s.credentials="include":i.crossorigin==="anonymous"?s.credentials="omit":s.credentials="same-origin",s}function n(i){if(i.ep)return;i.ep=!0;const s=e(i);fetch(i.href,s)}})();class M{constructor(){r(this,"points");this.points=[]}addPoint(t){this.points.push(t)}draw(t,e){for(let n=0;n<this.points.length-1;n++){const i=this.points[n],s=this.points[n+1];t.strokeStyle="white",t.lineWidth=1,t.beginPath(),t.moveTo(i.x*e.width,i.y*e.height),t.lineTo(s.x*e.width,s.y*e.height),t.stroke()}}}class c{constructor(t,e){r(this,"x");r(this,"y");this.x=t,this.y=e}static vector(t,e){return new c(e.x-t.x,e.y-t.y)}static dotProduct(t,e){return t.x*e.x+t.y*e.y}static calculateAngle(t,e){let n=c.dotProduct(t,e)/(t.magnitude()*e.magnitude());return n>=1&&(n=n-n%1),n<=-1&&(n=n-n%Math.PI),Math.acos(n)}magnitude(){return Math.sqrt(this.x*this.x+this.y*this.y)}unitVector(){const t=this.magnitude();return new c(this.x/t,this.y/t)}}class R{constructor(t,e){r(this,"canvas");r(this,"context");r(this,"paths",[]);r(this,"targetPoint");r(this,"currentPath",null);r(this,"onChange");const n=document.getElementById(t);if(!n)throw new Error(`Canvas with id ${t} not found`);const i=n.getContext("2d",{willReadFrequently:!0});if(!i)throw new Error(`Context for canvas with id ${t} not found`);this.canvas=n,this.context=i,this.targetPoint=new c(.5,.5),this.onChange=e,this.canvas.addEventListener("mousedown",this.onStartDraw.bind(this)),this.canvas.addEventListener("mouseup",this.onEndDraw.bind(this)),this.canvas.addEventListener("mouseleave",this.onEndDraw.bind(this)),this.canvas.addEventListener("mousemove",this.onDraw.bind(this))}onStartDraw(t){this.paths=[],this.currentPath=new M,this.currentPath.addPoint(this.getRelativeLocation(t))}onEndDraw(t){!this.currentPath||(this.currentPath.addPoint(this.getRelativeLocation(t)),this.paths.push(this.currentPath),this.currentPath=null,this.onChange(this.context),this.paths.forEach(e=>e.draw(this.context,this.canvas)))}onDraw(t){if(!this.currentPath)return;const e=this.getRelativeLocation(t);this.currentPath.addPoint(e)}getRelativeLocation(t){const e=this.canvas.getBoundingClientRect(),n=(t.clientX-e.left)/e.width,i=(t.clientY-e.top)/e.height;return new c(n,i)}}document.querySelector("#app").innerHTML=`
  <div style="position: relative;">
    <canvas
      id="canvas"
      width="500"
      height="500"
      style="
        background-color: #000000;
        position: relative;
      "
    >
    </canvas>

    <div style="margin: 10px; color: white; font-family: Arial">
      drag your mouse inside the canvas
    </div>
  </div>
`;function A(o,t,e){const n=t*(e*4)+o*4;return[n,n+1,n+2,n+3]}let a=null;function S(o){if(!a)return;const t=o.getImageData(0,0,a.canvas.width,a.canvas.height);for(let e=0;e<a.canvas.width;e++){for(let n=0;n<a.canvas.height;n++){const i=e/a.canvas.width,s=n/a.canvas.height,h=A(e,n,a.canvas.width),[w,m,y,P]=h,x=new c(i,s);let d=0,u=null,g=null,v=!0;for(const E of a.paths)for(const b of E.points){const l=c.vector(x,b);if(u&&g){const p=c.calculateAngle(u,l),C=c.calculateAngle(g,l);Math.abs(C-Math.PI)<=1e-5&&(v=!v),d=v?d+p:d-p,u=l}else u=l,g||(g=l)}const L=d/(2*Math.PI);let f=Math.abs(L)*185;t.data[w]=f>0?f:0,t.data[m]=0,t.data[y]=255-f,t.data[P]=f}o.putImageData(t,0,0)}}a=new R("canvas",S);
