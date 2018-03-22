import {
	Component,
	Input,
	OnChanges,
	OnInit,
	SimpleChanges,
	ViewChild
} from "@angular/core";
import { } from "@types/googlemaps";
import { UserData } from "data/model";

@Component({
	selector: "insta-map",
	templateUrl: "map.component.html"
})

export class MapComponent implements OnInit, OnChanges {
	@ViewChild("gmap") gmapElement: any;
	@Input() user!: UserData;
	map!: google.maps.Map;
	marker!: google.maps.Marker;

	ngOnInit() {
		const props = {
			zoom: 15
		};
		this.map = new google.maps.Map(this.gmapElement.nativeElement, props);
		this.findUser();
	}

	ngOnChanges(changes: SimpleChanges) {
		console.log("something changed", changes);
		// if (!changes.user || !this.marker) { return; }
		// this.marker.setIcon(this.updateIcon());
	}

	setMarker(location: google.maps.LatLng) {
		if (!this.marker) {
			this.marker = new google.maps.Marker({
				position: location,
				map: this.map,
				icon: this.getIcon(),
				optimized: false
			});
		} else {
			this.marker.setPosition(location);
		}

		const myoverlay = new google.maps.OverlayView();
		myoverlay.draw = () => {
			myoverlay.getPanes().markerLayer.id = "userPositionMarker";
		};
		myoverlay.setMap(this.map);

	}

	getIcon(): google.maps.Icon {
		const markerSize = 40;
		const size = new google.maps.Size(markerSize, markerSize);
		const anchor = new google.maps.Point(markerSize / 2, markerSize / 2);
		return {
			url: this.user.imageUrl,
			size,
			scaledSize: size,
			anchor
		};
	}

	findUser() {
		if (navigator.geolocation) {
			navigator.geolocation.watchPosition((position: Position) => {
				this.setLocation(position);
			});
		} else {
			console.error("Geolocation is not supported by this browser.");
		}
	}

	setLocation(position: Position) {
		const location = new google.maps.LatLng(position.coords.latitude, position.coords.longitude);
		this.map.panTo(location);
		this.setMarker(location);
	}

}
