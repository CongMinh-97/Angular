import { Component, signal } from '@angular/core';
import { ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';
import { FormControl, ReactiveFormsModule, Validators } from '@angular/forms';
import { By } from '@angular/platform-browser';
import { provideNoopAnimations } from '@angular/platform-browser/animations';
import { UiInputComponent } from './ui-input.component';

// Pattern for ui-* controls: test through a small host component, once per usage mode.

@Component({
  standalone: true,
  imports: [UiInputComponent, ReactiveFormsModule],
  template: `<ui-input [formControl]="ctrl" label="Email" />`,
})
class ReactiveHost {
  ctrl = new FormControl('', Validators.required);
}

@Component({
  standalone: true,
  imports: [UiInputComponent],
  template: `<ui-input [(value)]="query" [debounce]="300" (debounced)="searched = $event" />`,
})
class StandaloneHost {
  query = signal<string | null>('a');
  searched = '';
}

function typeInto<T>(fixture: ComponentFixture<T>, text: string): HTMLInputElement {
  const input = fixture.debugElement.query(By.css('input')).nativeElement as HTMLInputElement;
  input.value = text;
  input.dispatchEvent(new Event('input'));
  fixture.detectChanges();
  return input;
}

describe('UiInputComponent', () => {
  beforeEach(() => TestBed.configureTestingModule({ providers: [provideNoopAnimations()] }));

  describe('in a reactive form', () => {
    let fixture: ComponentFixture<ReactiveHost>;

    beforeEach(() => {
      fixture = TestBed.createComponent(ReactiveHost);
      fixture.detectChanges();
    });

    it('writes the form value into the input', () => {
      fixture.componentInstance.ctrl.setValue('an@x.vn');
      fixture.detectChanges();
      expect(fixture.debugElement.query(By.css('input')).nativeElement.value).toBe('an@x.vn');
    });

    it('pushes typed text to the form control', () => {
      typeInto(fixture, 'hello');
      expect(fixture.componentInstance.ctrl.value).toBe('hello');
    });

    it('shows the required error only after the control is touched', () => {
      expect(fixture.nativeElement.textContent).not.toContain('Email is required');
      fixture.componentInstance.ctrl.markAsTouched();
      fixture.detectChanges();
      expect(fixture.nativeElement.textContent).toContain('Email is required');
    });

    it('follows the control disabled state', () => {
      fixture.componentInstance.ctrl.disable();
      fixture.detectChanges();
      expect(fixture.debugElement.query(By.css('input')).nativeElement.disabled).toBeTrue();
    });
  });

  describe('standalone', () => {
    it('two-way binds [(value)] and debounces', fakeAsync(() => {
      const fixture = TestBed.createComponent(StandaloneHost);
      fixture.detectChanges();

      typeInto(fixture, 'abc');
      expect(fixture.componentInstance.query()).toBe('abc');
      expect(fixture.componentInstance.searched).toBe('');

      tick(300);
      expect(fixture.componentInstance.searched).toBe('abc');
    }));
  });
});
