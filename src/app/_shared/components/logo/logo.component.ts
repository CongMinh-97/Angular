import { Component, input } from '@angular/core';

let nextId = 0;

// Brand mark: two harbour piers (an "H") over a tide line.
@Component({
  selector: 'app-logo',
  standalone: true,
  template: `
    <svg [attr.width]="size()" [attr.height]="size()" viewBox="0 0 40 40" fill="none" aria-hidden="true">
      <defs>
        <linearGradient [attr.id]="gid" x1="0" y1="0" x2="40" y2="40" gradientUnits="userSpaceOnUse">
          <stop stop-color="#2FD3B0" />
          <stop offset="1" stop-color="#0D8A74" />
        </linearGradient>
      </defs>
      <rect width="40" height="40" rx="11" [attr.fill]="'url(#' + gid + ')'" />
      <path d="M13 10v14M27 10v14M13 17h14" stroke="#0F1324" stroke-width="3.4" stroke-linecap="round" />
      <path d="M8 29.5c2.4 0 2.4-2 4.8-2s2.4 2 4.8 2 2.4-2 4.8-2 2.4 2 4.8 2 2.4-2 4.8-2" stroke="#fff" stroke-width="2.4" stroke-linecap="round" />
    </svg>
  `,
  styles: [':host{display:inline-flex;flex:none}'],
})
export class LogoComponent {
  size = input(32);
  // Each instance needs its own gradient id: a url(#id) pointing into a display:none copy renders nothing.
  readonly gid = `hb-logo-${nextId++}`;
}
