# Component Library Documentation

## Overview

The Angular Base application includes a comprehensive component library designed for enterprise applications. All components follow Angular best practices and use standalone component architecture.

## Core Components

### 1. DataTable Component

**Path**: `src/app/shared/components/table/data-table.component.ts`

**Purpose**: Display tabular data with advanced features like sorting, filtering, pagination, and column visibility toggle.

**Usage**:
```typescript
import { DataTableComponent, TableConfig, Column } from '@shared/components/table/data-table.component';

@Component({
  imports: [DataTableComponent]
})
export class MyComponent {
  config: TableConfig = {
    columns: [
      { key: 'id', title: 'ID', width: '80px', sortable: true },
      { key: 'name', title: 'Name', sortable: true, filterable: true },
      { key: 'email', title: 'Email' },
      { key: 'status', title: 'Status', render: (row) => row.status.toUpperCase() }
    ],
    data: [
      { id: 1, name: 'John Doe', email: 'john@example.com', status: 'active' },
      // ... more data
    ],
    total: 100,
    pageSize: 10,
    currentPage: 1,
    showRowNumber: true,
    selectable: true
  };

  onPageChange(page: number) {
    console.log('Page changed to:', page);
  }

  onRowSelect(rows: any[]) {
    console.log('Selected rows:', rows);
  }
}
```

**Features**:
- Pagination with page size selector
- Column sorting
- Row selection
- Row click events
- Custom cell rendering
- Column visibility toggle
- Responsive design

---

### 2. FormBuilder Component

**Path**: `src/app/shared/components/forms/form-builder.component.ts`

**Purpose**: Generate dynamic forms with built-in validation and error handling.

**Usage**:
```typescript
import { FormBuilderComponent, FormField } from '@shared/components/forms/form-builder.component';

@Component({
  imports: [FormBuilderComponent]
})
export class MyComponent {
  formFields: FormField[] = [
    {
      key: 'name',
      label: 'Full Name',
      type: 'text',
      required: true,
      placeholder: 'Enter your name'
    },
    {
      key: 'email',
      label: 'Email Address',
      type: 'email',
      required: true,
      placeholder: 'Enter your email'
    },
    {
      key: 'category',
      label: 'Category',
      type: 'select',
      required: true,
      options: [
        { label: 'Category A', value: 'cat-a' },
        { label: 'Category B', value: 'cat-b' }
      ]
    },
    {
      key: 'description',
      label: 'Description',
      type: 'textarea',
      placeholder: 'Enter description'
    },
    {
      key: 'publish',
      label: 'Publish',
      type: 'checkbox',
      value: false
    }
  ];

  onFormSubmit(formData: any) {
    console.log('Form submitted:', formData);
  }

  onFormCancel() {
    console.log('Form cancelled');
  }
}
```

**Supported Field Types**:
- `text` - Single line text input
- `email` - Email input with validation
- `password` - Password input
- `number` - Numeric input
- `textarea` - Multi-line text
- `select` - Dropdown selection
- `date` - Date picker
- `checkbox` - Boolean toggle
- `radio` - Radio button group

---

### 3. RichTextEditor Component

**Path**: `src/app/shared/components/editor/rich-text-editor.component.ts`

**Purpose**: Provide a rich text editing experience with CKEditor 5 integration.

**Usage**:
```typescript
import { RichTextEditorComponent } from '@shared/components/editor/rich-text-editor.component';
import { FormBuilder, FormGroup } from '@angular/forms';

@Component({
  imports: [RichTextEditorComponent, ReactiveFormsModule]
})
export class MyComponent {
  form: FormGroup;

  constructor(private fb: FormBuilder) {
    this.form = this.fb.group({
      content: ['']
    });
  }

  onContentChange(content: string) {
    console.log('Editor content changed:', content);
    this.form.patchValue({ content });
  }
}
```

**HTML**:
```html
<app-rich-text-editor
  [placeholder]="'Enter your content...'"
  [height]="'500px'"
  (contentChange)="onContentChange($event)"
  [formControl]="form.get('content')"
></app-rich-text-editor>
```

**Features**:
- Bold, Italic, Underline formatting
- Heading levels
- Bulleted and numbered lists
- Links
- Image upload with drag & drop
- Text alignment
- Undo/Redo
- Clean HTML output

---

### 4. ChartContainer Component

**Path**: `src/app/shared/components/charts/chart-container.component.ts`

**Purpose**: Display interactive charts with multiple types support.

**Supported Chart Types**:
- `line` - Line charts for trends
- `bar` - Bar charts for comparisons
- `pie` - Pie charts for distribution
- `doughnut` - Doughnut charts for circular data
- `radar` - Radar charts for multi-dimensional data
- `polar` - Polar charts for angular distribution

**Usage**:
```typescript
import { ChartContainerComponent } from '@shared/components/charts/chart-container.component';
import { ChartConfig, DEFAULT_LINE_CHART } from '@shared/components/charts/chart-types';

@Component({
  imports: [ChartContainerComponent]
})
export class MyComponent {
  chartConfig: ChartConfig = {
    type: 'line',
    labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
    data: [
      {
        label: 'Sales',
        data: [12, 19, 3, 5, 2, 3],
        borderColor: '#00d4a8',
        backgroundColor: 'rgba(0, 212, 168, 0.1)',
        tension: 0.4,
        fill: true
      }
    ]
  };
}
```

**HTML**:
```html
<app-chart-container
  [config]="chartConfig"
  [title]="'Monthly Sales'"
  [height]="'400px'"
></app-chart-container>
```

**Color Palette**:
```typescript
const colors = {
  primary: '#2d3e63',
  secondary: '#ff6b35',
  accent: '#00d4a8',
  tertiary: '#7c5cff',
  success: '#52c41a',
  warning: '#faad14',
  error: '#f5222d'
};
```

---

### 5. Layout Component

**Path**: `src/app/shared/components/layout/layout.component.ts`

**Purpose**: Provide the main application layout with header, sidebar, and content area.

**Features**:
- Collapsible sidebar
- Header with user menu
- Search functionality
- Notification bell
- Settings menu
- Logout button
- Responsive design

**Usage**: Automatically used in `AppComponent`

---

## Style System

### Global Variables

**File**: `src/styles/variables.scss`

All design tokens are defined in this file and can be customized:

```scss
// Primary Colors
$primary-dark: #1a1f3a;
$primary-main: #2d3e63;
$primary-light: #5a7a9e;
$primary-lighter: #8fa3c1;

// Secondary Colors
$secondary-main: #ff6b35;
$secondary-light: #ff8560;
$secondary-lighter: #ffa580;

// Accent Colors
$accent-main: #00d4a8;
$accent-dark: #00a085;
$accent-light: #33e6c0;

// Spacing
$spacing-xs: 4px;
$spacing-sm: 8px;
$spacing-md: 12px;
$spacing-lg: 16px;
$spacing-xl: 24px;

// Border Radius
$radius-sm: 4px;
$radius-md: 6px;
$radius-lg: 8px;
$radius-xl: 12px;
$radius-2xl: 16px;
```

### Utility Classes

Common CSS utility classes are available:

```html
<!-- Display -->
<div class="d-flex flex-col items-center justify-center gap-lg">
  
  <!-- Padding & Margin -->
  <div class="p-lg mb-lg">
    Content with padding and margin
  </div>

  <!-- Text -->
  <p class="text-lg font-semibold text-accent">
    Accent text
  </p>

  <!-- Colors -->
  <div class="bg-primary text-white p-lg rounded-lg">
    Colored background
  </div>

  <!-- Shadows -->
  <div class="shadow-md rounded-lg p-lg">
    Card with shadow
  </div>
</div>
```

---

## Authentication

### AuthService

**Path**: `src/app/core/services/auth.service.ts`

**Methods**:
- `login(request)` - Authenticate user
- `logout()` - Clear session
- `getCurrentUser()` - Get current user
- `getToken()` - Get auth token
- `isAuthenticated()` - Check auth status

**Observables**:
- `user$` - Current user observable
- `token$` - Token observable
- `isAuthenticated$` - Auth status observable

**Usage**:
```typescript
import { AuthService } from '@services/auth.service';

@Component({...})
export class MyComponent {
  constructor(private authService: AuthService) {}

  login() {
    this.authService.login({
      username: 'admin',
      password: 'password123'
    }).subscribe({
      next: () => console.log('Login successful'),
      error: (err) => console.log('Login failed')
    });
  }

  logout() {
    this.authService.logout();
  }
}
```

---

## Interceptors

### HttpInterceptor

**Path**: `src/app/core/interceptors/http.interceptor.ts`

Automatically adds:
- Authorization header with Bearer token
- Content-Type: application/json

### ErrorInterceptor

**Path**: `src/app/core/interceptors/error.interceptor.ts`

Handles:
- 401 Unauthorized - Logout and redirect to login
- 403 Forbidden - Permission error
- 404 Not Found - Resource not found
- 500 Server Error - Server error
- Network errors

---

## Routing

### Protected Routes

**Path**: `src/app/app.routes.ts`

Routes are protected with `AuthGuard`. Add new routes:

```typescript
{
  path: 'users',
  canActivate: [AuthGuard],
  loadComponent: () => import('./features/users/users.component').then(m => m.UsersComponent)
}
```

---

## Best Practices

1. **Use TypeScript paths** for clean imports:
   ```typescript
   import { AuthService } from '@services/auth.service';
   import { User } from '@models/auth.model';
   ```

2. **Follow the folder structure**:
   - `core/` - Services, guards, interceptors, models
   - `features/` - Feature modules
   - `shared/` - Shared components, pipes, directives

3. **Use Reactive Forms** for complex forms

4. **Leverage observables** for async operations

5. **Implement OnDestroy** to prevent memory leaks:
   ```typescript
   ngOnDestroy() {
     this.subscription.unsubscribe();
   }
   ```

6. **Use ChangeDetectionStrategy.OnPush** for performance:
   ```typescript
   @Component({
     changeDetection: ChangeDetectionStrategy.OnPush
   })
   ```

---

## Customization

### Changing Colors

Edit `src/styles/variables.scss` and update the color variables.

### Adding New Components

1. Create component in `src/app/shared/components/`
2. Use standalone component syntax
3. Add SCSS file with styles
4. Export in component decorator

### Extending Services

Add new methods to existing services or create new services in `src/app/core/services/`

---

## Performance Tips

1. Use lazy loading for feature modules
2. Implement OnPush change detection
3. Use TrackBy with ngFor
4. Unsubscribe from observables
5. Use async pipe in templates
6. Lazy load images
7. Optimize bundle size with tree shaking

---

## Troubleshooting

### Styles not applying

- Ensure SCSS is imported correctly
- Clear browser cache
- Check CSS specificity

### Components not rendering

- Verify imports in component
- Check route configuration
- Check browser console for errors

### API calls failing

- Check interceptor configuration
- Verify API endpoint
- Check network tab in DevTools
- Verify authentication token

---

For more information, see the main [README.md](./README.md)
