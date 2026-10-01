# Angular Base Application

A sophisticated, modern Angular base application with enterprise-grade features and design patterns.

## Features

### Core Architecture
- **Angular 18** - Latest Angular framework
- **Standalone Components** - Modern Angular architecture
- **TypeScript** - Fully typed codebase
- **Routing** - Pre-configured routing with auth guards
- **HTTP Client** - Built-in HTTP interceptors

### Authentication & Security
- **Auth Service** - Centralized authentication management
- **HTTP Interceptor** - Automatic token attachment
- **Error Interceptor** - Global error handling
- **Auth Guard** - Route protection for authenticated users

### UI/UX
- **Ant Design Integration** - Enterprise UI components
- **Tailwind CSS** - Utility-first CSS framework
- **Custom Color Palette** - Distinctive, branded colors
- **Responsive Design** - Mobile-first approach
- **Dark Mode Ready** - Theme support infrastructure

### Components Library
- **Data Table** - Feature-rich table with sorting, filtering, pagination
- **Form Builder** - Dynamic form generation with validation
- **Rich Text Editor** - CKEditor 5 integration with image upload
- **Chart Components** - Multiple chart types (Line, Bar, Pie, Doughnut, Radar, Polar)

### Charts & Visualization
- **Chart.js** - Powerful charting library
- **ng2-charts** - Angular wrapper for Chart.js
- **Multiple Chart Types**
  - Line Charts (Trends, Time Series)
  - Bar Charts (Comparisons, Sales)
  - Pie Charts (Distribution, Segments)
  - Doughnut Charts (Circular Distribution)
  - Radar Charts (Multi-dimensional Comparison)
  - Polar Charts (Angular Distribution)

### Dashboard
- **Statistics Cards** - Quick metrics overview
- **Chart Gallery** - All chart types displayed
- **Responsive Grid** - Adaptive layouts

## Project Structure

```
src/
├── app/
│   ├── core/
│   │   ├── guards/
│   │   │   └── auth.guard.ts
│   │   ├── interceptors/
│   │   │   ├── http.interceptor.ts
│   │   │   └── error.interceptor.ts
│   │   ├── models/
│   │   │   ├── auth.model.ts
│   │   │   └── api-response.model.ts
│   │   ├── services/
│   │   │   └── auth.service.ts
│   │   └── utils/
│   ├── features/
│   │   ├── auth/
│   │   │   └── login/
│   │   └── dashboard/
│   ├── shared/
│   │   └── components/
│   │       ├── layout/
│   │       ├── table/
│   │       ├── forms/
│   │       ├── editor/
│   │       └── charts/
│   ├── app.component.ts
│   ├── app.routes.ts
│   └── environments/
├── styles/
│   ├── variables.scss
│   ├── themes.scss
│   └── global styles
├── main.ts
├── index.html
└── environments/

```

## Installation

### Prerequisites
- Node.js (v22.22+)
- npm (v10.9+)

### Setup

```bash
# Install dependencies
npm install

# Start development server
npm start

# Navigate to http://localhost:4200/
```

## Development

### Running the Application

```bash
npm start
```

The application will automatically reload if you change any of the source files.

### Building for Production

```bash
npm run build
```

The build artifacts will be stored in the `dist/` directory.

## Color Palette

The application uses a distinctive, branded color palette:

- **Primary**: Deep Indigo (#2d3e63)
- **Secondary**: Coral Orange (#ff6b35)
- **Accent**: Electric Emerald (#00d4a8)
- **Tertiary**: Soft Purple (#7c5cff)

## Authentication

### Demo Credentials
- Username: `admin`
- Password: `password123`

### API Integration

Update the API endpoints in:
- `src/app/core/services/auth.service.ts`
- `src/environments/environment.ts`

## Customization

### Changing Colors

Edit `src/styles/variables.scss` to customize the color palette.

### Adding New Routes

Update `src/app/app.routes.ts` with your new routes.

### Custom Components

Add new components in `src/app/shared/components/` and export them.

## Features to Implement

- [ ] User management module
- [ ] Product management module
- [ ] Settings & configuration
- [ ] Reports & export functionality
- [ ] Multi-language support (i18n)
- [ ] Dark mode toggle
- [ ] Advanced filtering system
- [ ] Real-time notifications

## Performance

- **Code Splitting**: Route-based lazy loading
- **Tree Shaking**: Optimized bundle size
- **OnPush Change Detection**: Ready for implementation
- **Standalone Components**: Reduced bundle overhead

## Browser Support

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)

## Contributing

1. Create a new branch for your feature
2. Follow the existing code structure and patterns
3. Write meaningful commit messages
4. Create a pull request with a clear description

## License

MIT

## Support

For issues and questions, please contact the development team.

---

**Built with Angular, Ant Design, and TypeScript**
