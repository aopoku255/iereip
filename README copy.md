# Loan Admin Dashboard

A modern React-based admin dashboard application built with Vite, Redux Toolkit, and Bootstrap. This project provides a comprehensive loan management interface with authentication, dashboards, and various admin features.

## Features

- **Authentication**: Login/logout functionality with fake backend
- **Dashboards**: Multiple dashboard views (Analytics, CRM, Ecommerce, etc.)
- **Responsive Design**: Built with Bootstrap for mobile-first responsive design
- **State Management**: Redux Toolkit for efficient state management
- **Routing**: React Router for client-side navigation
- **Charts & Analytics**: ApexCharts integration for data visualization
- **Internationalization**: Multi-language support
- **Dark/Light Mode**: Theme switching capability

## Tech Stack

- **Frontend**: React 18
- **Build Tool**: Vite
- **State Management**: Redux Toolkit
- **Styling**: Bootstrap 5, SCSS
- **Charts**: ApexCharts, Chart.js
- **Icons**: Feather Icons, Remix Icons
- **Forms**: Formik, Yup validation
- **HTTP Client**: Axios
- **Routing**: React Router DOM

## Getting Started

### Prerequisites

- Node.js (v16 or higher)
- Yarn package manager

### Installation

1. Clone the repository:
```bash
git clone https://github.com/aopoku255/loanadmin.git
cd loanadmin
```

2. Install dependencies:
```bash
yarn install
```

3. Start the development server:
```bash
yarn dev
```

The application will be available at [http://localhost:3000](http://localhost:3000).

## Available Scripts

### `yarn dev`
Runs the app in development mode with hot reloading.

### `yarn build`
Builds the app for production to the `dist` folder.

### `yarn preview`
Serves the production build locally for testing.

### `yarn lint`
Runs ESLint to check for code quality issues.

## Project Structure

```
src/
├── Components/          # Reusable UI components
├── pages/              # Page components
├── Layouts/            # Layout components
├── Routes/             # Routing configuration
├── slices/             # Redux slices
├── helpers/            # Utility functions
├── assets/             # Static assets (images, styles)
├── locales/            # Internationalization files
└── main.jsx            # Application entry point
```

## Authentication

The app uses a fake backend for demonstration. Default login credentials:
- **Email**: admin@themesbrand.com
- **Password**: 123456

## Deployment

1. Build the project:
```bash
yarn build
```

2. The `dist` folder contains the production-ready files that can be deployed to any static hosting service.

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Run tests and linting
5. Submit a pull request

## License

This project is licensed under the MIT License.

## Support

For support and questions, please open an issue on GitHub.

### Analyzing the Bundle Size

This section has moved here: [https://facebook.github.io/create-react-app/docs/analyzing-the-bundle-size](https://facebook.github.io/create-react-app/docs/analyzing-the-bundle-size)

### Making a Progressive Web App

This section has moved here: [https://facebook.github.io/create-react-app/docs/making-a-progressive-web-app](https://facebook.github.io/create-react-app/docs/making-a-progressive-web-app)

### Advanced Configuration

This section has moved here: [https://facebook.github.io/create-react-app/docs/advanced-configuration](https://facebook.github.io/create-react-app/docs/advanced-configuration)

### Deployment

This section has moved here: [https://facebook.github.io/create-react-app/docs/deployment](https://facebook.github.io/create-react-app/docs/deployment)

### `npm run build` fails to minify

This section has moved here: [https://facebook.github.io/create-react-app/docs/troubleshooting#npm-run-build-fails-to-minify](https://facebook.github.io/create-react-app/docs/troubleshooting#npm-run-build-fails-to-minify)
