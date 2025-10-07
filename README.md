# 🚀 Flow Management Console

A comprehensive SaaS Management Console built with React, TypeScript, and modern web technologies. This application provides a complete solution for managing clients, suppliers, finances, and business operations.

## 🎯 Features

### Core Modules
- **Client Management** - Complete CRUD operations for client data
- **Supplier Management** - Manage supplier relationships and information
- **Finance Module** - Bills, invoices, profit & loss reports, and business intelligence
- **Settings** - Company details, user management, and application configuration

### Key Capabilities
- **Flexible Storage** - Switch between LocalStorage and Supabase cloud storage
- **Real-time Updates** - Optimistic updates with React Query
- **Responsive Design** - Modern UI with ShadCN/UI components
- **Type Safety** - Full TypeScript implementation with Zod validation
- **Clean Architecture** - MVC pattern with SOLID principles

## 🛠️ Technology Stack

| Layer | Technology |
|-------|------------|
| **Frontend** | React 19 + TypeScript + Vite |
| **UI Framework** | ShadCN/UI + Tailwind CSS |
| **State Management** | Redux Toolkit |
| **Data Fetching** | React Query (TanStack Query) |
| **Form Handling** | React Hook Form + Zod |
| **Routing** | React Router v7 |
| **Database** | Supabase (PostgreSQL) / LocalStorage |
| **Authentication** | Supabase Auth |
| **Validation** | Zod schemas |
| **Icons** | Lucide React |

## 🏗️ Architecture

### Folder Structure
```
src/
├── app/                    # App entry point and providers
├── core/
│   ├── models/             # Data models and schemas
│   ├── services/           # Business logic and CRUD operations
│   └── adapters/
│       └── storage/        # Storage adapter pattern
├── hooks/                  # Custom React hooks
├── components/
│   ├── ui/                 # ShadCN/UI components
│   ├── common/             # Reusable components
│   ├── forms/              # Form components
│   └── layout/             # Layout components
├── pages/                  # Page components
│   ├── Clients/
│   ├── Suppliers/
│   ├── Finance/
│   └── Settings/
├── config/                 # Configuration files
├── types/                  # TypeScript type definitions
└── tests/                  # Test files
```

### Design Patterns
- **Adapter Pattern** - Flexible storage switching
- **MVC Architecture** - Separation of concerns
- **Repository Pattern** - Data access abstraction
- **Custom Hooks** - Business logic encapsulation

## 🚀 Getting Started

### Prerequisites
- Node.js 18+ 
- npm or yarn
- Git

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd flow_management_console
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   ```bash
   cp env.example .env.local
   ```
   
   Edit `.env.local` with your configuration:
   ```env
   VITE_SUPABASE_URL=https://your-project.supabase.co
   VITE_SUPABASE_ANON_KEY=your-supabase-anon-key
   ```

4. **Start the development server**
   ```bash
   npm run dev
   ```

5. **Open your browser**
   Navigate to `http://localhost:5173`

### Supabase Setup (Optional)

If you want to use cloud storage:

1. Create a new Supabase project at [supabase.com](https://supabase.com)
2. Run the following SQL to create the data table:
   ```sql
   CREATE TABLE flow_management_data (
     id SERIAL PRIMARY KEY,
     key TEXT UNIQUE NOT NULL,
     value JSONB NOT NULL,
     created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
     updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
   );
   ```
3. Add your Supabase URL and anon key to `.env.local`

## 📝 Available Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Start development server |
| `npm run build` | Build for production |
| `npm run preview` | Preview production build |
| `npm run lint` | Run ESLint |
| `npm run lint:fix` | Fix ESLint issues |
| `npm run format` | Format code with Prettier |
| `npm run format:check` | Check code formatting |
| `npm run test` | Run tests |
| `npm run test:ui` | Run tests with UI |

## 🔧 Configuration

### Storage Adapter Switching

The application supports two storage modes:

1. **Local Storage** (Default)
   - Data stored in browser's localStorage
   - Perfect for personal use and testing
   - No external dependencies

2. **Supabase Cloud Storage**
   - Data stored in PostgreSQL database
   - Enables data synchronization across devices
   - Requires Supabase configuration

Switch between modes in **Settings > Application Registration**.

### Environment Variables

| Variable | Description | Required |
|----------|-------------|----------|
| `VITE_SUPABASE_URL` | Supabase project URL | Only for Supabase mode |
| `VITE_SUPABASE_ANON_KEY` | Supabase anonymous key | Only for Supabase mode |
| `VITE_APP_NAME` | Application name | No |
| `VITE_APP_VERSION` | Application version | No |

## 🧪 Testing

The project includes comprehensive testing setup:

- **Unit Tests** - Vitest for component testing
- **Integration Tests** - React Testing Library
- **E2E Tests** - Playwright (coming soon)

Run tests:
```bash
npm run test
```

## 🚀 Deployment

### Vercel Deployment

1. **Connect to Vercel**
   ```bash
   npm install -g vercel
   vercel login
   ```

2. **Deploy**
   ```bash
   vercel --prod
   ```

3. **Set environment variables** in Vercel dashboard

### GitHub Actions CI/CD

The project includes GitHub Actions workflow for:
- Automated testing
- Code quality checks
- Automatic deployment to Vercel

## 🔒 Security & Privacy

### GDPR Compliance
- Cookie consent management
- Data export functionality
- Data deletion capabilities
- Data encryption at rest and in transit

### Security Features
- Input validation with Zod
- XSS protection
- CSRF protection
- Secure authentication with Supabase

## 📊 Performance

### Optimization Features
- **Code Splitting** - Lazy loading of routes
- **Optimistic Updates** - Instant UI feedback
- **Caching** - React Query for data caching
- **Bundle Optimization** - Vite for fast builds

### Performance Targets
- **CRUD Operations** - Under 150ms latency
- **Initial Load** - Under 2 seconds
- **Bundle Size** - Optimized for production

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

### Development Guidelines
- Follow Clean Code principles
- Use TypeScript for type safety
- Write tests for new features
- Follow the existing code style
- Update documentation as needed

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🆘 Support

For support and questions:
- Create an issue in the GitHub repository
- Check the documentation
- Review the code examples

## 🔮 Roadmap

### Upcoming Features
- [ ] Supplier management module
- [ ] Finance module with invoicing
- [ ] Business intelligence reports
- [ ] User authentication and management
- [ ] Real-time notifications
- [ ] Mobile app (React Native)
- [ ] API documentation
- [ ] Advanced search and filtering
- [ ] Data import/export
- [ ] Multi-language support

### Performance Improvements
- [ ] Service Worker for offline support
- [ ] Advanced caching strategies
- [ ] Image optimization
- [ ] Database query optimization

---

**Built with ❤️ using modern web technologies**