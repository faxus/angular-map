import { Component, OnInit, ViewChild } from "@angular/core";
import { } from "@types/googlemaps";

@Component({
	selector: "map",
	templateUrl: "map.component.html"
})

export class MapComponent implements OnInit {
	@ViewChild("gmap") gmapElement: any;
	position: Position | undefined;
	map: google.maps.Map | undefined;
	marker: google.maps.Marker | undefined;

	ngOnInit() {
		const props = {
			zoom: 15
		};
		this.map = new google.maps.Map(this.gmapElement.nativeElement, props);
		this.findUser();
	}

	findUser() {
		if (navigator.geolocation) {
			navigator.geolocation.watchPosition((position: Position) => {
				this.showPosition(position);
			});
		} else {
			console.error("Geolocation is not supported by this browser.");
		}
	}

	showPosition(position: Position) {
		const location = new google.maps.LatLng(position.coords.latitude, position.coords.longitude);
		if (!this.map) { return; }
		this.map.panTo(location);
		this.setMarker(location);
	}

	setMarker(location: google.maps.LatLng) {
		const icon = {
			url: "https://developers.google.com/maps/documentation/javascript/examples/full/images/beachflag.png",
			size: new google.maps.Size(40, 40),
			// The anchor for this image is the base of the flagpole at (0, 32).
			anchor: new google.maps.Point(20, 20)
		};
		// Shapes define the clickable region of the icon.
		const shape = {
			coords: [20, 20, 20],
			type: "circle"
		};
		if (!this.marker) {
			this.marker = new google.maps.Marker({
				position: location,
				map: this.map,
				icon,
				shape,
				title: "Me!",
				animation: google.maps.Animation.DROP
			});
		} else {
			this.marker.setPosition(location);
		}
	}
}
