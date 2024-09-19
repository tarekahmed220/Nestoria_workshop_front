import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { catchError, Observable, throwError } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class OrdersService {
  apiAllOrders: string = 'http://localhost:5000/api/v1/fur/workshop/getorders';
  apiPendingOrders: string =
    'http://localhost:5000/api/v1/fur/workshop/pendingOrders';
  apiShippedOrders: string =
    'http://localhost:5000/api/v1/fur/workshop/shippedOrders';
  apiUpdateOrders: string =
    'http://localhost:5000/api/v1/fur/workshop/updateOrders';
  apiCancelOrders: string =
    'http://localhost:5000/api/v1/fur/workshop/cancelProduct';

  constructor(private http: HttpClient) {}

  allOrders!: any[];
  id: string = '66d87cbeb4d55d64579e20cc';
  getAllOrders(id: string): Observable<any> {
    return this.http.post<any>(this.apiAllOrders, { id });
  }

  getPendingOrders(id: string): Observable<any> {
    return this.http.post<any>(this.apiPendingOrders, { id });
  }

  getShippedOrders(id: string): Observable<any> {
    return this.http.post<any>(this.apiShippedOrders, { id }).pipe(
      catchError((error) => {
        console.error('Error fetching shipped orders:', error);
        return throwError(error);
      })
    );
  }

  updateOrderStatus(id: string, productId: string, orderId: string): Observable<any> {
    return this.http.put<any>(this.apiUpdateOrders, { id, productId, orderId });
  }

  cancelOrder(id: string, productId: string, orderId: string): Observable<any> {
    const body = { id, productId, orderId };
    return this.http.delete<any>(this.apiCancelOrders, { body });
  }
}
