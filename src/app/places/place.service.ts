import { Injectable } from '@angular/core';
import { Place } from './places.model';
import { AuthService } from '../auth/auth.service';
import { BehaviorSubject, concat, of } from 'rxjs';
import { take , map, tap, delay, switchMap} from 'rxjs/operators';
import { HttpClient } from '@angular/common/http';
import { FormGroup, FormControl } from '@angular/forms';;

interface PlaceData {
availableFrom: string ;
availableTo: string ;
description: string ;
imageurl: string ;
price: number ;
title: string ;
uderId: string;
}
@Injectable({
  providedIn: 'root'
})

export class PlaceService {
  generatedId: string;
  form: FormGroup;
 get places() {
   return this._places.asObservable();
 }
  constructor(private authService: AuthService ,private http: HttpClient) { }
// tslint:disable-next-line: variable-name
 private _places = new BehaviorSubject<Place[]>([
// // tslint:disable-next-line: max-line-length
//    new Place('p1', 'New York', 'Best Place' , 'https://lonelyplanetimages.imgix.net/mastheads/GettyImages-538096543_medium.jpg?sharp=10&vib=20&w=1200', 400, new Date('2019-01-01'), new Date('2019-12-01'), 'abc'),
// // tslint:disable-next-line: max-line-length
//    new Place('p2', 'Washington DC', 'work Place' , 'https://cdn.aarp.net/content/dam/aarp/travel/destination-guides/2018/03/1140-trv-dst-dc-main.imgcache.revd66f01d4a19adcecdb09fdacd4471fa8.web.650.370.jpg', 700.64, new Date('2019-11-15'), new Date('2019-08-11') , 'abc')
 ]);
  

 getPlace(id: string) {
  //  return this.places.pipe(take(1), map(places => {
  //   return {  ...places.find(p => p.id === id)  };

  //  }));
  return this.http.get<PlaceData> (`https://bookings-292c0.firebaseio.com/offer-places/${id}.json`).pipe(
    map(place => {
    return new Place(
      id ,
      place.title ,
      place.description, 
      place.imageurl ,
      place.price,
      new Date(place.availableFrom),
      new Date(place.availableTo) ,
      place.uderId );
    })
  );
 }
  addPlace(title: string, description: string, price: number, dateFrom: Date, DateTo: Date ) {
    let newPlace: Place;
    return this.authService.userId.pipe(take(1) , switchMap( userId => {
if (!userId) {
  throw new Error('No user found!');
}
// tslint:disable-next-line: max-line-length
newPlace = new Place(Math.random().toString() , title, description, 'https://lonelyplanetimages.imgix.net/mastheads/GettyImages-538096543_medium.jpg?sharp=10&vib=20&w=1200', price, dateFrom, DateTo, userId);
// tslint:disable-next-line: max-line-length
return this.http.post<{name: string}>('https://bookings-292c0.firebaseio.com/offer-places.json', {...newPlace , id: null });
    }))
// tslint:disable-next-line: max-line-length
    .pipe(switchMap(rest => {
      this.generatedId = rest.name;
      return this.places;
    }), take(1) , tap(places => {
      newPlace.id = this.generatedId;
      this._places.next(places.concat(newPlace));
    }))  ;

    // return  this.places.pipe(take(1), delay(1000), tap(places => {
    //   this._places.next(places.concat(newPlace));
    // }));
  }

  updatePlace(placeId: string, title: string, description: string) {
    let updatedPlaces: Place[];
    return this.places.pipe(take(1), switchMap(places => {
      if
      (!places || places.length <= 0 ) {
return this.fetchPlace;
      } else {
        return of(places);
      }
      

    }), switchMap(places => {
      if (!places || places.length <= 0) {
         return this.fetchPlace;
      }
      const updatedPlacesIndex = places.findIndex (pl => pl.id === placeId);
      updatedPlaces = [...places];
      const old = updatedPlaces[updatedPlacesIndex];
 // tslint:disable-next-line: max-line-length
      updatedPlaces[updatedPlacesIndex] = new Place (old.id, title , description, old.imageurl , old.price, old.availableFrom, old.availableTo , old.uderId);
// tslint:disable-next-line: max-line-length
      return this.http.put(`https://bookings-292c0.firebaseio.com/offer-places/${placeId}.json`, {...updatedPlaces[updatedPlacesIndex], id: null}
      );
    } ) , tap(res => {
      this._places.next(updatedPlaces);
    }));

  }


uploadPlace(image: File) {
  const uploadData = new FormData();
  uploadData.append('image' ,  image);
 // this.http.post('gs://bookings-292c0.appspot.com/')


}



fetchPlace() {
 return this.http.get<{[key: string]: PlaceData }>('https://bookings-292c0.firebaseio.com/offer-places.json').pipe( map(
   res => {
     const places = [];
     for(const key in res) {
       if (res.hasOwnProperty(key)) {
         places.push(
           new Place (
             key,
             res[key].title,
             res[key].description ,
             res[key].imageurl,
             res[key].price,
            new Date( res[key].availableFrom) ,
            new Date( res[key].availableTo) ,
             res[key].uderId,
           )
         );
       }
     }
     return places;
       }
 ), tap(places => {
   this._places .next(places);
 })
 );

}

}
