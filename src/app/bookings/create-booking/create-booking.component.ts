import { Component, OnInit, Input, ViewChild } from '@angular/core';
import { Place } from 'src/app/places/places.model';
import { ModalController } from '@ionic/angular';
import { NgForm } from '@angular/forms';

@Component({
  selector: 'app-create-booking',
  templateUrl: './create-booking.component.html',
  styleUrls: ['./create-booking.component.scss'],
})
export class CreateBookingComponent implements OnInit {
  @Input() selectedPlace: Place;
  @Input() selectedMode: 'select' |  'random' ;
  @ViewChild('f') form: NgForm;
  startDate: string;
  endDate: string;
  constructor(private modalCtl: ModalController) { }

  ngOnInit() {
    const avaliableFrom = new Date(this.selectedPlace.availableFrom);
    const avaliableTo = new Date(this.selectedPlace.availableTo);
    if (this.selectedMode === 'random') {
// tslint:disable-next-line: max-line-length
      this.startDate = new Date( avaliableFrom.getDate() + Math.random() * (avaliableTo.getTime() - 7 * 24 * 60 * 60 * 1000 - avaliableFrom.getTime())).toISOString();

// tslint:disable-next-line: max-line-length
      this.endDate = new Date(new Date(this.startDate).getTime() + Math.random() * (new Date(this.startDate).getTime() + 6 * 24 * 60 * 60 * 1000 - new Date(this.startDate).getTime())).toISOString();
    }
  }
  onBookPlace() {
    if(!this.form.valid || !this.datesValid){
      return;
    }
    this.modalCtl.dismiss({bookingData:
      {
        firstName: this.form.value['First-Name'],
      LastName: this.form.value['Last-Name'],
        guestNumber: +this.form.value['guestNo'],
        startDate: new Date( this.form.value['dateFrom']),
        endDate: new Date( this.form.value['dateTo']),

      }}, 'confirm');

}
  onCancel() {
  this.modalCtl.dismiss(null, 'cancel');
  }

  datesValid() {
    const startDate = new Date(this.form.value['dateFrom']);
    const endDate = new Date(this.form.value['dateTo']);
    return endDate > startDate;

  }
}
