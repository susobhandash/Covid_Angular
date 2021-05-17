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

  findByPIN(pin, date) {
    // let date = new Date().toLocaleDateString('en-GB').replace(/\//g, "-");
    let url = this.cowinAPIUrl + '/v2/appointment/sessions/public/calendarByPin?pincode=' + pin + '&date=' + date;

    return this.http.get(url);
  }

  findByDistrict(distId, date) {
    // let date = new Date().toLocaleDateString('en-GB').replace(/\//g, "-");
    let url = this.cowinAPIUrl + '/v2/appointment/sessions/public/calendarByDistrict?district_id=' + distId + '&date=' + date;

    return this.http.get(url);
  }

  getCertificate(refId, auth_token) {
    // let date = new Date().toLocaleDateString('en-GB').replace(/\//g, "-");
    let url = this.cowinAPIUrl + '/v2/registration/certificate/public/download?beneficiary_reference_id=' + refId;
    const header = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${auth_token}`
    });
    let options = { headers: header};

    return this.http.get(url, options);
  }

  getOTP(body) {
    let url = this.cowinAPIUrl + '/v2/auth/public/generateOTP';

    return this.http.post(url, body);
  }

  validateOTP(body) {
    let url = this.cowinAPIUrl + '/v2/auth/public/confirmOTP';

    return this.http.post(url, body);
  }


}
