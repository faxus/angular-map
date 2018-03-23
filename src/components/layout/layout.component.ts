import { AfterViewInit, Component, NgZone, OnInit } from "@angular/core";
import { } from "@types/gapi.auth2";
import { Media, User } from "data/model";

@Component({
	selector: "layout",
	templateUrl: "layout.component.html"
})
export class LayoutComponent implements AfterViewInit, OnInit {
	user!: User;
	auth!: gapi.auth2.GoogleAuth;
	mediaData!: Media[];

	constructor(
		private zone: NgZone,
	) {
	}

	ngOnInit() {
		// Start watching user position
		this.findUser();
		// Init user object
		this.user = {
			name: "",
			imageUrl: "",
			isSignedIn: false,
			position: new google.maps.LatLng(56.9608, 23.7) // TODO: 52.3702, 4.8952
		};
	}

	ngAfterViewInit() {
		gapi.load("auth2", () => {
			this.auth = gapi.auth2.init({});

			this.auth.currentUser.listen((googleUser: gapi.auth2.GoogleUser) => {
				this.zone.run(() => this.updateUser(googleUser));
			});
		});
	}

	mediaUpdated = (media: Media[]) => {
		this.mediaData = media;
	}

	signIn = () => {
		this.auth.signIn();
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
				name: profile.getGivenName(),
				isSignedIn
			};
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
				this.user = {
					...this.user,
					position: new google.maps.LatLng(position.coords.latitude, position.coords.longitude)
				};
			});
		} else {
			console.error("Geolocation is not supported by this browser.");
		}
	}

}
