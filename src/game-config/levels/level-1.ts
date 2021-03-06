/**
 * @Author: Nicolas Fazio <webmaster-fazio>
 * @Date:   26-07-2017
 * @Email:  contact@nicolasfazio.ch
 * @Last modified by:   webmaster-fazio
 * @Last modified time: 07-08-2017
 */

import { ILevel } from "./levels";

export const LEVEL_1:ILevel = {
    enemys: {
      imgUrl: './assets/img/enemy-02.png',
      speed:2.9,
      life: 40,
      power: 150,
      bullet: {
        speed: 5
      }
    },
    background: {
      imgUrl: '',
      speed: 1.8
    },
    maxScore: 2500,
    boss: {
      imgUrl: './assets/img/boss-02.png',
      speed: 1.8,
      life: 800,
      power:350
    }
  }
