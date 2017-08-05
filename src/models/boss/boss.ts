/**
 * @Author: Nicolas Fazio <webmaster-fazio>
 * @Date:   28-07-2017
 * @Email:  contact@nicolasfazio.ch
 * @Last modified by:   webmaster-fazio
 * @Last modified time: 01-08-2017
 */

 import { Shape } from '../shape'

  export class Boss extends Shape{

    public name:string;
    public speed:number;
    public power:number;
    public life:number;
    public int:number;
    public return:boolean;

    constructor(ctx, level, x,y){
      super(ctx)
      this.name = 'boss';
      this.x = x;
      this.y = y;
      this.speed = level.speed;
      this.power = level.power
      this.life = level.life
      this.int = 0;
      this.width = 180;
      this.height = 180;
      this.imgUrl = level.imgUrl || "./assets/img/boss-01.png"
      this.return = false
      super.loadImg()
    }

    draw(){
      // super.draw()
      if(this.y > window.screen.height) return;
      //if(this.y < 0) this.y = (+this.y) + this.speed;

      if(this.y <= 50){
        this.return = false;
      }
      if(this.y >= window.screen.height/3 ) {
        this.return = true
      }
      if(this.y > window.screen.height/3 || this.return) {
        this.y = (+this.y) - this.speed/2
      }
      else {
        this.y = (+this.y) + (this.speed);
      }



      this.ctx.beginPath();
      //this.ctx.fillStyle = "red";
      //this.ctx.fillRect (this.x, this.y, this.width, this.height);
      this.ctx.drawImage(this.img,this.x-5, this.y, this.width+10, this.height+10);
      this.ctx.closePath();
   }

  }
