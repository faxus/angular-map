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
	mediaPins!: google.maps.Marker[];

	ngOnInit() {
		const props = {
			zoom: 10
		};
		this.map = new google.maps.Map(this.gmapElement.nativeElement, props);
		this.mediaPins = [];
	}

	ngOnChanges(changes: SimpleChanges) {
		if (!this.map || !this.user) { return; }
		if (changes.user) {
			this.setLocation();
			this.setUserMarker();
			this.setMediaPins();
		}
		if (changes.media) {
			this.setMediaPins();
		}
	}

	setMediaPins = () => {
		if (!this.media || !this.user.isSignedIn) {
			this.deleteMarkers();
			return;
		}
		this.deleteMarkers();
		this.media.map((item: Media) => {
			const marker = new google.maps.Marker({
				position: item.location,
				map: this.map,
				optimized: true
			});
			this.mediaPins.push(marker);

			const contentString = `<div class="info-window">
			<div class="img"><img src="${item.imageUrl}" /></div>
			<div class="caption">${item.caption}</div>
			</div>`;
			const infowindow = new google.maps.InfoWindow({
				content: contentString
			});
			marker.addListener("click", () => {
				infowindow.open(this.map, marker);
			});
		});
		this.showMarkers();
	}

	setMapOnAll = (map: google.maps.Map | null) => {
		this.mediaPins.forEach((item: google.maps.Marker) => {
			item.setMap(map);
		});
	}

	// Removes the markers from the map, but keeps them in the array.
	clearMarkers = () => {
		this.setMapOnAll(null);
	}

	// Shows any markers currently in the array.
	showMarkers = () => {
		this.setMapOnAll(this.map);
	}

	// Deletes all markers in the array by removing references to them.
	deleteMarkers = () => {
		this.clearMarkers();
		this.mediaPins = [];
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
				scale: 6,
				fillColor: "white",
				fillOpacity: 1,
				strokeColor: "#326bc7"
			};
		}
		return {
			url: this.user.imageUrl,
			size,
			scaledSize: size,
			anchor
		};
	}

	setUserMarker = () => {
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
