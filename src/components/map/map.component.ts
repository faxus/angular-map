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
		if (!changes.user || !this.marker) { return; }
		this.marker.setIcon(this.updateIcon());
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

	setMarker(location: google.maps.LatLng) {
		if (!this.marker) {
			this.marker = new google.maps.Marker({
				position: location,
				map: this.map,
				optimized: false
			});
		} else {
			this.marker.setPosition(location);
		}
		if (this.user) {
			this.marker.setIcon(this.updateIcon());
		}
	}

	updateIcon(): any {
		const url = this.user.imageUrl !== "" ? this.user.imageUrl : "";
		const size = this.user.imageUrl !== "" ? new google.maps.Size(40, 40) : new google.maps.Size(20, 20);
		const anchor = this.user.imageUrl !== "" ? new google.maps.Point(20, 20) : new google.maps.Point(10, 10);
		return {
			url,
			size,
			scaledSize: size,
			anchor
		};
	}

}
