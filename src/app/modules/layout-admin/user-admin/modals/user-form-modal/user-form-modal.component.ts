import { DatePipe } from '@angular/common';
import { HttpErrorResponse } from '@angular/common/http';
import { Component, effect, inject, input, model, output, signal, untracked } from '@angular/core';
import { FormGroup, ReactiveFormsModule } from '@angular/forms';
import { finalize } from 'rxjs';
import { UserPayload, UserRecord } from '@models/layout-admin/user.model';
import { UserService } from '@services/layout-admin/user.service';
import { DynamicFormComponent, buildForm } from '@shared/components/dynamic-form/dynamic-form.component';
import { UiDialogService, UiModalComponent } from '@ui';
import { USER_FIELDS } from '../../constants/user-admin.const';

/**
 * Add / edit user dialog. Pass [user] to edit, null to create.
 * <app-user-form-modal [(open)]="open" [user]="editing()" (saved)="reload()" />
 */
@Component({
  selector: 'app-user-form-modal',
  standalone: true,
  imports: [DatePipe, ReactiveFormsModule, UiModalComponent, DynamicFormComponent],
  template: `
    <ui-modal
      [(open)]="open"
      size="lg"
      [heading]="user() ? 'Edit user' : 'Add user'"
      [subtitle]="user() ? 'Member since ' + (user()!.createdAt | date: 'MMMM y') : 'They get an email invitation and can sign in once they set a password.'"
      [icon]="user() ? 'edit' : 'user-add'"
      [okText]="user() ? 'Save changes' : 'Add and invite'"
      [okIcon]="user() ? 'save' : 'send'"
      [okLoading]="saving()"
      (ok)="save()"
    >
      <form [formGroup]="form" (ngSubmit)="save()" novalidate>
        <app-dynamic-form [form]="form" [fields]="fields" idPrefix="user" />
        <button type="submit" hidden></button>
      </form>
    </ui-modal>
  `,
})
export class UserFormModalComponent {
  private users = inject(UserService);
  private dialog = inject(UiDialogService);

  open = model(false);
  user = input<UserRecord | null>(null);
  saved = output<UserRecord>();

  readonly fields = USER_FIELDS;
  form: FormGroup = buildForm(USER_FIELDS);
  saving = signal(false);

  constructor() {
    // Fresh form every time the dialog opens, prefilled when editing.
    effect(() => {
      if (!this.open()) return;
      const u = this.user();
      untracked(() => {
        this.form = buildForm(USER_FIELDS);
        if (u) this.form.patchValue(u);
      });
    });
  }

  save(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }
    const payload = this.form.getRawValue() as UserPayload;
    const current = this.user();
    this.saving.set(true);
    const req = current ? this.users.update(current.id, payload) : this.users.create(payload);
    req.pipe(finalize(() => this.saving.set(false))).subscribe({
      next: u => {
        this.dialog.success(current ? `Saved changes to ${u.name}` : `${u.name} was added and invited`);
        this.open.set(false);
        this.saved.emit(u);
      },
      error: (err: HttpErrorResponse) => {
        if (err.status === 409) {
          const email = this.form.controls['email'];
          email.setErrors({ server: err.error?.message });
          email.markAsTouched();
        }
      },
    });
  }
}
