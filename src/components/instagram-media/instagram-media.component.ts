import {
	Component,
	EventEmitter,
	Input,
	OnChanges,
	OnInit,
	Output,
	SimpleChanges
} from "@angular/core";
import { ActivatedRoute } from "@angular/router";
import { Subscription } from "rxjs/Subscription";

import { Media } from "data/model";
import { InstagramService } from "providers";

@Component({
	selector: "instagram-media",
	templateUrl: "instagram-media.component.html"
})

export class InstagramMediaComponent implements OnInit, OnChanges {
	@Output() mediaUpdate: EventEmitter<Media[]> = new EventEmitter<Media[]>();
	@Input() isSignedIn!: boolean;
	@Input() position!: google.maps.LatLng;
	instaToken: string | undefined;
	media$$!: Subscription;
	instagramLoginUrl = `https://api.instagram.com/oauth/authorize/?client_id=b6dfd87498b14a4bbd1648c094ce3b1b
								&scope=public_content&redirect_uri=http://localhost:8080&response_type=token`;

	constructor(
		private instaService: InstagramService,
		private route: ActivatedRoute
	) {
	}

	ngOnInit() {
		this.route.fragment.subscribe((fragment: string) => {
			if (!fragment || !fragment.includes("access_token")) {
				this.instaToken = undefined;
			} else {
				this.instaToken = fragment.split("=")[1];
			}
		});
	}

	ngOnChanges(changes: SimpleChanges) {
		if (changes.isSignedIn && changes.isSignedIn.firstChange) { return; }
		if (this.isSignedIn) {
			this.getMedia();
		} else {
			window.location.hash = "";
		}
	}

	getMedia = () => {
		if (!this.instaToken) { return; }
		const lat = this.position.lat();
		const lng = this.position.lng();
		const mediaUrl = `https://api.instagram.com/v1/media/search?lat=${lat}&lng=${lng}&distance=5000&access_token=${this.instaToken}`;
		this.media$$ = this.instaService.getPhotos(mediaUrl)
			.subscribe(
				(media) => {
					this.mediaUpdate.emit(media);
				},
				(error) => {
					console.error(error);
				}
			);
	}

	ngOnDestroy() {
		this.media$$.unsubscribe();
	}

}
