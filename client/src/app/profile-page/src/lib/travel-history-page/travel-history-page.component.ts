import {Component, inject, OnInit} from '@angular/core';
import {TripFilter, TripService} from "@client/shared-services";
import {Trip} from "@client/shared-models";
import {PageEvent} from "@angular/material/paginator";
import {control, Icon, icon, latLng, marker, point, polyline, tileLayer} from "leaflet";
import layers = control.layers;
import * as Leaflet from 'leaflet';

interface State {
  loading: boolean;
  hasTrips: boolean;
}

@Component({
  selector: 'app-travel-history-page',
  templateUrl: './travel-history-page.component.html',
  styleUrls: ['./travel-history-page.component.scss']
})
export class TravelHistoryPageComponent implements OnInit{
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

  initMarkers() {
    const initialMarkers = [
      {
        position: { lat: 52.2959, lng: 4.6677 },
      }, 
      {
        position: { lat: 53.16416420, lng: 5.78175420 },
      }, 
    ];

    for (let index = 0; index < initialMarkers.length; index++) {
      const data = initialMarkers[index];
      const marker = this.generateMarker(data, index);
      marker.addTo(this.map).bindPopup(`<b>${data.position.lat},  ${data.position.lng}</b>`);
      this.map.panTo(data.position);
      this.markers.push(marker)
    }
  }

  generateMarker(data: any, index: number) {
    return Leaflet.marker(data.position, {
      title: `Marker #${index}`,
      riseOnHover: true,
      icon: Leaflet.icon({
        iconSize: [ 25, 41 ],
        iconAnchor: [ 13, 41 ],
        iconUrl: 'https://firebasestorage.googleapis.com/v0/b/train-game-6fc9f.appspot.com/o/trip-011a2537-9454-4052-af06-cc06c4a5f4e7_station-8400685_user-4iZfcX9f1lhg2QdALcL8rr0g6802.png?alt=media&token=947fd4b8-ce6f-4331-8fd3-0d8f299f62e5&_gl=1*3yxcji*_ga*OTM2NjIyODgwLjE2ODQyMjQ3ODE.*_ga_CW55HF8NVT*MTY4NjY2NTk0NS41My4xLjE2ODY2Njc2NzguMC4wLjA.'
      })
    })
    .on('click', (event) => this.markerClicked(event, index));
  }

  onMapReady($event: Leaflet.Map) {
    this.map = $event;

    setInterval(() => {
      this.map.invalidateSize();
    }, 100);
    
    this.map.fitBounds(this.map.getBounds(), {
      maxZoom: 7,
    });

    this.initMarkers();
  }

  mapClicked($event: any) {
    console.log($event.latlng.lat, $event.latlng.lng);
  }

  markerClicked($event: any, index: number) {
    console.log($event.latlng.lat, $event.latlng.lng);
  }

  // // Define our base layers so we can reference them multiple times
  // streetMaps = tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
  //   detectRetina: true,
  //   attribution: '&amp;copy; &lt;a href="https://www.openstreetmap.org/copyright"&gt;OpenStreetMap&lt;/a&gt; contributors'
  // });
  // wMaps = tileLayer('http://maps.wikimedia.org/osm-intl/{z}/{x}/{y}.png', {
  //   detectRetina: true,
  //   attribution: '&amp;copy; &lt;a href="https://www.openstreetmap.org/copyright"&gt;OpenStreetMap&lt;/a&gt; contributors'
  // });
  //
  // // Marker for the top of Mt. Ranier
  // summit = marker([ 46.8523, -121.7603 ], {
  //   icon: icon({
  //     iconSize: [ 25, 41 ],
  //     iconAnchor: [ 13, 41 ],
  //     iconUrl: 'leaflet/marker-icon.png',
  //     shadowUrl: 'leaflet/marker-shadow.png'
  //   })
  // });
  //
  // // Marker for the parking lot at the base of Mt. Ranier trails
  // paradise = marker([ 46.78465227596462,-121.74141269177198 ], {
  //   icon: icon({
  //     iconSize: [ 25, 41 ],
  //     iconAnchor: [ 13, 41 ],
  //     iconUrl: 'leaflet/marker-icon.png',
  //     iconRetinaUrl: 'leaflet/marker-icon-2x.png',
  //     shadowUrl: 'leaflet/marker-shadow.png'
  //   })
  // });
  //
  // // Path from paradise to summit - most points omitted from this example for brevity
  // route = polyline([[ 46.78465227596462,-121.74141269177198 ],
  //   [ 46.80047278292477, -121.73470708541572 ],
  //   [ 46.815471360459924, -121.72521826811135 ],
  //   [ 46.8360239546746, -121.7323131300509 ],
  //   [ 46.844306448474526, -121.73327445052564 ],
  //   [ 46.84979408048093, -121.74325201660395 ],
  //   [ 46.853193528950214, -121.74823296256363 ],
  //   [ 46.85322881676257, -121.74843915738165 ],
  //   [ 46.85119913890958, -121.7519719619304 ],
  //   [ 46.85103829018772, -121.7542376741767 ],
  //   [ 46.85101557523012, -121.75431755371392 ],
  //   [ 46.85140013694763, -121.75727385096252 ],
  //   [ 46.8525277543813, -121.75995212048292 ],
  //   [ 46.85290292836726, -121.76049157977104 ],
  //   [ 46.8528160918504, -121.76042997278273 ]]);
  //
  // // Layers control object with our two base layers and the three overlay layers
  // layersControl = {
  //   baseLayers: {
  //     'Street Maps': this.streetMaps,
  //     'Wikimedia Maps': this.wMaps
  //   },
  //   overlays: {
  //     'Mt. Rainier Summit': this.summit,
  //     'Mt. Rainier Paradise Start': this.paradise,
  //     'Mt. Rainier Climb Route': this.route
  //   }
  // };

  // Set the initial set of displayed layers (we could also use the leafletLayers input binding for this)
  // options = {
  //   // layers: [ this.streetMaps, this.route, this.summit, this.paradise ],
  //   zoom: 7,
  //   center: latLng([ 46.879966, -121.726909 ])
  // };
}
