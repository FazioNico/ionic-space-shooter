/**
 * @Author: Nicolas Fazio <webmaster-fazio>
 * @Date:   28-07-2017
 * @Email:  contact@nicolasfazio.ch
 * @Last modified by:   webmaster-fazio
 * @Last modified time: 29-07-2017
 */

 import { Shape } from '../shape'

  export class Enemy extends Shape{

    public name:string;
    public speed:number;
    public power:number;
    public life:number;
    public int:number;

    constructor(ctx, level, x,y){
      super(ctx)
      this.name = 'enemy';
      this.x = x;
      this.y = y;
      this.speed = level.speed;
      this.power = level.power
      this.life = level.life
      this.int = 0;
      this.width = 60;
      this.height = 60;
      this.imgUrl = level.imgUrl || "./assets/img/enemy-01.png"
      super.loadImg()
    }

    draw(){
      // super.draw()
      if(this.y > window.screen.height) return;
      this.y = (+this.y) + this.speed

      this.ctx.beginPath();
      //this.ctx.fillStyle = "red";
      //this.ctx.fillRect (this.x, this.y, this.width, this.height);
      this.ctx.drawImage(this.img,this.x-5, this.y, this.width+10, this.height+10);
      this.ctx.closePath();
   }

  }
