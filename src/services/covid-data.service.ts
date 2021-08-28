import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class CovidDataService {

  countryDataURL = "/v1/data.json";
  statesDataURL = "/v1/state_district_wise.json";
  timeSeriesURL = "/v1/v4/timeseries.json";

  constructor(private http: HttpClient) { }

  getCountryDataByStates() {
    return this.http.get(this.countryDataURL);
  }

  getStatesDataByDistricts() {
    return this.http.get(this.statesDataURL);
  }

  getTimeSeriesData() {
    return this.http.get(this.timeSeriesURL)
  }
}
