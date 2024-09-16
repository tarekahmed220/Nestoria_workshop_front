import { Routes } from '@angular/router';
import { DashboardComponent } from './dashboard/dashboard.component';
import { LayoutComponent } from './layout/layout.component';
import { OrdersComponent } from './orders/orders.component';
import { ProductsComponent } from './products/products.component';
import { ProfileComponent } from './profile/profile.component';
import { ChatComponent } from './chat/chat.component';
import { PagenotfoundComponent } from './pagenotfound/pagenotfound.component';
import { WorkshopProfileComponent } from './work-shop-profile/work-shop-profile.component';

export const routes: Routes = [
  {
    path: '',
    component: LayoutComponent,
    children: [
      { path: 'dashboard', component: DashboardComponent },
      { path: 'orders', component: OrdersComponent },
      { path: 'products', component: ProductsComponent },
      { path: 'profile', component: ProfileComponent },
      { path: 'chat', component: ChatComponent },
      { path: "workShopProfile", component:WorkshopProfileComponent},
      { path: '', redirectTo: 'dashboard', pathMatch: 'full' },
      { path: '**', component: PagenotfoundComponent },
    ],
  },
];
