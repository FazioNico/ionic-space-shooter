/**
* @Author: Nicolas Fazio <webmaster-fazio>
* @Date:   27-07-2017
* @Email:  contact@nicolasfazio.ch
 * @Last modified by:   webmaster-fazio
 * @Last modified time: 05-08-2017
*/


import { Injectable } from '@angular/core';
import { Http, Headers, RequestOptions } from '@angular/http';
import { Observable } from 'rxjs';
import 'rxjs/add/operator/map';

import { MainActions } from "../actions/mainActions";

@Injectable()
export class HttpService {

  private apiEndPoint:string;

  constructor(
    public http: Http
  ) {
    this.apiEndPoint = './assets/'
  }


  getDatas(_params):Observable<any> {
    return Observable.create((observer) => {
      //console.log('_params->',_params.path)
      this.http.get(`${this.apiEndPoint}${_params.path}`)
      .map(response => response.json())
      .subscribe(
        datas => {
          //console.log( {[_params.element]:datas })
          observer.next({ type: MainActions.GET_DATAS_SUCCESS, payload: {item: _params.element, datas:datas } })
        },
        (error) => {
          console.log(' ERROR: ' + error);
          observer.next({ type: MainActions.GET_DATAS_FAILED, payload: error })
        });
      })
    }

  }
