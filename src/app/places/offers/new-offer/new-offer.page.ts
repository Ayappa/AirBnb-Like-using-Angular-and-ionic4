import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators , ReactiveFormsModule } from '@angular/forms';
import { PlaceService } from '../../place.service';
import { Router } from '@angular/router';
import { LoadingController } from '@ionic/angular';
function b64toBlob(b64Data, contentType) {
  contentType = contentType || '';
  const sliceSize =  1024;

  // tslint:disable-next-line: prefer-const
  let byteCharacters = atob(b64Data);
  const byteArrays = [];

  for (let offset = 0; offset < byteCharacters.length; offset += sliceSize) {
      const slice = byteCharacters.slice(offset, offset + sliceSize);

      const byteNumbers = new Array(slice.length);
      for (let i = 0; i < slice.length; i++) {
          byteNumbers[i] = slice.charCodeAt(i);
      }

      const byteArray = new Uint8Array(byteNumbers);

      byteArrays.push(byteArray);
  }

  const blob = new Blob(byteArrays, {type: contentType});
  return blob;
}

@Component({
  selector: 'app-new-offer',
  templateUrl: './new-offer.page.html',
  styleUrls: ['./new-offer.page.scss'],
})
export class NewOfferPage implements OnInit {
    form: FormGroup;
  constructor(private placeService: PlaceService , private router: Router, private loaderctl: LoadingController) { }

  ngOnInit() {

    this.form = new FormGroup( {
      title: new FormControl(null, {
        updateOn: 'blur',
        validators: [Validators.required]
      }),
      description: new FormControl(null, {
        updateOn: 'blur',
        validators: [Validators.required, Validators.maxLength(180)]
      }),
      price: new FormControl(null, {
        updateOn: 'blur',
        validators: [Validators.required, Validators.min(1)]
      }),
      dateForm: new FormControl(null, {
        updateOn: 'blur',
        validators: [Validators.required]
      }),
      dateTo: new FormControl(null, {
        updateOn: 'blur',
        validators: [Validators.required]
      }),
      image: new FormControl(null)
    });
  }
  onCreateOffer() {
    if (!this.form.valid || !this.form.get('image').value) {
      return;
    }
    this.loaderctl.create({
      message: 'Creating Place..'
    }).then(ctl => {
      ctl.present();
// tslint:disable-next-line: max-line-length
      this.placeService.addPlace(this.form.value.title, this.form.value.description, +this.form.value.price, new Date(this.form.value.dateForm), new Date(this.form.value.dateTo)).subscribe(() => {
         ctl.dismiss();
         this.form.reset();
         this.router.navigate(['/places/tabs/offers']);
      });
    });
// tslint:disable-next-line: max-line-length
// tslint:disable-next-line: max-line-length
  }






  onImagePicked(imageData: string | File) {
    let imageFile;
    if (typeof imageData === 'string') {
    try {
   imageFile =  b64toBlob(imageData.replace('data:image/jpeg;base64,', ''), 'image/jpeg');
    } catch (err) {
      return;
    }
  } else {
     imageFile = imageData;
  }
     this.form.patchValue( { image : imageFile});
  }
}
