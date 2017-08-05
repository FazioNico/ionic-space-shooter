/**
 * @Author: Nicolas Fazio <webmaster-fazio>
 * @Date:   22-07-2017
 * @Email:  contact@nicolasfazio.ch
 * @Last modified by:   webmaster-fazio
 * @Last modified time: 01-08-2017
 */


import { DetectCollision } from "./detectCollision";
//import { Explosion } from '../models/explosions/explosion'
//import { IImgData } from '../../gameControllers'

export class ManageCollision {

  private ctx:CanvasRenderingContext2D;
  private detector:DetectCollision;
  public elementsToDraw:any
  public score:{enemy:number;current:number} = {  "enemy":0,"current":0};
  public result:any;
  public gameOver:boolean;
  public audio:any;
  //public imgData:IImgData = { explosion:[]};

  constructor(ctx:CanvasRenderingContext2D,elementsToDraw:any[], score:number){
    this.ctx = ctx
    this.elementsToDraw = elementsToDraw
    this.detector = new DetectCollision(this.elementsToDraw)
    this.result = null;
    this.gameOver = false
    this.audio = {
      explosion: new Audio()
    };
    this.audio.explosion.src = './assets/audio/explos.mp3';
    this.audio.explosion.oncanplaythrough = () =>{
      //audio.play()
      //console.log('audio ready')
      this.audio.explosion.volume=0.1
    }
    this.loadImg()

    // -- log
    window['log'] = this.elementsToDraw
  }

  loadImg(){
    let explosionImages = [
      './assets/img/expl_1.png', './assets/img/expl_2.png', './assets/img/expl_3.png', './assets/img/expl_4.png',
      './assets/img/expl_5.png', './assets/img/expl_6.png', './assets/img/expl_7.png', './assets/img/expl_8.png',
      './assets/img/expl_9.png', './assets/img/expl_10.png', './assets/img/expl_11.png'
    ];
    // explosionImages.map((imageURL,i)=> {
    //   let img = new Image();
    //   img.onload = (e:any)=>{
    //     //console.log(e)
    //     this.imgData.explosion.push(img)
    //   };
    //   img.src = imageURL;
    // })
  }
  detectCollision(index,candidate,myCursor,cIndex){
    this.detector.detect(index,candidate,myCursor,cIndex)
    this.result = this.detector.result
  }

  _then(){
    //console.log(this.result);
    let result;
    switch (this.result.type || 'default') {
        case 'bullet_VS_boss':
            //console.log('switch', this.result.type);
            result = this.bullet_VS_boss(this.result.payload)
            break;
        case 'bullet_VS_enemy':
            //console.log('switch', this.result.type);
            result = this.bullet_VS_enemy(this.result.payload)
            break;
        case 'player_VS_enemyBullet':
            //console.log('switch', this.result.type);
            result = this.player_VS_enemyBullet(this.result.payload)
            break;
        case 'enemy_VS_player':
            //console.log('switch', this.result.type);
            result = this.enemy_VS_player(this.result.payload)
            break;
        case 'boss_VS_player':
            //console.log('switch', this.result.type);
            result = this.boss_VS_player(this.result.payload)
            break;
        default:
            //console.log('default');
    }
    return result
  }

  bullet_VS_enemy(result){
    //console.warn('bullet_VS_enemy', result.candidate.life)
    //console.log(collection, cible.name.toLowerCase(), cible.orientation)
    if(result.collection === 'enemy' && result.cible.name.toLowerCase() === 'bullet' && result.cible.orientation === true ){
      //console.log('update score', result.index, result.candidate.life, result.cible.power);
      //console.log(result.index)
      this.updateScore(result.cible.power)
      //  console.log('current score', result.cible.power , this.score.current);
      result.candidate.life = result.candidate.life - result.cible.power;

      // let exp = new Explosion(this.ctx, result.cible.x, result.cible.y, this.imgData.explosion)
      // this.elementsToDraw.explosion.push(exp);

      this.audio.explosion.currentTime = 0;
      this.audio.explosion.play()
      this.audio.explosion.volume=0.1

      this.removeElement('bullet', result.cible, result.cible.index, true)
      if(this.elementsToDraw[result.collection][result.index].life <= 0){
        this.removeElement(result.collection, result.cible, result.index, true)
      }
      return false
    }
    return false
  }

  bullet_VS_boss(result){
    //console.warn('bullet_VS_enemy', result.candidate.life)
    //console.log(collection, cible.name.toLowerCase(), cible.orientation)
    if(result.collection === 'boss' && result.cible.name.toLowerCase() === 'bullet' && result.cible.orientation === true ){
      //console.log('update score', result.index, result.candidate.life, result.cible.power);
      //console.log(result.candidate.life - result.cible.power)
      this.updateScore(result.cible.power)
      //  console.log('current score', result.cible.power , this.score.current);
      result.candidate.life = result.candidate.life - result.cible.power;

      // let exp = new Explosion(this.ctx, result.cible.x, result.cible.y, this.imgData.explosion)
      // this.elementsToDraw.explosion.push(exp);

      this.audio.explosion.currentTime = 0;
      this.audio.explosion.play()
      this.audio.explosion.volume=0.1

      this.removeElement('bullet', result.cible, result.cible.index, true)
      if(this.elementsToDraw[result.collection][result.index].life <= 0){
        this.removeElement(result.collection, result.cible, result.index, true)
        // alert('CONGRATE!! YOU WIN!')
        console.log('CONGRATE!! YOU WIN!')
        return true
      }
      return false
    }
    return false
  }

  player_VS_enemyBullet(result){
    //console.log('player VS enemy bullet')
    this.audio.explosion.currentTime = 0;
    this.audio.explosion.play()
    this.audio.explosion.volume=0.1
    //console.log(result)
    this.removeElement('bullet', result.cible, result.cible.index, true)
    this.checkGameOver(result.cible.power, result)
    return
  }

  enemy_VS_player(result){
    //console.log('enemy_VS_player', result)
    //this.audio.explosion.currentTime = 0;
    this.audio.explosion.play()
    this.audio.explosion.volume=0.1
    this.checkGameOver(result.candidate.power, result)
    return
  }

  boss_VS_player(result){
    //console.log('enemy_VS_player', result)
    //this.audio.explosion.currentTime = 0;
    this.audio.explosion.play()
    this.audio.explosion.volume=0.1
    this.checkGameOver(result.candidate.power, result)
    return
  }

  updateScore(point:number){
    this.score.current += point
    //console.log('updateScore',this.score.current)
  }

  removeElement(collection:string, element:any,index:number, touch:boolean):void{
    //console.log(this.elementsToDraw[collection])
    if(touch){

      if(!element.orientation && element.name.toLowerCase() === 'bullet'){
        //console.log('player VS enemy bullet', element)
        this.elementsToDraw.enemyBullet[index] = null;
        this.elementsToDraw.enemyBullet.splice(index, 1);
        return
      }
      //console.log(index)
      this.elementsToDraw[collection][index] = null;
      this.elementsToDraw[collection].splice(index, 1);
      //console.log(this.elementsToDraw[collection])
      return
    }
    if(element.y < 0 || (element.y > window.screen.height)){
      //console.log('YYYYYYYXXXXXXXXXXXXX',this.elementsToDraw[collection][index])
      // remove element from array
      this.elementsToDraw[collection][index] = null;
      this.elementsToDraw[collection].splice(index, 1);
      //console.log(this.elementsToDraw[collection])
      return
    }
    return;
  }

  checkGameOver(degat:number, result:any){
    if(this.elementsToDraw.player[0].life <= 0){
      //console.log(result.index)
      this.removeElement(result.candidate.name, result.candidate,result.index, true)
      this.gameOver = true
    }
    else {
      this.elementsToDraw.player[0].life = this.elementsToDraw.player[0].life - degat
      //console.info('Touched', this.elementsToDraw.player[0].life)
      // this.ctx.beginPath();
      // this.ctx.fillStyle = "rgba(255, 255, 255, 0.35)";
      // this.ctx.fillRect(0,0,this.width,this.height);


      // let exp = new Explosion(this.ctx, this.elementsToDraw.player[0].x, this.elementsToDraw.player[0].y, this.imgData.explosion)
      // this.elementsToDraw.explosion.push(exp);
    }
  }

}
