import { BrowserModule } from "@angular/platform-browser";
import { NgModule } from "@angular/core";
import { FormsModule } from "@angular/forms";
import { HttpModule } from "@angular/http";
import { RouterModule, Routes } from "@angular/router";

import { AppComponent } from "./app.component";
import { appRoutes } from "./app.routes";
import { UI_COMPONENTS } from "../components";

@NgModule({
	declarations: [
		AppComponent,
		UI_COMPONENTS
	],
	imports: [
		RouterModule.forRoot(
			appRoutes,
			{ enableTracing: true } // <-- debugging purposes only
		),
		BrowserModule,
		FormsModule,
		HttpModule
	],
	providers: [],
	bootstrap: [AppComponent]
})
export class AppModule { }