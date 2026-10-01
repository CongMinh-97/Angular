import { NgTemplateOutlet } from '@angular/common';
import { Component, Directive, Injectable, TemplateRef, booleanAttribute, computed, contentChild, inject, input, model, output } from '@angular/core';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { NzMessageService } from 'ng-zorro-antd/message';
import { NzModalModule, NzModalService } from 'ng-zorro-antd/modal';
import { UiButtonComponent } from './ui-button.component';

const WIDTHS = { sm: 420, md: 560, lg: 760, xl: 980 } as const;
export type UiModalSize = keyof typeof WIDTHS;

/** Replace the default Cancel/OK footer: <ng-template uiModalFooter>…</ng-template> */
@Directive({ selector: 'ng-template[uiModalFooter]', standalone: true })
export class UiModalFooterDirective {
  template = inject(TemplateRef);
}

/**
 * Dialog with a consistent header and footer. Body is the projected content.
 *
 * <ui-modal [(open)]="editing" heading="Edit user" okText="Save changes" [okLoading]="saving" (ok)="save()">
 *   <form [formGroup]="form">…</form>
 * </ui-modal>
 */
@Component({
  selector: 'ui-modal',
  standalone: true,
  imports: [NgTemplateOutlet, NzModalModule, NzIconModule, UiButtonComponent],
  template: `
    <nz-modal
      [nzVisible]="open()"
      [nzTitle]="headTpl"
      [nzFooter]="hideFooter() ? null : footTpl"
      [nzWidth]="width()"
      [nzCentered]="centered()"
      [nzClosable]="closable()"
      [nzMaskClosable]="maskClosable()"
      [nzKeyboard]="closable()"
      nzClassName="ui-modal"
      (nzOnCancel)="dismiss()"
      (nzAfterOpen)="opened.emit()"
      (nzAfterClose)="closed.emit()"
    >
      <ng-container *nzModalContent>
        <ng-content />
      </ng-container>
    </nz-modal>

    <ng-template #headTpl>
      <div class="ui-md-head">
        @if (icon()) {
          <span class="ui-md-icon" [class.is-danger]="okDanger()"><span nz-icon [nzType]="icon()"></span></span>
        }
        <div>
          <div class="ui-md-title">{{ heading() }}</div>
          @if (subtitle()) {
            <div class="ui-md-sub">{{ subtitle() }}</div>
          }
        </div>
      </div>
    </ng-template>

    <ng-template #footTpl>
      @if (customFooter(); as f) {
        <ng-container [ngTemplateOutlet]="f.template" />
      } @else {
        <div class="ui-md-foot">
          <button ui-button variant="secondary" (click)="dismiss()" [disabled]="okLoading()">{{ cancelText() }}</button>
          <button
            ui-button
            [variant]="okDanger() ? 'danger' : 'primary'"
            [icon]="okIcon()"
            [loading]="okLoading()"
            [disabled]="okDisabled()"
            (click)="ok.emit()"
          >
            {{ okText() }}
          </button>
        </div>
      }
    </ng-template>
  `,
  styles: [
    `
      .ui-md-head { display: flex; align-items: center; gap: 12px; }
      .ui-md-icon { flex: none; width: 36px; height: 36px; border-radius: 10px; display: grid; place-items: center; font-size: 16px; color: var(--jade-600); background: var(--jade-50); }
      .ui-md-icon.is-danger { color: var(--danger); background: var(--danger-bg); }
      .ui-md-title { font-size: 16px; font-weight: 700; color: var(--text); line-height: 1.3; }
      .ui-md-sub { margin-top: 2px; font-size: 12.5px; font-weight: 500; color: var(--text-3); }
      .ui-md-foot { display: flex; justify-content: flex-end; gap: 8px; }
    `,
  ],
})
export class UiModalComponent {
  open = model(false);
  heading = input('');
  subtitle = input('');
  icon = input('');
  size = input<UiModalSize>('md');
  centered = input(true, { transform: booleanAttribute });
  closable = input(true, { transform: booleanAttribute });
  /** Off by default so a stray click doesn't throw away a half-filled form. */
  maskClosable = input(false, { transform: booleanAttribute });
  hideFooter = input(false, { transform: booleanAttribute });
  okText = input('Save');
  okIcon = input('');
  cancelText = input('Cancel');
  okLoading = input(false, { transform: booleanAttribute });
  okDisabled = input(false, { transform: booleanAttribute });
  okDanger = input(false, { transform: booleanAttribute });

  ok = output<void>();
  cancel = output<void>();
  opened = output<void>();
  closed = output<void>();

  customFooter = contentChild(UiModalFooterDirective);
  width = computed(() => WIDTHS[this.size()]);

  dismiss(): void {
    if (this.okLoading()) return;
    this.open.set(false);
    this.cancel.emit();
  }
}

export interface UiConfirmOptions {
  heading: string;
  content?: string;
  okText?: string;
  cancelText?: string;
  danger?: boolean;
  /** Runs before closing; the dialog shows a spinner until it resolves. Reject/throw keeps it open. */
  onOk?: () => Promise<unknown> | unknown;
}

/**
 * Confirmation dialogs and toasts with the kit's wording and styling.
 *
 * if (await dialog.confirm({ heading: 'Delete 3 users?', danger: true, okText: 'Delete' })) { … }
 */
@Injectable({ providedIn: 'root' })
export class UiDialogService {
  private modal = inject(NzModalService);
  private message = inject(NzMessageService);

  confirm(o: UiConfirmOptions): Promise<boolean> {
    return new Promise(resolve => {
      this.modal.confirm({
        nzTitle: o.heading,
        nzContent: o.content,
        nzOkText: o.okText ?? (o.danger ? 'Delete' : 'Confirm'),
        nzCancelText: o.cancelText ?? 'Cancel',
        nzOkDanger: !!o.danger,
        nzIconType: o.danger ? 'exclamation-circle' : 'question-circle',
        nzClassName: 'ui-confirm',
        nzCentered: true,
        nzOnOk: async () => {
          if (o.onOk) await o.onOk();
          resolve(true);
        },
        nzOnCancel: () => resolve(false),
      });
    });
  }

  success(text: string): void {
    this.message.success(text);
  }

  error(text: string): void {
    this.message.error(text);
  }

  info(text: string): void {
    this.message.info(text);
  }

  warning(text: string): void {
    this.message.warning(text);
  }
}
