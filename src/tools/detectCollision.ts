/**
 * @Author: Nicolas Fazio <webmaster-fazio>
 * @Date:   22-07-2017
 * @Email:  contact@nicolasfazio.ch
 * @Last modified by:   webmaster-fazio
 * @Last modified time: 01-08-2017
 */

export class DetectCollision {

  public elementsToDraw:any;
  public result:any;

  constructor(elementsToDraw){
    this.elementsToDraw = elementsToDraw
    window['log'] = this.elementsToDraw
  }

  detect(i,candidate,cible,cibleIndex = 0) {
    //console.log('candidate->', candidate)
    if(candidate.name.toLowerCase() === 'boss'){
      //console.log('XXXXX candidate->', candidate)
    }
    if (
      candidate.x < cible.x + cible.width &&
      candidate.x + candidate.width > cible.x &&
      candidate.y < cible.y + cible.height &&
      candidate.height + candidate.y > cible.y
    ) {
      let collection = candidate.name.toLowerCase()

      // element not drawable
      this.notDrawable(collection,i);
      // element to ignore
      this.elementIgnorable(collection,cible)
      // console.log('collision !! ->', collection, candidate, i)
      //enemy VS player
      this.enemy_VS_player(collection, cible, candidate ,i)
      //enemy VS player
      this.boss_VS_player(collection, cible, candidate ,i)
      //player VS enemy bullet
      this.player_VS_enemyBullet(collection,cible, candidate, cibleIndex ,i)
      // bullet VS enemy
      this.bullet_VS_enemy(collection, cible, candidate, cibleIndex, i)
      // bullet VS boss
      this.bullet_VS_boss(collection, cible, candidate, cibleIndex, i)
      // Default
      // this.defaultCheck(collection, cible, candidate, i)
    }
    else {
      this.result = false
    }
    //this.result = false
  }

  notDrawable(collection,i){
    if(!collection){
      return false
    }
    if(!this.elementsToDraw[collection][i]){
      //return this.result
      return false
    }
  }

  elementIgnorable(collection,cible){
    /**
     * player VS player
     */
    if(collection === 'player' && cible.name.toLowerCase() === 'player'){
      this.result = false
      return false
    }
    /**
     * bullet VS bullet
    */
    if(collection === 'bullet' && cible.name.toLowerCase() === 'bullet'){
      this.result = false
      return false
    }
    /**
     * enemy VS enemy bullet
     */
    if(collection === 'enemy' && cible.name.toLowerCase() === 'bullet' && cible.orientation === false ){
      this.result = false
      return false
    }
    /**
     * player VS payer bullet
     */
    if(collection === 'player' && cible.name.toLowerCase() === 'bullet' && cible.orientation === true ){
      this.result = false
      return false
    }
  }

  enemy_VS_player(collection, cible, candidate ,i){
    if(collection === 'enemy' && cible.name.toLowerCase() === 'player' ){
      this.result = {type: 'enemy_VS_player',  payload: {collection:collection, candidate:candidate, cible:cible, index:i, touch:true}}
      return false
    }
  }

  boss_VS_player(collection, cible, candidate ,i){
    if(collection === 'boss' && cible.name.toLowerCase() === 'player' ){
      this.result = {type: 'boss_VS_player',  payload: {collection:collection, candidate:candidate, cible:cible, index:i, touch:true}}
      return false
    }
  }

  player_VS_enemyBullet(collection,cible, candidate, cibleIndex ,i){
    if(collection === 'player' && cible.name.toLowerCase() === 'bullet' && cible.orientation === false ){
      cible.index = cibleIndex
      this.result = {type: 'player_VS_enemyBullet',  payload: {collection:collection, candidate:candidate, cible:cible, index:i, touch:true}}
      return false
    }
  }

  bullet_VS_enemy(collection, cible, candidate, cibleIndex, i){
    if(collection === 'enemy' && cible.name.toLowerCase() === 'bullet' && cible.orientation === true ){
      cible.index = cibleIndex;
      this.result = {type: 'bullet_VS_enemy', payload: {collection:collection, candidate:candidate, cible:cible, index:i, touch:true}}
      //console.log(this.result)
      return false
    }
  }

  bullet_VS_boss(collection, cible, candidate, cibleIndex, i){
    if(collection === 'boss' && cible.name.toLowerCase() === 'bullet' && cible.orientation === true ){
      cible.index = cibleIndex;
      this.result = {type: 'bullet_VS_boss', payload: {collection:collection, candidate:candidate, cible:cible, index:i, touch:true}}
      //console.log(this.result)
      return false
    }
  }

  defaultCheck(collection, cible, candidate, i){
    this.result = {type: 'default', payload: {collection:collection, candidate:candidate, cible:cible, index:i, touch:true}}
    return false
  }
}
