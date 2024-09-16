// import { Component } from '@angular/core';

// @Component({
//   selector: 'app-work-shop-profile',
//   standalone: true,
//   imports: [],
//   templateUrl: './work-shop-profile.component.html',
//   styleUrl: './work-shop-profile.component.css'
// })
// export class WorkShopProfileComponent {

// }

// import { Component } from '@angular/core';
// import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
// import { CustomValidators } from '../custom-validators';
// import { CommonModule } from '@angular/common';
// @Component({
//   selector: 'app-workshop-profile',
//   standalone: true,
//   templateUrl: './work-shop-profile.component.html',
//   styleUrls: ['./work-shop-profile.component.css'],
//   imports: [
//     CommonModule,
//     FormsModule,
//     ReactiveFormsModule
//   ]
// })
// export class WorkshopProfileComponent {
//   workshopForm: FormGroup;

//   constructor(private fb: FormBuilder) {
//     this.workshopForm = this.fb.group({
//       name: ['', [Validators.required, Validators.maxLength(50), CustomValidators.alphabetic]],
//       email: ['', [Validators.required, Validators.email]],
//       phone: ['', [Validators.required, CustomValidators.phoneNumber]],
//       address: ['', [Validators.maxLength(100)]],
//       workshopName: ['', [Validators.required, Validators.maxLength(50), CustomValidators.alphanumeric]],
//       licenseNumber: ['', [Validators.required, Validators.pattern(/^[A-Za-z0-9]{10}$/)]],
//       website: ['', [CustomValidators.optionalUrl]] // Optional, but must be valid if filled
//     });
//   }

//   // Method to handle form submission
//   onSubmit() {
//     if (this.workshopForm.valid) {
//       console.log('Form Submitted:', this.workshopForm.value);
//     } else {
//       console.log('Form is invalid');
//     }
//   }

//   // Helper method for easier validation feedback in template
//   hasError(field: string, error: string) {
//     const control = this.workshopForm.get(field);
//     return control?.hasError(error) && control.touched;
//   }
// }


import { CommonModule, NgFor, NgIf } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
// import { NgIf, NgFor, FormsModule } from '@angular/common';

@Component({
  selector: 'app-workshop-owner',
  standalone: true,
  templateUrl: './work-shop-profile.component.html',
  styleUrls: ['./work-shop-profile.component.css'],
  imports: [ FormsModule,NgIf,NgFor,CommonModule]  // استيراد NgIf و FormsModule بشكل مباشر
})
export class WorkshopProfileComponent {
  isEditing: boolean = false;

  // بيانات صاحب الورشة بدون نموذج
  owner = {
    name: 'John Doe',
    email: 'john.doe@example.com',
    phoneNumber: '123-456-7890',
    address: '123 Main St, City, Country',
    workshopName: 'John’s Auto Workshop',
    licenseNumber: 'ABC1234567',
    avatarUrl: 'https://example.com/avatar.jpg'
  };

  enableEditing() {
    this.isEditing = true;
  }

  saveChanges() {
    this.isEditing = false;
  }

  // تحميل الصورة الجديدة
  onAvatarSelected(event: any) {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e: any) => {
        this.owner.avatarUrl = e.target.result;  // تحديث رابط الصورة بعد رفع الصورة
      };
      reader.readAsDataURL(file);
    }

  }
}
