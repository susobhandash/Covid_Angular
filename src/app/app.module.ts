import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule }   from '@angular/forms';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { HttpClientModule } from '@angular/common/http';

// Chart
// import { ChartsModule } from 'ng2-charts';

// Material
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatListModule } from '@angular/material/list';
import { MatSortModule } from '@angular/material/sort';
import { MatTableModule } from '@angular/material/table';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatTooltipModule } from '@angular/material/tooltip';


import { CovidDataService } from '../services/covid-data.service';
import { CountryDataComponent } from '../components/country-data/country-data.component';
import { StateDataComponent } from '../components/state-data/state-data.component';
import { CommaSeparatorPipe } from '../common/pipes/comma-separator.pipe';
import { PieChartComponent } from '../common/components/pie-chart/pie-chart.component';
import { ChartComponent } from '../common/components/chart/chart.component';

import { ChartsModule } from 'ng2-charts';

@NgModule({
  declarations: [
    AppComponent,
    CountryDataComponent,
    StateDataComponent,
    CommaSeparatorPipe,
    ChartComponent,
    PieChartComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FormsModule,
    BrowserAnimationsModule,
    HttpClientModule,
    MatSidenavModule,
    MatButtonModule,
    MatTableModule,
    MatIconModule,
    MatToolbarModule,
    MatListModule,
    MatFormFieldModule,
    MatInputModule,
    MatSortModule,
    MatSelectModule,
    MatTooltipModule,
    ChartsModule
  ],
  providers: [CovidDataService],
  bootstrap: [AppComponent]
})
export class AppModule { }
