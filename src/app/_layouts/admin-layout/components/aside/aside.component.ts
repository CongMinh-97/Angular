import { Component, inject } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { NzToolTipModule } from 'ng-zorro-antd/tooltip';
import { environment } from '@environments/environment';
import { ADMIN_MENU } from '@shared/constants/menu.const';
import { LogoComponent } from '@shared/components/logo/logo.component';
import { GlobalStore } from '@store/global.store';

@Component({
  selector: 'app-aside',
  standalone: true,
  imports: [RouterLink, RouterLinkActive, NzIconModule, NzToolTipModule, LogoComponent],
  templateUrl: './aside.component.html',
  styleUrls: ['./aside.component.scss'],
})
export class AsideComponent {
  readonly store = inject(GlobalStore);
  readonly appName = environment.appName;
  readonly mockApi = environment.mockApi;
  readonly menu = ADMIN_MENU;
}
