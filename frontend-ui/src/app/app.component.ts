import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {
  form: FormGroup;
  file: File | null = null;
  submitted = false;
  success = false;
  errorMsg = '';

  constructor(private fb: FormBuilder, private http: HttpClient) {
    this.form = this.fb.group({
      date: ['', Validators.required],
      amount: ['', [Validators.required, Validators.min(0.01)]],
      description: ['', Validators.required],
      receipt: [null, Validators.required]
    });
  }
  onFileChange(event: Event) {
    const input = event.target as HTMLInputElement;
    if (input?.files?.length) {
      this.file = input.files[0];
      // Update form control manually so checks if it is "touched and valid"
      this.form.patchValue({
        receipt: this.file
      });
      this.form.get('receipt')?.updateValueAndValidity();
    }
  }
  

  submit() {
    if (this.form.invalid || !this.file) return;

    const formData = new FormData();
    formData.append('date', this.form.get('date')?.value);
    formData.append('amount', this.form.get('amount')?.value);
    formData.append('description', this.form.get('description')?.value);
    formData.append('receipt', this.file);

    this.http.post('http://localhost:3000/api/receipts/submit', formData).subscribe({
      next: () => {
        this.success = true;
        this.submitted = true;
        this.form.reset();
        this.file = null;
      },
      error: err => {
        this.errorMsg = err.error?.message || 'Submission failed';
        this.submitted = true;
      }
    });
  }
}
