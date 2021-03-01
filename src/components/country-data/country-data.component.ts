import { Component, OnInit, ViewChild } from '@angular/core';
import { CovidDataService } from '../../services/covid-data.service';
import { MatTableDataSource } from '@angular/material/table';
import { MatSort } from '@angular/material/sort';

@Component({
  selector: 'app-country-data',
  templateUrl: './country-data.component.html',
  styleUrls: ['./country-data.component.scss']
})
export class CountryDataComponent implements OnInit {

  tableData: CovidDailyData[] = [];
  displayedColumns: string[] = ['state', 'active', 'confirmed', 'deaths', 'recovered'];
  dataSource: MatTableDataSource<CovidDailyData>;
  bottomRow: CovidDailyData;

  @ViewChild(MatSort) sort: MatSort;

  constructor(private data: CovidDataService) { }

  ngOnInit(): void {
    this.data.getCountryDataByStates().subscribe(res => {
      console.log(res);
      if (res && res['statewise'] && res['statewise'].length > 0) {
        const result = Object.assign(res);
        this.bottomRow = result['statewise'].shift();
        this.tableData = result['statewise'];
        this.dataSource = new MatTableDataSource(this.tableData);
        this.dataSource.sort = this.sort;
      }
    }, err => {
      console.log(err);
    });
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }

  convertToEngIndFormat(num) {
    const number = parseInt(num);
    // console.log(num.toLocaleString('en-IN'));
    return number.toLocaleString('en-IN');
  }

}

export interface CovidDailyData {
  state: string;
  active: number;
  confirmed: number;
  deaths: number;
  recovered: number;
  deltaconfirmed: number;
  deltadeaths: number;
  deltarecovered: number;
}