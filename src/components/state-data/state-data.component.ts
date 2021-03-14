import { Component, OnInit } from '@angular/core';
import { CovidDataService } from '../../services/covid-data.service';
import { ActivatedRoute, Router } from '@angular/router';
import { Location } from '@angular/common';
// import { ChartDataSets, ChartOptions, ChartType } from 'chart.js';
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
  chartType: string = 'bar';
  dataDays: DataDays[] = [];
  stateDistData:any;

  // Selecetd Variables for Dropdowns
  selectedState = 'MH';
  selectedDataFields = [];
  selectedChartType = 'bar';
  selectedDataDays = 7;

  // dataVars
  totalConfirmed = 0;
  deltaConfirmed = 0;
  totalRecovered = 0;
  deltaRecovered = 0;
  totalDeceased = 0;
  deltaDeceased = 0;
  totalActive = 0;
  deltaActive = 0;
  totalVaccinated = 0;

  // Others
  date = '';
  dates = [];
  totalData = {};

  // public chartOptions: ChartOptions;

  public chartOptions: ChartOptions = {
    showBg: true
  };
  public chartLabels: Label[] = [];
  public chartLegend = true;
  public chartData: ChartData = new ChartData();

  // Delta Data
  public selectedDelta = 'delta-confirmed';
  public deltaChartOptions: ChartOptions = {
    showBg: true
  }
  public deltaChartData: ChartData = new ChartData();
  public deltaChartLabels: Label[] = [];

  // Delta7 Data
  public selectedDelta7 = 'delta7-confirmed';
  public delta7ChartOptions: ChartOptions = {
    showBg: true
  }
  public delta7ChartData: ChartData = new ChartData();
  public delta7ChartLabels: Label[] = [];

  // Total Data
  public selectedTotal = 'total-confirmed';
  public totalChartOptions: ChartOptions = {
    showBg: true
  }
  public totalChartData: ChartData = new ChartData();
  public totalChartLabels: Label[] = [];

  constructor(private data: CovidDataService, private activatedroute: ActivatedRoute, private router: Router, private location: Location) { }

  ngOnInit(): void {
    this.getStatesList();
    this.getStateDate();

    this.selectedState = this.location.getState()['state'] ? this.location.getState()['state'] : 'MH';

    // this.chartOptions = this.barChartOptions;

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
    // this.chartType = [
    //   { name: 'Bar', code: 'bar' },
    //   { name: 'Line', code: 'line' },
    //   { name: 'Pie', code: 'pie' }
    // ];

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
      let statesData = res;
      let states = Object.keys(statesData);
      let selectedStateInfo = states.filter(el => {
        return (statesData[el]['statecode'] === this.selectedState);
      });
      let distInfo = selectedStateInfo ? statesData[selectedStateInfo[0]] : undefined;
      this.processDistData(distInfo);
      // console.log(this.stateDistData);
      this.getTimeSeriesData();
    }, err => {
      console.log(err);
    });
  }

  processDistData(distInfo) {
    this.stateDistData = [];
    let districts = Object.keys(distInfo['districtData']);
    districts.forEach(el => {
      this.stateDistData.push({
        name: el,
        active: distInfo['districtData'][el].active,
        confirmed: distInfo['districtData'][el].confirmed,
        deceased: distInfo['districtData'][el].deceased,
        recovered: distInfo['districtData'][el].recovered,
        delta: distInfo['districtData'][el].delta,
        notes: distInfo['districtData'][el].notes
      });
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
  getStateData(event = null) {
    this.chartData = new ChartData();

    this.chartLabels = [];
    this.deltaChartLabels = [];
    this.totalChartLabels = [];

    this.chartData.data = [];

    this.deltaChartData.data = [];
    this.deltaChartLabels = [];

    this.delta7ChartData.data = [];
    this.delta7ChartLabels = [];
    
    this.totalChartData.data = [];
    this.totalChartLabels = [];

    this.creteChartData(this.selectedDelta);
    this.creteChartData(this.selectedDelta7);
    this.creteChartData(this.selectedTotal);
  }

  creteChartData(dataFields) {
    let field = dataFields.split('-')[0];
    let dataParam = dataFields.split('-')[1];

    const data = this.totalData[this.selectedState]['dates'];
    const dates = Object.keys(this.totalData[this.selectedState].dates);

    let currentDayData = data[dates[dates.length-1]];

    this.deltaConfirmed = currentDayData.delta && currentDayData.delta.confirmed ? currentDayData.delta.confirmed : 0;
    this.deltaRecovered = currentDayData.delta && currentDayData.delta.recovered ? currentDayData.delta.recovered : 0;
    this.deltaDeceased = currentDayData.delta && currentDayData.delta.deceased ? currentDayData.delta.deceased : 0;
    let deltaOther = currentDayData.delta && currentDayData.delta.other ? currentDayData.delta.other : 0
    this.deltaActive = this.deltaConfirmed - this.deltaRecovered - this.deltaDeceased - deltaOther;

    this.totalConfirmed = currentDayData.total.confirmed;
    this.totalRecovered = currentDayData.total.recovered;
    this.totalDeceased = currentDayData.total.deceased;
    this.totalVaccinated = currentDayData.total.vaccinated;
    this.totalActive = currentDayData.total.confirmed - currentDayData.total.recovered - currentDayData.total.deceased - (currentDayData.total.other ? currentDayData.total.other : 0);

    this.selectedDataDays = field === 'total' ? 30 : 7;

    for (let i = 0; i < this.selectedDataDays; i++) {


      // let dataToPush = 0;
      // if (dataParam === 'active') {
      //   dataToPush = data[Object.keys(data)[Object.keys(data).length - (i + 2)]][field]['confirmed'] -
      //     data[Object.keys(data)[Object.keys(data).length - (i + 2)]][field]['recovered'] -
      //     data[Object.keys(data)[Object.keys(data).length - (i + 2)]][field]['deceased'] -
      //     (data[Object.keys(data)[Object.keys(data).length - (i + 2)]][field]['other'] ? data[Object.keys(data)[Object.keys(data).length - (i + 2)]][field]['other'] : 0);
      // } else {
      let dataToPush = data[Object.keys(data)[Object.keys(data).length - (i + 2)]][field][dataParam] ? data[Object.keys(data)[Object.keys(data).length - (i + 2)]][field][dataParam] : 0;
      // }

      if (field === 'delta') {
        this.deltaChartData.data.push(dataToPush);
        this.deltaChartLabels.push(this.getFormattedDate(dates[dates.length - (i + 2)]));
      } else if (field === 'delta7') {
        this.delta7ChartData.data.push(dataToPush);
        // console.log(dates[dates.length - (i + 2) - (i*6)]);
        this.delta7ChartLabels.push(this.getFormattedDate(dates[dates.length - (i + 2) - (i * 6)]));
      } else if (field === 'total') {
        this.totalChartData.data.push(dataToPush);
        this.totalChartLabels.push(this.getFormattedDate(dates[dates.length - (i + 2)]));
      } else {
        this.chartData.data.push(dataToPush);
        this.chartLabels.push(this.getFormattedDate(dates[dates.length - (i + 2)]));
      }

      this.getChartProps(field, dataParam);
    }

    let label = this.dataFields.filter(el => {
      return el.code === dataFields;
    });

    if (field === 'delta') {
      // this.chartType = 'bar';
      this.deltaChartData.label = label && label.length > 0 ? label[0].name : '';
    } else if (field === 'delta7') {
      // this.chartType = 'bar';
      this.delta7ChartData.label = label[0]['name'];
    } else if (field === 'total') {
      this.totalChartData.label = label && label.length > 0 ? label[0].name : '';
    } else {
      this.chartType = 'line';
      this.chartData.label = label && label.length > 0 ? label[0].name : '';
    }

    this.deltaChartData = Object.assign(this.deltaChartData);
    this.delta7ChartData = Object.assign(this.delta7ChartData);
    // console.log(this.deltaChartData.data.length);
    this.totalChartData = Object.assign(this.totalChartData);
    this.chartData = Object.assign(this.chartData);
  }

  // Get Chart Color and Labels
  getChartProps(field, dataParam) {
    let bgColor = '';
    let borderColor = '';
    let hoverBgColor = '';

    switch (dataParam) {
      case 'confirmed':
        bgColor = 'rgba(255, 99, 132, .05)';
        borderColor = 'rgba(255, 99, 132, 1)';
        hoverBgColor = 'rgba(255, 99, 132, .5)';
        break;

      case 'recovered':
        bgColor = 'rgba(75, 192, 192, .05)';
        borderColor = 'rgba(75, 192, 192, 1)';
        hoverBgColor = 'rgba(75, 192, 192, .5)';
        break;

      case 'deceased':
        bgColor = 'rgba(201, 203, 207, .1)';
        borderColor = 'rgba(201, 203, 207, 1)';
        hoverBgColor = 'rgba(201, 203, 207, .5)';
        break;

      case 'tested':
        bgColor = 'rgba(153, 102, 255, .05)';
        borderColor = 'rgba(153, 102, 255, 1)';
        hoverBgColor = 'rgba(153, 102, 255, .5)';
        break;

      case 'vaccinated':
        bgColor = 'rgba(255,193,7, .1)';
        borderColor = 'rgba(255,193,7, 1)';
        hoverBgColor = 'rgba(255,193,7, .5)';
        break;

      case 'active':
        bgColor = 'rgba(0, 123, 255, .05)';
        borderColor = 'rgba(0, 123, 255, 1)';
        hoverBgColor = 'rgba(0, 123, 255, .5)';
        break;
    }

    this.deltaChartData.backgroundColor = bgColor;
    this.deltaChartData.borderColor = borderColor;
    this.deltaChartData.hoverBackgroundColor = hoverBgColor;

    this.delta7ChartData.backgroundColor = bgColor;
    this.delta7ChartData.borderColor = borderColor;
    this.delta7ChartData.hoverBackgroundColor = hoverBgColor;

    this.totalChartData.backgroundColor = bgColor;
    this.totalChartData.borderColor = borderColor;
    this.totalChartData.hoverBackgroundColor = hoverBgColor;

    this.chartData.backgroundColor = bgColor;
    this.chartData.borderColor = borderColor;
    this.chartData.hoverBackgroundColor = hoverBgColor;
  }

  getFormattedDate(date) {
    let month = date.split('-')[1];
    let monthLabel = '';

    switch (month) {
      case "01": {
        monthLabel = 'Jan';
        break;
      }
      case "02": {
        monthLabel = 'Feb';
        break;
      }
      case "03": {
        monthLabel = 'Mar';
        break;
      }
      case "04": {
        monthLabel = 'Apr';
        break;
      }
      case "05": {
        monthLabel = 'May';
        break;
      }
      case "06": {
        monthLabel = 'June';
        break;
      }
      case "07": {
        monthLabel = 'July';
        break;
      }
      case "08": {
        monthLabel = 'Aug';
        break;
      }
      case "09": {
        monthLabel = 'Sept';
        break;
      }
      case "10": {
        monthLabel = 'Oct';
        break;
      }
      case "11": {
        monthLabel = 'Nov';
        break;
      }
      case "12": {
        monthLabel = 'Dec';
        break;
      }
    }
    return date.split('-')[2] + ' ' + monthLabel;
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

// export interface ChartTypes {
//   name: string;
//   code: string;
// }

export interface DataDays {
  name: string;
  code: number;
}

export interface ChartOptions {
  showBg: boolean;
}

export class ChartData {
  "data": any[];
  "backgroundColor": string;
  "hoverBackgroundColor": string;
  "borderColor": string;
  "label": string;

  constructor() {
    this.data = [];
    this.backgroundColor = '';
    this.hoverBackgroundColor = '';
    this.borderColor = '';
    this.label = '';
  }
}
