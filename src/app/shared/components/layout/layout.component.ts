import { Component, OnInit } from '@angular/core';
import { RouterOutlet, Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { NzLayoutModule } from 'ng-zorro-antd/layout';
import { NzMenuModule } from 'ng-zorro-antd/menu';
import { NzAvatarModule } from 'ng-zorro-antd/avatar';
import { NzDropDownModule } from 'ng-zorro-antd/dropdown';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { NzBadgeModule } from 'ng-zorro-antd/badge';
import { NzInputModule } from 'ng-zorro-antd/input';
import { AuthService } from '@services/auth.service';
import { User } from '@models/auth.model';
import {
  MenuFoldOutline,
  MenuUnfoldOutline,
  LogoutOutline,
  SettingOutline,
  UserOutline,
  BellOutline,
  SearchOutline,
} from '@ant-design/icons-angular/icons';

@Component({
  selector: 'app-layout',
  standalone: true,
  imports: [
    CommonModule,
    RouterOutlet,
    NzLayoutModule,
    NzMenuModule,
    NzAvatarModule,
    NzDropDownModule,
    NzButtonModule,
    NzIconModule,
    NzBadgeModule,
    NzInputModule,
  ],
  templateUrl: './layout.component.html',
  styleUrls: ['./layout.component.scss'],
})
export class LayoutComponent implements OnInit {
  isCollapsed = false;
  user: User | null = null;

  constructor(
    private authService: AuthService,
    private router: Router
  ) {
    this.icons = [
      MenuFoldOutline,
      MenuUnfoldOutline,
      LogoutOutline,
      SettingOutline,
      UserOutline,
      BellOutline,
      SearchOutline,
    ];
  }

  icons: any[] = [];

  ngOnInit(): void {
    this.authService.user$.subscribe(user => {
      this.user = user;
    });
  }

  toggleMenu(): void {
    this.isCollapsed = !this.isCollapsed;
  }

  logout(): void {
    this.authService.logout();
    this.router.navigate(['/login']);
  }
}
