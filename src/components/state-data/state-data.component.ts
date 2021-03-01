import { Component, OnInit } from '@angular/core';
import { CovidDataService } from '../../services/covid-data.service';
import { ActivatedRoute, Router } from '@angular/router';
import { Location } from '@angular/common';
import { ChartDataSets, ChartOptions, ChartType } from 'chart.js';
// import * as pluginDataLabels from 'chartjs-plugin-datalabels';
import { Label } from 'ng2-charts';

@Component({
  selector: 'app-state-data',
  templateUrl: './state-data.component.html',
  styleUrls: ['./state-data.component.scss']
})
export class StateDataComponent implements OnInit {

  // Dropdown Arrays
  states: States[] = [];
  dataFields: DataFields[] = [];
  chartType: ChartTypes[] = [];
  dataDays: DataDays[] = [];

  // Selecetd Variables for Dropdowns
  selectedState = 'MH';
  selectedDataFields = '';
  selectedChartType: ChartType = 'bar';
  selectedDataDays = 7;
  
  // Others
  date = '';
  dates = [];
  totalData = {};

  public chartOptions: ChartOptions = {
    responsive: true,
    scales: { xAxes: [{}], yAxes: [{}] },
    plugins: {
      datalabels: {
        anchor: 'end',
        align: 'end',
      }
    }
  };
  public chartLabels: Label[] = []; 
  // public chartType: ChartType = 'bar';
  public chartLegend = true;
  // public barChartPlugins = [pluginDataLabels];
  public chartData: ChartDataSets[] = [
    //{ data: [65, 59, 80, 81, 56, 55, 40], label: 'Delta - Confirmed' }
  ];

  constructor(private data: CovidDataService, private activatedroute: ActivatedRoute, private router: Router, private location: Location) { }

  ngOnInit(): void {
    this.getStatesList();
    this.getStateDate();
    
    this.selectedState = this.location.getState()['state'] ? this.location.getState()['state'] : 'MH';

    // Date Dropdown value Init
    this.dataFields = [
      {name: 'Daily Confirmed', code: 'delta-confirmed'},
      {name: 'Daily Deceased', code: 'delta-deceased'},
      {name: 'Daily Recovered', code: 'delta-recovered'},
      {name: 'Daily Tested', code: 'delta-tested'},
      {name: 'Daily Vaccinated', code: 'delta-vaccinated'},
      {name: 'Weekly Delta Confirmed', code: 'delta7-confirmed'},
      {name: 'Weekly Delta Deceased', code: 'delta7-deceased'},
      {name: 'Weekly Delta Recovered', code: 'delta7-recovered'},
      {name: 'Weekly Delta Tested', code: 'delta7-tested'},
      {name: 'Weekly Delta Vaccinated', code: 'delta7-vaccinated'},
      {name: 'Total Confirmed', code: 'total-confirmed'},
      {name: 'Total Delta Deceased', code: 'total-deceased'},
      {name: 'Total Delta Recovered', code: 'total-recovered'},
      {name: 'Total Delta Tested', code: 'total-tested'},
      {name: 'Total Delta Vaccinated', code: 'total-vaccinated'},
    ];
    this.selectedDataFields= this.dataFields[0].code;

    // Chart Type Dropdown value Init
    this.chartType = [
      {name: 'Bar', code: 'bar'},
      {name: 'Line', code: 'line'}
    ];

    // Data Days Dropdown value Init
    this.dataDays = [
      {name: '7', code: 7},
      {name: '15', code: 15},
      {name: '30', code: 30}
    ];
    this.selectedDataDays= this.dataDays[0].code;
  }

  // Get states list to show in States dropdown
  getStatesList() {
    this.data.getCountryDataByStates().subscribe(res => {
      if (res && res['statewise'] && res['statewise'].length > 0) {
        let result = res['statewise'];
        result.forEach(el => {
          this.states.push({
            name: el.state,
            code: el.statecode
          });
        });
      }
    }, err => {
      console.log(err);
    });
  }

  // Get all States' Districts' all data
  getStateDate() {
    this.data.getStatesDataByDistricts().subscribe(res => {
      this.getTimeSeriesData();
    }, err => {
      console.log(err);
    });
  }

  // Get all States Data by Time Series
  getTimeSeriesData() {
    this.data.getTimeSeriesData().subscribe(res => {
      if (res) {
        this.totalData = res;
        this.getStateData();
      }
    }, err => {
      console.log(err);
    });
  }

  // Get Selected State data for last 7 days for Selected State
  getStateData() {
    const data = this.totalData[this.selectedState]['dates'];
    const dates = Object.keys(this.totalData[this.selectedState].dates);
    let dateData = [];
    this.chartLabels = [];
    this.chartData[0].data = [];
    this.chartData[0].label = "Delta Confirmed";

    for (let i = 0; i < 7; i++) {
      dateData.push({
        "date": dates[dates.length - (i + 2)],
        "data": data[Object.keys(data)[Object.keys(data).length - (i + 2)]]
      });
      this.chartLabels.push(dates[dates.length - (i + 2)]);
      this.chartData[0].data.push(data[Object.keys(data)[Object.keys(data).length - (i + 2)]]['delta']['confirmed']);
    }

    console.log(dateData);
  }

  creteChart() {}

  // Get Chart Color and Labels
  getChartProps(chartCode) {

  }

}

export interface States {
  name: string;
  code: string;
}

export interface DataFields {
  name: string;
  code: string;
}

export interface ChartTypes {
  name: string;
  code: string;
}

export interface DataDays {
  name: string;
  code: number;
}
