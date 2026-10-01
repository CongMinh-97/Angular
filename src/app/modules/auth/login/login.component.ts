import { Component, inject, input, signal } from '@angular/core';
import { NonNullableFormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { finalize } from 'rxjs';
import { environment } from '@environments/environment';
import { AuthService } from '@services/auth.service';
import { LogoComponent } from '@shared/components/logo/logo.component';
import { UiAlertComponent, UiButtonComponent, UiCheckboxComponent, UiDialogService, UiInputComponent } from '@ui';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [ReactiveFormsModule, LogoComponent, UiInputComponent, UiCheckboxComponent, UiButtonComponent, UiAlertComponent],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
})
export class LoginComponent {
  private fb = inject(NonNullableFormBuilder);
  private auth = inject(AuthService);
  private router = inject(Router);
  private dialog = inject(UiDialogService);

  returnUrl = input<string>();

  readonly appName = environment.appName;
  readonly year = new Date().getFullYear();
  loading = signal(false);
  error = signal<string | null>(null);

  form = this.fb.group({
    username: ['', [Validators.required]],
    password: ['', [Validators.required, Validators.minLength(6)]],
    remember: [true],
  });

  submit(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }
    this.error.set(null);
    this.loading.set(true);
    const { username, password, remember } = this.form.getRawValue();
    this.auth
      .login({ username, password }, remember)
      .pipe(finalize(() => this.loading.set(false)))
      .subscribe({
        next: res => {
          this.dialog.success(`Welcome back, ${res.user.fullName.split(' ').pop()}`);
          this.router.navigateByUrl(this.returnUrl() || '/dashboard');
        },
        error: err => this.error.set(err.error?.message ?? 'Sign in failed. Try again.'),
      });
  }

  fillDemo(): void {
    this.form.patchValue({ username: 'admin@harbor.vn', password: 'password123' });
    this.error.set(null);
  }

  sso(provider: string): void {
    this.dialog.info(`${provider} sign-in is not configured in this demo.`);
  }
}
