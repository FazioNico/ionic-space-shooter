/**
 * @Author: Nicolas Fazio <webmaster-fazio>
 * @Date:   26-07-2017
 * @Email:  contact@nicolasfazio.ch
 * @Last modified by:   webmaster-fazio
 * @Last modified time: 02-08-2017
 */

import { ILevel } from "./levels";

export const LEVEL_0:ILevel = {
    enemys: {
      imgUrl: './assets/img/enemy-01.png',
      speed:2.8,
      life: 20,
      power:100,
      bullet: {
        speed: 5
      }
    },
    background: {
      imgUrl: '',
      speed: 1.8
    },
    maxScore: 100,
    boss: {
      imgUrl: '',
      speed: 1.5,
      life: 100,
      power:300
    }
  }
