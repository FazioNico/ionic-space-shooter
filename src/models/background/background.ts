/**
 * @Author: Nicolas Fazio <webmaster-fazio>
 * @Date:   29-07-2017
 * @Email:  contact@nicolasfazio.ch
 * @Last modified by:   webmaster-fazio
 * @Last modified time: 30-07-2017
 */

 import { Shape } from '../shape'

 export class Background extends Shape {

     public speed:number;

     constructor(width:number, height:number, ctx:CanvasRenderingContext2D, speed:number, imgUrl:string){
       super(ctx)
       this.name = 'background'
       this.x = 0
       this.y = 0
       this.speed = speed || 1
       this.width = width
       this.height = height
       this.imgUrl = imgUrl || "./assets/img/space-03.jpg";
       super.loadImg()
     }

     draw(){
       // super.draw();
       // Fill the path
       this.ctx.beginPath();
       // this.ctx.fillStyle = "#000";
       // this.ctx.fillRect(0,0,this.width,this.height);
       this.ctx.drawImage(this.img,this.x, this.y);
       this.ctx.drawImage(this.img,this.x, this.y - this.img.height);
       this.ctx.closePath();
       this.y += this.speed;
       if (this.y >= this.img.height)
       			this.y = 0;
     }
 }
