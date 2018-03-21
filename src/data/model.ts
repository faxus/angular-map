
export interface UserData {
	name: string;
	imageUrl: string;
	photoUrls?: string[];
	location?: google.maps.LatLng;
	isSignedIn: boolean;
}
