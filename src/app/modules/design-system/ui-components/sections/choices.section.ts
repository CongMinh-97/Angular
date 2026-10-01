import { JsonPipe } from '@angular/common';
import { Component, computed, signal } from '@angular/core';
import {
  UiCheckboxComponent,
  UiCheckboxGroupComponent,
  UiOption,
  UiRadioGroupComponent,
  UiSliderComponent,
  UiSliderValue,
  UiSwitchComponent,
  UiUploadComponent,
  UiUploadFile,
} from '@ui';
import { ApiRow, DOC } from '../doc.components';

@Component({
  selector: 'section-choices',
  standalone: true,
  imports: [...DOC, JsonPipe, UiCheckboxComponent, UiCheckboxGroupComponent, UiRadioGroupComponent, UiSwitchComponent, UiSliderComponent, UiUploadComponent],
  template: `
    <doc-section anchor="checkbox" heading="Checkbox" selector="<ui-checkbox> · <ui-checkbox-group>" intro="A single yes/no (value: boolean) or several picks from a short list (value: array).">
      <doc-example heading="Single checkbox" [code]="code.single" grid>
        <ui-checkbox [(value)]="agree" text="I agree to the terms of service" />
        <ui-checkbox text="Email me product news" description="About once a month. Unsubscribe any time." [value]="true" />
        <ui-checkbox text="Indeterminate" indeterminate />
        <ui-checkbox text="Disabled" [value]="true" disabled />
        <ui-checkbox text="Required to continue" error="You need to accept the terms" />
      </doc-example>

      <doc-example heading="Checkbox group" description="Order of the value follows the options, not the click order." [code]="code.group" stack>
        <ui-checkbox-group label="Notify me by" [options]="channels" [(value)]="picked" />
        <ui-checkbox-group label="Permissions" [options]="perms" [columns]="3" showSelectAll />
        <ui-checkbox-group label="Vertical with descriptions" [options]="channelsDetailed" direction="vertical" />
      </doc-example>
      <div class="out">agree = <code>{{ agree() }}</code> · picked = <code>{{ picked() | json }}</code></div>
      <doc-api heading="ui-checkbox / ui-checkbox-group" [rows]="checkApi" />
    </doc-section>

    <doc-section anchor="radio" heading="Radio group" selector="<ui-radio-group>" intro="Exactly one choice. Three looks: classic radios, segmented buttons for 2–4 short options, and cards when each option needs explaining.">
      <doc-example heading="Default and button" [code]="code.radio" stack>
        <ui-radio-group label="Billing cycle" [options]="cycles" [(value)]="cycle" />
        <ui-radio-group label="View" variant="button" [options]="views" [(value)]="view" />
        <ui-radio-group label="Small buttons" variant="button" size="sm" [options]="views" value="week" />
      </doc-example>
      <doc-example heading="Cards" description="Arrow keys move between cards; only the selected card is in the tab order." [code]="code.cards" stack>
        <ui-radio-group label="Plan" variant="card" [options]="plans" [(value)]="plan" />
      </doc-example>
      <doc-api heading="ui-radio-group" [rows]="radioApi" />
    </doc-section>

    <doc-section anchor="switch" heading="Switch" selector="<ui-switch>" intro="For settings that turn something on or off. Use a checkbox instead when the choice only applies after pressing Save in a long form.">
      <doc-example heading="Variants" [code]="code.switch" grid>
        <ui-switch [(value)]="alerts" text="Email alerts" description="Daily summary at 08:00" />
        <ui-switch text="Small" size="sm" [value]="true" />
        <ui-switch text="With labels" onText="On" offText="Off" />
        <ui-switch text="Saving…" [value]="true" loading />
        <ui-switch text="Disabled" disabled />
      </doc-example>
      <doc-example heading="Settings list" description="placement=&quot;end&quot; puts the switch on the right, the usual pattern for preference pages." [code]="code.settings" stack>
        <div class="settings">
          <ui-switch placement="end" text="Two-factor authentication" description="Ask for a code from your phone at sign-in" [value]="true" />
          <ui-switch placement="end" text="Weekly report" description="Sent every Monday to all admins" />
          <ui-switch placement="end" text="Public profile" description="Anyone with the link can see your name and role" />
        </div>
      </doc-example>
    </doc-section>

    <doc-section anchor="slider" heading="Slider" selector="<ui-slider>" intro="Choose a number, or a range with two handles, when the exact value matters less than the rough position.">
      <doc-example heading="Single, range and marks" [code]="code.slider" grid>
        <ui-slider label="Seats" [min]="1" [max]="200" [(value)]="seats" />
        <ui-slider label="Budget" range [min]="0" [max]="500" unit=" tr" [(value)]="budget" />
        <ui-slider label="Priority" [min]="0" [max]="3" [marks]="priorityMarks" [value]="1" />
      </doc-example>
    </doc-section>

    <doc-section anchor="upload" heading="Upload" selector="<ui-upload>" intro="Choose files without sending them; the control value is the list of picked files (UiUploadFile[]). Size, type and count are checked before a file is accepted.">
      <doc-example heading="Drop zone" [code]="code.drop" stack>
        <ui-upload label="Attachments" accept=".pdf,.docx,.xlsx,image/*" [maxFiles]="5" [maxSizeMb]="10" [(value)]="files" />
      </doc-example>
      <doc-example heading="Button and image grid" [code]="code.image" grid>
        <ui-upload label="Contract" variant="button" accept=".pdf" [maxFiles]="1" buttonText="Choose PDF" />
        <ui-upload label="Product photos" variant="image" accept="image/*" [maxFiles]="4" [maxSizeMb]="5" />
      </doc-example>
      <div class="out">files = <code>{{ fileSummary() | json }}</code></div>
      <doc-api heading="ui-upload" [rows]="uploadApi" />
    </doc-section>
  `,
  styles: [
    `
      .out { font-size: 12.5px; color: var(--text-3); }
      code { font-family: 'JetBrains Mono', monospace; color: var(--text); }
      .settings { display: flex; flex-direction: column; border: 1px solid var(--border); border-radius: var(--radius); }
      .settings ui-switch { padding: 14px 16px; }
      .settings ui-switch + ui-switch { border-top: 1px solid var(--border); }
    `,
  ],
})
export class ChoicesSectionComponent {
  agree = signal<boolean | null>(false);
  picked = signal<string[] | null>(['email']);
  cycle = signal<string | null>('monthly');
  view = signal<string | null>('month');
  plan = signal<string | null>('team');
  alerts = signal<boolean | null>(true);
  seats = signal<UiSliderValue | null>(24);
  budget = signal<UiSliderValue | null>([50, 220]);
  files = signal<UiUploadFile[] | null>([]);

  readonly priorityMarks: Record<number, string> = { 0: 'Low', 1: 'Normal', 2: 'High', 3: 'Urgent' };

  fileSummary = computed(() => (this.files() ?? []).map(f => ({ name: f.name, size: f.size, type: f.type })));

  readonly channels: UiOption<string>[] = [
    { label: 'Email', value: 'email' },
    { label: 'SMS', value: 'sms' },
    { label: 'Zalo', value: 'zalo' },
    { label: 'Push', value: 'push' },
  ];
  readonly channelsDetailed: UiOption<string>[] = [
    { label: 'Mentions', value: 'mentions', description: 'Someone @mentions you in a comment' },
    { label: 'Assignments', value: 'assign', description: 'A task or ticket is assigned to you' },
    { label: 'Billing', value: 'billing', description: 'Invoices and payment problems', disabled: true },
  ];
  readonly perms: UiOption<string>[] = ['View users', 'Invite users', 'Edit users', 'Delete users', 'Export data', 'Manage billing'].map(p => ({
    label: p,
    value: p,
  }));
  readonly cycles: UiOption<string>[] = [
    { label: 'Monthly', value: 'monthly' },
    { label: 'Yearly (save 20%)', value: 'yearly' },
    { label: 'Custom', value: 'custom', disabled: true },
  ];
  readonly views: UiOption<string>[] = [
    { label: 'Day', value: 'day' },
    { label: 'Week', value: 'week' },
    { label: 'Month', value: 'month', icon: 'calendar' },
  ];
  readonly plans: UiOption<string>[] = [
    { label: 'Starter', value: 'starter', icon: 'rocket', description: 'Up to 5 people. Core dashboards and CSV import.' },
    { label: 'Team', value: 'team', icon: 'team', description: 'Up to 50 people. Roles, audit log and priority support.' },
    { label: 'Enterprise', value: 'enterprise', icon: 'bank', description: 'Unlimited people, SSO and a dedicated manager.' },
  ];

  readonly checkApi: ApiRow[] = [
    { name: 'text / content', type: 'string / slot', description: 'Inline label next to the box.' },
    { name: 'description', type: 'string', description: 'Second line under the text.' },
    { name: 'indeterminate', type: 'boolean', default: 'false', description: 'Partial state (single checkbox).' },
    { name: 'options', type: 'UiOption<T>[]', description: 'Group: the list of checkboxes.' },
    { name: 'direction', type: "'horizontal' | 'vertical'", default: "'horizontal'", description: 'Group layout.' },
    { name: 'columns', type: 'number', default: '0', description: 'Group: N equal columns.' },
    { name: 'showSelectAll', type: 'boolean', default: 'false', description: 'Group: a Select all box with indeterminate state.' },
    { name: 'Validators.requiredTrue', type: 'ValidatorFn', description: 'Use for “must accept” checkboxes.' },
  ];
  readonly radioApi: ApiRow[] = [
    { name: 'options', type: 'UiOption<T>[]', description: 'Card variant also uses icon and description.' },
    { name: 'variant', type: "'default' | 'button' | 'card'", default: "'default'", description: 'Look of the group.' },
    { name: 'direction', type: "'horizontal' | 'vertical'", default: "'horizontal'", description: 'For the default variant.' },
    { name: 'columns', type: 'number', default: 'one per option', description: 'Card grid columns.' },
  ];
  readonly uploadApi: ApiRow[] = [
    { name: 'variant', type: "'dropzone' | 'button' | 'image'", default: "'dropzone'", description: 'Look of the picker.' },
    { name: 'accept', type: 'string', description: 'Like <input accept>: "image/*", ".pdf,.docx".' },
    { name: 'maxFiles', type: 'number', default: '10', description: '1 = single file (replaces on pick).' },
    { name: 'maxSizeMb', type: 'number', default: '5', description: 'Per-file limit.' },
    { name: 'preview', type: 'boolean', default: 'true', description: 'Read images as data URLs for thumbnails.' },
    { name: 'value', type: 'UiUploadFile[]', description: '{ uid, name, size, type, file?, url? }. Upload value[i].file on save.' },
  ];

  readonly code = {
    single: `<ui-checkbox formControlName="terms" text="I agree to the terms of service" />
// terms: [false, Validators.requiredTrue]

<ui-checkbox [(value)]="news" text="Email me product news"
             description="About once a month." />`,
    group: `<ui-checkbox-group formControlName="channels" label="Notify me by" [options]="channels" />
<ui-checkbox-group label="Permissions" [options]="perms" [columns]="3" showSelectAll />
<ui-checkbox-group label="Events" [options]="events" direction="vertical" />`,
    radio: `<ui-radio-group formControlName="cycle" label="Billing cycle" [options]="cycles" />
<ui-radio-group label="View" variant="button" [options]="views" [(value)]="view" />`,
    cards: `plans: UiOption<string>[] = [
  { label: 'Starter', value: 'starter', icon: 'rocket', description: 'Up to 5 people…' },
  { label: 'Team', value: 'team', icon: 'team', description: 'Up to 50 people…' },
];

<ui-radio-group formControlName="plan" label="Plan" variant="card" [options]="plans" />`,
    switch: `<ui-switch formControlName="alerts" text="Email alerts" description="Daily summary at 08:00" />
<ui-switch text="With labels" onText="On" offText="Off" />
<ui-switch text="Saving…" [value]="true" [loading]="saving" />`,
    settings: `<ui-switch placement="end" text="Two-factor authentication"
           description="Ask for a code from your phone at sign-in" />`,
    slider: `<ui-slider formControlName="seats" label="Seats" [min]="1" [max]="200" />
<ui-slider label="Budget" range [min]="0" [max]="500" unit=" tr" [(value)]="budget" />
<ui-slider label="Priority" [max]="3" [marks]="{ 0: 'Low', 3: 'Urgent' }" />`,
    drop: `<ui-upload formControlName="attachments" label="Attachments"
           accept=".pdf,.docx,.xlsx,image/*" [maxFiles]="5" [maxSizeMb]="10" />

save() {
  const body = new FormData();
  for (const f of this.form.value.attachments) body.append('files', f.file);
  this.http.post('/api/attachments', body).subscribe();
}`,
    image: `<ui-upload label="Contract" variant="button" accept=".pdf" [maxFiles]="1" />
<ui-upload label="Product photos" variant="image" accept="image/*" [maxFiles]="4" />`,
  };
}
