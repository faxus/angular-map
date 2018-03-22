import {
	Component,
	Input,
	OnChanges,
	OnInit,
	SimpleChanges,
	ViewChild
} from "@angular/core";
import { } from "@types/googlemaps";
import { Media, User } from "data/model";

@Component({
	selector: "insta-map",
	templateUrl: "map.component.html"
})

export class MapComponent implements OnInit, OnChanges {
	@ViewChild("gmap") gmapElement: any;
	@Input() user!: User;
	@Input() media!: Media;
	map!: google.maps.Map;
	marker!: google.maps.Marker;

	ngOnInit() {
		const props = {
			zoom: 10
		};
		this.map = new google.maps.Map(this.gmapElement.nativeElement, props);
		// this.findUser();
	}

	ngOnChanges(changes: SimpleChanges) {
		if (changes.user) {
			console.log("user updated");
			this.setLocation();
			// set user marker
			this.setMarker();
		}
		if (changes.media) {
			// set media pins
			console.log("media updated");
		}
	}

	// findUser() {
	// 	if (navigator.geolocation) {
	// 		navigator.geolocation.watchPosition((position: Position) => {
	// 			this.setLocation(position);
	// 		});
	// 	} else {
	// 		console.error("Geolocation is not supported by this browser.");
	// 	}
	// }

	setLocation() {
		// const location = new google.maps.LatLng(position.coords.latitude, position.coords.longitude);
		if (!this.map || !this.user || !this.user.position) { return; }
		this.map.panTo(this.user.position);
		this.setMarker();
	}

	getIcon(): google.maps.Icon | google.maps.Symbol {
		const markerSize = 40;
		const size = new google.maps.Size(markerSize, markerSize);
		const anchor = new google.maps.Point(markerSize / 2, markerSize / 2);
		if (!this.user || !this.user.isSignedIn) {
			return {
				path: google.maps.SymbolPath.CIRCLE,
				scale: 10,
				fillColor: "blue"
			};
		}
		return {
			url: this.user.imageUrl,
			size,
			scaledSize: size,
			anchor
		};
	}

	setMarker() {
		// if (!this.user ) { return; }
		if (!this.marker) {
			this.marker = new google.maps.Marker({
				position: this.user.position,
				map: this.map,
				icon: this.getIcon(),
				optimized: false
			});
		} else {
			this.marker.setPosition(this.user.position);
		}

		const myoverlay = new google.maps.OverlayView();
		myoverlay.draw = () => {
			myoverlay.getPanes().markerLayer.id = "userPositionMarker";
		};
		myoverlay.setMap(this.map);

	}

}
