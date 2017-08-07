/**
 * @Author: Nicolas Fazio <webmaster-fazio>
 * @Date:   30-07-2017
 * @Email:  contact@nicolasfazio.ch
 * @Last modified by:   webmaster-fazio
 * @Last modified time: 07-08-2017
 */

 import { Shape } from '../shape'

 export class Bullet extends Shape {

   public speed:number;
   public power:number;
   public color:string;
   public orientation:boolean;
   public int:number;

   constructor(
     ctx:CanvasRenderingContext2D,
     userX:number,
     userY:number,
     speed:number = 4,
     color:string = 'yellow',
     orientation:boolean = true,
     dimention:{width:number, height:number} = {width:2, height:10}
   ){
     super(ctx)
     this.name = 'bullet';
     this.ctx = ctx;
     this.x = userX;
     this.y = userY;
     this.width = dimention.width;
     this.height = dimention.height;
     this.int = 0
     this.color = color
     this.orientation = orientation
     this.speed = speed;
     this.power = 10
   }

   draw():void{

     if(this.y > window.screen.height) return;
     if(this.orientation)this.y = (+this.y) - this.speed
     if(!this.orientation)this.y = (+this.y) + this.speed

     super.draw()
   }


 }
