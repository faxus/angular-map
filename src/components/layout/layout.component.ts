import { AfterViewInit, Component, NgZone } from "@angular/core";
import { } from "@types/gapi.auth2";

import { UserData } from "data/model";

@Component({
	selector: "layout",
	templateUrl: "layout.component.html"
})
export class LayoutComponent implements AfterViewInit {
	user!: UserData;
	signInBtnLabel!: string;
	mockedUser: UserData = {
		imageUrl: "https://lh5.googleusercontent.com/-7B7Ng2-rOTg/AAAAAAAAAAI/AAAAAAAAAB0/HrR3UTeLhHo/s96-c/photo.jpg",
		name: "Fabio Anatra",
		isSignedIn: true
	};

	constructor(
		// private zone: NgZone
	) {
		this.signOut = this.signOut.bind(this);
		this.loginSuccess = this.loginSuccess.bind(this);
	}

	ngAfterViewInit() {
		gapi.signin2.render(
			"signInBtn",
			{
				onsuccess: this.loginSuccess,
				scope: "profile",
				theme: "dark"
			});

		////////////////
		gapi.load("auth2", () => {
			const auth2 = gapi.auth2.init({});

			auth2.isSignedIn.listen((val: boolean) => {
				console.log("isSignedIn:", val);
				// this.user.isSignedIn = val;
			});

			auth2.currentUser.listen((googleUser: gapi.auth2.GoogleUser) => {
				console.log("userChanged");
				this.userChanged(auth2, googleUser);
			});

			if (auth2.isSignedIn.get() === true) {
				auth2.signIn();
			}
		});
	}

	loginSuccess = (loggedInUser: gapi.auth2.GoogleUser) => {
		const profile = loggedInUser.getBasicProfile();
		// this.zone.run(() => {
		// 	this.user = {
		// 		...this.user,
		// 		imageUrl: profile.getImageUrl(),
		// 		name: profile.getName()
		// 	};
		// });
		this.user = {
			...this.user,
			imageUrl: profile.getImageUrl(),
			name: profile.getName(),
			isSignedIn: loggedInUser.isSignedIn()
		};

	}

	userChanged(auth2: any, googleUser: gapi.auth2.GoogleUser) {
		const isSignedIn = auth2.isSignedIn.get();
		if (isSignedIn) {
			const profile = googleUser.getBasicProfile();
			this.user = {
				...this.user,
				imageUrl: profile.getImageUrl(),
				name: profile.getName()
			};
			this.signInBtnLabel = `Hi ${this.user.name}!`;
		} else {
			this.user = {
				...this.user,
				imageUrl: "",
				name: ""
			};
			this.signInBtnLabel = "Sign In";
		}
	}

	// signIn() {
	// 	const auth2 = gapi.auth2.getAuthInstance();
	// 	auth2.signIn().then(() => {
	// 		console.log("signIn::Success");
	// 	},
	// 		(err: any) => console.error("SignIn::Failed", err)
	// 	);
	// }

	signOut() {
		const auth2 = gapi.auth2.getAuthInstance();
		auth2.signOut().then(() => {
			console.log("SignOut::Success");
		},
			(err: any) => console.error("SignOut::Failed", err)
		);
	}

}
