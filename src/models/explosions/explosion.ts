/**
 * @Author: Nicolas Fazio <webmaster-fazio>
 * @Date:   06-08-2017
 * @Email:  contact@nicolasfazio.ch
 * @Last modified by:   webmaster-fazio
 * @Last modified time: 12-08-2017
 */

  import { Shape } from '../shape'

  export class Explosion extends Shape{

    public count:number;
    public imgArray:HTMLImageElement[]

    constructor(ctx:CanvasRenderingContext2D, x:number, y:number, images:string[]){
      super(ctx)
      this.name = 'explosion'
      this.imgUrl = images;
      this.ctx = ctx;
      this.x = x;
      this.y = y;
      this.count = 0;
      this.int = Date.now();
      //console.log(this.imgArray)
      super.loadImg()
    }

    draw():any{
      //console.log(this.int, Date.now(), Date.now() - this.int )
      if(this.count < 11){
        if(( Date.now() - this.int) > 10 ){
          if(!this.imgArray[this.count]){
            console.log('no img->', this.imgArray[this.count], this.imgArray)
            return
          }
          this.ctx.beginPath();
          this.ctx.drawImage(
            this.imgArray[this.count],
            this.x,
            this.y,
            60,
            60
          );
          this.ctx.closePath();
          this.count++;
        }
      }
      this.int = Date.now()
    }
  }
