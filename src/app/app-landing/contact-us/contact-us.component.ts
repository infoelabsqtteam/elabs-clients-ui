import { Component, HostListener, Input, OnInit, ViewChild } from '@angular/core';
import { UntypedFormGroup, UntypedFormControl, Validators} from '@angular/forms';
import { GoogleMap, MapInfoWindow, MapMarker } from "@angular/google-maps";
import { Router } from '@angular/router';
import { PublicApiService } from '@core/web-core';

@Component({
  selector: 'app-contact-us',
  templateUrl: './contact-us.component.html',
  styleUrls: ['./contact-us.component.css','../../../assets/css/app-landing.css']
})
export class ContactUsComponent implements OnInit {

  contactForm: UntypedFormGroup;
  @Input() public pageName;
  @ViewChild(GoogleMap, { static: false }) map: GoogleMap;
  @ViewChild(MapInfoWindow, { static: false }) info: MapInfoWindow;

  zoom = 18;
  center: google.maps.LatLngLiteral;
  options: google.maps.MapOptions = {
    zoomControl: true,
    scrollwheel: false,
    disableDoubleClickZoom: true,
    mapTypeId: "roadmap"
  };
  markers = [];
  infoContent = "";

  constructor(
    private router: Router,
    private publiApiService:PublicApiService
    
    ) { 
    this.initForm()
  }

  ngOnInit() {
    navigator.geolocation.getCurrentPosition(x => {
      this.center = {
        lat: 30.673688,
        lng: 76.832914
      };
      this.markers.push({
        position: {
          lat: x.coords.latitude,
          lng: x.coords.longitude
        },
        label: {
          color: "blue",
          text: "Marker Label"
        },
        title: "Marker Title",
        info: "Marker info",
        options: {
          animation: google.maps.Animation.BOUNCE
        }
      });
    });
  }

  openInfo(marker: MapMarker, info) {
    this.infoContent = info;
     this.info.open(marker);
  }

  initForm(){

    this.contactForm = new UntypedFormGroup({
      'name': new UntypedFormControl('',Validators.required),
      'email': new UntypedFormControl('', Validators.required),
      'mobile': new UntypedFormControl('', Validators.required),
      'subject': new UntypedFormControl('',Validators.required),
      'remarks': new UntypedFormControl('', Validators.required)
    })
  }

  onSubmit(){
    var x = this.contactForm.value;
    this.publiApiService.SaveContactUs(x);
    this.contactForm.reset();
  }

  @HostListener('window:popstate', ['$event'])
  onPopState(event) {
            
    this.router.navigate(['home_page'])
  }

}
