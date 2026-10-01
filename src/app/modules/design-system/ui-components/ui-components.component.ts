import { AfterViewInit, Component, ElementRef, OnDestroy, inject, signal } from '@angular/core';
import { PageHeaderComponent } from '@shared/components/page-header/page-header.component';
import { ChoicesSectionComponent } from './sections/choices.section';
import { DatesSectionComponent } from './sections/dates.section';
import { DisplaySectionComponent } from './sections/display.section';
import { FormUsageSectionComponent } from './sections/form-usage.section';
import { OverlaysSectionComponent } from './sections/overlays.section';
import { SelectSectionComponent } from './sections/select.section';
import { TextInputsSectionComponent } from './sections/text-inputs.section';

interface TocGroup {
  title: string;
  items: { id: string; label: string }[];
}

@Component({
  selector: 'app-ui-components',
  standalone: true,
  imports: [
    PageHeaderComponent,
    FormUsageSectionComponent,
    TextInputsSectionComponent,
    SelectSectionComponent,
    DatesSectionComponent,
    ChoicesSectionComponent,
    DisplaySectionComponent,
    OverlaysSectionComponent,
  ],
  template: `
    <app-page-header
      eyebrow="Design system"
      title="Components"
      subtitle="Every building block used across the app, with live examples, states and copy-ready code. Import from '@ui'."
    />

    <div class="layout">
      <nav class="toc" aria-label="Components">
        @for (g of toc; track g.title) {
          <div class="toc-group">
            <span class="toc-title">{{ g.title }}</span>
            @for (i of g.items; track i.id) {
              <a [href]="'#' + i.id" (click)="go($event, i.id)" [class.is-active]="active() === i.id">{{ i.label }}</a>
            }
          </div>
        }
      </nav>

      <div class="sections">
        <section-form-usage />
        <section-text-inputs />
        <section-select />
        <section-dates />
        <section-choices />
        <section-display />
        <section-overlays />
      </div>
    </div>
  `,
  styles: [
    `
      .layout { display: grid; grid-template-columns: 200px minmax(0, 1fr); gap: 32px; align-items: start; }
      .toc { position: sticky; top: calc(var(--topbar-h) + 20px); max-height: calc(100vh - var(--topbar-h) - 40px); overflow-y: auto; display: flex; flex-direction: column; gap: 18px; padding-right: 4px; }
      .toc-group { display: flex; flex-direction: column; gap: 2px; }
      .toc-title { padding: 0 10px 6px; font-size: 10.5px; font-weight: 700; letter-spacing: 0.1em; text-transform: uppercase; color: var(--text-3); }
      .toc a { padding: 6px 10px; border-radius: 8px; font-size: 13px; font-weight: 600; color: var(--text-2); text-decoration: none; border-left: 2px solid transparent; }
      .toc a:hover { background: var(--surface); color: var(--text); }
      .toc a.is-active { color: var(--jade-700); background: var(--jade-50); }
      .sections { min-width: 0; }
      @media (max-width: 1023px) {
        .layout { grid-template-columns: minmax(0, 1fr); }
        .toc { position: static; max-height: none; flex-direction: row; overflow-x: auto; gap: 6px; padding-bottom: 6px; border-bottom: 1px solid var(--border); }
        .toc-group { flex-direction: row; gap: 4px; flex: none; }
        .toc-title { display: none; }
        .toc a { white-space: nowrap; background: var(--surface); box-shadow: inset 0 0 0 1px var(--border); }
      }
    `,
  ],
})
export class UiComponentsComponent implements AfterViewInit, OnDestroy {
  private host = inject<ElementRef<HTMLElement>>(ElementRef);
  private observer?: IntersectionObserver;

  active = signal('forms');

  readonly toc: TocGroup[] = [
    { title: 'Usage', items: [{ id: 'forms', label: 'Form vs standalone' }] },
    {
      title: 'Form controls',
      items: [
        { id: 'input', label: 'Input' },
        { id: 'textarea', label: 'Textarea' },
        { id: 'number', label: 'Number' },
        { id: 'select', label: 'Select' },
        { id: 'multi-select', label: 'Multi-select' },
        { id: 'date-picker', label: 'Date picker' },
        { id: 'date-range', label: 'Date range' },
        { id: 'time-picker', label: 'Time picker' },
        { id: 'checkbox', label: 'Checkbox' },
        { id: 'radio', label: 'Radio group' },
        { id: 'switch', label: 'Switch' },
        { id: 'slider', label: 'Slider' },
        { id: 'upload', label: 'Upload' },
      ],
    },
    {
      title: 'Display',
      items: [
        { id: 'button', label: 'Button' },
        { id: 'tag', label: 'Tag' },
        { id: 'avatar', label: 'Avatar' },
        { id: 'card', label: 'Card' },
        { id: 'alert', label: 'Alert' },
        { id: 'empty', label: 'Empty state' },
      ],
    },
    {
      title: 'Overlays',
      items: [
        { id: 'modal', label: 'Modal' },
        { id: 'confirm', label: 'Confirm & toast' },
      ],
    },
  ];

  ngAfterViewInit(): void {
    const sections = this.host.nativeElement.querySelectorAll<HTMLElement>('.doc-section');
    this.observer = new IntersectionObserver(
      entries => {
        const visible = entries.filter(e => e.isIntersecting).sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top);
        if (visible[0]) this.active.set(visible[0].target.id);
      },
      { rootMargin: '-80px 0px -65% 0px' },
    );
    sections.forEach(s => this.observer!.observe(s));
  }

  ngOnDestroy(): void {
    this.observer?.disconnect();
  }

  go(e: Event, id: string): void {
    e.preventDefault();
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    this.active.set(id);
    history.replaceState(null, '', `#${id}`);
  }
}
