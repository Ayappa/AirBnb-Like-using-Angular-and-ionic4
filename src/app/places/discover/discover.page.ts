import { Component, OnInit, OnDestroy } from '@angular/core';
import { PlaceService } from '../place.service';
import { Place } from '../places.model';
import { SegmentChangeEventDetail } from '@ionic/core';
import { Subscription } from 'rxjs';
import { AuthService } from 'src/app/auth/auth.service';
import { take } from 'rxjs/operators';

@Component({
  selector: 'app-discover',
  templateUrl: './discover.page.html',
  styleUrls: ['./discover.page.scss'],
})
export class DiscoverPage implements OnInit , OnDestroy {

     loadedPlaces: Place[];
     listedLoadedPlaces: Place[];
     relevantPlaces: Place[];
     private  placesSub: Subscription;
isLoading = false;
  constructor(private placesService: PlaceService , private authService: AuthService) {
   }
  ionViewWillEnter() {
    this.isLoading = true;
    this.placesService.fetchPlace().subscribe(() => {
      this.isLoading = false;
    });
  }
  ngOnInit() {
    this. placesSub =  this.placesService.places.subscribe(places => {
      this.loadedPlaces = places;
      this.relevantPlaces = this.loadedPlaces;
      this.listedLoadedPlaces = this.relevantPlaces.slice(1);

    });
  }
  onFilterUpdate(event: CustomEvent<SegmentChangeEventDetail>) {
    this.authService.userId.pipe(take(1)).subscribe( userId =>
      {
        if (event.detail.value === 'all') {
          this.relevantPlaces = this.loadedPlaces;
          this.listedLoadedPlaces = this.relevantPlaces.slice(1);
        } else {
          this.relevantPlaces = this.loadedPlaces.filter( place => place.uderId !== userId);
          this.listedLoadedPlaces = this.relevantPlaces.slice(1);
        }
      });
  }

  ngOnDestroy() {
    if (this.placesSub) {
      this.placesSub.unsubscribe();
    }
  }
}
