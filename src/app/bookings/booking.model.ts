export class Booking {
// tslint:disable-next-line: ban-types
// tslint:disable-next-line: max-line-length
    constructor(public id: string, public placeId: string, public userId: string, public placeTitle: string, public placeImage: string,public firstName: string, public lastName: string, public guestNumber: number, public bookedFrom: Date, public bookedTo: Date) {

    }
}