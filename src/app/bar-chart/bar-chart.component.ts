import { Component } from '@angular/core';
import { ChartConfiguration, ChartOptions, ChartType } from 'chart.js';
import { BaseChartDirective } from 'ng2-charts';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Chart } from 'chart.js/auto';

@Component({
  selector: 'app-bar-chart',
  standalone: true,
  imports: [CommonModule, FormsModule, BaseChartDirective],
  templateUrl: './bar-chart.component.html',
  styleUrl: './bar-chart.component.css',
})
export class BarChartComponent {
  // إعدادات البيانات المستخدمة في الرسم البياني
  public barChartData: ChartConfiguration<'bar'>['data'] = {
    labels: ['Level 1', 'Level 2', 'Level 3', 'Level 4', 'Level 5'],
    datasets: [
      {
        label: 'Volume',
        data: [79, 65, 48, 54, 70],
        backgroundColor: 'rgba(72, 207, 173, 0.8)',
        hoverBackgroundColor: 'rgba(72, 207, 173, 1)',
      },
      {
        label: 'Service',
        data: [78, 55, 60, 40, 65],
        backgroundColor: 'rgba(54, 162, 235, 0.8)',
        hoverBackgroundColor: 'rgba(54, 162, 235, 1)',
      },
    ],
  };

  // إعدادات الرسم البياني
  public barChartOptions: ChartOptions<'bar'> = {
    responsive: true,
    plugins: {
      tooltip: {
        callbacks: {
          label: function (context) {
            // إظهار بيانات العمود عند التحويم
            return `${context.dataset.label}: ${context.raw}`;
          },
        },
      },
    },
  };

  public barChartType: ChartType | any = 'bar';
}
