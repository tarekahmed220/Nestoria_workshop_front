import 'zone.js';
import { Component, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { OrdersService } from '../services/orders.service';
import { ConfirmComponent } from '../confirm/confirm.component';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-orders',
  standalone: true,
  imports: [CommonModule,ConfirmComponent],
  templateUrl: './orders.component.html',
  styleUrl: './orders.component.css',
})
export class OrdersComponent implements OnInit {
  orders!: any;
  pendingOrders!: any;
  shippedOrders!: any;
  isClickDelete: boolean = false;
  isClickCancel: boolean = false;

  constructor(private ordersServ: OrdersService, private modalService: NgbModal) {}

  getAllOrders(){
    this.ordersServ.getAllOrders().subscribe((order) => {
      this.orders = order;
      // console.log(order);
    });
  }
  getPendingOrders(){
    this.ordersServ.getPendingOrders().subscribe(
      (response) => {
        if (
          response.message === 'No pending orders found for this workshop'
        ) {
          console.log(response.message);
          this.pendingOrders = [];
        } else {
          this.pendingOrders = response;
          console.log(this.shippedOrders);
        }
      },
      (error) => {
        console.error('An error occurred:', error);
      }
    );
  }
  getShippedOrders(){
    this.ordersServ.getShippedOrders().subscribe(
      (response) => {
        if (
          response.message === 'No shipped orders found for this workshop'
        ) {
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
    this.getPendingOrders();
  }


  // قائمة الطلبات المشحونة
  // shippedOrders: Order[] = [];

  // التبويب النشط - بداية يكون 'pending'
  activeTab = 'pending';

  // دالة لتحديد التبويب النشط
  selectTab(tab: string) {
    this.activeTab = tab;
    if (tab === 'shipped') {
      this.getShippedOrders();
    }else if(tab === 'pending'){
      this.getPendingOrders();
    }
  }

  shipOrder(productId: string, orderId: string, color: string) {
    // console.log(productId, orderId);
    this.ordersServ.updateOrderStatus(productId, orderId, color).subscribe(
      (response) => {
        console.log('Order updated successfully:', response);
        this.getPendingOrders();
      },
      (error) => {
        console.error('Error updating order:', error);
      }
    );
  }

  sendOrder(id: string) {}
  deleteOrder(productId: string, orderId: string, color: string) {
    this.isClickDelete = true;
      // this.modalService.open(content);
    // console.log(productId, orderId);
    this.ordersServ.cancelOrder(productId, orderId, color).subscribe(
      (response) => {
        console.log('Order canceled successfully:', response);
        this.getPendingOrders();
      },
      (error) => {
        console.error('Error cancel order:', error);
      }
    );
  }
  // cancelOrder(productId: string, orderId: string, color: string,content: any) {
  //   this.isClickCancel = true;
  //   this.modalService.open(content);
  //   // console.log(productId, orderId);
  //   this.ordersServ.cancelOrder(productId, orderId, color).subscribe(
  //     (response) => {
  //       console.log('Order canceled successfully:', response);
  //       this.getShippedOrders();
  //     },
  //     (error) => {
  //       console.error('Error cancel order:', error);
  //     }
  //   );
  // }

  cancelOrder(productId: string, orderId: string, color: string, content: any) {
    const modalRef = this.modalService.open(content);

    modalRef.result.then(
      (result) => {
        if (result === 'confirm') {
          this.ordersServ.cancelOrder(productId, orderId, color).subscribe(
            (response) => {
              this.isClickCancel = true;
              this.getShippedOrders();
            },
            (error) => {
              console.error('Error cancel order:', error);
            }
          );
        }
      },
      (reason) => {
        console.log('Modal dismissed');
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
