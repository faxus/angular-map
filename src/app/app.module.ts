import { HttpClientModule } from "@angular/common/http";
import { NgModule } from "@angular/core";
import { FormsModule } from "@angular/forms";
import { HttpModule } from "@angular/http";
import { BrowserModule } from "@angular/platform-browser";
import { RouterModule } from "@angular/router";

import { UI_COMPONENTS } from "../components";

import { AppComponent } from "./app.component";
import { appRoutes } from "./app.routes";

@NgModule({
	declarations: [
		AppComponent,
		UI_COMPONENTS
	],
	imports: [
		RouterModule.forRoot(
			appRoutes,
			{ enableTracing: false } // <-- set to true for debugging purposes only
		),
		BrowserModule,
		FormsModule,
		HttpModule,
		HttpClientModule
	],
	providers: [],
	bootstrap: [AppComponent]
})
export class AppModule { }
