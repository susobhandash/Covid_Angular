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
  selectedDataFields = [];
  selectedChartType: ChartType = 'bar';
  selectedDataDays = 7;

  // Others
  date = '';
  dates = [];
  totalData = {};

  public chartOptions: ChartOptions;

  public barChartOptions: ChartOptions = {
    responsive: true,
    scales: {
      xAxes: [{
        ticks: {
          minRotation: 90,
          maxRotation: 90
        },
        gridLines: {
          display: false
        }
      }], yAxes: [{
        ticks: {
          beginAtZero: false,
          fontStyle: 'bold'
        },
        gridLines: {
          display: true,
          color: "#e5e5e5",
          zeroLineWidth: 2,
          zeroLineColor: "#333"
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

    this.chartOptions = this.barChartOptions;

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
    this.selectedDataFields[0] = this.dataFields[0].code;

    // Chart Type Dropdown value Init
    this.chartType = [
      { name: 'Bar', code: 'bar' },
      { name: 'Line', code: 'line' },
      { name: 'Pie', code: 'pie' }
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
  getStateData(event=null) {
    if (this.selectedDataFields.length > 3) {
      // this.selectedDataFields = [];
      this.selectedDataFields.length = 3;
      this.selectedDataFields = [...this.selectedDataFields];
    }
    this.chartData = [];

    this.selectedDataFields.forEach((el, idx, a) => {
      this.creteChartData(el, idx);
    });
    // let label = this.dataFields.filter(el => {
    //   return el.code === this.selectedDataFields;
    // });
    // this.chartData[0].label = label && label.length > 0 ? label[0].name : '';


    // console.log(dateData);
  }

  creteChartData(dataFields, idx) {
    let field = dataFields.split('-')[0];
    let dataParam = dataFields.split('-')[1];

    let dateData = [];
    this.chartLabels = [];
    this.chartData.push({ data: [] });
    this.chartData[idx].data = [];
    const data = this.totalData[this.selectedState]['dates'];
    const dates = Object.keys(this.totalData[this.selectedState].dates);

    for (let i = 0; i < this.selectedDataDays; i++) {
      dateData.push({
        "date": dates[dates.length - (i + 2)],
        "data": data[Object.keys(data)[Object.keys(data).length - (i + 2)]]
      });
      this.chartLabels.push(dates[dates.length - (i + 2)]);
      this.chartData[idx].data.push(data[Object.keys(data)[Object.keys(data).length - (i + 2)]][field][dataParam]);
      this.getChartProps(field, dataParam, idx);
    }

    let label = this.dataFields.filter(el => {
      return el.code === dataFields;
    });
    this.chartData[idx].label = label && label.length > 0 ? label[0].name : '';
  }

  // Get Chart Color and Labels
  getChartProps(field, dataParam, idx) {
    let bgColor = '';
    let borderColor = '';
    let hoverBgColor = '';

    switch (dataParam) {
      case 'confirmed':
        bgColor = 'rgba(255, 99, 132, .2)';
        borderColor = 'rgba(255, 99, 132, 1)';
        hoverBgColor = 'rgba(255, 99, 132, .5)';
        break;

      case 'recovered':
        bgColor = 'rgba(75, 192, 192, .2)';
        borderColor = 'rgba(75, 192, 192, 1)';
        hoverBgColor = 'rgba(75, 192, 192, .5)';
        break;

      case 'deceased':
        bgColor = 'rgba(201, 203, 207, .2)';
        borderColor = 'rgba(201, 203, 207, 1)';
        hoverBgColor = 'rgba(201, 203, 207, .5)';
        break;

      case 'tested':
        bgColor = 'rgba(153, 102, 255, .2)';
        borderColor = 'rgba(153, 102, 255, 1)';
        hoverBgColor = 'rgba(153, 102, 255, .5)';
        break;

      case 'vaccinated':
        bgColor = 'rgba(54, 162, 235, .2)';
        borderColor = 'rgba(54, 162, 235, 1)';
        hoverBgColor = 'rgba(54, 162, 235, .5)';
        break;
    }

    this.chartData[idx].backgroundColor = bgColor;
    this.chartData[idx].borderColor = borderColor;
    this.chartData[idx].hoverBorderColor = borderColor;
    this.chartData[idx].hoverBackgroundColor = hoverBgColor;
    this.chartData[idx].borderWidth = 1;

    //  if (field === 'delta7' || field === 'total') {
    //    this.barChartOptions.scales.yAxes[0].ticks.beginAtZero = false;
    //  }

    this.chartData = [...this.chartData];
    this.chartOptions = Object.assign(this.barChartOptions);
    this.chartType = Object.assign(this.chartType);
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
