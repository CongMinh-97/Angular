import { JsonPipe } from '@angular/common';
import { Component, signal } from '@angular/core';
import { UiMultiSelectComponent, UiOption, UiSelectComponent } from '@ui';
import { ApiRow, DOC } from '../doc.components';

const CITIES: UiOption<string>[] = [
  { label: 'Hà Nội', value: 'HN', group: 'North' },
  { label: 'Hải Phòng', value: 'HP', group: 'North' },
  { label: 'Quảng Ninh', value: 'QN', group: 'North' },
  { label: 'Đà Nẵng', value: 'DN', group: 'Central' },
  { label: 'Huế', value: 'HUE', group: 'Central' },
  { label: 'Khánh Hòa', value: 'KH', group: 'Central' },
  { label: 'TP. Hồ Chí Minh', value: 'HCM', group: 'South' },
  { label: 'Cần Thơ', value: 'CT', group: 'South' },
  { label: 'Bình Dương', value: 'BD', group: 'South' },
];

const ROLES: UiOption<string>[] = [
  { label: 'Admin', value: 'Admin', icon: 'crown', description: 'Full access, including billing and other admins' },
  { label: 'Manager', value: 'Manager', icon: 'team', description: 'Manage people and content in their department' },
  { label: 'Editor', value: 'Editor', icon: 'edit', description: 'Create and publish content' },
  { label: 'Viewer', value: 'Viewer', icon: 'eye', description: 'Read-only access', disabled: false },
  { label: 'Guest', value: 'Guest', icon: 'user', description: 'Invite pending approval', disabled: true },
];

const PEOPLE = ['Nguyễn Minh Anh', 'Trần Thảo Vy', 'Lê Quốc Bảo', 'Phạm Gia Huy', 'Hoàng Ngọc Lan', 'Võ Thanh Sơn', 'Đỗ Minh Khánh', 'Bùi Thanh Tâm', 'Đặng Yến', 'Huỳnh Phúc'];

const SKILLS: UiOption<string>[] = ['Angular', 'TypeScript', 'RxJS', 'Node.js', 'PostgreSQL', 'Figma', 'Docker', 'Kubernetes', 'Go', 'Python'].map(s => ({ label: s, value: s }));

@Component({
  selector: 'section-select',
  standalone: true,
  imports: [...DOC, JsonPipe, UiSelectComponent, UiMultiSelectComponent],
  template: `
    <doc-section anchor="select" heading="Select" selector="<ui-select>" intro="Pick one value from a list. Options can carry an icon, a description line, a group heading, and a disabled flag.">
      <doc-example heading="Basic, searchable and clearable" [code]="code.basic" grid>
        <ui-select label="City" [options]="cities" [(value)]="city" placeholder="Choose a city" />
        <ui-select label="Searchable" [options]="cities" searchable placeholder="Type to filter" />
        <ui-select label="Clearable" [options]="cities" clearable [(value)]="city2" />
      </doc-example>

      <doc-example heading="Groups, icons and descriptions" description="Grouped by the option's group field. Disabled options stay visible so people understand they exist." [code]="code.rich" grid>
        <ui-select label="Region" [options]="cities" searchable placeholder="Grouped by region" />
        <ui-select label="Role" [options]="roles" [(value)]="role" hint="What this person is allowed to do" />
      </doc-example>

      <doc-example heading="Remote search" description="serverSearch turns off local filtering; (search) fires with the query and you set [options] and [loading]." [code]="code.remote" grid>
        <ui-select label="Assign to" serverSearch [options]="remoteOptions()" [loading]="remoteLoading()" (search)="findPeople($event)" placeholder="Type a name" emptyText="Type at least 1 letter" />
      </doc-example>

      <doc-example heading="Sizes and states" [code]="code.states" grid>
        <ui-select size="sm" label="Small" [options]="cities" placeholder="Small" />
        <ui-select size="lg" label="Large" [options]="cities" placeholder="Large" />
        <ui-select label="Disabled" [options]="cities" value="HN" disabled />
        <ui-select label="Error" [options]="cities" error="Choose where this office is" />
      </doc-example>

      <doc-api heading="ui-select properties (plus the common control properties)" [rows]="selectApi" />
    </doc-section>

    <doc-section anchor="multi-select" heading="Multi-select" selector="<ui-multi-select>" intro="Pick several values. The value is always an array. Long selections collapse into “+N more”.">
      <doc-example heading="Basic and Select all" [code]="code.multi" grid>
        <ui-multi-select label="Cities" [options]="cities" [(value)]="multi" />
        <ui-multi-select label="With Select all" [options]="cities" showSelectAll [maxTagCount]="2" />
      </doc-example>

      <doc-example heading="Create tags and limit selection" description="allowCreate lets people type new values (Enter or comma). maxSelected stops further picks." [code]="code.tags" grid>
        <ui-multi-select label="Tags" allowCreate [(value)]="tags" placeholder="Type and press Enter" />
        <ui-multi-select label="Top 3 skills" [options]="skills" [maxSelected]="3" hint="Choose up to 3" />
        <ui-multi-select label="Error" [options]="skills" error="Choose at least one skill" />
      </doc-example>
      <div class="out">cities = <code>{{ multi() | json }}</code> · tags = <code>{{ tags() | json }}</code></div>

      <doc-api heading="ui-multi-select properties" [rows]="multiApi" />
    </doc-section>
  `,
  styles: [`.out { font-size: 12.5px; color: var(--text-3); } code { font-family: 'JetBrains Mono', monospace; color: var(--text); }`],
})
export class SelectSectionComponent {
  readonly cities = CITIES;
  readonly roles = ROLES;
  readonly skills = SKILLS;

  city = signal<string | null>('DN');
  city2 = signal<string | null>('HCM');
  role = signal<string | null>('Editor');
  multi = signal<string[] | null>(['HN', 'DN', 'HCM', 'CT']);
  tags = signal<string[] | null>(['vip', 'q3-launch']);

  remoteOptions = signal<UiOption<string>[]>([]);
  remoteLoading = signal(false);
  private timer?: ReturnType<typeof setTimeout>;

  findPeople(q: string): void {
    clearTimeout(this.timer);
    if (!q.trim()) {
      this.remoteOptions.set([]);
      return;
    }
    this.remoteLoading.set(true);
    // Simulates an API call.
    this.timer = setTimeout(() => {
      const term = q.toLowerCase();
      this.remoteOptions.set(PEOPLE.filter(p => p.toLowerCase().includes(term)).map(p => ({ label: p, value: p })));
      this.remoteLoading.set(false);
    }, 450);
  }

  readonly selectApi: ApiRow[] = [
    { name: 'options', type: 'UiOption<T>[]', default: '[]', description: '{ label, value, disabled?, description?, icon?, group? }' },
    { name: 'searchable', type: 'boolean', default: 'false', description: 'Filter options by typing.' },
    { name: 'clearable', type: 'boolean', default: 'false', description: 'Show a clear (×) button.' },
    { name: 'serverSearch', type: 'boolean', default: 'false', description: 'Disable local filtering; listen to (search).' },
    { name: 'loading', type: 'boolean', default: 'false', description: 'Spinner in the dropdown.' },
    { name: 'emptyText', type: 'string', default: "'No matches'", description: 'Shown when there are no options.' },
    { name: '(search)', type: 'string', description: 'Query typed by the user.' },
  ];

  readonly multiApi: ApiRow[] = [
    { name: 'options', type: 'UiOption<T>[]', description: 'Same shape as ui-select.' },
    { name: 'showSelectAll', type: 'boolean', default: 'false', description: '“Select all / Clear” bar under the list.' },
    { name: 'allowCreate', type: 'boolean', default: 'false', description: 'Tags mode: users can add new values.' },
    { name: 'maxTagCount', type: 'number', default: '3', description: 'Chips shown before “+N more”.' },
    { name: 'maxSelected', type: 'number', default: '0 (no limit)', description: 'Hard limit on selections.' },
    { name: 'minSelected(n) / maxSelected(n)', type: 'ValidatorFn', description: 'Validators exported from @ui for array values.' },
  ];

  readonly code = {
    basic: `cities: UiOption<string>[] = [
  { label: 'Hà Nội', value: 'HN', group: 'North' },
  { label: 'Đà Nẵng', value: 'DN', group: 'Central' },
  …
];

<ui-select label="City" [options]="cities" [(value)]="city" />
<ui-select label="Searchable" [options]="cities" searchable />
<ui-select formControlName="city" label="City" [options]="cities" clearable />`,
    rich: `roles: UiOption<string>[] = [
  { label: 'Admin', value: 'Admin', icon: 'crown', description: 'Full access, including billing' },
  { label: 'Guest', value: 'Guest', icon: 'user', description: 'Pending approval', disabled: true },
];

<ui-select label="Role" [options]="roles" hint="What this person is allowed to do" />`,
    remote: `<ui-select
  label="Assign to"
  serverSearch
  [options]="results()"
  [loading]="loading()"
  (search)="find($event)" />

find(q: string) {
  this.loading.set(true);
  this.api.searchPeople(q).subscribe(list => {
    this.results.set(list.map(p => ({ label: p.name, value: p.id })));
    this.loading.set(false);
  });
}`,
    states: `<ui-select size="sm" … />
<ui-select size="lg" … />
<ui-select … disabled />
<ui-select … error="Choose where this office is" />`,
    multi: `<ui-multi-select label="Cities" [options]="cities" [(value)]="selected" />
<ui-multi-select formControlName="cities" [options]="cities" showSelectAll [maxTagCount]="2" />`,
    tags: `<ui-multi-select label="Tags" allowCreate />
<ui-multi-select label="Top 3 skills" [options]="skills" [maxSelected]="3" />

// Validation on arrays
skills: [[], [minSelected(1), maxSelected(3)]]`,
  };
}
