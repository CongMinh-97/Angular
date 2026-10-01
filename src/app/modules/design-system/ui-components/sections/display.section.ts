import { Component, signal } from '@angular/core';
import { UI_DISPLAY } from '@ui';
import { ApiRow, DOC } from '../doc.components';

@Component({
  selector: 'section-display',
  standalone: true,
  imports: [...DOC, ...UI_DISPLAY],
  template: `
    <doc-section anchor="button" heading="Button" selector="button[ui-button] · a[ui-button]" intro="Attribute component on a native button or link, so type, form submit, routerLink and keyboard behaviour stay native. One primary button per view.">
      <doc-example heading="Variants" [code]="code.variants">
        <button ui-button variant="primary">Primary</button>
        <button ui-button variant="secondary">Secondary</button>
        <button ui-button variant="soft">Soft</button>
        <button ui-button variant="ghost">Ghost</button>
        <button ui-button variant="dark">Dark</button>
        <button ui-button variant="danger">Danger</button>
        <button ui-button variant="danger-soft">Danger soft</button>
        <button ui-button variant="link">Link</button>
      </doc-example>

      <doc-example heading="Sizes and icons" [code]="code.sizes">
        <button ui-button variant="primary" size="sm" icon="plus">Small</button>
        <button ui-button variant="primary" icon="plus">Medium</button>
        <button ui-button variant="primary" size="lg" icon="plus">Large</button>
        <button ui-button variant="secondary" iconRight="arrow-right">Next step</button>
        <button ui-button variant="secondary" icon="download">Export</button>
        <a ui-button variant="link" href="#button" iconRight="arrow-right">As a link</a>
      </doc-example>

      <doc-example heading="Icon only" description="Square buttons for toolbars and table rows. Always give them an aria-label." [code]="code.iconOnly">
        <button ui-button variant="secondary" icon="edit" iconOnly aria-label="Edit"></button>
        <button ui-button variant="ghost" icon="delete" iconOnly aria-label="Delete"></button>
        <button ui-button variant="soft" icon="setting" iconOnly aria-label="Settings"></button>
        <button ui-button variant="primary" icon="plus" iconOnly pill aria-label="Add"></button>
        <button ui-button variant="ghost" size="sm" icon="more" iconOnly aria-label="More"></button>
      </doc-example>

      <doc-example heading="States" [code]="code.states">
        <button ui-button variant="primary" [loading]="loading()" (click)="fakeSave()">{{ loading() ? 'Saving…' : 'Click to save' }}</button>
        <button ui-button variant="secondary" loading>Loading</button>
        <button ui-button variant="primary" disabled>Disabled</button>
        <button ui-button variant="secondary" pill icon="star">Pill</button>
      </doc-example>

      <doc-example heading="Full width" [code]="code.block" stack>
        <button ui-button variant="primary" size="lg" block iconRight="arrow-right">Continue</button>
      </doc-example>
      <doc-api heading="ui-button" [rows]="buttonApi" />
    </doc-section>

    <doc-section anchor="tag" heading="Tag" selector="<ui-tag>" intro="Status, category or count. The text carries the meaning; colour reinforces it.">
      <doc-example heading="Tones" [code]="code.tones">
        @for (t of tones; track t) {
          <ui-tag [tone]="t">{{ t }}</ui-tag>
        }
      </doc-example>
      <doc-example heading="Variants, dot, icon and sizes" [code]="code.tagVariants">
        <ui-tag tone="success" dot>Active</ui-tag>
        <ui-tag tone="info" dot>Invited</ui-tag>
        <ui-tag tone="danger" dot>Suspended</ui-tag>
        <ui-tag tone="violet" variant="solid">Manager</ui-tag>
        <ui-tag tone="neutral" variant="solid">Admin</ui-tag>
        <ui-tag tone="jade" variant="outline" icon="check">Verified</ui-tag>
        <ui-tag tone="warning" size="sm">Beta</ui-tag>
        <ui-tag tone="coral" size="lg">Hot deal</ui-tag>
      </doc-example>
      <doc-example heading="Closable (active filters)" [code]="code.closable">
        @for (f of filters(); track f) {
          <ui-tag tone="jade" closable (close)="removeFilter(f)">{{ f }}</ui-tag>
        }
        @if (!filters().length) {
          <button ui-button variant="link" (click)="resetFilters()">Restore filters</button>
        }
      </doc-example>
    </doc-section>

    <doc-section anchor="avatar" heading="Avatar" selector="<ui-avatar> · <ui-avatar-group>" intro="Photo or initials. Colour is derived from the name, so the same person always looks the same.">
      <doc-example heading="Sizes, photo and presence" [code]="code.avatar">
        <ui-avatar name="Nguyễn Minh Anh" size="xs" />
        <ui-avatar name="Trần Thảo Vy" size="sm" />
        <ui-avatar name="Lê Quốc Bảo" status="online" />
        <ui-avatar name="Phạm Gia Huy" size="lg" status="busy" />
        <ui-avatar name="Hoàng Ngọc Lan" size="xl" status="away" />
        <ui-avatar name="Harbor" shape="square" size="lg" color="#0f1324" />
        <ui-avatar name="Broken image" src="/missing.png" size="lg" />
      </doc-example>
      <doc-example heading="Group" [code]="code.group">
        <ui-avatar-group [people]="team" [max]="4" />
        <ui-avatar-group [people]="team" [max]="3" size="md" />
      </doc-example>
    </doc-section>

    <doc-section anchor="card" heading="Card" selector="<ui-card>" intro="Container for one topic, with optional icon, header actions and footer.">
      <doc-example heading="Variants" [code]="code.card" grid>
        <ui-card heading="Storage" subtitle="64% of 50 GB used" icon="inbox">
          <ui-tag uiCardActions tone="warning" size="sm">Almost full</ui-tag>
          <p class="muted">Old exports are deleted after 30 days.</p>
          <div uiCardFooter>
            <button ui-button variant="ghost" size="sm">Details</button>
            <button ui-button variant="soft" size="sm">Upgrade</button>
          </div>
        </ui-card>
        <ui-card heading="Elevated" subtitle="variant=&quot;elevated&quot;" variant="elevated">
          <p class="muted">For content that floats above the page, like a summary pinned to the side.</p>
        </ui-card>
        <ui-card variant="flat" padding="lg">
          <strong>Flat, no header</strong>
          <p class="muted">Grouping inside another card or a form.</p>
        </ui-card>
      </doc-example>
    </doc-section>

    <doc-section anchor="alert" heading="Alert" selector="<ui-alert>" intro="Persistent message about the page or a section. Use a toast for the result of an action instead.">
      <doc-example heading="Tones and variants" [code]="code.alert" stack>
        <ui-alert tone="info">Sync starts every 15 minutes. The last one finished at 09:45.</ui-alert>
        <ui-alert tone="success" heading="Import finished">42 users were added and invited.</ui-alert>
        <ui-alert tone="warning" heading="Two rows were skipped" variant="outline">Their email addresses already belong to existing users.</ui-alert>
        <ui-alert tone="danger" heading="Payment failed" variant="accent" closable>
          Update your card to keep the workspace active.
          <button uiAlertActions ui-button variant="danger" size="sm">Update card</button>
          <button uiAlertActions ui-button variant="ghost" size="sm">Remind me later</button>
        </ui-alert>
      </doc-example>
    </doc-section>

    <doc-section anchor="empty" heading="Empty state" selector="<ui-empty>" intro="Say what is missing and what to do next.">
      <doc-example heading="Default and small" [code]="code.empty" grid>
        <ui-empty icon="team" heading="No users yet" description="Invite your first teammate, or import a list from a CSV file.">
          <button ui-button variant="secondary" icon="cloud-upload">Import</button>
          <button ui-button variant="primary" icon="plus">Invite</button>
        </ui-empty>
        <ui-empty size="sm" icon="search" heading="No matches" description="Try a different search or clear the filters." />
      </doc-example>
    </doc-section>
  `,
  styles: [`.muted { margin: 0; color: var(--text-2); font-size: 13px; } strong { display: block; }`],
})
export class DisplaySectionComponent {
  readonly tones = ['neutral', 'jade', 'success', 'warning', 'danger', 'info', 'violet', 'coral'] as const;
  readonly team = ['Nguyễn Minh Anh', 'Trần Thảo Vy', 'Lê Quốc Bảo', 'Phạm Gia Huy', 'Hoàng Ngọc Lan', 'Võ Thanh Sơn', 'Đỗ Minh Khánh'].map(name => ({ name }));
  private readonly initialFilters = ['Role: Admin', 'City: Đà Nẵng', 'Status: Active'];

  loading = signal(false);
  filters = signal(this.initialFilters);

  fakeSave(): void {
    this.loading.set(true);
    setTimeout(() => this.loading.set(false), 1500);
  }

  removeFilter(f: string): void {
    this.filters.update(list => list.filter(x => x !== f));
  }

  resetFilters(): void {
    this.filters.set(this.initialFilters);
  }

  readonly buttonApi: ApiRow[] = [
    { name: 'variant', type: "'primary' | 'secondary' | 'soft' | 'ghost' | 'dark' | 'danger' | 'danger-soft' | 'link'", default: "'secondary'", description: 'Visual weight.' },
    { name: 'size', type: "'sm' | 'md' | 'lg'", default: "'md'", description: '30 / 38 / 46 px.' },
    { name: 'icon / iconRight', type: 'string', description: 'Ant icon name before / after the label.' },
    { name: 'iconOnly', type: 'boolean', default: 'false', description: 'Square, icon only. Add aria-label.' },
    { name: 'loading', type: 'boolean', default: 'false', description: 'Spinner, disables clicks, sets aria-busy.' },
    { name: 'disabled', type: 'boolean', default: 'false', description: 'On <a>, sets aria-disabled and blocks navigation.' },
    { name: 'block / pill', type: 'boolean', default: 'false', description: 'Full width / fully rounded.' },
    { name: 'type', type: "'button' | 'submit' | 'reset'", default: "'button'", description: 'Defaults to button so it never submits a form by accident.' },
  ];

  readonly code = {
    variants: `<button ui-button variant="primary">Primary</button>
<button ui-button variant="secondary">Secondary</button>
<button ui-button variant="soft">Soft</button>
<button ui-button variant="ghost">Ghost</button>
<button ui-button variant="dark">Dark</button>
<button ui-button variant="danger">Danger</button>
<button ui-button variant="danger-soft">Danger soft</button>
<button ui-button variant="link">Link</button>`,
    sizes: `<button ui-button variant="primary" size="sm" icon="plus">Small</button>
<button ui-button variant="primary" icon="plus">Medium</button>
<button ui-button variant="primary" size="lg" icon="plus">Large</button>
<button ui-button iconRight="arrow-right">Next step</button>
<a ui-button variant="link" routerLink="/users" iconRight="arrow-right">View all</a>`,
    iconOnly: `<button ui-button icon="edit" iconOnly aria-label="Edit"></button>
<button ui-button variant="ghost" icon="delete" iconOnly aria-label="Delete"></button>
<button ui-button variant="primary" icon="plus" iconOnly pill aria-label="Add"></button>`,
    states: `<button ui-button variant="primary" [loading]="saving()" (click)="save()">Save</button>
<button ui-button variant="primary" disabled>Disabled</button>
<button ui-button variant="primary" type="submit">Submit form</button>`,
    block: `<button ui-button variant="primary" size="lg" block iconRight="arrow-right">Continue</button>`,
    tones: `<ui-tag tone="neutral">neutral</ui-tag>
<ui-tag tone="jade">jade</ui-tag>
<ui-tag tone="success">success</ui-tag>
… warning · danger · info · violet · coral`,
    tagVariants: `<ui-tag tone="success" dot>Active</ui-tag>
<ui-tag tone="violet" variant="solid">Manager</ui-tag>
<ui-tag tone="jade" variant="outline" icon="check">Verified</ui-tag>
<ui-tag tone="warning" size="sm">Beta</ui-tag>`,
    closable: `@for (f of filters(); track f) {
  <ui-tag tone="jade" closable (close)="removeFilter(f)">{{ f }}</ui-tag>
}`,
    avatar: `<ui-avatar name="Nguyễn Minh Anh" size="xs" />
<ui-avatar name="Lê Quốc Bảo" status="online" />
<ui-avatar [src]="user.photo" [name]="user.name" size="lg" status="busy" />
<ui-avatar name="Harbor" shape="square" color="#0f1324" />`,
    group: `<ui-avatar-group [people]="team" [max]="4" />   // team: { name, src? }[]`,
    card: `<ui-card heading="Storage" subtitle="64% of 50 GB used" icon="inbox">
  <ui-tag uiCardActions tone="warning" size="sm">Almost full</ui-tag>
  <p>Old exports are deleted after 30 days.</p>
  <div uiCardFooter>
    <button ui-button variant="soft" size="sm">Upgrade</button>
  </div>
</ui-card>

<ui-card variant="elevated">…</ui-card>
<ui-card variant="flat" padding="lg">…</ui-card>`,
    alert: `<ui-alert tone="info">Sync starts every 15 minutes.</ui-alert>
<ui-alert tone="success" heading="Import finished">42 users were added.</ui-alert>
<ui-alert tone="warning" variant="outline" heading="Two rows were skipped">…</ui-alert>
<ui-alert tone="danger" variant="accent" heading="Payment failed" closable>
  Update your card to keep the workspace active.
  <button uiAlertActions ui-button variant="danger" size="sm">Update card</button>
</ui-alert>`,
    empty: `<ui-empty icon="team" heading="No users yet"
          description="Invite your first teammate, or import a list from a CSV file.">
  <button ui-button variant="primary" icon="plus">Invite</button>
</ui-empty>`,
  };
}
