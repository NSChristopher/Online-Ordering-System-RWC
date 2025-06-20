# Full Stack Template

A complete, production-ready full-stack template featuring React 18, Express.js, Prisma ORM, and JWT authentication. Get your CRUD application up and running in minutes with modern best practices and beautiful UI components.

## 📦 Tech Stack

| Layer               | Technology                       | Purpose                                     |
| ------------------- | -------------------------------- | ------------------------------------------- |
| **Frontend**        | React 18 + TypeScript + Vite     | Modern React with fast development          |
| **Styling**         | Tailwind CSS + ShadCN UI         | Utility-first CSS with beautiful components |
| **Icons & UI**      | Lucide React + Sonner            | Icons and toast notifications               |
| **Backend**         | Express.js + Node.js             | RESTful API server                          |
| **Database**        | SQLite + Prisma ORM              | Type-safe database access                   |
| **Auth**            | JWT + HTTP-only Cookies          | Secure authentication flow                  |
| **API Client**      | Axios                            | HTTP client with interceptors               |
| **Dev Environment** | GitHub Codespaces + Devcontainer | Consistent development environment          |

## ✨ Features

- 🔐 **Complete Authentication**: Register, login, logout with JWT
- 📝 **CRUD Operations**: Full create, read, update, delete for posts
- 🎨 **Beautiful UI**: Tailwind CSS with ShadCN components
- 🔒 **Protected Routes**: Both frontend and backend route protection
- 📱 **Responsive Design**: Mobile-first approach
- 🚀 **Fast Development**: Hot reload for both frontend and backend
- 🛡️ **Type Safety**: Full TypeScript support
- 🍞 **Toast Notifications**: User feedback with Sonner
- 🎯 **Modern Icons**: Lucide React icon library

## 🚀 Quick Start

### Prerequisites

- Node.js 18+ installed
- Git installed

### Installation

1. **Install dependencies:**

   ```bash
   npm install
   ```

2. **Set up environment variables:**

   ```bash
   cp .env.example .env
   # Edit .env with your configuration
   ```

3. **Initialize the database:**

   ```bash
   cd backend
   npx prisma generate
   npx prisma db push
   npx run prisma/seed.js
   cd ..
   ```

4. **Start development servers:**

   ```bash
   npm run dev
   ```

5. **Open your browser:**
   - Frontend: http://localhost:3000
   - Backend API: http://localhost:5000

## 📚 Documentation & Planning

- **Important planning and documentation files are located in the [`external-docs/`](external-docs/) folder.**  
  This folder may be a submodule or a direct part of your repository, and contains key docs such as project planning, guidelines, and templates.
- The documentation in `external-docs/` will auto-update at each rebuild or restart of the codespace if configured as a submodule.
- For more details on managing external documentation, see the [Adding Documentation as a Submodule](#-adding-documentation-as-a-submodule) section below.

## 📚 Adding Documentation as a Submodule

To add your own documentation as a submodule (recommended for multi-repo projects):

1. **Add the submodule (excluding the `.devcontainer` folder):**

   ```sh
   git submodule add --depth 1 --filter=blob:none --sparse https://github.com/NSChristopher/Online-Ordering-System-RWC-DOCS.git external-docs
   cd external-docs
   git sparse-checkout set docs guidelines planning templates
   cd ..
   ```

   > This will only include the `docs`, `guidelines`, `planning`, and `templates` folders from your docs repo, excluding `.devcontainer`.

2. **Update submodules as needed:**

   ```sh
   git submodule update --remote --merge
   ```

3. **If you want to remove the submodule:**
   ```sh
   git submodule deinit -f external-docs
   git rm -f external-docs
   rm -rf .git/modules/external-docs
   ```

**Note:**

- Documentation will auto update at each rebuild or restart of the codespace due to postCreate and posStart commands.
- You can keep the `external-docs/` folder in your repo as a placeholder for documentation, even if you don't use a submodule.
- If you use a different folder name, update the commands accordingly.

## 📁 Project Structure

```
├── .devcontainer/             # GitHub Codespaces configuration
│   └── devcontainer.json
├── backend/                   # Express.js API
│   ├── prisma/
│   │   └── schema.prisma      # Database schema
│   ├── routes/
│   │   ├── auth.js           # Authentication routes
│   │   └── posts.js          # Posts CRUD routes
│   ├── package.json
│   └── index.js              # Express server
├── frontend/                  # React application
│   ├── src/
│   │   ├── components/
│   │   │   └── ui/           # ShadCN UI components
│   │   ├── pages/
│   │   │   ├── Home.tsx      # Landing page
│   │   │   ├── Login.tsx     # Login page
│   │   │   ├── Register.tsx  # Registration page
│   │   │   └── Dashboard.tsx # Protected dashboard
│   │   ├── hooks/
│   │   │   ├── useAuth.tsx   # Authentication hook
│   │   │   └── usePosts.ts   # Posts management hook
│   │   ├── lib/
│   │   │   ├── api.ts        # Axios configuration
│   │   │   └── utils.ts      # Utility functions
│   │   ├── types/
│   │   │   └── index.ts      # TypeScript definitions
│   │   ├── App.tsx           # Main app component
│   │   ├── main.tsx          # React entry point
│   │   └── index.css         # Global styles
│   ├── package.json
│   ├── tailwind.config.js    # Tailwind configuration
│   └── vite.config.ts        # Vite configuration
├── external-docs/             # External documentation and planning (important!)
├── agent/
│   └── prompts.md            # AI agent instructions
├── package.json              # Root package.json
├── .env.example              # Environment variables template
└── README.md                 # This file
```

## 🔌 API Endpoints

### Authentication (`/api/auth`)

- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user
- `GET /api/auth/me` - Get current user (protected)
- `POST /api/auth/logout` - Logout user

### Posts (`/api/posts`)

- `GET /api/posts` - Get all posts
- `GET /api/posts/:id` - Get single post
- `POST /api/posts` - Create post (protected)
- `PUT /api/posts/:id` - Update post (protected, owner only)
- `DELETE /api/posts/:id` - Delete post (protected, owner only)

## 🛠️ Development Scripts

```bash
# Install all dependencies
npm install

# Start both frontend and backend
npm run dev

# Start backend only
npm run backend:dev

# Start frontend only
npm run frontend:dev

# Build frontend
npm run frontend:build

# Database operations
cd backend
npx prisma studio      # Database GUI
npx prisma generate    # Generate Prisma client
npx prisma db push     # Push schema to database
npx prisma migrate dev # Create migration
```

## 🎨 Customization

### Adding New Database Models

1. Update the Prisma schema:

   ```prisma
   // backend/prisma/schema.prisma
   model YourModel {
     id        Int      @id @default(autoincrement())
     name      String
     createdAt DateTime @default(now())
   }
   ```

2. Generate and apply changes:

   ```bash
   cd backend
   npx prisma generate
   npx prisma db push
   ```

3. Create API routes in `backend/routes/`
4. Add corresponding hooks and types in frontend

### Styling and Theming

- Modify `frontend/tailwind.config.js` for theme customization
- Update CSS variables in `frontend/src/index.css`
- Customize ShadCN components in `frontend/src/components/ui/`

### Environment Configuration

Create a `.env` file in the root directory:

```env
# Backend
PORT=5000
JWT_SECRET=your-secret-key

# Database (optional for SQLite)
DATABASE_URL="file:./dev.db"
```

## 🚢 Deployment

### Frontend (Vercel, Netlify, etc.)

1. Build the frontend: `cd frontend && npm run build`
2. Deploy the `frontend/dist` folder
3. Configure environment variables for API URL

### Backend (Railway, Heroku, etc.)

1. Deploy the `backend` folder
2. Set environment variables
3. Use a production database (PostgreSQL, MySQL)

### Full Stack (Railway, Render)

1. Use the root package.json for deployment
2. Configure build and start scripts
3. Set up environment variables

## 📚 Documentation

- [external-docs/](external-docs/) — **Project planning, guidelines, and templates**
- [React 18 Documentation](https://reactjs.org/docs/getting-started.html)
- [Vite Documentation](https://vitejs.dev/guide/)
- [Tailwind CSS Documentation](https://tailwindcss.com/docs)
- [ShadCN UI Documentation](https://ui.shadcn.com/docs)
- [Express.js Documentation](https://expressjs.com/)
- [Prisma Documentation](https://www.prisma.io/docs)
- [JWT Introduction](https://jwt.io/introduction)

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/your-feature`
3. Commit your changes: `git commit -am 'Add some feature'`
4. Push to the branch: `git push origin feature/your-feature`
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙋‍♂️ Support

If you have any questions or run into issues, please:

1. Check the [documentation](agent/prompts.md) and [`external-docs/`](external-docs/)
2. Search existing issues
3. Create a new issue with detailed information

---

**Happy coding!** 🚀
