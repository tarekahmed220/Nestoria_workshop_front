// import { CommonModule } from '@angular/common';
// import { Component, OnInit } from '@angular/core';
// import { FormsModule } from '@angular/forms';
// import { ProfileService } from '../services/profile.service';

// @Component({
//   selector: 'app-workshop-profile',
//   templateUrl: './work-shop-profile.component.html',
//   styleUrls: ['./work-shop-profile.component.css'],
//   standalone: true,
//   imports: [CommonModule, FormsModule],
// })
// export class WorkshopProfileComponent implements OnInit {
//   workshop: any = {}; // Holds the original data
//   workshopTemp: any = {}; // Temporary object for form changes
//   editMode = false;
//   errorMessage = '';
//   documentTypes = [
//     { key: 'bankStatement', name: 'Bank Statement' },
//     { key: 'commercialRecord', name: 'Commercial Record' },
//     { key: 'nationalIDFront', name: 'National ID Front' },
//     { key: 'nationalIDBack', name: 'National ID Back' }
//   ];

//   constructor(private profileService: ProfileService) {}

//   ngOnInit() {
//     this.getWorkshopData(); // Fetch workshop data on component load
//   }

//   // Fetch workshop data
//   getWorkshopData() {
//     this.profileService.getProfileData().subscribe(
//       (data) => {
//         if (data) {
//           this.workshop = data; // Set workshop data from profile
//         } else {
//           this.errorMessage = 'Failed to load workshop data';
//         }
//       },
//       (error) => {
//         this.errorMessage = 'Error fetching data';
//         console.error('Error:', error);
//       }
//     );
//   }

//   // Toggle edit mode for the form
//   toggleEditMode() {
//     this.editMode = !this.editMode;
//     if (this.editMode) {
//       // Copy the workshop data to a temporary object
//       this.workshopTemp = { ...this.workshop };
//     }
//   }

//   // Handle file selection for image upload
//   onFileSelected(event: any) {
//     const file = event.target.files[0];
//     const validImageTypes = ['image/jpeg', 'image/png', 'image/jpg'];

//     if (file && this.workshopTemp) {
//       // Check file type
//       if (!validImageTypes.includes(file.type)) {
//         this.errorMessage = 'Invalid file type. Only JPG, JPEG, and PNG are allowed.';
//         return;
//       }

//       // Check file size (e.g., max 5MB)
//       const maxSizeInMB = 5;
//       if (file.size > maxSizeInMB * 1024 * 1024) {
//         this.errorMessage = 'File size exceeds the 5MB limit.';
//         return;
//       }

//       const reader = new FileReader();
//       reader.onload = (e: any) => {
//         this.workshopTemp.personalPhoto = e.target.result; // Set the image in the temporary object
//       };
//       reader.readAsDataURL(file);
//     }
//   }

//   // Save workshop data (calls update service method)
//   saveWorkshop() {
//     if (this.workshopTemp.valid) {
//       if (this.workshopTemp.password && this.workshopTemp.password !== this.workshopTemp.confirmPassword) {
//         this.errorMessage = 'Passwords do not match!';
//         return;
//       }

//       this.profileService.updateProfileData(this.workshopTemp).subscribe(
//         (response) => {
//           // Apply the changes from the temporary object to the original object
//           this.workshop = { ...this.workshopTemp };
//           console.log('Workshop updated successfully');
//           this.errorMessage = ''; // Clear any error messages
//           this.toggleEditMode();
//         },
//         (error) => {
//           if (error.status === 400) {
//             this.errorMessage = 'Invalid data provided. Please check the form and try again.';
//           } else if (error.status === 500) {
//             this.errorMessage = 'Server error. Please try again later.';
//           } else {
//             this.errorMessage = 'An unexpected error occurred. Please try again.';
//           }
//           console.error('Error:', error);
//         }
//       );
//     } else {
//       this.errorMessage = 'Please fill out the form correctly.';
//     }
//   }
// }
import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ProfileService } from '../services/profile.service';

@Component({
  selector: 'app-workshop-profile',
  templateUrl: './work-shop-profile.component.html',
  styleUrls: ['./work-shop-profile.component.css'],
  standalone: true,
  imports: [CommonModule, FormsModule],
})
export class WorkshopProfileComponent implements OnInit {
  workshop: any = {}; // Holds the original data
  workshopTemp: any = {}; // Temporary object for form changes
  editMode = false;
  errorMessage = '';
  documentTypes = [
    { key: 'bankStatement', name: 'Bank Statement' },
    { key: 'commercialRecord', name: 'Commercial Record' },
    { key: 'nationalIDFront', name: 'National ID Front' },
    { key: 'nationalIDBack', name: 'National ID Back' }
  ];

  constructor(private profileService: ProfileService) {}

  ngOnInit() {
    this.getWorkshopData(); // Fetch workshop data on component load
  }

  // Fetch workshop data
  getWorkshopData() {
    this.profileService.getProfileData().subscribe(
      (data) => {
        if (data) {
          this.workshop = data; // Set workshop data from profile
        } else {
          this.errorMessage = 'Failed to load workshop data';
        }
      },
      (error) => {
        this.errorMessage = 'Error fetching data';
        console.error('Error:', error);
      }
    );
  }

  // Toggle edit mode for the form
  toggleEditMode() {
    this.editMode = !this.editMode;
    if (this.editMode) {
      // Copy the workshop data to a temporary object
      this.workshopTemp = { ...this.workshop };
    }
  }

  // Handle file selection for image upload
  onFileSelected(event: any) {
    const file = event.target.files[0];
    const validImageTypes = ['image/jpeg', 'image/png', 'image/jpg'];

    if (file && this.workshopTemp) {
      // Check file type
      if (!validImageTypes.includes(file.type)) {
        this.errorMessage = 'Invalid file type. Only JPG, JPEG, and PNG are allowed.';
        return;
      }

      // Check file size (e.g., max 5MB)
      const maxSizeInMB = 5;
      if (file.size > maxSizeInMB * 1024 * 1024) {
        this.errorMessage = 'File size exceeds the 5MB limit.';
        return;
      }

      const reader = new FileReader();
      reader.onload = (e: any) => {
        this.workshopTemp.personalPhoto = e.target.result; // Set the image in the temporary object
      };
      reader.readAsDataURL(file);
    }
  }

  // Save workshop data (calls update service method)
  saveWorkshop() {
    if (this.workshopTemp.valid) {
      if (this.workshopTemp.password && this.workshopTemp.password !== this.workshopTemp.confirmPassword) {
        this.errorMessage = 'Passwords do not match!';
        return;
      }

      this.profileService.updateProfileData(this.workshopTemp).subscribe(
        (response) => {
          // Apply the changes from the temporary object to the original object
          this.workshop = { ...this.workshopTemp };
          console.log('Workshop updated successfully');
          this.errorMessage = ''; // Clear any error messages
          this.toggleEditMode();
        },
        (error) => {
          if (error.status === 400) {
            this.errorMessage = 'Invalid data provided. Please check the form and try again.';
          } else if (error.status === 500) {
            this.errorMessage = 'Server error. Please try again later.';
          } else {
            this.errorMessage = 'An unexpected error occurred. Please try again.';
          }
          console.error('Error:', error);
        }
      );
    } else {
      this.errorMessage = 'Please fill out the form correctly.';
    }
  }
}
