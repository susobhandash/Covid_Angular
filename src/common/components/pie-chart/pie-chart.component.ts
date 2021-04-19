import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-pie-chart',
  templateUrl: './pie-chart.component.html',
  styleUrls: ['./pie-chart.component.scss']
})
export class PieChartComponent implements OnInit {

  @Input('total') total:number;
  @Input('prop') prop:number;
  @Input('color') color:string;
  strokeColor = '';
  state = '';

  constructor() { }

  ngOnInit(): void {
    if (this.color === 'active') {
      this.strokeColor = 'rgba(0, 123, 255, 1)';
      this.state = 'Active';
    } else if (this.color === 'recovered') {
      this.strokeColor = 'rgba(75, 192, 192, 1)';
      this.state = 'Recovered';
    } else if (this.color === 'deceased') {
      this.strokeColor = 'rgba(173, 173, 175, 1)';
      this.state = 'Deceased';
    }
  }

  getStrkDashArray() {
    // console.log(this.prop);
    let param1 = ((this.prop * 31.4)/this.total);
    return param1 +" "+ 31.4;
  }

  getTooltipValue() {
    return this.state + ': ' + Math.round((this.prop/this.total)*100) + ' %';
  }

}
