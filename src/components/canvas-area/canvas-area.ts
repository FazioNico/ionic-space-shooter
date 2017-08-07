/**
* @Author: Nicolas Fazio <webmaster-fazio>
* @Date:   25-07-2017
* @Email:  contact@nicolasfazio.ch
 * @Last modified by:   webmaster-fazio
 * @Last modified time: 07-08-2017
*/

import { Component, Output, EventEmitter, ViewChild, Input, ElementRef, Renderer, ChangeDetectionStrategy, HostListener } from '@angular/core';
import { Observable } from 'rxjs';

import { Store } from '@ngrx/store'

import { State } from "../../store/reducers";
import { IConfigStats } from "../../store/reducers/configReducer";
import { IPlayerStats } from "../../store/reducers/playerReducer";
import { ILevelStats } from "../../store/reducers/levelReducer";
import { MainActions } from '../../store/actions/mainActions';

import { Background } from "../../models/background/background";
import { Player } from "../../models/players/player";
import { Enemy } from "../../models/enemys/enemy";
import { Bullet } from "../../models/bullets/bullet";
import { Boss } from "../../models/boss/boss";
import { Explosion } from "../../models/explosions/explosion";

import { Quadtree } from "../../tools/quadtree";
import { ManageCollision } from "../../tools/manageCollision";

@Component({
  selector: 'ng-canvas-area',
  template:  `
    <canvas
    #canvasArea
    (touchstart)="handleStart($event)"
    (touchmove)="handleMove($event)"></canvas>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class CanvasAreaComponent{

  @HostListener(`document:mousemove`, ['$event']) onKMouseMove(event: MouseEvent) {
      this.updatePlayer({x:event.clientX, y:event.clientY})
      // this.store.dispatch({
      //     type: MainActions.MOUSE_MOVING,
      //     payload: {x:event.clientX-30, y:event.clientY-30}
      // });
  }
  @HostListener('document:keypress', ['$event']) onKeyPress(event: KeyboardEvent) {
      if(event.keyCode != 13){
        return false;
      }
      this.addBullets(true);
  }

  @ViewChild('canvasArea') canvasArea:ElementRef;
  @Input('config') config:IConfigStats
  @Input('player') player:IPlayerStats
  @Input('level') level:ILevelStats
  @Output() onEvents: EventEmitter<string> = new EventEmitter();

  //public config:any;
  public ctx:CanvasRenderingContext2D;
  public elementsToDraw:{
    "background"?: Background;
    "player":Player[];
    "bullet": Bullet[],
    "enemy": Enemy[],
    "boss": Boss[],
    "enemyBullet": Bullet[];
    "explosion": any[];
  }
  public boss:Boss

  public drawLevelUp:boolean;
  public eventEmited:boolean;
  public animate:boolean;
  public animationFrame:any;
  public intCtrl: {enemy:number, enemyBullet:number, bossBullet:number}
  public collCtrl:ManageCollision;
  public quadtree:Quadtree;

  constructor(
    public renderer: Renderer,
    private store:Store<any>
  ){
  }

  initGame():void {
    this.drawLevelUp = false
    this.eventEmited = false
    this.animate = true
    this.intCtrl = {enemy:null, enemyBullet:null, bossBullet:null};
    // init quadTree
    this.quadtree = new Quadtree({
    	x: 0,
    	y: 0,
    	width: this.config.position.width,
    	height: this.config.position.height
    }, 4);
    this.elementsToDraw = {
      "player": [],
      "bullet": [],
      "enemy": [],
      "boss": [],
      "enemyBullet": [],
      "explosion": []
    }
    // fix canvas dimention
    this.ctx = this.canvasArea.nativeElement.getContext('2d')
    this.renderer.setElementAttribute(this.canvasArea.nativeElement, 'width', this.config.position.width + '');
    this.renderer.setElementAttribute(this.canvasArea.nativeElement, 'height', this.config.position.height + '');
    // add background
    this.elementsToDraw.background = new Background(this.config.position.width, this.config.position.height, this.ctx, this.level.config.background.speed, this.level.config.background.imgUrl)
    // add player
    this.elementsToDraw.player.push(new Player(this.ctx, this.player.imgUrl, this.player.life))
    window['player'] = this.player
    //add enemy
    this.addEnemy()
    // add enemy bullet
    this.intCtrl.enemyBullet =  setInterval(_=> {
                                // init enemy's Shot (bullet)
                                this.addBullets(false)
                              },1800)
    // add Boss bullet
    this.intCtrl.bossBullet =  setInterval(_=> {
                                // init enemy's Shot (bullet)
                                this.addBullets(false,true)
                              },800)
    // Init collision manager with all elements to draw + score .
    this.collCtrl = new ManageCollision(this.ctx, this.elementsToDraw, 0)
    // init draw
    this.animate = true
    this.drawElements()
  }

  drawElements():void{
    //console.log(this.level.maxLevel, this.level.current)
    if(!this.animate )return ;
    if(this.level.maxLevel <= this.level.current){
      this.stopGame()
      this.drawFinalWin()
      this.onEvents.emit('endofgame');
      return;
     };

    this.ctx.clearRect(0,0,this.config.position.width,this.config.position.height)
    this.quadtree.clear()
    // insert/update element in quadtree
    this.quadtree.insert( this.elementsToDraw.player)
    this.quadtree.insert( this.elementsToDraw.enemy )
    this.quadtree.insert( this.elementsToDraw.boss )
    // Draw background
    this.elementsToDraw.background.draw()
    // Draw players
    this.elementsToDraw.player.map((player, index) => {
      this.drawTXT({
        x:10,
        y:30,
        fillStyle:'white',
        font: '1.8rem DS DIGI, Arial',
        textAlign:'left',
        data: `LIFE: ${(player.life<=0)?0:player.life}`
      })
      if(player.life >0) {
        this.checkCandidate(player)
        return player.draw()
      }
    })
    // Draw all Bullets
    this.elementsToDraw.bullet.map((bullet, index) => {
      this.checkCandidate(bullet,index)
      // if animated element move outside canvasElement zone
      this.removeElement('bullet',bullet,index , false)
      // return drawable element
      return bullet.draw()
    })
    // draw Enemys
    this.elementsToDraw.enemy.map((enemy, index) => {
      // if animated element move outside canvasElement zone
      this.removeElement('enemy',enemy,index, false)
      // return drawable element
      return enemy.draw()
    })
    // draw Enemys Bullets
    this.elementsToDraw.enemyBullet.map((enemyBullet, index) => {
      this.checkCandidate(enemyBullet)
      // if animated element move outside canvasElement zone
      this.removeElement('enemyBullet',enemyBullet,index, false)
      // return drawable element
      return enemyBullet.draw()
    })
    // Draw Boss
    if(this.collCtrl.score.current >= this.level.config.maxScore && !this.boss){
      this.boss = new Boss(this.ctx, this.level.config.boss,(this.config.position.width/2)- 90,-180)
      //console.log('add Boss -> level.config', this.level.config)
      this.elementsToDraw.boss.push(this.boss)
    }
    this.elementsToDraw.boss.map((boss:Boss, i) => {
      return boss.draw()
    })

    // Draw Explosion
    if(this.collCtrl.collision.active){
      let explosionImages:any[] = [
        './assets/img/expl_1.png', './assets/img/expl_2.png', './assets/img/expl_3.png', './assets/img/expl_4.png',
        './assets/img/expl_5.png', './assets/img/expl_6.png', './assets/img/expl_7.png', './assets/img/expl_8.png',
        './assets/img/expl_9.png', './assets/img/expl_10.png', './assets/img/expl_11.png'
      ];
      let exp = new Explosion(this.ctx, this.collCtrl.collision.x, this.collCtrl.collision.y, explosionImages)
      this.elementsToDraw.explosion.push(exp);
      this.collCtrl.collision = {active:false};
    }
    this.elementsToDraw.explosion.map((explosion, index)=> {
      if(explosion.count >= 11){
        this.removeElement('explosion',explosion,index, true)
      }
      return explosion.draw()
    })

    // Draw score
    this.drawTXT({
      x:10,
      y:50,
      fillStyle:'white',
      font: '1.8rem DS DIGI, Arial',
      textAlign:'left',
      data: `SCORE: ${this.collCtrl.score.current}`
    })

    // Draw levelUp
    if(this.drawLevelUp){
      this.drawTXT({
        x:this.config.position.width/2,
        y:this.config.position.height/2,
        fillStyle:'white',
        font: '4rem DS DIGI, Arial',
        textAlign:'center',
        data: `LEVEL UP  ${this.level.current}`
      })
    }

    // Draw gameOver
    if(!this.elementsToDraw.player[0] || this.elementsToDraw.player[0].life <= 0){
      if(!this.eventEmited) this.onEvents.emit('gameover');
      this.drawTXT({
        x:this.config.position.width/2,
        y:this.config.position.height/2,
        fillStyle:'white',
        font: '5rem DS DIGIB, Arial',
        textAlign:'center',
        data: `GAME OVER`
      })
      this.eventEmited = true
    }

    this.collCtrl.elementsToDraw = this.elementsToDraw
    this.animationFrame = requestAnimationFrame(_=>this.drawElements());
  }

  drawTXT(txt:{x:number,y:number,fillStyle:string, font:string,textAlign:string, data:string}):void{
    this.ctx.beginPath();
    this.ctx.fillStyle = txt.fillStyle;
    this.ctx.font = txt.font;
    this.ctx.textAlign= txt.textAlign;
    this.ctx.fillText(txt.data,txt.x,txt.y);
  }

  addEnemy():void{
    let delay:number =  Math.floor(Math.random()*(3000-500+1)+500);
    let x:number =  Math.floor(Math.random()*this.config.position.width);
    this.intCtrl.enemy = setTimeout( ()=> {
      this.elementsToDraw.enemy.push(new Enemy(this.ctx, this.level.config.enemys, (x>=(this.config.position.width-60))?this.config.position.width-60: x, 0))
      this.addEnemy();
    },delay);
  }

  addBullets(isPlayer:boolean,isBoss:boolean = false):void{
    if(!this.elementsToDraw.player[0] || this.elementsToDraw.player[0].life <= 0){
      return
    }
    let bullets:any[] = [];
    if(isPlayer){
      // player bullets
      bullets = [
        ...bullets,
        new Bullet(this.ctx, this.elementsToDraw.player[0].x-((this.elementsToDraw.player[0].width/2)-45), this.elementsToDraw.player[0].y),
        new Bullet(this.ctx, this.elementsToDraw.player[0].x+((this.elementsToDraw.player[0].width/2)+15), this.elementsToDraw.player[0].y)
      ]
      // add bullets to elementsToDraw
      this.elementsToDraw.bullet.push(...bullets)
    }
    if(!isPlayer && !isBoss) {
      // enemy bullets
      if(this.elementsToDraw.enemy.length === 0){
        return
      }
      this.elementsToDraw.enemy.map((element, index) => {
          if(!element.x && !element.y)return;
          bullets = [
            ...bullets,
            new Bullet(this.ctx, element.x+30, element.y+40, this.level.config.enemys.bullet.speed, 'red', false),
          ]
      })
      // add bullets to elementsToDraw
      this.elementsToDraw.enemyBullet.push(...bullets)
    }

    if(!isPlayer && isBoss) {
      // boss bullets
      if(!this.elementsToDraw.boss || this.elementsToDraw.boss.length === 0){
        return
      }
      console.log('boss bullets')
      this.elementsToDraw.boss.map((element, index) => {
          if(!element.x && !element.y)return;
          bullets = [
            ...bullets,
            new Bullet(this.ctx, (element.x+element.width/2)-40, element.y+element.height/2, this.level.config.enemys.bullet.speed, 'orange', false, {width:3, height:15}),
            new Bullet(this.ctx, (element.x+element.width/2)-20, element.y+element.height/2, this.level.config.enemys.bullet.speed, 'orange', false, {width:3, height:15}),
            new Bullet(this.ctx, (element.x+element.width/2), element.y+element.height/2, this.level.config.enemys.bullet.speed, 'orange', false, {width:3, height:15}),
            new Bullet(this.ctx, (element.x+element.width/2)+20, element.y+element.height/2, this.level.config.enemys.bullet.speed, 'orange', false, {width:3, height:15}),
            new Bullet(this.ctx, (element.x+element.width/2)+40, element.y+element.height/2, this.level.config.enemys.bullet.speed, 'orange', false, {width:3, height:15}),
          ]
      })
      // add bullets to elementsToDraw
      this.elementsToDraw.enemyBullet.push(...bullets)
    }
    // this.audio.bullet.default.currentTime = 0;
    // this.audio.bullet.default.play()

  }

  updatePlayer(position:{x:number,y:number}):void{
    if(!position || !this.elementsToDraw || !this.elementsToDraw.player[0]){
      return
    };
    this.elementsToDraw.player[0].x = (position.x >29)?position.x-30 : 0
    this.elementsToDraw.player[0].y = (position.y >29)?position.y-30 : 0
  }

  checkCandidate(myCursor, cIndex:number = 0):void{
    let candidatesNodes:any[] = this.quadtree.retrieve( myCursor )
    candidatesNodes.map((candidates) => {
      return candidates.map((candidate, index) => {
        this.collCtrl.detectCollision(index,candidate,myCursor,cIndex)
        if(this.collCtrl.result){
          let endOfLevel = this.collCtrl._then()
          //console.log(endOfLevel)
          if(endOfLevel)this.levelUp();return
          // console.log(this.collCtrl.result)
        }
        return this.collCtrl.result || candidate
      })
    })
  }

  removeElement(collection:string, element:any,index:number, touch:boolean):void{
    this.collCtrl.removeElement(collection,element,index, touch)
  }

  handleStart(event):void{
    this.updatePlayer({x:event.touches[0].pageX, y: event.touches[0].pageY})
    this.addBullets(true)
  }

  handleMove(event):void{
    this.updatePlayer({x:event.touches[0].pageX, y: event.touches[0].pageY})
  }

  levelUp():void{
    console.log('levelUp!!')
    this.onEvents.emit('levelup')
    clearTimeout(this.intCtrl.enemy)
    this.drawLevelUp = true
    let levelUp = setTimeout(_=>{
      this.boss = null
      this.drawLevelUp = false
      this.addEnemy()
      clearTimeout(levelUp)
    },3000)
  }

  eofPause():void{
    this.animate = true;
    this.addEnemy()
    this.intCtrl.enemyBullet =  setInterval(_=> {
                                // init enemy's Shot (bullet)
                                this.addBullets(false)
                              },1800)
    this.intCtrl.bossBullet =  setInterval(_=> {
                                // init enemy's Shot (bullet)
                                this.addBullets(false, true)
                              },800)
    this.drawElements()
  }

  stopGame():void{
    cancelAnimationFrame(this.animationFrame);
    if(this.intCtrl){
      clearTimeout(this.intCtrl.enemy)
      clearInterval(this.intCtrl.enemyBullet)
      clearInterval(this.intCtrl.bossBullet)
    }
    this.animationFrame = null
    this.animate = false;
    if(this.boss)
      delete this.boss
    console.log('stopGame!!')
  }

  drawFinalWin():void{
    this.ctx.clearRect(0,0,this.config.position.width,this.config.position.height)
    // Draw background
    this.elementsToDraw.background.draw()
    // Draw players
    this.elementsToDraw.player.map((player, index) => {
      this.drawTXT({
        x:10,
        y:30,
        fillStyle:'white',
        font: '1.8rem DS DIGI, Arial',
        textAlign:'left',
        data: `LIFE: ${(player.life<=0)?0:player.life}`
      })
      player.draw()
    })
    // Draw score
    this.drawTXT({
      x:10,
      y:50,
      fillStyle:'white',
      font: '1.8rem DS DIGI, Arial',
      textAlign:'left',
      data: `SCORE: ${this.collCtrl.score.current}`
    })
    this.drawTXT({
      x:this.config.position.width/2,
      y:this.config.position.height/2,
      fillStyle:'white',
      font: '5rem DS DIGIB, Arial',
      textAlign:'center',
      data: `END OF GAME`
    })
    this.animationFrame = requestAnimationFrame(_=>this.drawFinalWin());
  }
}
