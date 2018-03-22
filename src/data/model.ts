
export interface UserData {
	name: string;
	imageUrl: string;
	isSignedIn: boolean;
	position: google.maps.LatLng;
	photoUrls?: string[];
}
