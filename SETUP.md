# Project Setup & Configuration Guide

## Initial Setup

### Prerequisites

- Node.js v22.22.0 or higher
- npm v10.9.4 or higher
- Git

### Installation Steps

1. **Clone the repository**
   ```bash
   git clone https://github.com/CongMinh-97/Angular.git
   cd Angular
   ```

2. **Install dependencies**
   ```bash
   npm install --legacy-peer-deps
   ```

3. **Start development server**
   ```bash
   npm start
   ```

   The application will open at `http://localhost:4200`

---

## Development

### Project Structure

```
Angular/
├── src/
│   ├── app/
│   │   ├── core/              # Core module (services, guards, interceptors)
│   │   │   ├── guards/        # Route guards
│   │   │   ├── interceptors/  # HTTP interceptors
│   │   │   ├── models/        # TypeScript interfaces
│   │   │   ├── services/      # Application services
│   │   │   └── utils/         # Utility functions
│   │   ├── features/          # Feature modules
│   │   │   ├── auth/          # Authentication pages
│   │   │   └── dashboard/     # Dashboard pages
│   │   ├── shared/            # Shared components & utilities
│   │   │   └── components/
│   │   │       ├── charts/
│   │   │       ├── forms/
│   │   │       ├── layout/
│   │   │       ├── table/
│   │   │       └── editor/
│   │   ├── app.component.ts   # Root component
│   │   └── app.routes.ts      # Route configuration
│   ├── styles/                # Global styles
│   │   ├── variables.scss     # Design tokens
│   │   └── themes.scss        # Theme definitions
│   ├── environments/          # Environment configs
│   ├── main.ts               # Application entry point
│   ├── index.html            # HTML template
│   └── styles.scss           # Global stylesheet
├── angular.json              # Angular configuration
├── tsconfig.json             # TypeScript configuration
├── tailwind.config.js        # Tailwind CSS configuration
├── postcss.config.js         # PostCSS configuration
├── package.json              # Dependencies
└── README.md                 # Project documentation
```

---

## Configuration

### Environment Variables

Create `.env` file (optional):
```env
API_URL=http://localhost:3000/api
API_KEY=your-api-key
ENVIRONMENT=development
```

### API Configuration

Update API endpoints in:
- `src/environments/environment.ts` (development)
- `src/environments/environment.prod.ts` (production)

**Example**:
```typescript
export const environment = {
  production: false,
  apiUrl: 'http://localhost:3000/api',
  apiKey: 'dev-key-12345',
  logLevel: 'debug',
};
```

### Authentication Configuration

The application uses JWT token-based authentication. Configure your auth API:

1. Update `src/app/core/services/auth.service.ts`
2. Change the API endpoint in the service
3. Update login model if needed

**Login Model** (`src/app/core/models/auth.model.ts`):
```typescript
export interface LoginRequest {
  username: string;
  password: string;
}

export interface LoginResponse {
  token: string;
  refreshToken?: string;
  user: User;
}
```

---

## Customization

### Color Palette

All colors are defined in `src/styles/variables.scss`:

```scss
// Primary Colors
$primary-dark: #1a1f3a;
$primary-main: #2d3e63;
$primary-light: #5a7a9e;

// Secondary Colors
$secondary-main: #ff6b35;

// Accent Colors
$accent-main: #00d4a8;

// Custom your colors here
```

After changing colors, all components will automatically update.

### Typography

Customize fonts in `src/styles/variables.scss`:

```scss
$font-family: 'Your Custom Font', sans-serif;
$font-size-base: 14px;
$line-height-base: 1.5;
```

### Spacing & Layout

Adjust spacing scale:
```scss
$spacing-xs: 4px;
$spacing-sm: 8px;
$spacing-md: 12px;
$spacing-lg: 16px;
$spacing-xl: 24px;
```

### Border Radius

Customize corner radius:
```scss
$radius-sm: 4px;
$radius-md: 6px;
$radius-lg: 8px;
$radius-xl: 12px;
$radius-2xl: 16px;
```

---

## Building for Production

### Build Command

```bash
npm run build
```

Output will be in `dist/angular-base/`

### Build Configuration

Modify build settings in `angular.json`:

```json
{
  "configurations": {
    "production": {
      "outputHashing": "all",
      "sourceMap": false,
      "optimization": true
    }
  }
}
```

### Bundle Analysis

```bash
npm run build -- --stats-json
npx webpack-bundle-analyzer dist/angular-base/stats.json
```

---

## Docker Deployment

### Create Dockerfile

```dockerfile
FROM node:22-alpine AS builder
WORKDIR /app
COPY package*.json ./
RUN npm install --legacy-peer-deps
COPY . .
RUN npm run build

FROM nginx:alpine
COPY --from=builder /app/dist/angular-base /usr/share/nginx/html
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
```

### Build Docker Image

```bash
docker build -t angular-base:latest .
```

### Run Container

```bash
docker run -p 80:80 angular-base:latest
```

---

## Development Commands

### Start Development Server
```bash
npm start
```

### Build Project
```bash
npm run build
```

### Watch Mode (Auto-rebuild)
```bash
npm run watch
```

### Run Tests
```bash
npm test
```

### Lint Code
```bash
npm run lint
```

---

## Debugging

### Browser DevTools

1. Open application in browser
2. Press `F12` to open DevTools
3. Use Console, Network, and Elements tabs

### VS Code Debugging

Add to `.vscode/launch.json`:

```json
{
  "version": "0.2.0",
  "configurations": [
    {
      "name": "ng serve",
      "type": "chrome",
      "request": "launch",
      "preLaunchTask": "ng: serve",
      "url": "http://localhost:4200",
      "webRoot": "${workspaceRoot}",
      "sourceMapPathOverrides": {
        "webpack:/*": "${webRoot}/*",
        "/./*": "${webRoot}/*",
        "/src/*": "${webRoot}/src/*",
        "/*": "${webRoot}/*",
        "/./~/*": "${webRoot}/node_modules/*"
      }
    }
  ]
}
```

### Console Logging

```typescript
console.log('Debug info:', data);
console.error('Error:', error);
console.warn('Warning:', issue);
console.table(arrayData);
```

---

## Performance Optimization

### Code Splitting

Routes are lazy-loaded by default:
```typescript
{
  path: 'feature',
  loadComponent: () => import('./feature.component').then(m => m.FeatureComponent)
}
```

### Change Detection Strategy

Use OnPush for better performance:
```typescript
@Component({
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class MyComponent {
  // ...
}
```

### TrackBy with ngFor

```typescript
trackByFn(index: number, item: any): any {
  return item.id;
}
```

```html
<div *ngFor="let item of items; trackBy: trackByFn">
  {{ item.name }}
</div>
```

### Lazy Load Images

```html
<img [src]="imageUrl" [loading]="'lazy'" alt="Image" />
```

---

## Common Issues & Solutions

### Issue: Styles not applying

**Solution**:
1. Clear browser cache (Ctrl+Shift+Delete)
2. Restart dev server
3. Check CSS specificity
4. Verify SCSS import path

### Issue: Components not rendering

**Solution**:
1. Check component is imported in module/component
2. Verify route configuration
3. Check browser console for errors
4. Ensure component selector is unique

### Issue: API calls failing

**Solution**:
1. Check API endpoint configuration
2. Verify authentication token
3. Check CORS configuration
4. Use Network tab to inspect requests

### Issue: Build errors

**Solution**:
1. Clear `node_modules` and `dist` folders
2. Reinstall dependencies: `npm install --legacy-peer-deps`
3. Check TypeScript errors: `npx tsc --noEmit`
4. Review error messages in console

---

## Git Workflow

### Create Feature Branch

```bash
git checkout -b feature/my-feature
```

### Commit Changes

```bash
git add .
git commit -m "feat: add new feature"
```

### Push to Remote

```bash
git push origin feature/my-feature
```

### Create Pull Request

Push branch and create PR on GitHub with:
- Clear title
- Description of changes
- Related issues
- Checklist of testing

---

## Security Best Practices

1. **Environment Variables**: Never commit secrets
2. **API Keys**: Store in `.env` file
3. **Authentication**: Use HTTPS only
4. **CORS**: Configure properly in backend
5. **Input Validation**: Validate all user inputs
6. **XSS Protection**: Angular sanitizes by default
7. **CSRF Token**: Include if required by backend
8. **Headers**: Add security headers in production

---

## Resources

- [Angular Documentation](https://angular.io/docs)
- [Ant Design](https://ng.ant.design/)
- [TypeScript Handbook](https://www.typescriptlang.org/docs/)
- [RxJS Documentation](https://rxjs.dev/)
- [Chart.js Documentation](https://www.chartjs.org/)
- [Tailwind CSS](https://tailwindcss.com/)

---

## Support

For issues or questions:
1. Check this documentation
2. Review component examples
3. Check browser console for errors
4. Contact the development team

---

**Last Updated**: October 2024
