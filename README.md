# Shopelio - E-commerce Web Application

Shopelio is a modern e-commerce platform built with Next.js, MongoDB, and Tailwind CSS. It offers a complete shopping experience with user authentication, product management, cart functionality, and order processing.

## Features

- **User Authentication**: Secure login/registration system
- **Product Catalog**: Browse products by categories
- **Product Management**: Admin interface for adding and managing products
- **Shopping Cart**: Add, remove, and update items
- **Checkout Process**: Complete purchase flow with multiple payment options
- **Order Management**: Track and manage orders
- **Wishlist**: Save products for later
- **Responsive Design**: Optimized for mobile, tablet, and desktop
- **Search Functionality**: Find products easily

## Technologies Used

- **Frontend**: Next.js, React, Tailwind CSS
- **Backend**: Next.js API Routes
- **Database**: MongoDB with Mongoose
- **Authentication**: JWT (JSON Web Tokens)
- **State Management**: React Context API
- **UI Components**: Custom components with Tailwind CSS
- **Icons**: Lucide React

## Getting Started

### Prerequisites

- Node.js (v14 or higher)
- MongoDB connection

### Installation

1. Clone the repository:
   ```
   git clone https://github.com/your-username/shopelio.git
   ```

2. Install dependencies:
   ```
   cd shopelio
   npm install
   ```

3. Set up environment variables:
   Create a `.env` file in the root directory with the following variables:
   ```
   MONGODB_URI=your_mongodb_connection_string
   JWT_SECRET=your_jwt_secret
   ```

4. Run the development server:
   ```
   npm run dev
   ```

5. Open [http://localhost:3000](http://localhost:3000) in your browser.

## Project Structure

- `app/` - Next.js pages and components
  - `actions/` - Server actions for database operations
  - `api/` - API routes for CRUD operations
  - `components/` - Reusable UI components
  - `context/` - React context providers
  - `models/` - Mongoose schemas
  - `lib/` - Helper functions and utilities

## License

MIT License

## Contact

Your Name - your.email@example.com

Project Link: [https://github.com/your-username/shopelio](https://github.com/your-username/shopelio)
