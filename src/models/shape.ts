/**
 * @Author: Nicolas Fazio <webmaster-fazio>
 * @Date:   27-07-2017
 * @Email:  contact@nicolasfazio.ch
 * @Last modified by:   webmaster-fazio
 * @Last modified time: 29-07-2017
 */

 export class Shape {

     public name:string;
     public ctx:CanvasRenderingContext2D;
     public x:number;
     public y:number;
     public width:number;
     public height:number;
     public int:number;
     public life:number;
     public color:string;
     public img:HTMLImageElement;
     public imgUrl:string;

     constructor(ctx:CanvasRenderingContext2D){
       this.ctx = ctx;
       this.loadImg()
     }

     draw():void{
       if(this.img && !this.int){
         this.ctx.beginPath();
         this.ctx.drawImage(this.img,this.x, this.y, this.width, this.height);
         this.ctx.closePath();
         return
       }
       if(this.color) {
         this.ctx.beginPath();
         this.ctx.fillStyle = this.color;
         this.ctx.fillRect (this.x, this.y, this.width, this.height);
         this.ctx.closePath();
         return
       }
     }

     loadImg():void{
       if(!this.imgUrl){
         return;
       }
       this.img = new Image();
      //  this.img.onload = (e:any)=>{
      //    //console.log(e.path[0].src)
      //    //this.img.src = img.src;
      //  };
       this.img.src = this.imgUrl;
     }
 }
