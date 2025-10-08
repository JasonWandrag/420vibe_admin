# 420Vibe Admin Portal

A comprehensive admin portal for managing the 420Vibe ecommerce store, built with Vue 3, Firebase, and Tailwind CSS.

## Features

- **Dashboard**: Overview of store performance, recent orders, and key metrics
- **Product Management**: Create, edit, delete products with base64 image upload support
- **Order Management**: View and manage customer orders with status updates
- **User Management**: Manage customer accounts and view user statistics
- **Admin Authentication**: Secure admin login with role-based access control
- **Settings**: Store configuration and system management

## Tech Stack

- **Frontend**: Vue 3 with Composition API
- **State Management**: Pinia
- **Routing**: Vue Router
- **Styling**: Tailwind CSS
- **Backend**: Firebase (Firestore, Authentication)
- **Build Tool**: Vite

## Setup Instructions

### 1. Install Dependencies

```bash
npm install
```

### 2. Environment Configuration

1. Copy the example environment file:
```bash
cp env.example .env
```

2. Update `.env` with your Firebase configuration:
```env
VITE_FIREBASE_API_KEY=your_api_key_here
VITE_FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=your_project_id
VITE_FIREBASE_STORAGE_BUCKET=your_project.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
VITE_FIREBASE_APP_ID=your_app_id
VITE_FIREBASE_MEASUREMENT_ID=your_measurement_id
```

### 3. Firebase Setup

1. Create a Firebase project at [Firebase Console](https://console.firebase.google.com/)
2. Enable Authentication with Email/Password
3. Create a Firestore database
4. Set up the following Firestore collections:
   - `products` - Store product information
   - `orders` - Store customer orders
   - `users` - Store customer information
   - `adminUsers` - Store admin user information
   - `carts` - Store user cart data

### 4. Create Admin User

1. Start the development server:
```bash
npm run dev
```

2. Navigate to the admin portal
3. Use the "Create New Admin" feature in Settings to create your first admin account

### 5. Development

```bash
# Start development server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview
```

## Project Structure

```
src/
├── components/          # Reusable Vue components
│   ├── AdminHeader.vue  # Top navigation header
│   └── AdminSidebar.vue # Sidebar navigation
├── firebase/           # Firebase configuration
│   └── config.js       # Firebase setup
├── router/             # Vue Router configuration
│   └── index.js        # Route definitions
├── stores/             # Pinia stores
│   ├── auth.js         # Authentication store
│   ├── products.js     # Products management store
│   ├── orders.js       # Orders management store
│   └── users.js        # Users management store
├── views/              # Page components
│   ├── Login.vue       # Admin login page
│   ├── Dashboard.vue   # Admin dashboard
│   ├── Products.vue    # Products listing
│   ├── ProductForm.vue # Product create/edit form
│   ├── Orders.vue      # Orders listing
│   ├── OrderDetail.vue # Order details
│   ├── Users.vue       # Users listing
│   ├── UserDetail.vue  # User details
│   └── Settings.vue    # Settings page
├── App.vue             # Root component
└── main.js             # Application entry point
```

## Key Features

### Product Management
- Create and edit products with detailed information
- Upload product images as base64 strings
- Set product categories, pricing, and descriptions
- Toggle product active/featured status
- THC/CBD content tracking for cannabis products

### Order Management
- View all customer orders with filtering
- Update order status (pending, processing, shipped, delivered, cancelled)
- Add admin notes to orders
- Track order history and status changes

### User Management
- View customer accounts and statistics
- Toggle user active/inactive status
- View user order history and spending

### Admin Authentication
- Secure admin login with email/password
- Role-based access control
- Admin user creation and management

## Base64 Image Support

The admin portal supports uploading product images as base64 strings, which are stored directly in Firestore. This approach:

- Eliminates the need for separate image storage
- Simplifies deployment and reduces costs
- Ensures images are always available with the product data
- Works seamlessly with the frontend ecommerce store

## Integration with Frontend Store

The admin portal is designed to work seamlessly with the main 420Vibe ecommerce store:

- Products created in the admin portal appear immediately in the frontend
- Base64 images are displayed correctly in the frontend store
- Order data is shared between both applications
- User accounts are managed consistently

## Security Considerations

- Admin authentication is required for all admin routes
- Admin users are stored in a separate Firestore collection
- Role-based access control prevents unauthorized access
- All admin actions are logged and tracked

## Deployment

The admin portal can be deployed to any static hosting service:

1. Build the project: `npm run build`
2. Deploy the `dist` folder to your hosting service
3. Ensure environment variables are set in your hosting platform
4. Configure Firebase security rules for production

## Support

For issues or questions about the admin portal, please refer to the main 420Vibe project documentation or contact the development team.