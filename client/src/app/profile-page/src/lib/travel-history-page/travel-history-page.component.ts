import {Component, inject, OnInit} from '@angular/core';
import {TripFilter, TripService} from "@client/shared-services";
import {Trip} from "@client/shared-models";
import {PageEvent} from "@angular/material/paginator";
import * as Leaflet from 'leaflet';
import {take, tap} from "rxjs";
import {MapImage} from "../models/map-image.model";
import {LatLng, Point} from "leaflet";

interface State {
  loading: boolean;
  hasTrips: boolean;
}

@Component({
  selector: 'app-travel-history-page',
  templateUrl: './travel-history-page.component.html',
  styleUrls: ['./travel-history-page.component.scss']
})
export class TravelHistoryPageComponent implements OnInit {
  state: State;
  private _tripService: TripService = inject(TripService);

  private _trips: Trip[] = []
  private _isAscending: boolean = true;
  private _currentPage = 0;
  private _pageSize = 5;

  map!: Leaflet.Map;
  markers: Leaflet.Marker[] = [];
  options = {
    layers: [
      Leaflet.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
      })
    ],
    zoom: 8,
    center: { lat: 52.132633, lng: 5.291266 }
  }
  images: MapImage[] = [];

  constructor() {
    this.state = this.initialState();
  }

  ngOnInit(): void {
    this.state.loading = true;
    const filter = <TripFilter>{ onGoing: false };
    this._tripService.getTrips(filter).subscribe(trips =>{
        if(trips.length == 0){
          this.state.hasTrips = false;
          return;
        }else {
          this._trips = trips
            .filter(trip => trip.tripEndDate !== undefined)
            .sort((a, b) => new Date(a.tripEndDate!).getTime() - new Date(b.tripEndDate!).getTime());
        }
      this.state.loading = false;
    });
  }

  onTripOpened(trip: Trip) {
    this._tripService.getImages(trip.tripId!)
      .pipe(
        tap(() => {
          this.images = [];
          this.clearMarkers();
        }),
        take(1),
        tap((images: MapImage[]) => {
          this.images = images;
          this.setMapImageMarkers(images)
        })
      ).subscribe();
  }

  onTripClosed() {
    this.images = [];
    this.clearMarkers();
  }

  private setMapImageMarkers(tripImages: MapImage[]) {
    for (let index = 0; index < tripImages.length; index++) {
      const image = tripImages[index];
      const marker = this.generateMarker(image, index);
      marker.addTo(this.map).bindPopup(`<b>${image.ltd},  ${image.lng}</b>`);
      this.map.panTo(<LatLng>{lat: image.ltd, lng: image.lng});
      this.markers.push(marker)
    }
  }

  private generateMarker(image: MapImage, index: number) {
    return Leaflet.marker(<LatLng>{ lat: image.ltd, lng: image.lng }, {
      riseOnHover: true,
      icon: Leaflet.icon({
        iconSize: new Point(40, 40, true),
        iconUrl: "data:image/jpeg;base64," + image.image,
      })
    }).on('click', (event) => this.markerClicked(event, index));
  }

  private clearMarkers() {
    this.markers.forEach(marker => {
      marker.remove();
    });
    this.markers = [];
  }

  onMapReady($event: Leaflet.Map) {
    this.map = $event;

    setInterval(() => {
      this.map.invalidateSize();
    }, 100);

    this.map.fitBounds(this.map.getBounds(), {
      maxZoom: 7,
    });
  }

  markerClicked($event: any, index: number) {
    console.log($event, index)
  }

  sortTripsByDate() {
    this._trips = this._trips.reverse();
    this._isAscending = !this._isAscending;
  }
  pageChanged(event: PageEvent) {
    this._currentPage = event.pageIndex;
    this._pageSize = event.pageSize;
  }

  private initialState(): State {
    return {
      loading: false,
      hasTrips: true
    };
  }

  get isAscending(): boolean {
    return this._isAscending;
  }

  get currentPage(): number {
    return this._currentPage;
  }

  get pageSize(): number {
    return this._pageSize;
  }

  get trips(): Trip[] {
    return this._trips;
  }
}
