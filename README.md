# 🛍️ Luxe Cart - E-Commerce Platform

A professional, full-featured e-commerce React application built with modern technologies. Luxe Cart provides a seamless shopping experience with authentication, product browsing, cart management, checkout, and order tracking.

**🌐 Live Demo:** https://ecommerce-react-capstone.vercel.app

---

## ✨ Features

### 🔐 **Authentication**
- User Registration with email validation
- Secure Login with session management
- Profile management with personal information
- Persistent authentication using localStorage

### 🛒 **Shopping Experience**
- Browse products from Fake Store API + custom collection
- Advanced product search and filtering
- Product detail pages with ratings and reviews
- Add to cart with quantity management
- Wishlist functionality to save favorite products

### 💳 **Checkout & Orders**
- Multiple address management (add, edit, delete)
- Payment method selection (COD, Online)
- Order summary with calculations (subtotal, delivery charges, discounts)
- Real-time order creation and persistence
- Order history with status tracking (Processing, Delivered, Pending, Cancelled)

### 👤 **User Profile**
- Comprehensive dashboard with 6 statistics
  - Total Orders, Delivered Orders, Processing Orders
  - Pending Orders, Cancelled Orders, Wishlist Items
- Personal information display
- Edit profile functionality
- Order and wishlist management

### 🎨 **Professional UI/UX**
- Responsive design (desktop, tablet, mobile)
- Smooth animations with Framer Motion
- Professional navbar with dropdown menu
- Newsletter signup modal
- Loading spinners and toast notifications
- Modern color scheme and typography

---

## 🛠️ Tech Stack

### Frontend
- **React 18** - UI library
- **React Router v6** - Client-side routing
- **Framer Motion** - Animations and interactions
- **Lucide React** - Icon library
- **React Hot Toast** - Notifications

### State Management
- **React Context API** - Global state (AuthContext, CartContext)
- **localStorage** - Data persistence

### Build & Deployment
- **Create React App** - Build tool
- **Vercel** - Production hosting
- **GitHub** - Version control

### Data Sources
- **Fake Store API** - Primary product database
- **Mock Products** - Custom collection for missing categories

---

## 📁 Project Structure

```
src/
├── components/
│   ├── Auth/
│   │   ├── AuthModal.js
│   │   ├── LoginModal.js
│   │   ├── RegisterModal.js
│   │   └── auth.css
│   ├── Cart/
│   │   └── CartSidebar.js
│   ├── Navbar/
│   │   ├── Navbar.js
│   │   └── navbar.css
│   ├── ProductCard/
│   │   ├── ProductCard.js
│   │   └── ProductCard.css
│   ├── Shared/
│   │   └── LoadingSpinner.js
│   └── ProductList.js
├── contexts/
│   ├── AuthContext.js
│   └── CartContext.js
├── hooks/
│   └── useProducts.js
├── pages/
│   ├── Home.js
│   ├── Products.js
│   ├── ProductDetail.js
│   ├── CartPage.js
│   ├── CheckoutPage.js
│   ├── Orders.js
│   ├── Profile.js
│   ├── Wishlist.js
│   └── *.css (styling for each page)
├── routes/
│   └── AppRoutes.js
├── services/
│   ├── api.js
│   ├── ordersService.js
│   ├── wishlistService.js
│   └── realtime.js
├── App.js
└── index.js
```

---

## 🚀 Getting Started

### Prerequisites
- Node.js (v14 or higher)
- npm (v6 or higher)

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/Anshu2530/ecommerce-react-capstone.git
   cd ecommerce-react-capstone/luxe-cart
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Start the development server**
   ```bash
   npm start
   ```

4. **Open in browser**
   - Navigate to [http://localhost:3000](http://localhost:3000)
   - The app will reload on code changes

---

## 📖 Usage Guide

### Creating an Account
1. Click "Sign In" in the navbar
2. Switch to "Register" tab
3. Fill in email, password, and profile details
4. Click "Register"

### Shopping
1. Browse products on Home or Products page
2. Click on product to view details
3. Click "Add to Cart" to add items
4. Click cart icon to view shopping cart
5. Click "Proceed to Checkout"

### Checkout Process
1. Select or add delivery address
2. Choose payment method (COD or Online)
3. Review order summary
4. Click "Place Order" to complete purchase

### Tracking Orders
1. Go to "Orders" from navbar dropdown
2. View all orders with status and details
3. Filter by status (All, Delivered, Processing, etc.)

### Wishlist
1. Click heart icon on product card to add to wishlist
2. Visit Wishlist page from navbar dropdown
3. Add wishlist items directly to cart

---

## 📦 Available Scripts

### Development
```bash
npm start
```
Runs the app in development mode at [http://localhost:3000](http://localhost:3000)

### Testing
```bash
npm test
```
Launches the test runner in interactive watch mode

### Production Build
```bash
npm run build
```
Builds the app for production to the `build` folder

### Deployment to Vercel
```bash
npm install -g vercel
vercel --prod
```

---

## 🌐 Deployment

### Vercel Deployment

1. **Install Vercel CLI**
   ```bash
   npm install -g vercel
   ```

2. **Deploy to production**
   ```bash
   vercel --prod
   ```

3. **Follow the interactive prompts**
   - Authenticate with Vercel account
   - Confirm project name
   - Select deployment settings

4. **Access your app**
   - Vercel will provide your live URL
   - Your app is now accessible worldwide

### Environment Variables (if needed)
Add any environment variables in Vercel dashboard under Project Settings → Environment Variables

---

## 🔑 Key Features in Detail

### State Management
- **AuthContext**: Manages user login status, user data, and authentication methods
- **CartContext**: Manages shopping cart items, wishlist, and order history

### Data Persistence
- User data stored in localStorage with key `luxe-user`
- Cart data stored with key `luxe-cart`
- Orders stored with key `luxe-orders`
- Profile info stored with key `profile_${email}`

### API Integration
- Fake Store API: `https://fakestoreapi.com/products`
- Custom mock data for fashion category products
- All data fetched and processed on the frontend

---

## 🎯 Future Enhancements

- [ ] Real backend integration with Node.js/Express
- [ ] Database integration (MongoDB/PostgreSQL)
- [ ] Real payment gateway (Stripe/Razorpay)
- [ ] Email notifications
- [ ] Product reviews and ratings
- [ ] Admin dashboard
- [ ] Analytics and reporting
- [ ] Wishlist sharing functionality

---

## 🐛 Troubleshooting

### Port 3000 already in use
```bash
# On Windows
netstat -ano | findstr :3000
taskkill /PID <PID> /F

# On macOS/Linux
lsof -i :3000
kill -9 <PID>
```

### Cache issues
Clear browser cache and localStorage:
1. Open DevTools (F12)
2. Go to Application tab
3. Click "Clear site data"
4. Refresh page

### Build errors
```bash
# Clear npm cache
npm cache clean --force

# Reinstall dependencies
rm -rf node_modules package-lock.json
npm install
```

---

## 👨‍💻 Author

**Anshu Kumar**
- GitHub: [@Anshu2530](https://github.com/Anshu2530)
- Project: [ecommerce-react-capstone](https://github.com/Anshu2530/ecommerce-react-capstone)

---

## 🙏 Acknowledgments

- [Fake Store API](https://fakestoreapi.com/) for product data
- [Create React App](https://create-react-app.dev/) for project scaffolding
- [Vercel](https://vercel.com/) for deployment platform
- All open-source libraries and their contributors

---

**Built with ❤️ for the DeveloperWeek 1 Capstone Project**

### `npm run build`

Builds the app for production to the `build` folder.\
It correctly bundles React in production mode and optimizes the build for the best performance.

The build is minified and the filenames include the hashes.\
Your app is ready to be deployed!

See the section about [deployment](https://facebook.github.io/create-react-app/docs/deployment) for more information.

### `npm run eject`

**Note: this is a one-way operation. Once you `eject`, you can't go back!**

If you aren't satisfied with the build tool and configuration choices, you can `eject` at any time. This command will remove the single build dependency from your project.

Instead, it will copy all the configuration files and the transitive dependencies (webpack, Babel, ESLint, etc) right into your project so you have full control over them. All of the commands except `eject` will still work, but they will point to the copied scripts so you can tweak them. At this point you're on your own.

You don't have to ever use `eject`. The curated feature set is suitable for small and middle deployments, and you shouldn't feel obligated to use this feature. However we understand that this tool wouldn't be useful if you couldn't customize it when you are ready for it.

## Learn More

You can learn more in the [Create React App documentation](https://facebook.github.io/create-react-app/docs/getting-started).

To learn React, check out the [React documentation](https://reactjs.org/).

### Code Splitting

This section has moved here: [https://facebook.github.io/create-react-app/docs/code-splitting](https://facebook.github.io/create-react-app/docs/code-splitting)

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
