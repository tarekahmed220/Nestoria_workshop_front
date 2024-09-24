// import { Component, signal, computed, OnInit } from '@angular/core';
// import {
//   ChartData,
//   ChartOptions,
//   ChartType,
//   ChartConfiguration,
// } from 'chart.js';
// import { BaseChartDirective } from 'ng2-charts';
// import { CommonModule } from '@angular/common';
// import { FormsModule } from '@angular/forms';
// import { BarChartComponent } from '../bar-chart/bar-chart.component';
// import { ActivatedRoute, Router } from '@angular/router';
// import { HttpClient } from '@angular/common/http';
// import { ProfileService } from '../services/profile.service';
// import { DashboardService } from '../services/dashboard.service';
// @Component({
//   selector: 'app-dashboard',
//   standalone: true,
//   imports: [CommonModule, FormsModule, BaseChartDirective, BarChartComponent],
//   templateUrl: './dashboard.component.html',
//   styleUrl: './dashboard.component.css',
// })
// export class DashboardComponent implements OnInit {
//   balance!: number;
//   allDetails!: any;
//   customers!: any;
//   constructor(
//     private route: ActivatedRoute,
//     private router: Router,
//     private _ProfileService: ProfileService,
//     private _http: HttpClient,
//     private dashboard: DashboardService
//   ) {}

//   getAllDetails(){
//     this.dashboard.getAllDetails().subscribe((details) => {
//       this.allDetails = details;
//       this.customers.set(details.customers);
//       console.log(details);
//     })
//   }
//   ngOnInit(): void {
//     this.route.queryParams.subscribe((params) => {
//       const token = params['token'];
//       if (token) {
//         localStorage.setItem('token', token);
//       } else {
//         const token = localStorage.getItem('token');
//         if (token) {
//           this.router.navigate([`/dashboard/${token}`]);
//         } else {
//           window.location.href = 'http://localhost:3000/login';
//         }
//       }
//     });

//     this._http
//       .get('http://localhost:5000/api/v1/admin/get-balance')
//       .subscribe((res: any) => {
//         this.balance = res.sellerBalance
//           .toString()
//           .replace(/\B(?=(\d{3})+(?!\d))/g, ',');
//       });

//     this.getAllDetails();
//   }

//   // section tow
//   // إعدادات الرسم البياني
//   public barChartOptions: ChartOptions<'bar'> = {
//     responsive: true,
//     plugins: {
//       tooltip: {
//         // تكوين النص الظاهر عند تمرير الماوس فوق الأعمدة
//         callbacks: {
//           label: function (context) {
//             const datasetLabel = context.dataset.label || '';
//             const data = context.raw;
//             return `${datasetLabel}: ${data}`;
//           },
//         },
//       },
//     },
//     scales: {
//       x: {},
//       y: { beginAtZero: true }, // بدء المحور y من الصفر
//     },
//   };

//   // بيانات الرسم البياني
//   public barChartData: ChartData<'bar'> = {
//     labels: ['Level 1', 'Level 2', 'Level 3', 'Level 4'],
//     datasets: [
//       { label: 'Volume', data: [79, 80, 75, 90], backgroundColor: '#72d7d2' },
//       { label: 'Service', data: [78, 81, 70, 95], backgroundColor: '#43425D' },
//     ],
//   };

//   public barChartType: ChartType | any = 'bar';

//   // بيانات المنتجات
//   products = [
//     { name: 'Home Decore Range', popularity: 78, color: '#FFC107' },
//     { name: 'Disney Princess Dress', popularity: 62, color: '#a9dfd8' },
//     { name: 'Bathroom Essentials', popularity: 51, color: '#03A9F4' },
//     { name: 'Apple Smartwatch', popularity: 29, color: '#E91E63' },
//   ];
//   //end section tow
//   //start section three

//   //end section three
//   //start section five
//   // Current page signal
//   currentPage = signal(1);

//   // Number of items per page
//   itemsPerPage = 4;

//   // Total number of customers
//   // customers = signal([
//   //   {
//   //     name: 'Alex Xavier',
//   //     email: 'alex@example.com',
//   //     phone: '(555) 123-4567',
//   //     address: '123 Elm Street, Springfield, IL',
//   //     totalSpent: 981.0,
//   //   },
//   //   {
//   //     name: 'Brian Edwards',
//   //     email: 'brian@example.com',
//   //     phone: '(555) 234-5678',
//   //     address: '456 Oak Street, Lincoln, NE',
//   //     totalSpent: 199.0,
//   //   },
//   //   {
//   //     name: 'George Oliver',
//   //     email: 'george@example.com',
//   //     phone: '(555) 345-6789',
//   //     address: '789 Maple Avenue, Madison, WI',
//   //     totalSpent: 609.0,
//   //   },
//   //   {
//   //     name: 'Isaac Neville',
//   //     email: 'isaac@example.com',
//   //     phone: '(555) 456-7890',
//   //     address: '101 Pine Road, Orlando, FL',
//   //     totalSpent: 923.0,
//   //   },
//   //   {
//   //     name: 'John Doe',
//   //     email: 'john@example.com',
//   //     phone: '(555) 555-5555',
//   //     address: '789 Broadway, NYC, NY',
//   //     totalSpent: 302.5,
//   //   },
//   //   {
//   //     name: 'Jane Smith',
//   //     email: 'jane@example.com',
//   //     phone: '(555) 222-4444',
//   //     address: '123 Sunset Blvd, LA, CA',
//   //     totalSpent: 500.0,
//   //   },
//   //   {
//   //     name: 'Isaac Neville',
//   //     email: 'isaac@example.com',
//   //     phone: '(555) 456-7890',
//   //     address: '101 Pine Road, Orlando, FL',
//   //     totalSpent: 923.0,
//   //   },
//   //   {
//   //     name: 'John Doe',
//   //     email: 'john@example.com',
//   //     phone: '(555) 555-5555',
//   //     address: '789 Broadway, NYC, NY',
//   //     totalSpent: 302.5,
//   //   },
//   //   {
//   //     name: 'Jane Smith',
//   //     email: 'jane@example.com',
//   //     phone: '(555) 222-4444',
//   //     address: '123 Sunset Blvd, LA, CA',
//   //     totalSpent: 500.0,
//   //   },
//   // ]);

//   // Calculate total number of pages
//   totalPages = computed(() =>
//     Math.ceil(this.customers().length / this.itemsPerPage)
//   );

//   // Function to get visible customers for the current page
//   visibleCustomers = computed(() => {
//     const start = (this.currentPage() - 1) * this.itemsPerPage;
//     const end = start + this.itemsPerPage;
//     return this.customers().slice(start, end);
//   });

//   // Change the current page
//   changePage(page: number) {
//     if (page >= 1 && page <= this.totalPages()) {
//       this.currentPage.set(page);
//     }
//   }

//   // Create an array for page numbers
//   getPagesArray() {
//     return Array(this.totalPages())
//       .fill(0)
//       .map((x, i) => i + 1);
//   }

//   // Function to get a random color for the profile badge
//   getColor(name: string): string {
//     const colors = ['#28a745', '#dc3545', '#17a2b8', '#ffc107'];
//     return colors[name.charCodeAt(0) % colors.length];
//   }
// }

////////////

import { Component, signal, computed, OnInit } from '@angular/core';
import { ChartData, ChartOptions, ChartType } from 'chart.js';
import { BaseChartDirective } from 'ng2-charts';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { BarChartComponent } from '../bar-chart/bar-chart.component';
import { ActivatedRoute, Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { ProfileService } from '../services/profile.service';
import { DashboardService } from '../services/dashboard.service';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, FormsModule, BaseChartDirective, BarChartComponent],
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css'],
})
export class DashboardComponent implements OnInit {
  balance!: number;
  allDetails!: any;
  allProductsLength!: number;
  customers = signal([]);
  customersA!:any;
  productsSoldLength!: number;
  currentPage = signal(1);
  itemsPerPage = 4;
  topSoldProducts!: any;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private profileService: ProfileService,
    private http: HttpClient,
    private dashboardService: DashboardService
  ) {}

  ngOnInit(): void {
    this.route.queryParams.subscribe((params) => {
      const token = params['token'] || localStorage.getItem('token');
      if (token) {
        localStorage.setItem('token', token);
        this.router.navigate([`/dashboard/${token}`]);
      } else {
        window.location.href = 'http://localhost:3000/login';
      }
    });

    this.fetchBalance();
    this.getAllDetails();
  }

  fetchBalance() {
    this.http.get('http://localhost:5000/api/v1/admin/get-balance').subscribe((res: any) => {
      this.balance = res.sellerBalance.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
    });
  }

  getAllDetails() {
    this.dashboardService.getAllDetails().subscribe((details) => {
      this.allDetails = details;
      this.allProductsLength = details.allProducts.length;
      this.customers.set(details.customers);
      this.customersA = details.customers;
      this.productsSoldLength = details.deliveredProducts.length;
      this.topSoldProducts = details.topSoldProducts;
      console.log(details);
    });
  }

  // إعدادات الرسم البياني
  public barChartOptions: ChartOptions<'bar'> = {
    responsive: true,
    plugins: {
      tooltip: {
        callbacks: {
          label: (context) => {
            const datasetLabel = context.dataset.label || '';
            const data = context.raw;
            return `${datasetLabel}: ${data}`;
          },
        },
      },
    },
    scales: {
      x: {},
      y: { beginAtZero: true },
    },
  };

  public barChartData: ChartData<'bar'> = {
    labels: ['Level 1', 'Level 2', 'Level 3', 'Level 4'],
    datasets: [
      { label: 'Volume', data: [79, 80, 75, 90], backgroundColor: '#72d7d2' },
      { label: 'Service', data: [78, 81, 70, 95], backgroundColor: '#43425D' },
    ],
  };

  public barChartType: ChartType = 'bar';

  // حساب إجمالي عدد الصفحات
  totalPages = computed(() => Math.ceil(this.customers().length / this.itemsPerPage));

  // الحصول على العملاء المرئيين للصفحة الحالية
  visibleCustomers = computed(() => {
    const start = (this.currentPage() - 1) * this.itemsPerPage;
    return this.customers().slice(start, start + this.itemsPerPage);
  });

  changePage(page: number) {
    if (page >= 1 && page <= this.totalPages()) {
      this.currentPage.set(page);
    }
  }

  getPagesArray() {
    return Array(this.totalPages()).fill(0).map((x, i) => i + 1);
  }

  getColor(name: string): string {
    const colors = ['#28a745', '#dc3545', '#17a2b8', '#ffc107'];
    return colors[name.charCodeAt(0) % colors.length];
  }

    // بيانات المنتجات
  products = [
    { name: 'Home Decore Range', popularity: 78, color: '#FFC107' },
    { name: 'Disney Princess Dress', popularity: 62, color: '#a9dfd8' },
    { name: 'Bathroom Essentials', popularity: 51, color: '#03A9F4' },
    { name: 'Apple Smartwatch', popularity: 29, color: '#E91E63' },
  ];
}
