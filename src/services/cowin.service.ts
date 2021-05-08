import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class CowinService {

  cowinAPIUrl = 'https://cdn-api.co-vin.in/api';

  headers = new HttpHeaders({
    'Content-Type': 'application/json'
  });

  stateHeader = new HttpHeaders({
    'Content-Type': 'application/json'
  });

  constructor(private http: HttpClient) { }

  getOTP(mobNum) {
    let url = this.cowinAPIUrl + '/v2/auth/public/generateOTP';
    let body = {
      'mobile': mobNum
    };
    let options = {
      headers: this.headers
    }

    return this.http.post(url, body, options);
  }

  valiadteOTP(otp) {
    let url = this.cowinAPIUrl + '/v2/auth/public/confirmOTP';
    let body = otp;
    let options = {
      headers: this.headers
    }

    return this.http.post(url, body, options);
  }

  getStates() {
    let url = this.cowinAPIUrl + '/v2/admin/location/states';
    let options = {
      headers: this.headers
    };

    return this.http.get(url, options);
  }

  getDistricts(stateId) {
    let url = this.cowinAPIUrl + '/v2/admin/location/districts/' + stateId;

    return this.http.get(url);
  }
}
