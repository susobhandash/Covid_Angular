import { Component, Input, OnInit } from '@angular/core';
import { ChartDataSets, ChartOptions, ChartType } from 'chart.js';
import { Label } from 'ng2-charts';

@Component({
  selector: 'app-chart',
  templateUrl: './chart.component.html',
  styleUrls: ['./chart.component.scss']
})
export class ChartComponent implements OnInit {

  constructor() { }

  @Input('chartType') chartType;
  @Input('chartLabels') chartLabels;
  @Input('chartOptions') chartOptions;
  @Input('chartData') chartData;
  @Input('showLegend') showLegend;
  // chartType: ChartType;
  // chartLabels: Label[] = [];
  // chartOptions: ChartOptions;
  // chartData: ChartDataSets[];
  // showLegend: true;

  ngOnInit(): void {
  }



}
