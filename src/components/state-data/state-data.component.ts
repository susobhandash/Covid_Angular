import { Component, OnInit, ViewChild } from '@angular/core';
import { CovidDataService } from '../../services/covid-data.service';
import { ActivatedRoute, Router } from '@angular/router';
import { Location } from '@angular/common';
import { ChartDataSets, ChartOptions, Chart } from 'chart.js';
import { Color, Label, BaseChartDirective } from 'ng2-charts';

@Component({
  selector: 'app-state-data',
  templateUrl: './state-data.component.html',
  styleUrls: ['./state-data.component.scss']
})
export class StateDataComponent implements OnInit {

  windowWdt = 0;

  // Dropdown Arrays
  states: States[] = [];
  dataFields: DataFields[] = [];
  chartType: string = 'bar';
  dataDays: DataDays[] = [];
  stateDistData: any;

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
  totalTested = 0;
  deltaTested = 0;

  // Others
  date = '';
  dates = [];
  totalData = {};

  // public LocalChartOptions: LocalChartOptions;
  public chartOptions: LocalChartOptions = {
    showBg: true
  };
  public chartLabels: Label[] = [];
  public chartLegend = true;
  public chartData: ChartData = new ChartData();

  // Delta Data
  public selectedDelta = 'delta-confirmed';
  public deltaChartOptions: LocalChartOptions = {
    showBg: true
  }
  public deltaChartData: ChartData = new ChartData();
  public deltaChartLabels: Label[] = [];

  // Delta7 Data
  public selectedDelta7 = 'delta7-confirmed';
  public delta7ChartOptions: LocalChartOptions = {
    showBg: true
  }
  public delta7ChartData: ChartData = new ChartData();
  public delta7ChartLabels: Label[] = [];

  // Total Data
  public selectedTotal = 'total-confirmed';
  public totalChartOptions: LocalChartOptions = {
    showBg: true
  }
  public totalChartData: ChartData = new ChartData();
  public totalChartLabels: Label[] = [];

  // Monthly Data
  monthlyChartDetails = {};
  public monthlyChartOptions: LocalChartOptions = {
    showBg: true
  }
  public monthlyChartData: ChartDataSets[] = [{
    data: [],
    label: 'Monthly Data',
    borderWidth: 1
  }];

  // Compare Data
  public monthlyCompareChartData: ChartDataSets[] = [{
    data: [],
    label: 'Monthly Compare Data',
    borderWidth: 1
  }];
  public weeklyCompareChartData: ChartDataSets[] = [{
    data: [],
    label: 'Weekly Data',
    borderWidth: 1
  }];
  public dailyCompareChartData: ChartDataSets[] = [{
    data: [],
    label: 'Daily Data',
    borderWidth: 1
  }];
  public monthlyChartLabels: Label[] = [];
  public weeklyCompareChartLabels: Label[] = [];
  public dailyCompareChartLabels: Label[] = [];
  public multiLineChartColors: Color[] = [
    {
      borderColor: 'black',
      backgroundColor: 'rgba(255,0,0,0.3)',
    },
    {
      borderColor: 'black',
      backgroundColor: 'rgba(255,0,0,0.3)',
    },
    {
      borderColor: 'black',
      backgroundColor: 'rgba(255,0,0,0.3)',
    },
    {
      borderColor: 'black',
      backgroundColor: 'rgba(255,0,0,0.3)',
    },
    {
      borderColor: 'black',
      backgroundColor: 'rgba(255,0,0,0.3)',
    }
  ];
  public compareLineChartOptions = {
    responsive: false,
    maintainAspectRatio: false,
    backgroundColor: '',
    legend: {
      display: false
    },
    elements: {
      point: {
        radius: 2
      }
    },
    scales: {
      xAxes: [{
        gridLines: {
          display: false,
        },
        ticks: {
          fontColor: '#b0bec5'
        }
      }],
      yAxes: [{
        gridLines: {
          display: false,
        },
        ticks: {
          fontColor: '#b0bec5',
          beginAtZero: true
        }
      }]
    }
  }

  // Line Chart Options
  public lineChartBgColor = '';
  public lineChartTextColor = '';
  public lineChartColors: Color[] = [
    {
      borderColor: 'black',
      backgroundColor: 'rgba(255,0,0,0.3)',
    },
  ];

  public lineChartOptions = {
    responsive: true,
    backgroundColor: '',
    legend: {
      display: false
    },
    elements: {
      point: {
        radius: 2
      }
    },
    scales: {
      xAxes: [{
        gridLines: {
          display: false,
        },
        ticks: {
          fontColor: ''
        }
      }],
      yAxes: [{
        gridLines: {
          display: false,
        },
        ticks: {
          fontColor: ''
        }
      }]
    }
  }


  @ViewChild(BaseChartDirective) private Chart: BaseChartDirective;

  constructor(private data: CovidDataService, private activatedroute: ActivatedRoute, private router: Router, private location: Location) {
    if (document.documentElement.clientWidth > 499) {
      this.windowWdt = 550;
    } else {
      this.windowWdt = 360;
    }
  }

  ngOnInit(): void {
    this.getStatesList();
    this.getStateDate();

    this.selectedState = this.location.getState()['state'] ? this.location.getState()['state'] : 'MH';

    // Date Dropdown value Init
    this.dataFields = [
      { name: 'Daily Confirmed', code: 'delta-confirmed' },
      { name: 'Daily Deceased', code: 'delta-deceased' },
      { name: 'Daily Recovered', code: 'delta-recovered' },
      { name: 'Daily Active', code: 'delta-active' },
      { name: 'Daily Tested', code: 'delta-tested' },
      { name: 'Daily Vaccinated', code: 'delta-vaccinated' },
      { name: 'Weekly Delta Confirmed', code: 'delta7-confirmed' },
      { name: 'Weekly Delta Deceased', code: 'delta7-deceased' },
      { name: 'Weekly Delta Recovered', code: 'delta7-recovered' },
      { name: 'Weekly Delta Active', code: 'delta7-active' },
      { name: 'Weekly Delta Tested', code: 'delta7-tested' },
      { name: 'Weekly Delta Vaccinated', code: 'delta7-vaccinated' },
      { name: 'Total Confirmed', code: 'total-confirmed' },
      { name: 'Total Delta Deceased', code: 'total-deceased' },
      { name: 'Total Delta Recovered', code: 'total-recovered' },
      { name: 'Total Delta Active', code: 'total-active' },
      { name: 'Total Delta Tested', code: 'total-tested' },
      { name: 'Total Delta Vaccinated', code: 'total-vaccinated' },
    ];
    this.selectedDataFields[0] = this.dataFields[0].code;

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
      let distInfo = selectedStateInfo && selectedStateInfo.length > 0 ? statesData[selectedStateInfo[0]] : statesData['State Unassigned'];
      this.processDistData(distInfo);
      this.getTimeSeriesData();
    }, err => {
      console.log(err);
    });
  }

  processDistData(distInfo) {
    this.stateDistData = [];
    let districts = Object.keys(distInfo['districtData']);
    let districtData = [];
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
    let param = this.selectedDelta.split('-')[1];
    districtData = this.stateDistData.slice(0);
    districtData.sort(function (a, b) {
      return b[param] - a[param];
    });

    this.stateDistData = [...districtData];
    if (this.Chart)
      this.Chart.update();
  }

  // Get all States Data by Time Series
  getTimeSeriesData() {
    this.data.getTimeSeriesData().subscribe(res => {
      if (res) {
        this.totalData = res;
        this.getStateData(res);
      }
    }, err => {
      console.log(err);
    });
  }

  // Monthly cumulatve data
  getMonthlyData(res) {
    let data = res['dates'];
    let datesArr = Object.keys(data);
    let cumulativeData = {};
    datesArr.forEach(dt => {
      let year = dt.split('-')[0];
      let month = dt.split('-')[1];
      let date = dt.split('-')[2];

      if (cumulativeData[year + '-' + month] && cumulativeData[year + '-' + month]['confirmed']) {
        cumulativeData[year + '-' + month]['confirmed'].push((res['dates'][dt]['delta'] && res['dates'][dt]['delta']['confirmed'] ? res['dates'][dt]['delta']['confirmed'] : 0))
      } else {
        cumulativeData[year + '-' + month] = {
          'confirmed': [(res['dates'][dt]['delta'] && res['dates'][dt]['delta']['confirmed'] ? res['dates'][dt]['delta']['confirmed'] : 0)]
        };
      }

      if (cumulativeData[year + '-' + month] && cumulativeData[year + '-' + month]['deceased']) {
        cumulativeData[year + '-' + month]['deceased'].push((res['dates'][dt]['delta'] && res['dates'][dt]['delta']['deceased'] ? res['dates'][dt]['delta']['deceased'] : 0))
      } else {
        cumulativeData[year + '-' + month]['deceased'] = [(res['dates'][dt]['delta'] && res['dates'][dt]['delta']['deceased'] ? res['dates'][dt]['delta']['deceased'] : 0)];
      }

      if (cumulativeData[year + '-' + month] && cumulativeData[year + '-' + month]['recovered']) {
        cumulativeData[year + '-' + month]['recovered'].push((res['dates'][dt]['delta'] && res['dates'][dt]['delta']['recovered'] ? res['dates'][dt]['delta']['recovered'] : 0))
      } else {
        cumulativeData[year + '-' + month]['recovered'] = [(res['dates'][dt]['delta'] && res['dates'][dt]['delta']['recovered'] ? res['dates'][dt]['delta']['recovered'] : 0)];
      }

      if (cumulativeData[year + '-' + month] && cumulativeData[year + '-' + month]['tested']) {
        cumulativeData[year + '-' + month]['tested'].push((res['dates'][dt]['delta'] && res['dates'][dt]['delta']['tested'] ? res['dates'][dt]['delta']['tested'] : 0))
      } else {
        cumulativeData[year + '-' + month]['tested'] = [(res['dates'][dt]['delta'] && res['dates'][dt]['delta']['tested'] ? res['dates'][dt]['delta']['tested'] : 0)];
      }

      if (cumulativeData[year + '-' + month] && cumulativeData[year + '-' + month]['vaccinated']) {
        cumulativeData[year + '-' + month]['vaccinated'].push((res['dates'][dt]['delta'] && res['dates'][dt]['delta']['vaccinated'] ? res['dates'][dt]['delta']['vaccinated'] : 0))
      } else {
        cumulativeData[year + '-' + month]['vaccinated'] = [(res['dates'][dt]['delta'] && res['dates'][dt]['delta']['vaccinated'] ? res['dates'][dt]['delta']['vaccinated'] : 0)];
      }
    });

    this.getMonthlyChartData(cumulativeData);
  }

  getMonthlyChartData(cumulativeData) {
    let keys = Object.keys(cumulativeData);
    this.monthlyChartDetails = {};

    keys.forEach(dt => {
      this.monthlyChartDetails[dt] = {};
      this.monthlyChartDetails[dt].confirmed = cumulativeData[dt]['confirmed'].reduce((a, b) => a + b, 0);
      this.monthlyChartDetails[dt].deceased = cumulativeData[dt]['deceased'].reduce((a, b) => a + b, 0);
      this.monthlyChartDetails[dt].recovered = cumulativeData[dt]['recovered'].reduce((a, b) => a + b, 0);
      this.monthlyChartDetails[dt].vaccinated = cumulativeData[dt]['vaccinated'].reduce((a, b) => a + b, 0);
      this.monthlyChartDetails[dt].tested = cumulativeData[dt]['tested'].reduce((a, b) => a + b, 0);
      this.monthlyChartDetails[dt].active = (this.monthlyChartDetails[dt].confirmed ? this.monthlyChartDetails[dt].confirmed : 0) -
        (this.monthlyChartDetails[dt].recovered ? this.monthlyChartDetails[dt].recovered : 0) -
        (this.monthlyChartDetails[dt].deceased ? this.monthlyChartDetails[dt].deceased : 0);
    });

    this.assignMetMonthlyData();
  }

  // Get Selected State data for last 7 days for Selected State
  getStateData(data) {
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

    this.getMonthlyData(data[this.selectedState]);
  }

  assignMetMonthlyData() {
    this.monthlyChartData[0].data = [];
    this.monthlyCompareChartData[0].data = [];
    this.monthlyChartLabels = [];
    let monthlyKeys = Object.keys(this.monthlyChartDetails);

    monthlyKeys.forEach(mnth => {
      this.monthlyChartLabels.push(this.getFormattedDate(mnth, true));
      this.monthlyChartData[0].data.push(this.monthlyChartDetails[mnth][this.selectedDelta.split('-')[1]]);
    });

    this.getCompareChartData(monthlyKeys);
    // console.log(this.selectedDelta);
  }

  getCompareChartData(monthlyKeys) {
    let params = [
      { 'field': 'tested', color: 'rgba(153, 102, 255, 1)' },
      { 'field': 'vaccinated', color: 'rgba(255,193,7, 1)' }
    ];

    if (this.selectedDelta.split('-')[1] !== 'tested' && this.selectedDelta.split('-')[1] !== 'vaccinated') {
      params.unshift({ 'field': this.selectedDelta.split('-')[1], color: this.totalChartData.borderColor });

      params.forEach((prm, idx) => {
        this.multiLineChartColors[idx].borderColor = prm.color;
        this.multiLineChartColors[idx].backgroundColor = 'transparent';
        monthlyKeys.forEach(mnth => {
          if (this.monthlyCompareChartData[idx]) {
            this.monthlyCompareChartData[idx].data.push(this.monthlyChartDetails[mnth][prm.field]);
          } else {
            this.monthlyCompareChartData.push({
              data: [],
              label: prm.field + ' Data',
              borderWidth: 1
            });
            this.monthlyCompareChartData[idx].data.push(this.monthlyChartDetails[mnth][prm.field]);
          }
        });
      });
    }
    // console.log(this.monthlyCompareChartData);
  }

  getDeltaCompareChartData(compareChartData, dataParam, field, currentDayData) {
    let params = [
      { 'field': 'tested', color: 'rgba(153, 102, 255, 1)' },
      { 'field': 'vaccinated', color: 'rgba(255,193,7, 1)' }
    ];

    if (field === 'delta') {
      this.dailyCompareChartData = [];
      this.dailyCompareChartLabels = [];
    }

    if (field === 'delta7') {
      this.weeklyCompareChartData = [];
      this.weeklyCompareChartLabels = [];
    }

    currentDayData.forEach(date => {
      if (field === 'delta') {
        this.dailyCompareChartLabels.push(date);
      }

      if (field === 'delta7') {
        this.weeklyCompareChartLabels.push(date);
      }
    });

    if (dataParam !== 'tested' && dataParam !== 'vaccinated') {
      params.unshift({ 'field': dataParam, color: this.totalChartData.borderColor });
    }

    params.forEach((prm, idx) => {
      this.multiLineChartColors[idx].borderColor = prm.color;
      this.multiLineChartColors[idx].backgroundColor = 'transparent';
      compareChartData.forEach(mnth => {
        if (field === 'delta') {
          if (prm.field === 'active') {
            mnth[prm.field] = (mnth['confirmed'] ? mnth['confirmed'] : 0) - (mnth['deceased'] ? mnth['deceased'] : 0) - (mnth['recovered'] ? mnth['recovered'] : 0) - (mnth['other'] ? mnth['other'] : 0);
          }
          if (this.dailyCompareChartData[idx]) {
            this.dailyCompareChartData[idx].data.push(mnth[prm.field]);
          } else {
            this.dailyCompareChartData.push({
              data: [],
              label: 'Daily ' + prm.field + ' Data',
              borderWidth: 1
            });
            this.dailyCompareChartData[idx].data.push(mnth[prm.field]);
          }
        } else if (field === 'delta7') {
          if (prm.field === 'active') {
            mnth[prm.field] = (mnth['confirmed'] ? mnth['confirmed'] : 0) - (mnth['deceased'] ? mnth['deceased'] : 0) - (mnth['recovered'] ? mnth['recovered'] : 0) - (mnth['other'] ? mnth['other'] : 0);
          }
          if (this.weeklyCompareChartData[idx]) {
            this.weeklyCompareChartData[idx].data.push(mnth[prm.field]);
          } else {
            this.weeklyCompareChartData.push({
              data: [],
              label: 'Weekly ' + prm.field + ' Data',
              borderWidth: 1
            });
            this.weeklyCompareChartData[idx].data.push(mnth[prm.field]);
          }
        }

      });
    });

    // console.log(this.dailyCompareChartData);
    console.log(this.weeklyCompareChartData);
  }

  creteChartData(dataFields) {
    let field = dataFields.split('-')[0];
    let dataParam = dataFields.split('-')[1];
    let compareDates = [];

    const data = this.totalData[this.selectedState]['dates'];
    const dates = Object.keys(this.totalData[this.selectedState].dates);

    let currentDayData = data[dates[dates.length - 1]];

    this.deltaConfirmed = currentDayData.delta && currentDayData.delta.confirmed ? currentDayData.delta.confirmed : 0;
    this.deltaRecovered = currentDayData.delta && currentDayData.delta.recovered ? currentDayData.delta.recovered : 0;
    this.deltaDeceased = currentDayData.delta && currentDayData.delta.deceased ? currentDayData.delta.deceased : 0;

    let deltaOther = currentDayData.delta && currentDayData.delta.other ? currentDayData.delta.other : 0
    this.deltaActive = this.deltaConfirmed - this.deltaRecovered - this.deltaDeceased - deltaOther;
    this.deltaTested = currentDayData.delta && currentDayData.delta.tested ? currentDayData.delta.tested : 0;

    this.totalConfirmed = currentDayData.total.confirmed;
    this.totalTested = currentDayData.total.tested;
    this.totalRecovered = currentDayData.total.recovered;
    this.totalDeceased = currentDayData.total.deceased;
    this.totalVaccinated = currentDayData.total.vaccinated;
    this.totalActive = currentDayData.total.confirmed - currentDayData.total.recovered - currentDayData.total.deceased - (currentDayData.total.other ? currentDayData.total.other : 0);

    this.selectedDataDays = field === 'total' ? 30 : 7;

    let compareChartData = [];

    for (let i = 0; i < this.selectedDataDays; i++) {
      let dataToPush;
      let selectedData = data[Object.keys(data)[Object.keys(data).length - (i + 2)]][field];
      if (dataParam !== 'active') {
        dataToPush = selectedData[dataParam] ? selectedData[dataParam] : 0;
      } else {
        let confirmedStats = selectedData['confirmed'] ? selectedData['confirmed'] : 0;
        let recoveredStats = selectedData['recovered'] ? selectedData['recovered'] : 0;
        let deceasedStats = selectedData['deceased'] ? selectedData['deceased'] : 0;

        dataToPush = confirmedStats - recoveredStats - deceasedStats;
      }

      compareDates.push(this.getFormattedDate(dates[dates.length - (i + 1)]));

      if (field === 'delta') {
        this.deltaChartData.data.push(dataToPush);
        this.deltaChartLabels.push(this.getFormattedDate(dates[dates.length - (i + 1)]));
      } else if (field === 'delta7') {
        this.delta7ChartData.data.push(dataToPush);
        this.delta7ChartLabels.push(this.getFormattedDate(dates[dates.length - (i + 1) - (i * 6)]));
      } else if (field === 'total') {
        this.totalChartData.data.push(dataToPush);
        this.totalChartLabels.push(this.getFormattedDate(dates[dates.length - (i + 1)]));
      } else {
        this.chartData.data.push(dataToPush);
        this.chartLabels.push(this.getFormattedDate(dates[dates.length - (i + 1)]));
      }

      compareChartData.push(selectedData);

      this.getChartProps(field, dataParam);
    }

    this.getDeltaCompareChartData(compareChartData, dataParam, field, compareDates);

    let label = this.dataFields.filter(el => {
      return el.code === dataFields;
    });

    if (field === 'delta') {
      this.deltaChartData.label = label && label.length > 0 ? label[0].name : '';
    } else if (field === 'delta7') {
      this.delta7ChartData.label = label[0]['name'];
    } else if (field === 'total') {
      this.totalChartData.label = label && label.length > 0 ? label[0].name : '';
    } else {
      this.chartType = 'line';
      this.chartData.label = label && label.length > 0 ? label[0].name : '';
    }

    this.deltaChartData = Object.assign(this.deltaChartData);
    this.delta7ChartData = Object.assign(this.delta7ChartData);

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
        bgColor = 'rgba(255, 99, 132, .1)';
        borderColor = 'rgba(255, 99, 132, 1)';
        hoverBgColor = 'rgba(255, 99, 132, .5)';
        break;

      case 'recovered':
        bgColor = 'rgba(75, 192, 192, .1)';
        borderColor = 'rgba(75, 192, 192, 1)';
        hoverBgColor = 'rgba(75, 192, 192, .5)';
        break;

      case 'deceased':
        bgColor = 'rgba(201, 203, 207, .1)';
        borderColor = 'rgba(201, 203, 207, 1)';
        hoverBgColor = 'rgba(201, 203, 207, .5)';
        break;

      case 'tested':
        bgColor = 'rgba(153, 102, 255, .1)';
        borderColor = 'rgba(153, 102, 255, 1)';
        hoverBgColor = 'rgba(153, 102, 255, .5)';
        break;

      case 'vaccinated':
        bgColor = 'rgba(255,193,7, .1)';
        borderColor = 'rgba(255,193,7, 1)';
        hoverBgColor = 'rgba(255,193,7, .5)';
        break;

      case 'active':
        bgColor = 'rgba(0, 123, 255, .1)';
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

    this.lineChartColors[0].borderColor = borderColor;
    this.lineChartColors[0].backgroundColor = hoverBgColor;
    this.lineChartBgColor = bgColor;
    this.lineChartTextColor = borderColor;
    this.lineChartOptions.scales.xAxes[0].ticks.fontColor = borderColor;
    this.lineChartOptions.scales.yAxes[0].ticks.fontColor = borderColor;
    this.lineChartOptions = Object.assign(this.lineChartOptions);

    this.chartData.backgroundColor = bgColor;
    this.chartData.borderColor = borderColor;
    this.chartData.hoverBackgroundColor = hoverBgColor;
  }

  getFormattedDate(date, datePresent = false) {
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
    return !datePresent ? date.split('-')[2] + ' ' + monthLabel : monthLabel + '-' + date.split('-')[0].substr(2, 4);
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

export interface DataDays {
  name: string;
  code: number;
}

export interface LocalChartOptions {
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
