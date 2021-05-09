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

  constructor(private http: HttpClient) { }

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

  findByPIN(pin) {
    let date = new Date().toLocaleDateString('en-GB').replace(/\//g, "-");
    let url = this.cowinAPIUrl + '/v2/appointment/sessions/public/findByPin?pincode='+ pin + '&date=' + date;

    return this.http.get(url);
  }

  findByDistrict(distId) {
    let date = new Date().toLocaleDateString('en-GB').replace(/\//g, "-");
    let url = this.cowinAPIUrl + '/v2/appointment/sessions/public/findByDistrict?district_id='+ distId + '&date=' + date;

    return this.http.get(url);
  }
}
