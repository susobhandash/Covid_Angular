import { Component, OnInit } from '@angular/core';
import { CowinService } from 'src/services/cowin.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { connectableObservableDescriptor } from 'rxjs/internal/observable/ConnectableObservable';

@Component({
  selector: 'app-cowin-info',
  templateUrl: './cowin-info.component.html',
  styleUrls: ['./cowin-info.component.scss']
})
export class CowinInfoComponent implements OnInit {

  phone: number;
  otp: number;
  txnId: string;
  hashHex: string;
  token: string;
  states: any[] = [];
  districts: any[] = [];
  selectedStateId: number = 0;

  constructor(private cowinService: CowinService, private _snackBar: MatSnackBar) { }

  ngOnInit(): void {
    this.getStates();
  }

  openSnackBar(message: string, action: string) {
    this._snackBar.open(message, action, {
      duration: 2000,
    });
  }

  getOTP() {
    this.cowinService.getOTP(this.phone).subscribe(res => {
      console.log(res);
      if (res && res['txnId']) {
        this.txnId = res['txnId'];
        this.openSnackBar('Please enter OTP received on this number', 'Proceed');
      }
    }, err => {
      console.log(err.error);
      if(err.error.error) {
        this.openSnackBar(err.error, 'Ok');
      } else {
        this.openSnackBar(err.error + '. Please wait for 3 minutes before trying again.', 'Ok');
      }

      this.phone = undefined;
      this.otp = undefined;
    });
  }

  async sha256(message) {
    // encode as UTF-8
    const msgBuffer = new TextEncoder().encode(message);

    // hash the message
    const hashBuffer = await crypto.subtle.digest('SHA-256', msgBuffer);

    // convert ArrayBuffer to Array
    const hashArray = Array.from(new Uint8Array(hashBuffer));

    // convert bytes to hex string
    const hashHex = hashArray.map(b => ('00' + b.toString(16)).slice(-2)).join('');

    this.validateOTP(hashHex);
  }

  validateOTP(hashHex) {
    let encodedOTP = hashHex;

    let postObj = {
      "otp": encodedOTP,
      "txnId": this.txnId
    };

    this.cowinService.valiadteOTP(postObj).subscribe(res => {
      console.log(res);
      if (res && res['token']) {
        this.token = res['token'];
        this.openSnackBar('OTP matched', 'Ok');
      }
    }, err => {
      console.log(err.error.error);
      if (err.error.error) {
        this.openSnackBar(err.error.error, 'Ok');
      } else if (err.error) {
        this.openSnackBar(err.error, 'Ok');
      }
    });
  }

  getStates() {
    this.cowinService.getStates().subscribe(res => {
      console.log(res);
      if (res && res['states']) {
        this.states = res['states'];
        this.selectedStateId = this.states[0]['state_id'];
        this.getDistricts();
      }
    }, err => {
      console.log(err);
      if (err.error.error) {
        this.openSnackBar(err.error.error, 'Ok');
      } else if (err.error) {
        this.openSnackBar(err.error, 'Ok');
      }
    });
  }

  getDistricts() {
    this.cowinService.getDistricts(this.selectedStateId).subscribe(res => {
      console.log(res);
      if(res && res['districts']) {
        this.districts = res['districts'];
      }
    }, err => {
      console.log(err);
    });
  }

}
