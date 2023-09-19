import { Component, OnInit } from '@angular/core';
import Geolocation from 'ol/Geolocation.js';

declare var ol: any;

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  title = 'suggestion';
  myMap: any;
  constructor() {

  }
  async ngOnInit() {
    this.drawMap()

  }

 async drawMap(){
    const iconFeature = new ol.Feature({
      geometry: new ol.geom.Point(ol.proj.fromLonLat([51.338076, 35.699756])),
      name: 'Somewhere near Nottingham',
    });
    const view = new ol.View({
      center: ol.proj.fromLonLat([51.338076, 35.699756]),
      zoom: 12
    })
    this.myMap = new ol.Map({
      target: 'map',
      key: 'web.9a9e99ff75fa4de580bdc5dde2dba4c4',
      maptype: 'dreamy',
      poi: true,
      traffic: false,
      layers: [
        new ol.layer.Tile({
          source: new ol.source.OSM(),
        }),

      ],
      view: view
    });

    const layer = new ol.layer.Vector({
      source: new ol.source.Vector({
        features: [iconFeature]
      }),
      style: new ol.style.Style({
        image: new ol.style.Icon({
          anchor: [0.5, 46],
          anchorXUnits: 'fraction',
          anchorYUnits: 'pixels',
          src: 'https://openlayers.org/en/latest/examples/data/icon.png'
        })
      })
    })
    this.myMap.addLayer(layer)

    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          console.log('ffff', position)
          var lat = position.coords.latitude;
          var lng = position.coords.longitude;
          // this.addMarker(lat, lng)
        },
        this.error,
        this.options
      );
    } else {
      alert("Geolocation is not supported by this browser.");
    }
    const res = await fetch('https://location.services.mozilla.com/v1/geolocate?key=test').then(el => el.json())
    const point = [res.location.lat, res.location.lng]
    this.addMarker(point)
    console.log(point)
  }

  addMarker(point:any) {
    const layer = new ol.layer.Vector({
      source: new ol.source.Vector({
        features: [new ol.Feature({
          geometry: new ol.geom.Point(ol.proj.fromLonLat([point[1],point[0]])),
          name: 'Somewhere near Nottingham',
        })]
      }),
      style: new ol.style.Style({
        image: new ol.style.Icon({
          anchor: [0.5, 46],
          anchorXUnits: 'fraction',
          anchorYUnits: 'pixels',
          src: 'https://openlayers.org/en/latest/examples/data/icon.png'
        })
      })
    })
    this.myMap.addLayer(layer)
  }

  error = (err: any) => {
    console.warn(`ERROR(${err.code}): ${err.message}`);
  };
  options = {
    enableHighAccuracy: true,
    timeout: 5000,
    maximumAge: 0,
  };
}
