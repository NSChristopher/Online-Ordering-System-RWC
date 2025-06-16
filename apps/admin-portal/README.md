# Admin Portal

This is the admin portal for the Online Ordering System. This web application is optimized for desktop use and allows restaurant owners/managers to manage menu categories, menu items, and business information.

## Features (Implemented)
- ✅ Menu category management (create, edit, delete, reorder)
- ✅ Menu item management (create, edit, delete, set pricing, visibility)
- ✅ Business information management (name, hours, contact details, logo)
- ✅ Web-optimized interface for desktop use
- ✅ Responsive design for larger screens
- ✅ Mock data integration (as specified in MVP requirements)

## Target Platform
- Desktop web browsers
- Responsive design for larger screens

## Development

### Installation
```bash
# From root directory
npm run admin:install

# Or directly in admin-portal directory
cd apps/admin-portal
npm install
```

### Running in Development
```bash
# From root directory
npm run admin:dev

# Or directly in admin-portal directory
cd apps/admin-portal
npm run dev
```

The admin portal will be available at http://localhost:3001

### Building for Production
```bash
# From root directory
npm run admin:build

# Or directly in admin-portal directory
cd apps/admin-portal
npm run build
```

## Implementation Details

### User Stories Covered
- **US-008**: Menu management - Full CRUD operations for menu categories and items
- **US-009**: Business info management - Edit restaurant details, hours, and contact info

### Technology Stack
- **Frontend**: React 18 with TypeScript
- **UI Library**: Tailwind CSS with ShadCN components
- **Routing**: React Router DOM
- **Icons**: Lucide React
- **Notifications**: Sonner toast library
- **Build Tool**: Vite

### Features Overview

#### Dashboard
- Overview of menu statistics (categories, items, visibility)
- Quick navigation to management sections
- Clean, accessible design for non-technical users

#### Business Information Management
- Edit restaurant name, address, phone, and hours
- Logo URL management
- Form validation and success feedback

#### Menu Categories Management
- Create, edit, and delete categories
- Drag-and-drop style reordering with up/down arrows
- Sort order management
- Real-time updates with toast notifications

#### Menu Items Management
- Full CRUD operations for menu items
- Category filtering for easy navigation
- Price management with proper number formatting
- Visibility toggle (show/hide from customers)
- Image URL management
- Detailed descriptions and categorization

### Current Status
✅ **Fully Implemented** - The admin portal is complete with all required functionality for the MVP. It currently uses mock data as specified in the requirements. Backend API integration is ready but requires Prisma database setup.

### Next Steps
- Set up Prisma database connection
- Replace mock data with real API calls
- Add authentication (post-MVP)
- Add more advanced features like bulk operations