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
    scales: {
      xAxes: [{
        gridLines: {
          display: false
        },
        ticks: {
          fontStyle: 'bold'
        }
      }], yAxes: [{
        ticks: {
          beginAtZero: true
        },
        gridLines: {
          display: false
        }
      }]
    },
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
      { name: 'Daily Confirmed', code: 'delta-confirmed' },
      { name: 'Daily Deceased', code: 'delta-deceased' },
      { name: 'Daily Recovered', code: 'delta-recovered' },
      { name: 'Daily Tested', code: 'delta-tested' },
      { name: 'Daily Vaccinated', code: 'delta-vaccinated' },
      { name: 'Weekly Delta Confirmed', code: 'delta7-confirmed' },
      { name: 'Weekly Delta Deceased', code: 'delta7-deceased' },
      { name: 'Weekly Delta Recovered', code: 'delta7-recovered' },
      { name: 'Weekly Delta Tested', code: 'delta7-tested' },
      { name: 'Weekly Delta Vaccinated', code: 'delta7-vaccinated' },
      { name: 'Total Confirmed', code: 'total-confirmed' },
      { name: 'Total Delta Deceased', code: 'total-deceased' },
      { name: 'Total Delta Recovered', code: 'total-recovered' },
      { name: 'Total Delta Tested', code: 'total-tested' },
      { name: 'Total Delta Vaccinated', code: 'total-vaccinated' },
    ];
    this.selectedDataFields = this.dataFields[0].code;

    // Chart Type Dropdown value Init
    this.chartType = [
      { name: 'Bar', code: 'bar' },
      { name: 'Line', code: 'line' }
    ];

    // Data Days Dropdown value Init
    this.dataDays = [
      { name: '7', code: 7 },
      { name: '15', code: 15 },
      { name: '30', code: 30 }
    ];
    this.selectedDataDays = this.dataDays[0].code;
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
    let label = this.dataFields.filter(el => {
      return el.code === this.selectedDataFields;
    });
    this.chartData[0].label = label && label.length > 0 ? label[0].name : '';
    let field = this.selectedDataFields.split('-')[0];
    let dataParam = this.selectedDataFields.split('-')[1];

    for (let i = 0; i < this.selectedDataDays; i++) {
      dateData.push({
        "date": dates[dates.length - (i + 2)],
        "data": data[Object.keys(data)[Object.keys(data).length - (i + 2)]]
      });
      this.chartLabels.push(dates[dates.length - (i + 2)]);
      this.chartData[0].data.push(data[Object.keys(data)[Object.keys(data).length - (i + 2)]][field][dataParam]);
      this.getChartProps(dataParam);
    }

    console.log(dateData);
  }

  creteChart() { }

  // Get Chart Color and Labels
  getChartProps(dataParam) {
    let bgColor = '';
    let borderColor = '';
    let hoverBgColor = '';

    switch (dataParam) {
      case 'confirmed':
        bgColor = 'rgba(255, 7, 58, .12549)';
        borderColor = '#ff073a';
        hoverBgColor = 'rgba(255, 7, 58, .5)';
        break;

      case 'recovered':
        bgColor = 'rgba(40, 167, 69, .12549)';
        borderColor = '#28a745';
        hoverBgColor = 'rgba(40, 167, 69, .5)';
        break;

      case 'deceased':
        bgColor = 'rgba(108, 117, 125, .0627451)';
        borderColor = '#6c757d';
        hoverBgColor = 'rgba(108, 117, 125, .5)';
        break;

      case 'tested':
        bgColor = 'rgba(32, 26, 162, .12549)';
        borderColor = 'rgba(32, 26, 162, .866667)';
        hoverBgColor = 'rgba(32, 26, 162, .5)';
        break;

      case 'vaccinated':
        bgColor = 'rgba(40, 167, 69, .12549)';
        borderColor = '#28a745';
        hoverBgColor = 'rgba(40, 167, 69, .5)';
        break;
    }

    this.chartData[0].backgroundColor = bgColor;
    this.chartData[0].borderColor = borderColor;
    this.chartData[0].hoverBorderColor = borderColor;
    this.chartData[0].hoverBackgroundColor = hoverBgColor;
    this.chartData[0].borderWidth = 1;
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
