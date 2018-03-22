
export interface User {
	name: string;
	imageUrl: string;
	isSignedIn: boolean;
	position: google.maps.LatLng;
}

export interface Media {
	id: string;
	imageUrl: string;
	location: google.maps.LatLng;
	caption: string;
}
