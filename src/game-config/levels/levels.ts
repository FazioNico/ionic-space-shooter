/**
* @Author: Nicolas Fazio <webmaster-fazio>
* @Date:   26-07-2017
* @Email:  contact@nicolasfazio.ch
 * @Last modified by:   webmaster-fazio
 * @Last modified time: 30-07-2017
*/

import { LEVEL_0 } from "./level-0";
import { LEVEL_1 } from "./level-1";

export interface ILevels extends Array<ILevel>{
}

export interface ILevel {
  enemys: {
    imgUrl:string;
    speed:number;
    life:number;
    power:number;
    bullet: {
      speed:number
    }
  },
  background: {
    imgUrl:string;
    speed:number;
  },
  maxScore:number;
  boss: {
    imgUrl:string;
    speed:number;
    life:number;
    power:number;
  },
  bonus?:any;
}

export const LEVELS:ILevels =[
  LEVEL_0,
  LEVEL_1
]
