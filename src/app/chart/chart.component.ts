import { Component, Input, OnInit, ViewChild, OnChanges, SimpleChanges } from '@angular/core';
import { ChartDataSets, ChartOptions, ChartType, Chart } from 'chart.js';
import { Label } from 'ng2-charts';
import { BaseChartDirective } from 'ng2-charts';

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

  @ViewChild(BaseChartDirective) chart: BaseChartDirective;
  // chartType: ChartType;
  // chartLabels: Label[] = [];
  // chartOptions: ChartOptions;
  // chartData: ChartDataSets[];
  // showLegend: true;

  ngOnChanges(changes: SimpleChanges) {
    this.chartOptions = Object.assign(this.chartOptions);
    // this.chart.chart.update();
    console.log(changes);
    console.log(this.chartOptions.scales.yAxes[0].ticks.beginAtZero);
  }

  ngOnInit(): void {
  }



}
