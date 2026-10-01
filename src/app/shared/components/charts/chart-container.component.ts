import { Component, Input, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BaseChartDirective, NgChartsModule } from 'ng2-charts';
import { Chart, ChartOptions, ChartData } from 'chart.js';
import { ChartConfig } from './chart-types';

@Component({
  selector: 'app-chart-container',
  standalone: true,
  imports: [CommonModule, NgChartsModule],
  templateUrl: './chart-container.component.html',
  styleUrls: ['./chart-container.component.scss'],
})
export class ChartContainerComponent {
  @Input() config!: ChartConfig;
  @Input() title?: string;
  @Input() height = '400px';
  @ViewChild(BaseChartDirective) chart?: BaseChartDirective;

  chartType: any;
  chartData: ChartData<any> = { labels: [], datasets: [] };
  chartOptions: ChartOptions<any> = {};

  ngOnInit(): void {
    this.initializeChart();
  }

  ngOnChanges(): void {
    if (this.config) {
      this.initializeChart();
    }
  }

  initializeChart(): void {
    if (!this.config) return;

    this.chartType = this.config.type;
    this.chartData = {
      labels: this.config.labels || [],
      datasets: this.config.data.map(dataset => ({
        label: dataset.label,
        data: dataset.data,
        borderColor: dataset.borderColor,
        backgroundColor: dataset.backgroundColor,
        borderWidth: dataset.borderWidth,
        fill: dataset.fill,
        tension: dataset.tension,
        radius: dataset.radius,
      })),
    };

    this.chartOptions = this.getDefaultOptions();
  }

  getDefaultOptions(): ChartOptions<any> {
    return {
      responsive: true,
      maintainAspectRatio: true,
      plugins: {
        legend: {
          display: true,
          position: 'bottom',
          labels: {
            font: {
              family: "'Segoe UI', Roboto, 'Helvetica Neue', sans-serif",
              size: 12,
            },
            padding: 15,
            usePointStyle: true,
          },
        },
        title: {
          display: !!this.title,
          text: this.title,
          font: {
            size: 16,
            weight: '600' as any,
          },
          padding: 15,
        },
        tooltip: {
          backgroundColor: 'rgba(0, 0, 0, 0.8)',
          titleFont: { size: 12 },
          bodyFont: { size: 12 },
          padding: 12,
          cornerRadius: 6,
          displayColors: true,
          borderColor: 'rgba(0, 0, 0, 0.1)',
          borderWidth: 1,
        },
      },
      scales:
        this.config.type === 'pie' ||
        this.config.type === 'doughnut' ||
        this.config.type === 'polar'
          ? {}
          : {
              y: {
                beginAtZero: true,
                grid: {
                  color: 'rgba(0, 0, 0, 0.05)',
                },
              },
              x: {
                grid: {
                  display: false,
                },
              },
            },
    };
  }

  updateChart(): void {
    if (this.chart?.chart) {
      this.chart.chart.update();
    }
  }
}
