# Project Structure Explanation

Here's a detailed explanation of each specified directory based on the provided content and common conventions:

1.  **`server/` Directory:**
    *   **Purpose:** This directory contains the backend application for your CMS. It's responsible for handling API requests from the client, managing data (likely interacting with a database), handling user authentication and authorization, processing business logic, and serving necessary resources.
    *   **Technology Stack (Inferred):**
        *   **Language:** TypeScript (indicated by `tsconfig.json` and `.ts` files likely within `src/`).
        *   **Framework:** Express.js (indicated by `express` dependency in `package.json`).
        *   **Database:** PostgreSQL (indicated by `pg` dependency).
        *   **Authentication:** Likely uses JSON Web Tokens (JWT) (indicated by `jsonwebtoken`) and password hashing (indicated by `bcrypt`).
        *   **Other Key Libraries:**
            *   `cors`: Handles Cross-Origin Resource Sharing.
            *   `helmet`: Provides security headers.
            *   `dotenv`: Manages environment variables.
            *   `multer`: Handles file uploads.
            *   `nodemailer`: Sends emails.
            *   `pino`, `winston`: Logging libraries.
            *   `sharp`: Image processing.
            *   `archiver`: File archiving (potentially for deployment or backups).
            *   `csso`, `terser`: CSS and JavaScript minification.
    *   **Key Files/Directories:**
        *   `.gitignore`: Specifies intentionally untracked files that Git should ignore (e.g., `node_modules`, log files, environment files like `.env`).
        *   `package.json`: Defines the project's metadata, dependencies (libraries the server needs), and scripts (like `start`, `dev`, `build`).
        *   `package-lock.json`: Records the exact versions of dependencies installed, ensuring consistent builds across different environments.
        *   `tsconfig.json`: Configuration file for the TypeScript compiler, specifying how TypeScript code should be compiled into JavaScript. It includes path aliases (`@config/*`, `@/*`) for cleaner imports.
        *   `node_modules/`: Directory where npm installs the project's dependencies. (Typically not committed to version control due to `.gitignore`).
        *   `config/`: Likely contains server-specific configuration files (e.g., database connection details, authentication settings, API keys).
        *   `public/`: Could contain static assets served directly by the server, although often static assets are handled by the client build process or a dedicated CDN.
        *   `src/`: Contains the actual source code for the server application (controllers, models, services, routes, middleware, database logic, utilities, etc.).
        *   `dist/` (Implied by `tsconfig.json` `outDir` and `package.json` `start` script): The output directory where the compiled JavaScript code is placed after running the `build` script (`tsc`).

2.  **`client/` Directory:**
    *   **Purpose:** This directory contains the frontend application – the user interface (UI) that users interact with in their web browser. It communicates with the `server/` application via API calls to fetch and manipulate data.
    *   **Technology Stack (Inferred):**
        *   **Framework/Library:** React (indicated by `react`, `react-dom` dependencies and `vite.config.ts` using `@vitejs/plugin-react`).
        *   **Language:** TypeScript (indicated by `tsconfig.json`, `.tsx` files, and TypeScript dependencies).
        *   **Build Tool:** Vite (indicated by `vite.config.ts` and Vite dependencies).
        *   **Styling:** Tailwind CSS (indicated by `tailwindcss` dependency, `tailwind.config` reference in `components.json`, and `@tailwindcss/vite` plugin). Likely uses Shadcn UI components built on Radix UI primitives (indicated by `components.json`, `@radix-ui/*` dependencies).
        *   **Routing:** React Router (indicated by `react-router-dom`).
        *   **Code Editing:** CodeMirror (indicated by `@uiw/react-codemirror` and `@codemirror/*` dependencies).
        *   **State Management:** Not explicitly defined by a dedicated library like Redux or Zustand in the top-level dependencies, might be using React Context or local state.
        *   **Other Key Libraries:**
            *   `lucide-react`: Icon library.
            *   `react-hook-form`, `@hookform/resolvers`: Form handling and validation (likely with `zod`).
            *   `sonner`: Toast notifications.
            *   `react-resizable-panels`, `re-resizable`, `react-split-pane`: UI layout components.
            *   `react-dnd`: Drag and drop functionality.
            *   `next-themes`: Theme management (light/dark mode).
    *   **Key Files/Directories:**
        *   `.gitignore`: Specifies files to be ignored by Git, specific to the frontend build process and dependencies (e.g., `node_modules`, `dist`, `.env` files).
        *   `package.json`: Defines frontend-specific metadata, dependencies, and scripts (`dev`, `build`, `lint`, `preview`).
        *   `package-lock.json`: Records exact frontend dependency versions.
        *   `vite.config.ts`: Configuration file for the Vite build tool, setting up plugins (React, Tailwind) and resolving aliases (`@/*`).
        *   `tsconfig.json`, `tsconfig.app.json`, `tsconfig.node.json`: TypeScript configuration files for the client project, likely separating config for the app code and Node.js-specific files like the Vite config itself. Uses project references.
        *   `index.html`: The main HTML entry point for the single-page application (SPA). Vite injects the built JavaScript here.
        *   `eslint.config.js`: Configuration for ESLint, the code linter, using the newer flat config format.
        *   `components.json`: Configuration file specifically for Shadcn UI, defining style, paths, etc.
        *   `node_modules/`: Directory where frontend dependencies are installed.
        *   `public/`: Contains static assets that are copied directly to the build output directory (e.g., `vite.svg` favicon).
        *   `src/`: Contains the React application's source code (components, pages, hooks, services, store, styles, utilities, etc.).
        *   `dist/` (Implied by build process): The output directory where Vite places the optimized, bundled frontend assets for deployment.

3.  **`config/` Directory (Root Level):**
    *   **Purpose:** Defines project-wide settings that affect both client and server sides, or configuration related to deployment environments and infrastructure.
    *   **Typical Contents:**
        *   Environment detection (dev/staging/prod).
        *   Feature flags shared across the stack.
        *   Deployment-specific configurations.
        *   API endpoints for different environments.
        *   Shared constants like API version numbers.
        *   Global paths and URLs.
        *   Docker or container configuration.
    *   **Typical Files (Examples):**
        *   `environment.js`: Detects and exports the current environment.
        *   `endpoints.js`: Defines API endpoints for different environments.
        *   `features.js`: Manages feature flags.
        *   `build.js`: Build-specific configuration.
        *   `constants.js`: Global constants shared between client and server.
        *   `docker-compose.yml`: Docker configuration (if applicable).
        *   `.env.example`: Example environment variables for local setup.

4.  **`docs/` Directory:**
    *   **Purpose:** Central repository for all project-related documentation.
    *   **Key Contents:**
        *   **Architecture:** High-level system design, component diagrams (e.g., using Mermaid like `project-structure.mermaid`), data flow diagrams.
        *   **API Documentation:** Detailed specifications for server APIs (e.g., OpenAPI/Swagger files, Postman collections).
        *   **Guides:** Setup instructions, contribution guidelines, deployment procedures.
        *   **User Manuals:** How-to guides for end-users of the CMS.
        *   **Decision Records:** Architectural Decision Records (ADRs) explaining key design choices.
        *   **Style Guides:** Coding standards and UI/UX guidelines.

5.  **`scripts/` Directory (Build/Deploy):**
    *   **Purpose:** Provides executable scripts that automate common tasks in the development, building, and deployment workflows.
    *   **Key Functionalities:**
        *   Contains build scripts for compiling the application.
        *   Includes deployment scripts for different environments.
        *   Provides database migration and seeding scripts.
        *   Houses utility scripts for code generation, linting, and formatting.
        *   Contains scripts for CI/CD pipeline integration.
        *   May include scripts for environment setup and configuration.
    *   **Typical Files (Examples):**
        *   `build.js`: Application build script.
        *   `deploy.js`: Deployment automation.
        *   `setup-dev.js`: Development environment setup.
        *   `migrate-db.js`: Database migration scripts.
        *   `generate-component.js`: Boilerplate code generators.
        *   `clean.js`: Cleans build directories.

In summary, you have a standard monorepo structure with separate `client` and `server` applications, along with placeholder directories (`config`, `docs`, `scripts`) for project-wide configuration, documentation, and utility scripts respectively.
