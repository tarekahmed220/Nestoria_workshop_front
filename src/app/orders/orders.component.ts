import 'zone.js'; // Required for Angular
import { bootstrapApplication } from '@angular/platform-browser';
import { Component, signal } from '@angular/core';
import { CommonModule } from '@angular/common'; // استيراد CommonModule

// بيانات الطلبات الوهمية
interface Order {
  id: number;
  product: string;
  price: number;
  customerName: string;
  orderDate: Date;
  shipped: boolean;
  imageUrl: string; // إضافة الصورة لكل طلب
  quantity: number; // خاصية الكمية الجديدة
}

@Component({
  selector: 'app-orders',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './orders.component.html',
  styleUrl: './orders.component.css',
})
export class OrdersComponent {
  // قائمة الطلبات باستخدام signals
  orders = signal<Order[]>([
    {
      id: 1,
      product: 'Laptop',
      price: 1500,
      customerName: 'John Doe',
      orderDate: new Date(),
      shipped: false,
      imageUrl: 'https://via.placeholder.com/50x50?text=Laptop', // صورة المنتج
      quantity: 1, // الكمية الافتراضية
    },
    {
      id: 2,
      product: 'Phone',
      price: 800,
      customerName: 'Jane Smith',
      orderDate: new Date(),
      shipped: false,
      imageUrl: 'https://via.placeholder.com/50x50?text=Phone', // صورة المنتج
      quantity: 1, // الكمية الافتراضية
    },
    {
      id: 3,
      product: 'Headphones',
      price: 200,
      customerName: 'Alice Brown',
      orderDate: new Date(),
      shipped: false,
      imageUrl: 'https://via.placeholder.com/50x50?text=Headphones', // صورة المنتج
      quantity: 1, // الكمية الافتراضية
    },
  ]);

  // قائمة الطلبات المشحونة
  shippedOrders: Order[] = [];

  // التبويب النشط - بداية يكون 'pending'
  activeTab = 'pending';

  // دالة لتحديد التبويب النشط
  selectTab(tab: string) {
    this.activeTab = tab;
  }

  // دالة لشحن الطلب
  shipOrder(id: number) {
    this.orders.update((orders) => {
      return orders.map((order) => {
        if (order.id === id) {
          order.shipped = true;
          this.shippedOrders.push(order); // إضافة الطلب لقائمة الطلبات المشحونة
        }
        return order;
      });
    });
  }

  // دالة لإلغاء الشحن
  cancelOrder(id: number) {
    this.shippedOrders = this.shippedOrders.filter((order) => order.id !== id); // إزالة الطلب من الطلبات المشحونة
    this.orders.update((orders) =>
      orders.map((order) => {
        if (order.id === id) {
          order.shipped = false; // إعادة حالة الشحن إلى false
        }
        return order;
      })
    );
  }

  // دالة لزيادة الكمية
  increaseQuantity(id: number) {
    this.orders.update((orders) =>
      orders.map((order) => {
        if (order.id === id) {
          order.quantity += 1; // زيادة الكمية
        }
        return order;
      })
    );
  }

  // دالة لتقليل الكمية
  decreaseQuantity(id: number) {
    this.orders.update((orders) =>
      orders.map((order) => {
        if (order.id === id && order.quantity > 1) {
          order.quantity -= 1; // تقليل الكمية (بشرط ألا تكون أقل من 1)
        }
        return order;
      })
    );
  }
}
