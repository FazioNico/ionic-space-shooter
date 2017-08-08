import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { TopScoresPage } from './top-scores';

@NgModule({
  declarations: [
    TopScoresPage,
  ],
  imports: [
    IonicPageModule.forChild(TopScoresPage),
  ],
})
export class TopScoresPageModule {}
