import { HttpClient } from "@angular/common/http";
import { AfterViewInit, Component, NgZone, OnInit } from "@angular/core";
import { ActivatedRoute } from "@angular/router";
import { } from "@types/gapi.auth2";
import { map } from "rxjs/operators";

import { UserData } from "data/model";

@Component({
	selector: "layout",
	templateUrl: "layout.component.html"
})
export class LayoutComponent implements AfterViewInit, OnInit {
	user!: UserData;
	auth!: gapi.auth2.GoogleAuth;
	instaToken!: string;
	mockedUser: UserData = {
		imageUrl: "https://lh5.googleusercontent.com/-7B7Ng2-rOTg/AAAAAAAAAAI/AAAAAAAAAB0/HrR3UTeLhHo/s96-c/photo.jpg",
		name: "Fabio Anatra",
		isSignedIn: true,
		position: new google.maps.LatLng(41.397, 70.644),
		photoUrls: []
	};

	constructor(
		private zone: NgZone,
		private http: HttpClient,
		private route: ActivatedRoute
	) {
	}

	ngOnInit() {
		this.route.fragment.subscribe((fragment: string) => {
			if (!fragment || !fragment.includes("access_token")) { return; }
			this.instaToken = fragment.split("=")[1];
		});
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
				console.log("userChanged");
				this.zone.run(() => this.userChanged(googleUser));
			});
		});
	}

	signOut = () => {
		this.auth.signOut().then(() => {
			console.log("SignOut::Success");
		},
			(err: any) => console.error("SignOut::Failed", err)
		);
	}

	userChanged = (googleUser: gapi.auth2.GoogleUser) => {
		const isSignedIn = this.auth.isSignedIn.get();
		if (isSignedIn) {
			const profile = googleUser.getBasicProfile();
			this.user = {
				...this.user,
				imageUrl: profile.getImageUrl(),
				name: profile.getName(),
				isSignedIn
			};
			// this.getInstagram();
		} else {
			this.user = {
				...this.user,
				imageUrl: "",
				name: "",
				isSignedIn
			};
		}
		// this.findUser();
	}

	findUser() {
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

	getInstagram() {
		// const instaMedia = "https://www.instagram.com/roarroads/?__a=1";
		if (!this.instaToken) { return; }
		const lat = this.user.position.lat;
		const lng = this.user.position.lng;
		const mediaUrl = `https://api.instagram.com/v1/media/search?lat=${lat}&lng=${lng}&access_token=${this.instaToken}`;
		this.http.get(mediaUrl).pipe(
			map((res: any) => {
				console.log(res);
			})
		);
		// .subscribe((res) => console.log(res.json()));
	}
}
