import { Component, EventEmitter, Input, Output } from "@angular/core";

import { Media, User } from "data/model";

@Component({
	selector: "topbar",
	templateUrl: "topbar.component.html"
})

export class TopBarComponent {
	@Input() user!: User;
	@Output() mediaUpdate: EventEmitter<Media[]> = new EventEmitter<Media[]>();
	@Output() signInClick = new EventEmitter();
	@Output() signOutClick = new EventEmitter();

}
