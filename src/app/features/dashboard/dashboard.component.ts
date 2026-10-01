import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NzGridModule } from 'ng-zorro-antd/grid';
import { NzCardModule } from 'ng-zorro-antd/card';
import { NzStatisticModule } from 'ng-zorro-antd/statistic';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { NzRowModule } from 'ng-zorro-antd/grid';
import { NzColModule } from 'ng-zorro-antd/grid';
import { ChartContainerComponent } from '@shared/components/charts/chart-container.component';
import {
  DEFAULT_LINE_CHART,
  DEFAULT_BAR_CHART,
  DEFAULT_PIE_CHART,
  DEFAULT_DOUGHNUT_CHART,
  DEFAULT_RADAR_CHART,
  DEFAULT_POLAR_CHART,
  ChartConfig,
} from '@shared/components/charts/chart-types';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [
    CommonModule,
    NzGridModule,
    NzCardModule,
    NzStatisticModule,
    NzIconModule,
    NzRowModule,
    NzColModule,
    ChartContainerComponent,
  ],
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss'],
})
export class DashboardComponent implements OnInit {
  lineChartConfig: ChartConfig = DEFAULT_LINE_CHART;
  barChartConfig: ChartConfig = DEFAULT_BAR_CHART;
  pieChartConfig: ChartConfig = DEFAULT_PIE_CHART;
  doughnutChartConfig: ChartConfig = DEFAULT_DOUGHNUT_CHART;
  radarChartConfig: ChartConfig = DEFAULT_RADAR_CHART;
  polarChartConfig: ChartConfig = DEFAULT_POLAR_CHART;

  stats = [
    { label: 'Total Users', value: '12,345', icon: 'team', color: '#00d4a8' },
    { label: 'Total Revenue', value: '$45,678', icon: 'dollar', color: '#ff6b35' },
    { label: 'Active Sessions', value: '2,456', icon: 'login', color: '#2d3e63' },
    { label: 'Conversion Rate', value: '3.45%', icon: 'percentage', color: '#7c5cff' },
  ];

  ngOnInit(): void {
    this.initializeCharts();
  }

  initializeCharts(): void {
    // Charts are already initialized with default data
    // You can update them here with real data from API
  }
}
