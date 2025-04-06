# Content Management System (CMS)

A modern, full-stack Content Management System built with TypeScript, React, and Node.js.

## 🚀 Tech Stack

### Backend (server/)
- **Language:** TypeScript
- **Framework:** Express.js
- **Database:** PostgreSQL
- **Authentication:** JWT + bcrypt
- **Key Libraries:**
  - cors (CORS handling)
  - helmet (Security headers)
  - multer (File uploads)
  - nodemailer (Email service)
  - pino/winston (Logging)
  - sharp (Image processing)

### Frontend (client/)
- **Framework:** React with TypeScript
- **Build Tool:** Vite
- **UI/Styling:** 
  - Tailwind CSS
  - Shadcn UI
  - Radix UI primitives
- **Key Features:**
  - Code editing (CodeMirror)
  - Drag and drop support
  - Form handling (react-hook-form)
  - Toast notifications
  - Theme switching
  - Responsive layouts

## 📁 Project Structure

```
.
├── client/                 # Frontend React application (Vite + TypeScript)
│   ├── public/             # Static assets (index.html, favicon, etc.)
│   ├── src/                # Frontend source code
│   │   ├── components/     # Reusable UI components (core, layout, editor, etc.)
│   │   ├── pages/          # Page-level components (routes)
│   │   ├── hooks/          # Custom React hooks
│   │   ├── store/          # State management (likely Redux or Zustand)
│   │   ├── services/       # API interaction logic
│   │   ├── utils/          # Utility functions
│   │   ├── types/          # TypeScript type definitions
│   │   └── styles/         # Global styles and themes
│   ├── vite.config.ts      # Vite build configuration
│   ├── tsconfig.json       # TypeScript configuration
│   ├── package.json        # Frontend dependencies and scripts
│   └── ...                 # Other config files (.gitignore, eslint, etc.)
│
├── server/                 # Backend Node.js application (Express + TypeScript)
│   ├── config/             # Server configuration (db, auth, storage, etc.)
│   ├── public/             # Server-managed public assets (uploads, templates)
│   ├── src/                # Backend source code
│   │   ├── controllers/    # Request handlers (API logic)
│   │   ├── db/             # Database interactions (connection, migrations, queries)
│   │   ├── middleware/     # Express middleware (auth, validation, error handling)
│   │   ├── models/         # Data models/schemas
│   │   ├── routes/         # API route definitions
│   │   ├── services/       # Business logic services (auth, codegen, deploy, etc.)
│   │   └── utils/          # Backend utility functions (logger, errors, security)
│   ├── tests/              # Automated tests (unit, integration)
│   ├── tsconfig.json       # TypeScript configuration
│   ├── package.json        # Backend dependencies and scripts
│   └── ...                 # Other config files (.gitignore, .env.example, etc.)
│
├── config/                 # Root configuration (shared settings, env detection) - Currently Empty
│
├── docs/                   # Project documentation (architecture, guides, API specs) - Currently Empty
│
└── scripts/                # Automation scripts (build, deploy, db migration) - Currently Empty
```

## 🚀 Getting Started

### Prerequisites
- Node.js (v18 or higher)
- PostgreSQL
- npm or yarn

### Backend Setup
```bash
cd server
npm install
cp .env.example .env    # Configure your environment variables
npm run dev            # Start development server
```

### Frontend Setup
```bash
cd client
npm install
npm run dev           # Start development server
```

## 🛠️ Development

### Backend Scripts
- `npm run dev`: Start development server with hot-reload
- `npm run build`: Build for production
- `npm start`: Run production server

### Frontend Scripts
- `npm run dev`: Start development server
- `npm run build`: Build for production
- `npm run preview`: Preview production build
- `npm run lint`: Run ESLint

## 🔐 Environment Variables

### Backend (.env)
```
PORT=3000
DATABASE_URL=postgresql://user:password@localhost:5432/dbname
JWT_SECRET=your_jwt_secret
```

### Frontend (.env)
```
VITE_API_URL=http://localhost:3000/api
```

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.
