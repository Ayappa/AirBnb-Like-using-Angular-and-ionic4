import { Component, OnInit, OnDestroy } from '@angular/core';
import { PlaceService } from '../../place.service';
import { ActivatedRoute, Router } from '@angular/router';
import { NavController, LoadingController, AlertController } from '@ionic/angular';
import { Place } from '../../places.model';
import { FormGroup, FormControl, Validators , ReactiveFormsModule } from '@angular/forms';
import { Subscription } from 'rxjs';


@Component({
  selector: 'app-edit-offer',
  templateUrl: './edit-offer.page.html',
  styleUrls: ['./edit-offer.page.scss'],
})
export class EditOfferPage implements OnInit , OnDestroy{
 place: Place;
 form: FormGroup;
 private  placesSub: Subscription;
 isLoading = false;
 placeId: string;
// tslint:disable-next-line: max-line-length
  constructor( private placeService: PlaceService, private route: ActivatedRoute, private nacctl: NavController , private loaderctl: LoadingController , private router: Router , private alertctl: AlertController) { }

  ngOnInit() {
    this.route.paramMap.subscribe(param => {
      if (!param.has('placeId')) {
        this.nacctl.navigateBack('/places/tabs/offers');
        return;
      }
      this.placeId = param.get('placeId');
      this.isLoading = true;
      this.placesSub = this.placeService.getPlace(param.get('placeId')).subscribe(place => {
        this.place = place;





        this.form = new FormGroup( {
      title: new FormControl(this.place.title, {
        updateOn: 'blur',
        validators: [Validators.required]
      }),
      description: new FormControl(this.place.description, {
        updateOn: 'blur',
        validators: [Validators.required, Validators.maxLength(180)]
      })
      // price: new FormControl(null, {
      //   updateOn: 'blur',
      //   validators: [Validators.required, Validators.min(1)]
      // }),
      // dateForm: new FormControl(null, {
      //   updateOn: 'blur',
      //   validators: [Validators.required]
      // }),
      // dateT0: new FormControl(null, {
      //   updateOn: 'blur',
      //   validators: [Validators.required]
      // })
    });
        this.isLoading = false;
  } , error => {
   this.alertctl.create({
     header: 'An error occurred!',
     message: 'Place could not fetched' ,
     buttons: [{text: 'okay', handler: () => {
       this.router.navigate(['/places/tabs/offers']);
     }}]
   }).then(ctl => {ctl.present(); } );
  });
});
  }
  onUpdateeOffer() {
    if ( !this.form.valid) { return; }
    this.loaderctl.create({
      message: 'UpdTING Place..'
    }).then( CTL => {
// tslint:disable-next-line: max-line-length
      this.placeService.updatePlace(this.place.id, this.form.value.title , this.form.value.description).subscribe(() => {CTL.dismiss(); this.form.reset(); this.router.navigate(['/places/tabs/offers'])});

    });
  }

  ngOnDestroy() {
    if (this.placesSub) {
      this.placesSub.unsubscribe();
    }
  }
}
