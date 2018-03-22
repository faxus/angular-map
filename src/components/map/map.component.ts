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
	@Input() media!: Media[];
	map!: google.maps.Map;
	marker!: google.maps.Marker;

	ngOnInit() {
		const props = {
			zoom: 11.5
		};
		this.map = new google.maps.Map(this.gmapElement.nativeElement, props);
	}

	ngOnChanges(changes: SimpleChanges) {
		if (!this.map || !this.user) { return; }
		if (changes.user) {
			console.log("user updated", changes.user.currentValue);
			// update location
			this.setLocation();
			this.setMarker();
		}
		if (changes.media) {
			// set media pins
			console.log("media updated", changes.media.currentValue);
			this.setMediaPins();
		}
	}

	setMediaPins = () => {
		this.media.map((item: Media) => {
			const marker = new google.maps.Marker({
				position: item.location,
				map: this.map,
				// icon: this.getIcon(),
				optimized: false
			});
			// Create the image popup to show on click
			// const infowindow = new google.maps.InfoWindow({
			// 	content: "Hello World!"
			// });
			// infowindow.open(map, marker);

			// Add click event listener
		});
	}

	setLocation = () => {
		this.map.panTo(this.user.position);
	}

	getIcon = (): google.maps.Icon | google.maps.Symbol => {
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

	setMarker = () => {
		if (!this.marker) {
			this.marker = new google.maps.Marker({
				position: this.user.position,
				map: this.map,
				icon: this.getIcon(),
				optimized: false
			});
		} else {
			this.marker.setPosition(this.user.position);
			this.marker.setIcon(this.getIcon());
		}

		const myoverlay = new google.maps.OverlayView();
		myoverlay.draw = () => {
			myoverlay.getPanes().markerLayer.id = "userPositionMarker";
		};
		myoverlay.setMap(this.map);
	}
}
