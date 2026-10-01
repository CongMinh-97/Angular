import { Component, computed, input, signal } from '@angular/core';

const TONES = ['#0d8a74', '#f2643a', '#7b61ff', '#2d3e63', '#d98b0a', '#3a8ef6', '#c2417a'];
const SIZES = { xs: 24, sm: 30, md: 36, lg: 48, xl: 64 } as const;
export type UiAvatarSize = keyof typeof SIZES | number;
export type UiPresence = 'online' | 'away' | 'busy' | 'offline';

/** Two initials: last word + first word, which suits Vietnamese names (Nguyễn Minh Anh → AN). */
export function initialsOf(name: string): string {
  const parts = name.trim().split(/\s+/).filter(Boolean);
  if (!parts.length) return '?';
  if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
  return (parts[parts.length - 1][0] + parts[0][0]).toUpperCase();
}

/** Stable colour per name, so the same person always gets the same avatar colour. */
export function toneOf(name: string): string {
  // FNV-1a with a murmur finaliser: spreads similar names across the palette.
  let h = 2166136261;
  for (const ch of name) {
    h ^= ch.codePointAt(0)!;
    h = Math.imul(h, 16777619);
  }
  h ^= h >>> 16;
  h = Math.imul(h, 2246822507);
  h ^= h >>> 13;
  h = Math.imul(h, 3266489909);
  h ^= h >>> 16;
  return TONES[(h >>> 0) % TONES.length];
}

/**
 * <ui-avatar name="Nguyễn Minh Anh" />
 * <ui-avatar [src]="user.photo" [name]="user.name" size="lg" status="online" />
 */
@Component({
  selector: 'ui-avatar',
  standalone: true,
  host: { '[style.--s.px]': 'px()', '[class.is-square]': "shape() === 'square'", role: 'img', '[attr.aria-label]': 'name() || "Avatar"' },
  template: `
    @if (src() && !failed()) {
      <img [src]="src()" alt="" (error)="failed.set(true)" />
    } @else {
      <span class="ui-av-init" [style.background]="color() || bg()">{{ initials() }}</span>
    }
    @if (status()) {
      <span class="ui-av-st" [attr.data-st]="status()"></span>
    }
  `,
  styles: [
    `
      :host { position: relative; display: inline-flex; flex: none; width: var(--s); height: var(--s); border-radius: 50%; vertical-align: middle; }
      :host(.is-square) { border-radius: calc(var(--s) * 0.28); }
      img, .ui-av-init { width: 100%; height: 100%; border-radius: inherit; object-fit: cover; }
      .ui-av-init { display: grid; place-items: center; color: #fff; font-weight: 800; font-size: calc(var(--s) * 0.36); letter-spacing: 0.01em; }
      .ui-av-st { position: absolute; right: -1px; bottom: -1px; width: max(8px, calc(var(--s) * 0.28)); height: max(8px, calc(var(--s) * 0.28)); border-radius: 50%; border: 2px solid var(--surface); }
      [data-st='online'] { background: var(--success); }
      [data-st='away'] { background: var(--amber-500); }
      [data-st='busy'] { background: var(--danger); }
      [data-st='offline'] { background: var(--text-3); }
    `,
  ],
})
export class UiAvatarComponent {
  name = input('');
  src = input('');
  size = input<UiAvatarSize>('md');
  shape = input<'circle' | 'square'>('circle');
  status = input<UiPresence | null>(null);
  /** Override the generated background colour. */
  color = input('');

  failed = signal(false);
  px = computed(() => (typeof this.size() === 'number' ? (this.size() as number) : SIZES[this.size() as keyof typeof SIZES]));
  initials = computed(() => initialsOf(this.name()));
  bg = computed(() => toneOf(this.name()));
}

/**
 * Overlapping stack with a "+N" counter.
 * <ui-avatar-group [people]="team" [max]="4" size="sm" />
 */
@Component({
  selector: 'ui-avatar-group',
  standalone: true,
  imports: [UiAvatarComponent],
  template: `
    @for (p of visible(); track p.name) {
      <ui-avatar [name]="p.name" [src]="p.src ?? ''" [size]="size()" [attr.title]="p.name" />
    }
    @if (rest() > 0) {
      <span class="ui-avg-more num" [style.--s.px]="px()" [attr.title]="restNames()">+{{ rest() }}</span>
    }
  `,
  styles: [
    `
      :host { display: inline-flex; align-items: center; }
      :host > * { margin-left: -8px; box-shadow: 0 0 0 2px var(--surface); border-radius: 50%; }
      :host > *:first-child { margin-left: 0; }
      .ui-avg-more { width: var(--s); height: var(--s); display: grid; place-items: center; font-size: calc(var(--s) * 0.34); font-weight: 700; color: var(--text-2); background: var(--surface-2); }
    `,
  ],
})
export class UiAvatarGroupComponent {
  people = input<{ name: string; src?: string }[]>([]);
  max = input(4);
  size = input<UiAvatarSize>('sm');

  visible = computed(() => this.people().slice(0, this.max()));
  rest = computed(() => this.people().length - this.visible().length);
  restNames = computed(() => this.people().slice(this.max()).map(p => p.name).join(', '));
  px = computed(() => (typeof this.size() === 'number' ? (this.size() as number) : SIZES[this.size() as keyof typeof SIZES]));
}
