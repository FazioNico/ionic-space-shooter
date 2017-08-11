# Ionic Space Shooter
<blockquote>80's arcade game build with Ionic Framework</blockquote>

## Overview
***This personal project is currently under development***

Testing build Gaming Hybrid Application using HTML5 Canvas API + Ionic Framework with ngrx @store/effects to manage game state and Electron Framework to provide full multi platform application (iOS/Android platform + Web Browser platform + Desktop platform).

=> [try browser demo](https://ionic-space-shooter.firebaseapp.com/#/home)

## Prerequisites
- NVM - [Download](https://github.com/creationix/nvm) & Install Node Version Manage
- NodeJS 7 - Download & Install Node.js and the npm package manager with NVM `$ nvm install node 7`.
- [Typescript](https://www.npmjs.com/package/typescript) Latest stable version install in Global `$ npm install -g typescript`
- [Ionic 3](https://ionicframework.com/) & [Cordova](https://cordova.apache.org/) - Latest stable version install in Global `$ npm install -g ionic cordova`
- [Electron](https://electron.atom.io/) Latest stable version install in Global `$ npm install electron -g`
- Good knowledge of [AngularFire2](https://github.com/angular/angularfire2)
- Good knowledge of [Reactive Programming](http://reactivex.io/) with [ngRx](https://github.com/ngrx) and [ngRx/store](https://github.com/ngrx/store) + [ngRx/effects](https://github.com/ngrx/effects)
- [Redux DevTools Extension](http://extension.remotedev.io/) - Install Plugin for Chrome - Debugging application's state changes & provides power-ups for your Redux development workflow.
- And you should also have git installed to a better working flow.


## Quick start
- run nvm & node with `$ nvm use 7` & `$ npm install`
- add your own FB_CONFIG in a simple file to initialize your Firebase config into `./src/store/app-state.module.ts`
- run app with `$ ionic serve`
- add platform with `$ ionic cordova platform add ios||browser`
- build platform with `$ ionic cordova build ios||browser`
- deploy browser platform with Firebase Hosting by runing `$ firebase deploy`
- build desktop version with `$ npm run electron:build`

## Have todo
- [ ] add all action into static proprety: [src/store/actions/mainActions.ts](src/store/actions/mainActions.ts)
- [x] check if user is log.. and propose signin if not: [src/pages/play/play.ts](src/pages/play/play.ts)
- [x] display confirmation score save: [src/pages/play/play.ts](src/pages/play/play.ts)
- [ ] save player setting, level & score: [src/pages/play/play.ts](src/pages/play/play.ts)
- [ ] remove static img load and use Store datas
- [ ] refactoring manageCollision.ts as an Angular Component
- [ ] refactoring detectCollision.ts as an Angular Component
- [ ] refactoring quadtree.ts as an Angular Component
- [ ] create/add app icon, splashscreen
- [x] add electron.js
- [ ] add auto-updating with [electron-builder](https://www.npmjs.com/package/electron-builder)

## Have tofix
- [ ] Fix bug with serviceWorker update. (PWA).. 
- [ ] Fix bug with IOS. audio not playing.. : [src/pages/play/play.ts](src/pages/play/play.ts)
- [ ] `$ ionic cordova build browser --prod` currently not working

## About author
Hi, i'm a Front-end developper living in Geneva Switzerland and i build hybrid mobile & web applications for almost 15 years. You can follow me on Twitter @FazioNico or checkout my own website http://nicolasfazio.ch
