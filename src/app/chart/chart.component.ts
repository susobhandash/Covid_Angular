import { Component, Input, OnInit, ViewChild, OnChanges, SimpleChanges } from '@angular/core';
// import { ChartDataSets, ChartOptions, ChartType, Chart } from 'chart.js';
// import { Label } from 'ng2-charts';
// import { BaseChartDirective } from 'ng2-charts';

@Component({
  selector: 'app-chart',
  templateUrl: './chart.component.html',
  styleUrls: ['./chart.component.scss']
})
export class ChartComponent implements OnChanges, OnInit {

  constructor() { }

  @Input('chartType') chartType;
  @Input('chartLabels') chartLabels;
  @Input('chartOptions') chartOptions;
  @Input('chartData') chartData;
  @Input('showLegend') showLegend;

  // @ViewChild(BaseChartDirective) chart: BaseChartDirective;
  barDataToRender = [];
  points = '';
  showAnimation = true;
  windowWidth = document.documentElement.clientWidth;
  svgWidth = 0;

  ngOnChanges(changes: SimpleChanges) {
    this.showAnimation = false;
    this.chartOptions = this.chartOptions ? Object.assign(this.chartOptions) : {};
    this.mapData();
  }

  ngOnInit(): void {
  }

  mapData() {
    this.points = ''
    this.barDataToRender = [];
    this.showAnimation = false;

    if (this.chartData && this.chartData.data && this.chartData.data.length > 0) {
      let labels = this.chartLabels.slice().reverse();
      let data = this.chartData.data.slice().reverse();
      let biggestElem = data.sort(function(a, b){return b-a})[0];
      data = this.chartData.data.slice().reverse();
      data.forEach((el, i, a) => {
        if (el) {
          this.barDataToRender.push(
            {
              data: parseInt((el / (biggestElem/100)).toFixed()),
              actualData: el,
              label: labels[i],
              color: this.chartData.backgroundColor,
              bgColor: this.chartData.hoverBackgroundColor,
              activeColor: this.chartData.borderColor
            }
          );

          this.points = this.points + ((i * 35)+35) + ', ' + (130 - parseInt((el / (biggestElem/100)).toFixed())) + (i === (data.length-1) ? '' : ',');
        } else {
          this.barDataToRender.push(
            {
              data: 0,
              actualData: 0,
              label: 'NA',
              color: this.chartData.backgroundColor,
              bgColor: this.chartData.hoverBackgroundColor,
              activeColor: this.chartData.borderColor
            }
          );

          this.points = this.points + ((i * 35)+35) + ', ' + (100 - 0) + (i === (data.length-1) ? '' : ',');
        }
      });

      setTimeout(() => {
        this.showAnimation = true;
      }, 100);
    }
  }

  getTranslateValue(idx) {
    return 'translate(' + (idx * (35)) + ',0)';
  }

  RGBAToHexA(rgba) {
    let sep = rgba.indexOf(",") > -1 ? "," : " ";
    rgba = rgba.substr(5).split(")")[0].split(sep);

    if (rgba.indexOf("/") > -1)
      rgba.splice(3, 1);

    for (let R in rgba) {
      let r = rgba[parseInt(R)];
      if (r.indexOf("%") > -1) {
        let p = r.substr(0, r.length - 1) / 100;

        if (parseInt(R) < 3) {
          rgba[R] = Math.round(p * 255);
        } else {
          rgba[R] = p;
        }
      }
    }

    let r = (+rgba[0]).toString(16),
      g = (+rgba[1]).toString(16),
      b = (+rgba[2]).toString(16),
      a = Math.round(+rgba[3] * 255).toString(16);

    if (r.length == 1)
      r = "0" + r;
    if (g.length == 1)
      g = "0" + g;
    if (b.length == 1)
      b = "0" + b;
    if (a.length == 1)
      a = "0" + a;

    return "#" + r + g + b + a;
  }

}
