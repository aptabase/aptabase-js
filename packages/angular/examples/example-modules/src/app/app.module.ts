import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AptabaseAnalyticsModule } from '@aptabase/angular';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';

@NgModule({
  declarations: [AppComponent],
  imports: [BrowserModule, AppRoutingModule, AptabaseAnalyticsModule.forRoot('A-EU-1280395555')],
  providers: [],
  bootstrap: [AppComponent],
})
export class AppModule {}
