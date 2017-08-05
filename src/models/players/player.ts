/**
 * @Author: Nicolas Fazio <webmaster-fazio>
 * @Date:   27-07-2017
 * @Email:  contact@nicolasfazio.ch
 * @Last modified by:   webmaster-fazio
 * @Last modified time: 02-08-2017
 */

 import { Shape } from '../shape'

 const DEFAULT_IMG_URL:string = ''//"./assets/img/fighter-01.png";
 export class Player extends Shape{

   constructor(ctx:CanvasRenderingContext2D,imgUrl:string, life:number=null) {
     super(ctx)
     this.name = 'player';
     this.x = 150;
     this.y = 500;
     this.width = 60;
     this.height = 60;
     this.life = life || 1000;
     this.imgUrl = imgUrl || DEFAULT_IMG_URL;
     super.loadImg()
   }

 }
