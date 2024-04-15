import { Component, OnInit, Input, Output, ViewChild, EventEmitter, ElementRef } from '@angular/core';
import { ModalDirective } from 'angular-bootstrap-md';
import {MatDialog } from '@angular/material/dialog';
import { GoogleMap, MapInfoWindow, MapMarker } from '@angular/google-maps';
import { ModelService } from '@core/web-core';



@Component({
  selector: 'app-full-screen-map',
  templateUrl: './full-screen-map.component.html',
  styleUrls: ['./full-screen-map.component.css']
})
export class FullScreenMapComponent implements OnInit  {

  @Output() mapResponse = new EventEmitter();

  @Input() id: string;
  @ViewChild(MapInfoWindow) infoWindow: MapInfoWindow;
  @ViewChild(GoogleMap) public map!: GoogleMap;
  @ViewChild('fullScreenMap') public fullScreenMap: ModalDirective;

    latitude: number = 0;
    longitude: number = 0;
    zoom: number = 10;
    center: google.maps.LatLngLiteral = {lat: 0, lng: 0};
    address: string;
    private geoCoder;
    tableField:any;

  constructor(
    public dialog: MatDialog,
    private modalService: ModelService,

  ) {}

  ngOnInit(): void {
    this.geoCoder = new google.maps.Geocoder;
    this.modalService.remove(this.id);
    this.modalService.add(this);
  }
  close() {
    this.fullScreenMap.hide();
  }
  async showModal(object) {
    this.address = object.address;
    this.latitude = object.center.lat;
    this.longitude = object.center.lng;
    if(this.latitude != 0 && this.longitude != 0) {
      this.center = {
        "lat":object.lat,
        "lng": object.lng
      };
    }
    this.zoom = 10;
    this.tableField = object.tableField;
    this.fullScreenMap.show();
    this.getAddress(this.latitude, this.longitude);
  }

  // async gmapSearchPlaces(inputData?:any){
  //   if(inputData?.target?.value){
  //     if(this.searchElementRef != undefined){
  //       this.searchElementRef.nativeElement.value  = inputData?.target?.value;
  //     }
  //   }
  //   let loadGoogleMap:boolean = false;
  //   if(typeof Common.GOOGLE_MAP_IN_FORM == "string"){
  //     if(Common.GOOGLE_MAP_IN_FORM == "true"){
  //       loadGoogleMap = true;
  //     }
  //   }else{
  //     if(Common.GOOGLE_MAP_IN_FORM){
  //       loadGoogleMap = true;
  //     }
  //   }
  //   if(loadGoogleMap){
  //       this.geoCoder = new google.maps.Geocoder;
  //       if(this.longitude == 0 && this.latitude == 0){
  //         await this.setCurrentLocation();
  //       }
  //       this.center = {
  //         "lat": this.latitude,
  //         "lng": this.longitude
  //       }

  //       if(this.searchElementRef != undefined){
  //         let autocomplete = new google.maps.places.Autocomplete(
  //           this.searchElementRef.nativeElement
  //         );
  //         autocomplete.addListener('place_changed', () => {
  //           this.ngZone.run(() => {
  //             let place: google.maps.places.PlaceResult = autocomplete?.getPlace();
  //             if (place.geometry === undefined || place.geometry === null) {
  //               return;
  //             }
  //             this.searchElementRef.nativeElement.value = place.name;
  //             this.address = place.formatted_address;
  //             this.latitude = place.geometry.location.lat();
  //             this.longitude = place.geometry.location.lng();
  //             this.center = {
  //               "lat": this.latitude,
  //               "lng": this.longitude
  //             }
  //             this.zoom = 17;
  //           });
  //         });
  //       }
  //   }
  // }

  //Map Click
  async mapClick(event: google.maps.MapMouseEvent,field?:any) {
    this.zoom = 17;
    this.center = (event.latLng.toJSON());
    await this.getAddress(this.center.lat, this.center.lng);
  }
  openInfoWindow(marker: MapMarker) {
    this.infoWindow.open(marker);
  }
  private setCurrentLocation() {
    if ('geolocation' in navigator) {
      navigator.geolocation.getCurrentPosition((position) => {
        this.latitude = position.coords.latitude;
        this.longitude = position.coords.longitude;
        this.zoom = 8;
        this.getAddress(this.latitude, this.longitude);
      });
    }
  }



  


  
  async getAddress(latitude, longitude)  {
    await new Promise((resolve, reject) => { 
      this.geoCoder.geocode({ 'location': { lat: latitude, lng: longitude } }, (results, status) => {
        if (status === google.maps.GeocoderStatus.OK) {
          if (results[0]) {
            resolve (this.address = results[0].formatted_address);
          } else {
            console.log("Geocoder status error: ", status);
            reject()
            window.alert('No results found');
          }
        } else {
          window.alert('Geocoder failed due to: ' + status);
        }  
      });
    })
  }
  
  saveData() {
    let locationData = {
      "center": this.center,
      "address": this.address,
      "lat": this.latitude,
      "lng": this.longitude,
    }
    this.mapResponse.emit(locationData);
    this.close();
  }

}
