import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { MapSuggestionComponent } from './map-suggestion/map-suggestion.component';

@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    MapSuggestionComponent
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
