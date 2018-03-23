import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable } from "rxjs/Observable";
import { catchError, map } from "rxjs/operators";

import { Media } from "data/model";

@Injectable()
export class InstagramService {
	constructor(
		private http: HttpClient
	) {

	}

	getPhotos(url: string): Observable<any> {
		return this.http.get(url).pipe(
			map(this.extractData),
			catchError(this.handleError)
		);
	}

	private extractData(res: any): Media[] {
		if (!res) { return []; }
		// take only 10 most recent media
		const sorted = res.data
			.sort((a: any, b: any) => b.created_time - a.created_time)
			.slice(0, 10);
		return sorted.map((row: any) => {
			return {
				id: row.id,
				imageUrl: row.images.low_resolution.url,
				location: new google.maps.LatLng(row.location.latitude, row.location.longitude),
				caption: row.caption.text
			};
		});
	}

	private handleError(error: Response | any) {
		let errMsg: string;
		if (error instanceof Response) {
			const err = error || "";
			errMsg = `${error.status} - ${error.statusText || ""} ${err}`;
		} else {
			errMsg = error.message ? error.message : error.toString();
		}
		console.error(errMsg);
		return Observable.throw(errMsg);
	}
}
