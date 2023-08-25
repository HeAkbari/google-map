import { AfterViewInit, Component, ViewChild } from "@angular/core";
import {
  GoogleMapsModule,
  MapDirectionsService,
  MapInfoWindow,
  MapMarker,
} from "@angular/google-maps";
import { Observable, map, of } from "rxjs";
import { CommonModule } from "@angular/common";
import { FormsModule } from "@angular/forms";

export type Markers = {
  latLng: google.maps.LatLngLiteral;
  title?: string;
  desciption?: string;
};
@Component({
  selector: "app-map-suggestion",
  templateUrl: "./map-suggestion.component.html",
  styleUrls: ["./map-suggestion.component.scss"],
  standalone: true,
  imports: [CommonModule, FormsModule, GoogleMapsModule],
})
export class MapSuggestionComponent implements AfterViewInit {
  @ViewChild(MapInfoWindow) infoWindow?: MapInfoWindow;
  testLocation = { lat: 35.760118732342, lng: 51.416293170735955 };

  markers: Markers[] = [
    {
      latLng: { lat: 35.76102654845088, lng: 51.41655206680298 },
      title: "daman afshar pool",
      desciption: `
      Tehran Province, Tehran
      Vardavard
      Tehran-Karaj Hwy
      Iran
      `,
    }, //
    {
      latLng: { lat: 35.76059559841722, lng: 51.41919136047363 },
      title: "sepidar park",
      desciption: `
      Tehran Province, Tehran
      Vardavard
      Tehran-Karaj Hwy
      Iran
      `,
    }, //
    {
      latLng: { lat: 35.7606957183302, lng: 51.41685247421265 },
      title: "sport complex",
      desciption: `
      Tehran Province, Tehran
      Vardavard
      Tehran-Karaj Hwy
      Iran
      `,
    }, //
    {
      latLng: { lat: 35.75974239752548, lng: 51.414148807525635 },
      title: "park khashayar",
      desciption: `
      Tehran Province, Tehran
      Vardavard
      Tehran-Karaj Hwy
      Iran
      `,
    }, //

    {
      latLng: { lat: 35.73717713779664, lng: 51.13657236099243 },
      title: "vardavard park",
      desciption: `
      Tehran Province, Tehran
      Vardavard
      Tehran-Karaj Hwy
      Iran
      `,
    }, //
    {
      latLng: { lat: 35.737455814007916, lng: 51.139984130859375 },
      title: "gym varavard park",
      desciption: `
      Tehran Province, Tehran
      Vardavard
      Tehran-Karaj Hwy
      Iran
      `,
    }, //
    {
      latLng: { lat: 35.73483797205986, lng: 51.131157639086936 },
      title: "shoahadaye varavard park",
      desciption: `
      Tehran Province, Tehran
      Vardavard
      Tehran-Karaj Hwy
      Iran
      `,
    }, //
  ];
  center: google.maps.LatLngLiteral = {
    lat: 35.72468624989195,
    lng: 51.325537306166865,
  };
  zoom = 14;
  display?: google.maps.LatLngLiteral;

  circleCenter: google.maps.LatLngLiteral = {
    lat: 35.72468624989195,
    lng: 51.325537306166865,
  };
  radius = 1500;
  moveMap(event: google.maps.MapMouseEvent) {
    // console.log("event", event.latLng!.toJSON());
    // this.center = event.latLng!.toJSON();
  }
  mapClick(event: google.maps.MapMouseEvent) {
    console.log(event.latLng!.toJSON())
    this.filterSuggestionMark(event.latLng!.toJSON());
  }

  move(event: google.maps.MapMouseEvent) {
    // console.log("event", event.latLng!.toJSON());
    this.display = event.latLng!.toJSON();
  }

  directionsResults$: Observable<google.maps.DirectionsResult | undefined> =
    of(undefined);

  constructor(private mapDirectionsService: MapDirectionsService) {}
  ngAfterViewInit(): void {
    this.getLocation();
  //   const myOptions = {
  //     zoom: 14,
  //     center: this.center,
  //     mapTypeId: google.maps.MapTypeId.ROADMAP,
  //   };
  //  const map = new google.maps.Map(document.getElementById("map")!, myOptions);
  //   google.maps.event.addListener(map, "zoom_changed", () => {
  //     this.zoom = map.getZoom()!;
  //   });
  }

  suggestedMarks: Markers[] = [];
  getSuggestion() {
    this.destination=undefined
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          var lat = position.coords.latitude;
          var lng = position.coords.longitude;
          this.filterSuggestionMark({ lat, lng });
        },
        this.error,
        this.options
      );
    } else {
      alert("Geolocation is not supported by this browser.");
    }
  }
  destination?: google.maps.LatLngLiteral = undefined;
  openInfoWindow(marker: MapMarker) {
    // const mapMarker=new MapMarker()
    const position = marker.getPosition();
    if (!position) return;
    const lat = position?.lat();
    this.destination = position.toJSON();

    this.vertices = [this.currentLocation!, this.destination];
    this.getDirection();
    const data = this.suggestedMarks.find((t) => t.latLng.lat == lat);
    this.infoWindow!.options = {
      ariaLabel: data?.title,
      content: `<div>
      <h4>${data?.title}</h4>
      <p>${data?.desciption}</p>
      </div>`,
    };
    this.infoWindow?.open(marker);
  }
  filterSuggestionMark(position?: google.maps.LatLngLiteral) {
    if (!position) return;
    const mayLat = +(position.lat * 100000000).toFixed();
    const mayLng = +(position.lng * 100000000).toFixed();
    const filter = this.markers.filter(
      (t) => Math.abs(mayLat - +(t.latLng.lat * 100000000).toFixed()) <= 400000
      //||  mayLng - +(t.latLng.lng * 100000000).toFixed() <= 400000
    );
    console.log(filter);
    this.destination=undefined
    this.suggestedMarks = filter;
    this.center = this.currentLocation = position;
    this.zoom = 14;
  }
  onZoomChanged(event: any) {
    //console.log(event);
     this.zoom = event.getZoom();
  }
  getDirection(position?: google.maps.LatLng | null) {
    if (this.destination) {
      const request: google.maps.DirectionsRequest = {
        origin: this.currentLocation!,
        destination: this.destination,
        travelMode: google.maps.TravelMode.DRIVING,
        provideRouteAlternatives: true,
        
      };
      this.directionsResults$ = this.mapDirectionsService
        .route(request)
        .pipe(map((response) => response.result));
    } else {
      alert("Geolocation is not supported by this browser.");
    }
  }

  getLocation() {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        this.showPosition,
        this.error,
        this.options
      );
      // navigator.geolocation.getCurrentPosition((res)=>{
      //   console.log('location',res)
      // });
    } else {
      alert("Geolocation is not supported by this browser.");
    }
  }

  success = (pos: any) => {
    const crd = pos.coords;

    console.log("Your current position is:");
    console.log(`Latitude : ${crd.latitude}`);
    console.log(`Longitude: ${crd.longitude}`);
    console.log(`More or less ${crd.accuracy} meters.`);
  };

  error = (err: any) => {
    console.warn(`ERROR(${err.code}): ${err.message}`);
  };
  options = {
    enableHighAccuracy: true,
    timeout: 5000,
    maximumAge: 0,
  };
  currentLocation?: google.maps.LatLngLiteral;
  markerOptions: google.maps.MarkerOptions = { draggable: false };
  showPosition = (position: any) => {
    console.log(position);
    var lat = position.coords.latitude;
    var lng = position.coords.longitude;
    this.center = { lat, lng };
    const interval = setInterval(() => {
      if (this.zoom < 14) this.zoom++;
      else clearInterval(interval);
    }, 100);

    this.currentLocation = this.center;
    // map.setCenter(new google.maps.LatLng(lat, lng));
  };

  bounds: google.maps.LatLngBoundsLiteral = {
    east: 35,
    north: 51,
    south: -35,
    west: -51,
  };
  vertices: google.maps.LatLngLiteral[] = [];
}
