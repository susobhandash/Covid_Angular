import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class CovidDataService {

  countryDataURL = "https://api.covid19india.org/data.json";
  statesDataURL = "https://api.covid19india.org/state_district_wise.json";
  timeSeriesURL = "https://api.covid19india.org/v4/timeseries.json";

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
