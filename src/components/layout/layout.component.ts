import { AfterViewInit, Component, NgZone, OnInit } from "@angular/core";
import { ActivatedRoute } from "@angular/router";
import { } from "@types/gapi.auth2";
import { Subscription } from "rxjs/Subscription";

import { Media, User } from "data/model";
import { InstagramService } from "providers";

@Component({
	selector: "layout",
	templateUrl: "layout.component.html"
})
export class LayoutComponent implements AfterViewInit, OnInit {
	user!: User;
	auth!: gapi.auth2.GoogleAuth;
	instaToken!: string;
	mediaData!: Media[];
	media$$!: Subscription;
	instagramLoginUrl = `https://api.instagram.com/oauth/authorize/?client_id=b6dfd87498b14a4bbd1648c094ce3b1b
								&scope=public_content&redirect_uri=http://localhost:8080&response_type=token`;

	constructor(
		private zone: NgZone,
		private instaService: InstagramService,
		private route: ActivatedRoute
	) {
	}

	ngOnInit() {
		this.route.fragment.subscribe((fragment: string) => {
			if (!fragment || !fragment.includes("access_token")) { return; }
			this.instaToken = fragment.split("=")[1];
			// this.getMedia();
		});
		// Start watching user position
		this.findUser();
		// Init user object
		this.user = {
			name: "",
			imageUrl: "",
			isSignedIn: false,
			position: new google.maps.LatLng(56.945853, 23.624162)
		};
	}

	ngAfterViewInit() {
		gapi.signin2.render(
			"signInBtn",
			{
				theme: "dark"
			});

		gapi.load("auth2", () => {
			this.auth = gapi.auth2.init({});

			this.auth.currentUser.listen((googleUser: gapi.auth2.GoogleUser) => {
				this.zone.run(() => this.updateUser(googleUser));
			});
		});
	}

	ngOnDestroy() {
		this.media$$.unsubscribe();
	}

	signOut = () => {
		this.auth.signOut();
	}

	updateUser = (googleUser: gapi.auth2.GoogleUser) => {
		const isSignedIn = this.auth.isSignedIn.get();
		if (isSignedIn) {
			const profile = googleUser.getBasicProfile();
			this.user = {
				...this.user,
				imageUrl: profile.getImageUrl(),
				name: profile.getName(),
				isSignedIn
			};
			this.getMedia();
		} else {
			this.user = {
				...this.user,
				imageUrl: "",
				name: "",
				isSignedIn
			};
		}
	}

	findUser = () => {
		if (navigator.geolocation) {
			navigator.geolocation.watchPosition((position: Position) => {
				console.log("my Position:", position.coords.latitude);
				this.user = {
					...this.user,
					position: new google.maps.LatLng(position.coords.latitude, position.coords.longitude)
				};
			});
		} else {
			console.error("Geolocation is not supported by this browser.");
		}
	}

	getMedia = () => {
		// const instaMedia = "https://www.instagram.com/roarroads/?__a=1";
		if (!this.instaToken) { return; }
		// const lat = this.user.position.lat();
		// const lng = this.user.position.lng();
		// const mediaUrl = `https://api.instagram.com/v1/media/search?lat=${lat}&lng=${lng}&distance=5000&access_token=${this.instaToken}`;
		// const recentMediaUrl = `https://api.instagram.com/v1/users/self/media/recent/?count=10&access_token=${this.instaToken}`;
		const otherLocationUrl = `https://api.instagram.com/v1/media/search?lat=56.9608&lng=23.75&distance=5000&access_token=${this.instaToken}`;
		this.media$$ = this.instaService.getPhotos(otherLocationUrl)
			.subscribe(
				(media) => {
					this.mediaData = media;
				},
				(error) => {
					console.error(error);
				}
			);
	}
}
