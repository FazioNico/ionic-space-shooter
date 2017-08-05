/**
* @Author: Nicolas Fazio <webmaster-fazio>
* @Date:   25-07-2017
* @Email:  contact@nicolasfazio.ch
 * @Last modified by:   webmaster-fazio
 * @Last modified time: 04-08-2017
*/

import { Component, Output, EventEmitter, ViewChild, Input, ElementRef, Renderer, ChangeDetectionStrategy, HostListener } from '@angular/core';
import { Observable } from 'rxjs';

import { Store } from '@ngrx/store'

import { State } from "../../store/reducers";
import { MainActions } from '../../store/actions/mainActions';

import { Background } from "../../models/background/background";
import { Player } from "../../models/players/player";
import { Enemy } from "../../models/enemys/enemy";
import { Bullet } from "../../models/bullets/bullet";
import { Boss } from "../../models/boss/boss";

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
      //console.log(event)
      this.updatePlayer({x:event.clientX, y:event.clientY})
      // this.store.dispatch({
      //     type: MainActions.MOUSE_MOVING,
      //     payload: {x:event.clientX-30, y:event.clientY-30}
      // });
  }
  @HostListener('document:keypress', ['$event']) onKeyPress(event: KeyboardEvent) {
      // console.log('HostListener onKeyPress', event)
      if(event.keyCode != 13){
        return false;
      }
      this.addBullets(true);
  }

  @ViewChild('canvasArea') canvasArea:ElementRef;
  @Input('config') config:any
  @Input('player') player:Player
  @Input('level') level:any
  @Output() onEvents: EventEmitter<any> = new EventEmitter();

  //public config:any;
  public ctx:CanvasRenderingContext2D;
  public elementsToDraw:any;
  public boss:Boss

  public drawLevelUp:boolean = false;
  public eventEmited:boolean = false;
  public animate:boolean = true;
  public animationFrame:any;
  public intCtrl: {enemy:number, enemyBullet:number} = {enemy:null, enemyBullet:null};
  public collCtrl:ManageCollision;
  public quadtree:Quadtree;

  constructor(
    private el: ElementRef,
    public renderer: Renderer,
    private store:Store<any>
  ){
  }

  initGame() {
    //console.log(this.player)
    // init quadTree
    this.quadtree = new Quadtree({
    	x: 0,
    	y: 0,
    	width: this.config.position.width,
    	height: this.config.position.height
    }, 4);
    this.elementsToDraw = {
      //"background": new Background(this.config.position.width, this.config.position.height, this.config.ctx),
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
    this.elementsToDraw.background = new Background(this.config.position.width, this.config.position.height, this.ctx, this.level.config.background.speed, this.level.config.background.speed.imgUrl)
    // add player
    this.elementsToDraw.player.push(new Player(this.ctx, this.player.imgUrl, this.player.life))
    console.log(this.player)
    window['player'] = this.player
    //console.log(this.inpLevel.config.enemys)
    //add enemy
    this.addEnemy()
    this.intCtrl.enemyBullet =  setInterval(_=> {
                                // init enemy's Shot (bullet)
                                this.addBullets(false)
                              },1800)
    // Init collision manager with all elements to draw + score .
    this.collCtrl = new ManageCollision(this.config.ctx, this.elementsToDraw, 0)//this.txtToDraw.score

    // init draw
    this.animate = true
    this.drawElements()
    //console.log(this.config)
  }

  drawElements(){
    if(!this.animate)return ;
    this.ctx.clearRect(0,0,this.config.position.width,this.config.position.height)
    this.quadtree.clear()
    // insert/update element in quadtree
    this.quadtree.insert( this.elementsToDraw.player)
    this.quadtree.insert( this.elementsToDraw.enemy )
    this.quadtree.insert( this.elementsToDraw.boss )

    // Draw all elements
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
    //console.log('add Boss', this.collCtrl.score.current >= this.level.config.maxScore, this.boss)
    if(this.collCtrl.score.current >= this.level.config.maxScore && !this.boss){
      this.boss = new Boss(this.ctx, this.level.config.boss,(this.config.position.width/2)- 90,-180)
      //console.log('add Boss -> level.config', this.level.config)
      this.elementsToDraw.boss.push(this.boss)
    }

    this.elementsToDraw.boss.map((boss:Boss, i) => {
      //this.checkCandidate(boss, i)
      //this.removeElement('boss', boss,i, true)
      return boss.draw()
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
    if(this.elementsToDraw.player[0].life <= 0){
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
    //console.log(this.elementsToDraw)
    this.collCtrl.elementsToDraw = this.elementsToDraw
    this.animationFrame = requestAnimationFrame(_=>this.drawElements());
  }

  drawTXT(txt:{x:number,y:number,fillStyle:string, font:string,textAlign:string, data:string}){
    this.ctx.beginPath();
    this.ctx.fillStyle = txt.fillStyle;
    this.ctx.font = txt.font;
    this.ctx.textAlign= txt.textAlign;
    this.ctx.fillText(txt.data,txt.x,txt.y);
  }

  addEnemy(){
    //console.log(this.level.config.maxScore )
    let delay:number =  Math.floor(Math.random()*(3000-500+1)+500);
    let x:number =  Math.floor(Math.random()*this.config.position.width);
    console.log('addEnemy-> ', delay, x)
    this.intCtrl.enemy = setTimeout( ()=> {
      this.elementsToDraw.enemy.push(new Enemy(this.ctx, this.level.config.enemys, (x>=(this.config.position.width-60))?this.config.position.width-60: x, 0))
      this.addEnemy();
    },delay);
  }

  addBullets(player:boolean){
    //console.log('playerShot')
    if(!this.elementsToDraw.player[0] || this.elementsToDraw.player[0].life <= 0){
      return
    }
    let bullets:any[] = [];
    if(player){
      // player bullets
      bullets = [
        ...bullets,
        new Bullet(this.ctx, this.elementsToDraw.player[0].x-((this.elementsToDraw.player[0].width/2)-45), this.elementsToDraw.player[0].y),
        new Bullet(this.ctx, this.elementsToDraw.player[0].x+((this.elementsToDraw.player[0].width/2)+15), this.elementsToDraw.player[0].y)
      ]
      // add bullets to elementsToDraw
      this.elementsToDraw.bullet.push(...bullets)
    }
    else {
      // enemy bullets

      if(this.elementsToDraw.enemy.length === 0){
        return false
      }
      this.elementsToDraw.enemy.map((element, index) => {
          if(!element.x && !element.y)return false;
          bullets = [
            ...bullets,
            new Bullet(this.ctx, element.x+30, element.y+40, this.level.config.enemys.bullet.speed, 'red', false),
          ]
      })
      // add bullets to elementsToDraw
      this.elementsToDraw.enemyBullet.push(...bullets)
    }

    //console.log(this.elementsToDraw.bullet)
    // this.audio.bullet.default.currentTime = 0;
    // this.audio.bullet.default.play()

  }
  updatePlayer(position:{x:number,y:number}):void{
    if(!position || !this.elementsToDraw || !this.elementsToDraw.player[0]){
      return
    };
    //console.log(position.y)
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
          console.log(endOfLevel)
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

  handleStart(event){
    //console.log(event)
    this.updatePlayer({x:event.touches[0].pageX, y: event.touches[0].pageY})
    this.addBullets(true)
  }

  handleMove(event){
    this.updatePlayer({x:event.touches[0].pageX, y: event.touches[0].pageY})
  }

  levelUp(){
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
    //this.stopGame()
  }

  eofPause(){
    this.animate = true;
    this.addEnemy()
    this.intCtrl.enemyBullet =  setInterval(_=> {
                                // init enemy's Shot (bullet)
                                this.addBullets(false)
                              },1800)
    this.drawElements()
  }

  stopGame(){
    cancelAnimationFrame(this.animationFrame);
    clearTimeout(this.intCtrl.enemy)
    this.animationFrame = null
    this.animate = false;
    console.log('stopGame!!')
  }
}
