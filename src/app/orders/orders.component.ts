import 'zone.js';
import { Component, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { OrdersService } from '../services/orders.service';

@Component({
  selector: 'app-orders',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './orders.component.html',
  styleUrl: './orders.component.css',
})
export class OrdersComponent implements OnInit {
  orders!: any;
  pendingOrders!: any;
  shippedOrders!: any;
  id: string = '66d87cbeb4d55d64579e20cc';

  constructor(private ordersServ: OrdersService) {}
  functions() {
    this.ordersServ.getAllOrders(this.id).subscribe((order) => {
      this.orders = order;
      console.log(order);
    });
    this.ordersServ.getPendingOrders(this.id).subscribe((order) => {
      this.pendingOrders = order;
      console.log(order);
    });
    this.ordersServ.getShippedOrders(this.id).subscribe(
      (response) => {
        if (response.message === 'No shipped orders found for this workshop') {
          console.log(response.message);
          this.shippedOrders = [];
        } else {
          this.shippedOrders = response;
          console.log(this.shippedOrders);
        }
      },
      (error) => {
        console.error('An error occurred:', error);
      }
    );
  }
  ngOnInit(): void {
    this.functions();
  }
  // قائمة الطلبات المشحونة
  // shippedOrders: Order[] = [];

  // التبويب النشط - بداية يكون 'pending'
  activeTab = 'pending';

  // دالة لتحديد التبويب النشط
  selectTab(tab: string) {
    this.activeTab = tab;
  }

  shipOrder(productId: string, orderId: string) {
    console.log(this.id, productId, orderId);
    this.ordersServ.updateOrderStatus(this.id, productId, orderId).subscribe(
      (response) => {
        console.log('Order updated successfully:', response);
        this.functions();
      },
      (error) => {
        console.error('Error updating order:', error);
      }
    );
  }

  sendOrder(id: string) {}
  deleteOrder(productId: string, orderId: string) {
    console.log(this.id, productId, orderId);
    this.ordersServ.cancelOrder(this.id, productId, orderId).subscribe(
      (response) => {
        console.log('Order canceled successfully:', response);
        this.functions();
      },
      (error) => {
        console.error('Error cancel order:', error);
      }
    );
  }
  cancelOrder(productId: string, orderId: string) {
    console.log(this.id, productId, orderId);
    this.ordersServ.cancelOrder(this.id, productId, orderId).subscribe(
      (response) => {
        console.log('Order canceled successfully:', response);
        this.functions();
      },
      (error) => {
        console.error('Error cancel order:', error);
      }
    );
  }
  // // دالة لشحن الطلب
  // shipOrder(id: number) {
  //   this.orders.update((orders) => {
  //     // تحديث الطلب كـ shipped ونقله إلى قائمة shippedOrders
  //     const updatedOrders = orders.map((order) => {
  //       if (order.id === id) {
  //         order.shipped = true; // تغيير حالة الشحن
  //         order.sent = false; // لم يتم الإرسال بعد
  //         this.shippedOrders.push(order); // إضافة الطلب لقائمة الطلبات المشحونة
  //       }
  //       return order;
  //     });

  //     // حذف الطلب من قائمة الطلبات المعلقة
  //     return updatedOrders.filter((order) => order.id !== id);
  //   });
  // }
  // // دالة لإرسال الطلب بعد شحنه
  // sendOrder(id: number) {
  //   this.orders.update((orders) => {
  //     return orders.map((order) => {
  //       if (order.id === id) {
  //         order.sent = true; // تغيير حالة الإرسال
  //       }
  //       return order;
  //     });
  //   });
  // }
  // // دالة لحذف الطلب نهائيًا من قائمة الطلبات المعلقة
  // deleteOrder(id: number) {
  //   this.orders.update(
  //     (orders) => orders.filter((order) => order.id !== id) // حذف الطلب
  //   );
  // }
  // // دالة لحذف الطلب نهائيًا من قائمة الطلبات المشحونة وأيضًا من قائمة الطلبات المعلقة
  // cancelOrder(id: number) {
  //   // حذف الطلب من قائمة الطلبات المشحونة
  //   this.shippedOrders = this.shippedOrders.filter((order) => order.id !== id);

  //   // حذف الطلب من قائمة الطلبات المعلقة
  //   this.orders.update((orders) => orders.filter((order) => order.id !== id));
  // }
}
