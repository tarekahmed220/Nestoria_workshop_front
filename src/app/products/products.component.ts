// import { Component } from '@angular/core';
// import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
// import { FormsModule } from '@angular/forms';
// import { CommonModule } from '@angular/common';
// import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
// import { faEdit, faTrash, faMinus, faPlus } from '@fortawesome/free-solid-svg-icons';

// interface Product {
//   id: number;
//   name: string;
//   description: string;
//   price: number;
//   imageUrl: string;
//   quantity: number;
//   color: string;
// }

// @Component({
//   selector: 'app-products',
//   standalone: true,
//   imports: [CommonModule, FormsModule, FontAwesomeModule],
//   templateUrl: './products.component.html',
//   styleUrls: ['./products.component.css'],
// })
// export class ProductsComponent {
//   products: Product[] = [

//     {
//       id: 1,
//       name: 'Product 1',
//       description: 'Description 1',
//       price: 100,
//       imageUrl: 'images/about/first.jpg',
//       quantity: 1,
//       color: 'Red',
//     },
//     {
//       id: 2,
//       name: 'Product 2',
//       description: 'Description 2',
//       price: 200,
//       imageUrl: 'images/about/shop-12-01 (1).jpg',
//       quantity: 2,
//       color: 'Blue',
//     },
//     {
//       id: 3,
//       name: 'Product 3',
//       description: 'Description 3',
//       price: 200,
//       imageUrl: 'images/about/shop-9-02.jpg',
//       quantity: 2,
//       color: 'Blue',

//     },
//     {
//       id: 4,
//       name: 'Product 4',
//       description: 'Description 4',
//       price: 200,
//       imageUrl: 'images/about/Home-2-Secton-2-03.jpg',
//       quantity: 2,
//       color: 'Blue',

//     },
//     {
//       id: 5,
//       name: 'Product 5',
//       description: 'Description 5',
//       price: 200,
//       imageUrl: 'images/about/shop-9-01.jpg',
//       quantity: 2,
//       color: 'Blue',

//     },
//     {
//       id: 6,
//       name: 'Product 6',
//       description: 'Description 6',
//       price: 200,
//       imageUrl: 'images/about/shop-2-04.jpg',
//       quantity: 2,
//       color: 'Blue',

//     },
//     {
//       id: 7,
//       name: 'Product 7',
//       description: 'Description 7',
//       price: 200,
//       imageUrl: 'images/about/shop-2-05.jpg',
//       quantity: 2,
//       color: 'Blue',

//     },
//     {
//       id: 8,
//       name: 'Product 8',
//       description: 'Description 8',
//       price: 200,
//       imageUrl: 'images/about/shop-5-04.jpg',
//       quantity: 2,
//       color: 'Blue',

//     },
//     {
//       id: 9,
//       name: 'Product 9',
//       description: 'Description 9',
//       price: 200,
//       imageUrl: 'images/about/shop-6-01.jpg',
//       quantity: 2,
//       color: 'Blue',

//     },
//     {
//       id: 10,
//       name: 'Product 10',
//       description: 'Description 10',
//       price: 200,
//       imageUrl: 'images/about/shop-8-03.jpg',
//       quantity: 2,
//       color: 'Blue',

//     },
//   ];

//   faEdit = faEdit;
//   faTrash = faTrash;
//   faMinus = faMinus;
//   faPlus = faPlus;

//   selectedProduct: Product | null = null;
//   isEditing = false;
//   availableColors: string[] = ['Red', 'Blue', 'Green', 'Yellow', 'Black', 'White', 'Orange'];

//   alertMessage: string | null = null;
//   alertType: 'success' | 'danger' | 'warning' = 'success';

//   selectedFile: File | null = null;

//   constructor(private modalService: NgbModal) {}

//   openModal(content: any, product?: Product) {
//     this.selectedProduct = product
//       ? { ...product }
//       : { id: 0, name: '', description: '', price: 0, imageUrl: '', quantity: 1, color: 'Red' };
//     this.isEditing = !!product;
//     this.modalService.open(content);
//   }

//   saveProduct() {

//     if (
//       !this.selectedProduct?.name ||
//       !this.selectedProduct?.description ||
//       !this.selectedProduct?.price ||
//       (!this.selectedProduct?.imageUrl && !this.selectedFile) // التحقق من الصورة أيضًا
//     ) {
//       this.showAlert('All fields are required, including the image!', 'warning');
//       return;
//     }

//     if (this.selectedFile) {
//       const reader = new FileReader();
//       reader.onload = (e: any) => {
//         this.selectedProduct!.imageUrl = e.target.result;
//         this.finalizeProductSave();
//       };
//       reader.readAsDataURL(this.selectedFile);
//     } else {
//       this.finalizeProductSave();
//     }
//   }

//   finalizeProductSave() {
//     if (this.isEditing) {
//       this.products = this.products.map((p) =>
//         p.id === this.selectedProduct?.id ? this.selectedProduct! : p
//       );
//       this.showAlert('Product updated successfully!', 'success');
//     } else {
//       this.selectedProduct!.id = this.products.length + 1;
//       this.products.push(this.selectedProduct!);
//       this.showAlert('Product added successfully!', 'success');
//     }
//     this.modalService.dismissAll();
//   }

//   deleteProduct(id: number) {
//     if (confirm('Are you sure you want to delete this product?')) {
//       this.products = this.products.filter((p) => p.id !== id);
//       this.showAlert('Product deleted successfully!', 'danger');
//     }
//   }

//   handleQuantityChange(action: string, product: Product) {
//     if (action === 'increase') {
//       product.quantity += 1;
//     } else if (action === 'decrease' && product.quantity > 1) {
//       product.quantity -= 1;
//     }
//   }

//   onFileSelected(event: any) {
//     this.selectedFile = event.target.files[0];
//   }

//   showAlert(message: string, type: 'success' | 'danger' | 'warning') {
//     this.alertMessage = message;
//     this.alertType = type;
//     setTimeout(() => this.closeAlert(), 3000);
//   }

//   closeAlert() {
//     this.alertMessage = null;
//   }
// }

import { Component, OnInit } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import {
  faEdit,
  faTrash,
  faMinus,
  faPlus,
} from '@fortawesome/free-solid-svg-icons';
import { HttpClient } from '@angular/common/http';

interface Product {
  _id?: string;
  name: string;
  description: string;
  price: number;
  images: string[];
  quantity: number;
  color: string;
}

@Component({
  selector: 'app-products',
  standalone: true,
  imports: [CommonModule, FormsModule, FontAwesomeModule],
  templateUrl: './products.component.html',
  styleUrls: ['./products.component.css'],
})
export class ProductsComponent implements OnInit {
  products: Product[] = [];
  faEdit = faEdit;
  faTrash = faTrash;
  faMinus = faMinus;
  faPlus = faPlus;
  selectedProduct: Product | null = null;
  isEditing = false;
  availableColors: string[] = [
    'Red',
    'Blue',
    'Green',
    'Yellow',
    'Black',
    'White',
    'Orange',
  ];
  alertMessage: string | null = null;
  alertType: 'success' | 'danger' | 'warning' = 'success';
  selectedFile: File | null = null;

  private apiUrl = 'http://localhost:5000/api/v1/fur/products';

  constructor(private modalService: NgbModal, private http: HttpClient) {}

  ngOnInit() {
    this.getProducts();
  }

  getProducts() {
    this.http.get<Product[]>(`${this.apiUrl}/myproducts`).subscribe(
      (data) => {
        this.products = data;
        console.log(data);
      },

      (error) => this.showAlert('Failed to load products.', 'danger')
    );
  }

  openModal(content: any, product?: Product) {
    this.selectedProduct = product
      ? { ...product, images: product.images || [] }
      : {
          name: '',
          description: '',
          price: 0,
          images: [],
          quantity: 1,
          color: 'Red',
        };
    this.isEditing = !!product;
    this.modalService.open(content);
  }

  saveProduct() {
    if (
      !this.selectedProduct?.name ||
      !this.selectedProduct?.description ||
      this.selectedProduct?.price === undefined ||
      (this.selectedProduct?.images.length === 0 && !this.selectedFile)
    ) {
      this.showAlert(
        'All fields are required, including the image!',
        'warning'
      );
      return;
    }

    if (this.selectedFile) {
      const reader = new FileReader();
      reader.onload = (e: any) => {
        this.selectedProduct!.images = [e.target.result];
        this.finalizeProductSave();
      };
      reader.readAsDataURL(this.selectedFile);
    } else {
      this.finalizeProductSave();
    }
  }

  finalizeProductSave() {
    if (this.isEditing && this.selectedProduct?._id) {
      this.http
        .put(`${this.apiUrl}/${this.selectedProduct._id}`, this.selectedProduct)
        .subscribe(
          () => {
            this.getProducts();
            this.showAlert('Product updated successfully!', 'success');
          },
          () => this.showAlert('Failed to update product.', 'danger')
        );
    } else {
      this.http.post(this.apiUrl, this.selectedProduct).subscribe(
        () => {
          this.getProducts();
          this.showAlert('Product added successfully!', 'success');
        },
        () => this.showAlert('Failed to add product.', 'danger')
      );
    }
    this.modalService.dismissAll();
  }

  deleteProduct(id: string) {
    if (confirm('Are you sure you want to delete this product?')) {
      this.http.delete(`${this.apiUrl}/${id}`).subscribe(
        () => {
          this.getProducts();
          this.showAlert('Product deleted successfully!', 'danger');
        },
        () => this.showAlert('Failed to delete product.', 'danger')
      );
    }
  }

  handleQuantityChange(action: string, product: Product) {
    if (action === 'increase') {
      product.quantity += 1;
    } else if (action === 'decrease' && product.quantity > 1) {
      product.quantity -= 1;
    }
  }

  onFileSelected(event: any) {
    this.selectedFile = event.target.files[0];
  }

  showAlert(message: string, type: 'success' | 'danger' | 'warning') {
    this.alertMessage = message;
    this.alertType = type;
    setTimeout(() => this.closeAlert(), 3000);
  }

  closeAlert() {
    this.alertMessage = null;
  }
}
