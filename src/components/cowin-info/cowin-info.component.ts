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

  states: any[] = [];
  districts: any[] = [];
  selectedStateId: number;
  selectedDistId: number;
  findBy = 'pin';
  pin: number = 425412;
  sessions: any[] = [];

  constructor(private cowinService: CowinService, private _snackBar: MatSnackBar) { }

  ngOnInit(): void {
    this.getStates();
  }

  openSnackBar(message: string, action: string) {
    this._snackBar.open(message, action, {
      duration: 3000,
    });
  }

  // async sha256(message) {
  //   // encode as UTF-8
  //   const msgBuffer = new TextEncoder().encode(message);

  //   // hash the message
  //   const hashBuffer = await crypto.subtle.digest('SHA-256', msgBuffer);

  //   // convert ArrayBuffer to Array
  //   const hashArray = Array.from(new Uint8Array(hashBuffer));

  //   // convert bytes to hex string
  //   const hashHex = hashArray.map(b => ('00' + b.toString(16)).slice(-2)).join('');

  //   this.validateOTP(hashHex);
  // }

  getFormattedTime(timeString) {
    let H = +timeString.substr(0, 2);
    let h = H % 12 || 12;
    let ampm = (H < 12 || H === 24) ? "AM" : "PM";
    return (h > 9 ? h : '0'+h) + timeString.substr(2, 3) + ampm;
  }

  getStates() {
    this.cowinService.getStates().subscribe(res => {
      // console.log(res);
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
    this.sessions = [];
    this.cowinService.getDistricts(this.selectedStateId).subscribe(res => {
      // console.log(res);
      if (res && res['districts']) {
        this.districts = res['districts'];
      }
    }, err => {
      console.log(err);
    });
  }

  getByPin() {
    this.cowinService.findByPIN(this.pin).subscribe(res => {
      console.log(res);
      if (res) {
        if (res['sessions'].length == 0) {
          this.openSnackBar('No Data found for Today', 'Ok');
          this.sessions = [];
        } else if (res['sessions'].length > 0) {
          this.sessions = res['sessions'];
        }
      }
    });
  }

  getByDistrict() {
    this.cowinService.findByDistrict(this.selectedDistId).subscribe(res => {
      console.log(res);
      if (res) {
        if (res['sessions'].length == 0) {
          this.openSnackBar('No Data found for Today', 'Ok');
          this.sessions = [];
        } else if (res['sessions'].length > 0) {
          this.sessions = res['sessions'];
        }
      }
    });
  }

}
