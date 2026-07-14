<div align="center">

# Voice-Powered Comic Book E-Commerce Store

<img src="https://img.shields.io/badge/React-19-61DAFB?style=for-the-badge&logo=react&logoColor=black" />
<img src="https://img.shields.io/badge/Node.js-Express-339933?style=for-the-badge&logo=node.js&logoColor=white" />
<img src="https://img.shields.io/badge/MongoDB-Mongoose-47A248?style=for-the-badge&logo=mongodb&logoColor=white" />
<img src="https://img.shields.io/badge/Redux_Toolkit-State_Management-764ABC?style=for-the-badge&logo=redux&logoColor=white" />
<img src="https://img.shields.io/badge/Tailwind_CSS-3.4-06B6D4?style=for-the-badge&logo=tailwindcss&logoColor=white" />
<img src="https://img.shields.io/badge/Vite-7-646CFF?style=for-the-badge&logo=vite&logoColor=white" />
<img src="https://img.shields.io/badge/Voice_AI-Web_Speech_API-FF6B35?style=for-the-badge&logo=googlechrome&logoColor=white" />
<img src="https://img.shields.io/badge/PayPal-Payment-00457C?style=for-the-badge&logo=paypal&logoColor=white" />

<br/><br/>

> **A full-stack MERN e-commerce platform with a unique comic-book visual theme, voice command shopping, AI-powered smart suggestions, and a complete admin dashboard — built from scratch.**

<br/>

```
⚡ KAPOW! Shop by voice. BAM! Manage your list hands-free. POW! Checkout in seconds.
```

</div>

---

## 📋 Table of Contents

- [🎯 Project Overview](#-project-overview)
- [✨ Features at a Glance](#-features-at-a-glance)
- [🗂️ Project Structure](#️-project-structure)
- [🛠️ Tech Stack — Every Tool Explained](#️-tech-stack--every-tool-explained)
- [🗄️ Database Schema — Every Model Explained](#️-database-schema--every-model-explained)
- [🔌 REST API Reference — Every Endpoint](#-rest-api-reference--every-endpoint)
- [🏪 Redux Store Architecture](#-redux-store-architecture)
- [🎤 Voice Feature System — Deep Dive](#-voice-feature-system--deep-dive)
- [🎨 Comic Theme Design System](#-comic-theme-design-system)
- [📱 Mobile Responsiveness](#-mobile-responsiveness)
- [⚙️ Environment Variables](#️-environment-variables)
- [🚀 Running the Project](#-running-the-project)
- [🔐 Authentication & Security](#-authentication--security)
- [👑 Admin Dashboard](#-admin-dashboard)
- [🛒 Shopping Flow — End to End](#-shopping-flow--end-to-end)
- [📦 All Pages & Routes](#-all-pages--routes)

---

## 🎯 Project Overview

**Rabbit** is a production-ready, full-stack e-commerce clothing store built with the **MERN stack** (MongoDB, Express, React, Node.js). What makes it stand out:

1. **Comic-book visual identity** — every element uses the custom `comic-*` Tailwind design system: bold borders, offset shadows, Bangers font, yellow/red/cyan palette, halftone overlays, and panel-style cards — creating a unique, energetic shopping experience.

2. **Voice-powered shopping** — using the browser-native **Web Speech API** with a custom NLP engine, users can search products, add items to a shopping list, filter by price/gender/category, and navigate the site — all by speaking.

3. **Dual payment gateway** — **Cash on Delivery** (COD) and **PayPal** payments via `@paypal/react-paypal-js`, with a two-step checkout flow that creates a `Checkout` document before finalizing it into an `Order`.

4. **Guest cart + merge** — unauthenticated users get a `guestId` auto-assigned and can shop freely. On login, their guest cart merges into their user account seamlessly.

5. **Full admin dashboard** — product management (CRUD + Cloudinary image upload), user management (role changes, deletion), order management (status updates), and a live analytics dashboard with revenue/order/product totals.

6. **Fully mobile responsive** — every page adapts from 320px to 4K using Tailwind's responsive prefix system. Tables collapse into card views on mobile. Images scale with responsive height breakpoints.

---

## ✨ Features at a Glance

### 🛍️ Customer Features
| Feature | Description |
|---|---|
| Product browsing | Grid layout with filters: gender, category, size, color, price range, material, brand, sort |
| Product detail | Image gallery, size/color selector, quantity stepper, similar products |
| Guest cart | Add to cart without login using auto-generated `guestId` |
| Cart management | Add, update quantity, remove items, see total |
| Cart drawer | Slide-in panel from navbar, shopping list quick link |
| Checkout | Full shipping form, COD or PayPal payment |
| PayPal payment | Live PayPal Buttons via `@paypal/react-paypal-js` |
| Order confirmation | Invoice download (print-to-PDF), order summary |
| Order history | Table/card list of all past orders |
| Order details | Full order breakdown with items, address, payment status |
| User profile | View account info |
| Newsletter | Email subscription with duplicate check |
| Voice search | Speak to search products |
| Shopping list | Voice-managed, localStorage-persisted checklist |
| Smart suggestions | Cart-based, seasonal, featured product recommendations |
| Voice filters | Say "Show women's tops under $50" to filter |
| Multilingual voice | 8 languages: EN, ES, FR, DE, HI, PT, JA, ZH |
| Substitute suggestions | Say "milk" → offers almond milk, oat milk etc. |

### 👑 Admin Features
| Feature | Description |
|---|---|
| Dashboard | Revenue, order count, product count, recent orders table |
| Product management | Full CRUD with Cloudinary image upload, SKU, size, color, material |
| User management | View all users, change roles, create users, delete users |
| Order management | View all orders, update status (Processing → Shipped → Delivered) |

---

## 🗂️ Project Structure

```
unthinkable Solution/
│
├── backend/                        ← Node.js + Express API server
│   ├── config/
│   │   └── db.js                   ← MongoDB connection (Mongoose)
│   ├── data/
│   │   └── products.js             ← 40 seed products
│   ├── middleware/
│   │   └── authMiddlware.js        ← JWT protect + admin role guards
│   ├── models/
│   │   ├── User.js                 ← User schema (bcrypt hashed passwords)
│   │   ├── Product.js              ← Product schema (full e-commerce fields)
│   │   ├── Cart.js                 ← Cart schema (user + guest support)
│   │   ├── Checkout.js             ← Checkout session schema
│   │   ├── Order.js                ← Final order schema
│   │   └── Subscriber.js           ← Newsletter subscriber schema
│   ├── routes/
│   │   ├── userRoutes.js           ← /api/users (register, login, profile)
│   │   ├── productRoutes.js        ← /api/products (CRUD + filters)
│   │   ├── cartRoutes.js           ← /api/cart (add, get, update, delete, merge)
│   │   ├── checkoutRoutes.js       ← /api/checkout (create, pay, finalize)
│   │   ├── orderRoutes.js          ← /api/orders (my-orders, by ID)
│   │   ├── adminRoutes.js          ← /api/admin/users (CRUD)
│   │   ├── adminOrderRoutes.js     ← /api/admin/orders (CRUD + status)
│   │   ├── productAdminRoutes.js   ← /api/admin/products (list, create)
│   │   ├── subscribeRoute.js       ← /api/subscribe (newsletter)
│   │   └── uploadRoutes.js         ← /api/upload (Cloudinary image upload)
│   ├── server.js                   ← Express app entry point
│   ├── seeder.js                   ← Database seed script
│   ├── vercel.json                 ← Vercel deployment config
│   └── package.json
│
└── frontend/                       ← React + Vite SPA
    ├── src/
    │   ├── App.jsx                 ← Root routes + Provider + VoiceCommandPanel
    │   ├── index.css               ← Tailwind + custom comic utility classes
    │   ├── assets/                 ← Static images (hero, collections, login)
    │   ├── components/
    │   │   ├── Admin/              ← AdminLayout, Sidebar, CRUD management pages
    │   │   ├── Cart/               ← CartContent, Checkout, PayPalButton
    │   │   ├── Common/             ← Navbar, Header, Footer, SearchBar,
    │   │   │                          VoiceSearchBar, ProtectedRoute
    │   │   ├── Layout/             ← UserLayout, CartDrawer, Hero, Topbar
    │   │   ├── Product/            ← ProductGrid, ProductsDetails, FilterSidebar,
    │   │   │                          SortOptions, NewArrivals, FeaturedCollection,
    │   │   │                          GenderCollectionSection, FeaturesSection
    │   │   └── Voice/              ← VoiceCommandPanel, SmartSuggestions
    │   ├── hooks/
    │   │   └── useVoiceRecognition.js  ← Core voice NLP hook
    │   ├── pages/
    │   │   ├── Home.jsx
    │   │   ├── Login.jsx / Register.jsx / Profile.jsx
    │   │   ├── CollectionPage.jsx
    │   │   ├── MyOrdersPage.jsx / OrderDetailsPage.jsx
    │   │   ├── OrderConfirmationPage.jsx
    │   │   ├── ShoppingListPage.jsx   ← Voice shopping list
    │   │   └── AdminHomePage.jsx
    │   ├── Redux/
    │   │   ├── Store.js            ← configureStore with 7 slices
    │   │   └── slices/
    │   │       ├── authSlice.js
    │   │       ├── productSlice.js
    │   │       ├── cartSlice.js
    │   │       ├── checkoutSlice.js
    │   │       ├── orderSlice.js
    │   │       ├── adminSlice.js
    │   │       └── voiceSlice.js   ← Shopping list + voice state
    │   └── utils/
    │       └── api.js              ← Axios instance with auth header
    ├── tailwind.config.js          ← Custom comic color palette + animations
    └── package.json
```

---

## 🛠️ Tech Stack — Every Tool Explained

### Backend

| Package | Version | Why It's Used |
|---|---|---|
| **express** | 5.2.1 | Web framework. Handles routing, middleware, request/response lifecycle. All API routes (`/api/users`, `/api/products`, etc.) are mounted here. |
| **mongoose** | 9.2.1 | MongoDB ODM. Defines schemas with validation, virtuals, pre-save hooks (password hashing), and provides query methods like `find()`, `findById()`, `findOneAndDelete()`. |
| **jsonwebtoken** | 9.0.3 | Creates and verifies JWT tokens for authentication. The payload includes `{ id, role }`. Tokens expire in 10 hours. Used in `protect` middleware and login/register routes. |
| **bcryptjs** | 3.0.3 | Hashes user passwords before saving to MongoDB using `bcrypt.genSalt(10)` + `bcrypt.hash()`. Also provides `matchPassword()` method for login comparison. |
| **cors** | 2.8.6 | Enables Cross-Origin Resource Sharing so the React frontend (port 5173) can call the Express API (port 9000) without browser blocking. |
| **dotenv** | 17.3.1 | Loads environment variables from `.env` into `process.env`. Used for `MONGO_URI`, `JWT_SECRET`, `CLOUDINARY_*` keys. |
| **cloudinary** | 2.9.0 | Cloud image hosting service. Product images are uploaded to Cloudinary and stored as URLs in the database. The upload route streams the file buffer directly using `streamifier`. |
| **multer** | 2.1.0 | Middleware for handling `multipart/form-data` file uploads. Uses `memoryStorage()` so the file is kept in RAM as a buffer (never written to disk) before streaming to Cloudinary. |
| **streamifier** | 0.1.1 | Converts a Node.js Buffer (from multer) into a readable stream so it can be piped directly into Cloudinary's upload stream API. |
| **nodemon** | 3.1.14 | Dev-only tool. Watches for file changes and auto-restarts the server. Used via `npm run dev`. |

### Frontend

| Package | Version | Why It's Used |
|---|---|---|
| **react** | 19.2.0 | UI library. All components are functional React components using hooks (`useState`, `useEffect`, `useRef`, `useCallback`, `useMemo`). |
| **react-dom** | 19.2.0 | Renders the React tree into the browser DOM via `ReactDOM.createRoot()` in `main.jsx`. |
| **react-router-dom** | 7.13.0 | Client-side routing. `BrowserRouter`, `Routes`, `Route`, `Link`, `useNavigate`, `useParams`, `useSearchParams` are all used extensively. Nested routes handle the user and admin layouts. |
| **@reduxjs/toolkit** | 2.11.2 | Official Redux toolset. `createSlice` generates reducers + action creators. `createAsyncThunk` handles async API calls with `pending/fulfilled/rejected` states. `configureStore` sets up the store. |
| **react-redux** | 9.2.0 | Connects React components to the Redux store via `useSelector` (read state) and `useDispatch` (dispatch actions). The `Provider` wraps the whole app in `App.jsx`. |
| **axios** | 1.13.6 | HTTP client for API calls. A central `api.js` instance is created with `baseURL` from env and an interceptor that auto-attaches the `Authorization: Bearer <token>` header from localStorage. |
| **@paypal/react-paypal-js** | 8.9.2 | Official PayPal React SDK. `PayPalScriptProvider` wraps the PayPal script loader. `PayPalButtons` renders the PayPal payment buttons. On approval, `actions.order.capture()` is called and the result is sent to the backend. |
| **sonner** | 2.0.7 | Toast notification library. Used throughout for success/error/info feedback. `toast.success()`, `toast.error()`, `toast.info()`, `toast.warning()`. The `Toaster` component is mounted globally in `App.jsx`. |
| **react-icons** | 5.5.0 | Icon library. Uses `hi2` (Heroicons v2), `ri` (Remix Icons), `fa` (Font Awesome), `io` (Ionicons), `tb` (Tabler Icons) icon sets throughout the UI. |
| **vite** | 7.2.4 | Frontend build tool and dev server. Extremely fast HMR (Hot Module Replacement). Replaces Create React App. The `@vitejs/plugin-react` plugin enables JSX transforms. |
| **tailwindcss** | 3.4.17 | Utility-first CSS framework. The entire UI is styled with Tailwind classes. A custom theme extends it with `comic-*` colors, Bangers/Comic Neue fonts, custom box shadows, border widths, and animations. |
| **postcss** | 8.5.6 | CSS processing pipeline. Tailwind requires PostCSS to transform `@tailwind` directives into real CSS. Also runs `autoprefixer` for browser compatibility. |
| **autoprefixer** | 10.4.24 | PostCSS plugin that adds vendor prefixes (`-webkit-`, `-moz-`, etc.) automatically. Ensures cross-browser CSS compatibility. |

### Voice — No Extra Package Needed
The entire voice system uses the **browser-native `window.SpeechRecognition` / `window.webkitSpeechRecognition` API** (Web Speech API). This is built into Chrome and Edge — no npm package required. The custom `useVoiceRecognition` hook wraps it with NLP parsing, Redux state management, and command execution.

---

## 🗄️ Database Schema — Every Model Explained

### 👤 User Model (`models/User.js`)
```
name        String   required, unique
email       String   required, unique, regex validated
password    String   required, min 6 chars — bcrypt hashed via pre-save hook
role        String   enum: ["customer", "admin"], default: "customer"
timestamps  createdAt, updatedAt (auto)
```
**Key methods:**
- `pre("save")` — auto-hashes password when modified using `bcrypt.genSalt(10)`
- `matchPassword(entered)` — compares plaintext against hash for login

### 🛍️ Product Model (`models/Product.js`)
```
name          String   required, trimmed
description   String   required
price         Number   required
discountPrice Number   optional original price for showing % off
countInStock  Number   required, default 0
sku           String   required, unique — stock keeping unit
category      String   required — "Top Wear" | "Bottom Wear"
brand         String   optional
sizes         [String] required — e.g. ["S","M","L","XL"]
colors        [String] required — e.g. ["Red","Blue","Black"]
collections   String   required — e.g. "Business Casual", "Vacation"
material      [String] e.g. ["Cotton", "Denim"]
gender        String   enum: ["Men","Women","Unisex"], required
images        [{url, altText}] array of image objects
isFeatured    Boolean  default false — used by SmartSuggestions
isPublished   Boolean  default false
rating        Number   default 0 — used for popularity sort
numReviews    Number   default 0
tags          [String] searchable keywords
user          ObjectId ref to User (who created it — admin)
metaTitle/Description/Keywords  SEO fields
dimensions    {length, width, height}
weight        Number
timestamps    createdAt, updatedAt
```

### 🛒 Cart Model (`models/Cart.js`)
```
user       ObjectId  ref User (null for guests)
guestId    String    auto-generated "guest_<timestamp>" for anonymous users
products   [{
  product  ObjectId  ref Product
  name     String    snapshot at add-time
  image    String    snapshot URL at add-time
  price    Number    snapshot price at add-time
  size     String
  color    String
  quantity Number    default 1
}]
totalPrice Number    calculated as sum(price × quantity), 2 decimal precision
timestamps createdAt, updatedAt
```
**Key design decisions:**
- Supports both authenticated users (`user` field) and guests (`guestId` field)
- Price and name are snapshotted so changes to the product don't affect existing carts
- The `merge` endpoint transfers guest cart items into the user cart on login

### 📋 Checkout Model (`models/Checkout.js`)
```
user           ObjectId  ref User, required
checkoutItems  [{product, name, image, price, size, color, quantity}]
shippingAddress {address, city, postalCode, country}
paymentMethod  String    "COD" | "PayPal"
totalPrice     Number
isPaid         Boolean   default false
paidAt         Date
paymentStatus  String    default "Pending"
paymentDetails Mixed     stores PayPal transaction details
isFinalized    Boolean   default false — prevents double-processing
finalizedAt    Date
timestamps
```
**Purpose:** The Checkout model acts as a temporary session between "user clicked checkout" and "order was created". This two-step approach lets PayPal complete payment before the Order is finalized.

### 📦 Order Model (`models/Order.js`)
```
user           ObjectId  ref User
orderItems     [{product, name, image, price, size, color, quantity}]
shippingAddress {address, city, postalCode, country}
paymentMethod  String
totalPrice     Number
isPaid         Boolean   default false
paidAt         Date
isDelivered    Boolean   default false
deliveredAt    Date
paymentStatus  String    default "Pending"
status         String    enum: ["Processing","Shipped","Delivered","Cancelled"]
                         default "Processing"
timestamps
```

### 📧 Subscriber Model (`models/Subscriber.js`)
```
email         String  required, unique, lowercase, trimmed
subscribedAt  Date    default Date.now
```

---

## 🔌 REST API Reference — Every Endpoint

Base URL: `http://localhost:9000`

### 👤 User Routes `/api/users`
| Method | Endpoint | Auth | Description |
|---|---|---|---|
| POST | `/api/users/register` | Public | Register new user. Returns JWT token + user object. Hashes password via bcrypt. |
| POST | `/api/users/login` | Public | Login. Compares password with hash. Returns JWT + user. |
| GET | `/api/users/profile` | 🔒 Private | Returns full user object from token. |

### 🛍️ Product Routes `/api/products`
| Method | Endpoint | Auth | Description |
|---|---|---|---|
| GET | `/api/products` | Public | Get all products. Supports query params: `search`, `gender`, `category`, `brand`, `material`, `size`, `color`, `collection`, `minPrice`, `maxPrice`, `sortBy` (priceAsc/priceDesc/popularity), `limit`. Uses MongoDB `$or` regex for search, `$gte/$lte` for price range. |
| GET | `/api/products/best-seller` | Public | Top 5 products sorted by `rating` descending. |
| GET | `/api/products/new-arrivals` | Public | Latest 8 products sorted by `createdAt` descending. |
| GET | `/api/products/similar/:id` | Public | Up to 4 products with same `category` + `gender` excluding the given ID. |
| GET | `/api/products/:id` | Public | Single product by MongoDB ObjectId. Validates ObjectId format first. |
| POST | `/api/products` | 🔒 Admin | Create product. Attaches `req.user._id` as owner. |
| PUT | `/api/products/:id` | 🔒 Admin | Update any field of a product. |
| DELETE | `/api/products/:id` | 🔒 Admin | Delete product by ID. |

### 🛒 Cart Routes `/api/cart`
| Method | Endpoint | Auth | Description |
|---|---|---|---|
| POST | `/api/cart` | Optional | Add item to cart. Supports both userId and guestId. Merges quantity if item already exists. Creates new cart if none exists. |
| GET | `/api/cart` | Optional | Get cart by userId (priority) or guestId from query params. |
| PUT | `/api/cart` | Optional | Update item quantity. Uses 3-tier fallback matching: exact (productId+size+color), then +size, then productId only. |
| DELETE | `/api/cart` | Optional | Remove item from cart. Accepts both body and query params. |
| POST | `/api/cart/merge` | 🔒 Private | Merge guest cart into user cart on login. If no user cart exists, converts guest cart. If both exist, merges quantities. Deletes guest cart after merge. |

### 💳 Checkout Routes `/api/checkout`
| Method | Endpoint | Auth | Description |
|---|---|---|---|
| POST | `/api/checkout` | 🔒 Private | Create checkout session. Validates items, full shipping address, payment method, and positive total price. |
| PUT | `/api/checkout/:id/pay` | 🔒 Private | Finalize checkout. Sets `isPaid`, stores payment details, creates `Order` document, deletes user's cart. COD orders stay `isPaid: false` with `paymentStatus: "Pending"`. |
| POST | `/api/checkout/:id/finalize` | 🔒 Private | Manually finalize a checkout that's already paid. |

### 📦 Order Routes `/api/orders`
| Method | Endpoint | Auth | Description |
|---|---|---|---|
| GET | `/api/orders/my-orders` | 🔒 Private | All orders for the logged-in user, sorted by newest first. |
| GET | `/api/orders/:id` | 🔒 Private | Single order. Verifies order belongs to the requesting user. Populates user name/email. |

### 👑 Admin Routes `/api/admin`
| Method | Endpoint | Auth | Description |
|---|---|---|---|
| GET | `/api/admin/users` | 🔒 Admin | All users (passwords excluded). |
| POST | `/api/admin/users` | 🔒 Admin | Create user with specified role. |
| PUT | `/api/admin/users/:id` | 🔒 Admin | Update name, email, role. |
| DELETE | `/api/admin/users/:id` | 🔒 Admin | Delete user. |
| GET | `/api/admin/products` | 🔒 Admin | All products (no filters). |
| POST | `/api/admin/products` | 🔒 Admin | Create product (basic fields). |
| GET | `/api/admin/orders` | 🔒 Admin | All orders populated with user name/email. |
| PUT | `/api/admin/orders/:id` | 🔒 Admin | Update order status. Auto-sets `isDelivered=true` and `deliveredAt` when status is "Delivered". |
| DELETE | `/api/admin/orders/:id` | 🔒 Admin | Delete order. |

### 🔧 Utility Routes
| Method | Endpoint | Auth | Description |
|---|---|---|---|
| POST | `/api/upload` | Public | Upload image to Cloudinary. Accepts `multipart/form-data` with field `image`. Uses `multer.memoryStorage()` + `streamifier` to pipe buffer to Cloudinary stream. Returns `{ url }`. |
| POST | `/api/subscribe` | Public | Add email to newsletter. Returns 400 if already subscribed. |

---

## 🏪 Redux Store Architecture

The Redux store has **7 slices** managed by `@reduxjs/toolkit`:

```
store
├── auth          → user, guestId, loading, error
│                   Actions: loginUser, registerUser, logout, generateNewGuestId
│                   Persistence: userInfo + userToken in localStorage
│
├── products      → products[], selectedProduct, bestSellers[], newArrivals[],
│                   similarProducts[], loading, error
│                   Thunks: fetchProducts, fetchProductById, fetchBestSellers,
│                           fetchNewArrivals, fetchSimilarProducts
│
├── cart          → cart (products[], totalPrice), loading, error
│                   Thunks: fetchCart, addToCart, updateCartItem,
│                           removeFromCart, mergeCart
│
├── checkout      → checkout, loading, error
│                   Thunks: createCheckout, payCheckout
│
├── orders        → orders[], selectedOrder, loading, error
│                   Thunks: fetchMyOrders, fetchOrderById
│
├── admin         → users[], products[], orders[], loading, error
│                   Thunks: fetchAdminUsers, createAdminUser, updateAdminUser,
│                           deleteAdminUser, fetchAdminProducts, deleteAdminProduct,
│                           fetchAdminOrders, updateAdminOrder, deleteAdminOrder
│
└── voice         → shoppingList[], isListening, transcript, language,
                    lastCommand, suggestions
                    Actions: addShoppingItem, removeShoppingItem,
                             updateShoppingItemQty, toggleShoppingItemChecked,
                             clearCheckedItems, clearShoppingList,
                             setListening, setTranscript, setLanguage,
                             setLastCommand, setSuggestions
                    Persistence: shoppingList saved to localStorage automatically
```

### How Async Thunks Work
Every API call uses `createAsyncThunk`. The pattern is:
```javascript
// Dispatching a thunk
dispatch(fetchProducts({ gender: "Women", maxPrice: 50 }))
  .unwrap()           // throws on rejected
  .then(result => ...)
  .catch(err => ...)

// Inside the slice - three cases auto-handled:
.addCase(fetchProducts.pending, state => { state.loading = true })
.addCase(fetchProducts.fulfilled, (state, action) => { state.products = action.payload })
.addCase(fetchProducts.rejected, (state, action) => { state.error = action.payload })
```

### The Axios Instance (`utils/api.js`)
A single Axios instance is shared across all slices. It automatically:
- Sets `baseURL` from `VITE_BACKEND_URL` environment variable
- Adds `Authorization: Bearer <token>` header by reading `userToken` from localStorage on every request
- This means no manual token passing in any API call

---

## 🎤 Voice Feature System — Deep Dive

This is the most unique part of the project. The entire voice system is built with **zero extra npm packages** — only the browser-native Web Speech API.

### Architecture Overview

```
User speaks
    ↓
SpeechRecognition API (browser-native)
    ↓ raw transcript (interim + final)
useVoiceRecognition hook
    ↓
parseCommand(transcript)  ← NLP engine
    ↓
{type, item, quantity, searchTerm, filters}
    ↓
executeCommand()
    ↓
Redux dispatch / navigate / toast
```

### 📁 Files Involved
| File | Role |
|---|---|
| `hooks/useVoiceRecognition.js` | Core hook: starts/stops SpeechRecognition, runs NLP, dispatches commands |
| `Redux/slices/voiceSlice.js` | State: shopping list, isListening, transcript, language, suggestions |
| `components/Common/VoiceSearchBar.jsx` | Enhanced search bar with mic button, language picker, live transcript, suggestions dropdown |
| `components/Voice/VoiceCommandPanel.jsx` | Floating FAB (bottom-right): mic button, expand panel with examples + language selector |
| `components/Voice/SmartSuggestions.jsx` | Cart-based, seasonal, and featured product recommendation panels |
| `pages/ShoppingListPage.jsx` | Full shopping list manager: voice + manual add, categories, check-off, bulk actions |

### 🧠 NLP Engine — `parseCommand()`

The NLP parser classifies every spoken utterance into one of 7 command types:

#### 1. `ADD_TO_LIST` — Add item to shopping list
Triggered by patterns like:
- `"Add milk"` / `"Add 2 bottles of milk"`
- `"I need apples"` / `"I need 5 oranges"`
- `"Buy bread"` / `"Get some coffee"`
- `"I want to buy bananas"`
- `"Please add eggs to my list"`
- `"3 packets of pasta to the list"`

**Quantity extraction** handles both numeric (`"3 apples"`) and word numbers (`"five oranges"`, `"a bottle of water"`).

#### 2. `REMOVE_FROM_LIST` — Remove item
- `"Remove milk from my list"`
- `"Delete bread"`
- `"Take out eggs"`
- `"I don't need coffee anymore"`

#### 3. `UPDATE_QTY` — Change quantity
- `"Change sugar to 3"`
- `"Update milk quantity to 2"`
- `"Set oranges to 5"`

#### 4. `SEARCH` — Product search
- `"Find cotton shirts"`
- `"Search for blue jeans"`
- `"Show me hoodies"`
- `"I'm looking for a winter coat"`
- `"Find me organic cotton t-shirts under $40 for women"`

The search term is extracted by stripping stop words, filters, and conjunctions. Simultaneously, `extractFilters()` parses any embedded filter attributes.

#### 5. `FILTER` — Apply filters without specific search term
- `"Show women's tops under $50"`
- `"Sort by cheapest"`
- `"Show trending men's bottoms"`
- `"Between $20 and $60"`

Parsed filters: `gender`, `category`, `sortBy`, `minPrice`, `maxPrice`, `brand`, `material`

#### 6. `NAVIGATE` — Go to a page
- `"Go to men's section"`
- `"Open women's collection"`
- `"Show my shopping list"`
- `"Open cart"`

#### 7. `UNKNOWN` — Fallback
Unrecognized commands fall back to a plain text search and show a helpful toast.

### 🌐 Multilingual Support
8 languages supported via the Web Speech API's `recognition.lang` property:

| Code | Language |
|---|---|
| `en-US` | 🇺🇸 English |
| `es-ES` | 🇪🇸 Spanish |
| `fr-FR` | 🇫🇷 French |
| `de-DE` | 🇩🇪 German |
| `hi-IN` | 🇮🇳 Hindi |
| `pt-BR` | 🇧🇷 Portuguese |
| `ja-JP` | 🇯🇵 Japanese |
| `zh-CN` | 🇨🇳 Chinese |

Language is stored in Redux `voice.language` and persisted for the session. The language picker is available both in the VoiceSearchBar and VoiceCommandPanel.

### 🔄 Substitute Suggestions
When a user says a common item, the system offers healthier/alternative substitutes in real-time:
| Item Said | Substitutes Offered |
|---|---|
| milk | almond milk, oat milk, soy milk, coconut milk |
| bread | whole wheat bread, sourdough, rye bread, gluten-free bread |
| butter | margarine, coconut oil, olive oil, ghee |
| sugar | honey, maple syrup, stevia, agave |
| coffee | green tea, matcha, chai, decaf coffee |
| beef | chicken, turkey, tofu, lentils |
| eggs | tofu scramble, flax eggs, chia eggs |

### 🗂️ Auto-Categorization
When an item is added to the shopping list, the `categorizeItem()` function automatically assigns it to a category using regex pattern matching:

| Category | Keywords Detected |
|---|---|
| Dairy | milk, cheese, yogurt, butter, cream |
| Fruits | apple, banana, orange, grape, mango, berry |
| Vegetables | carrot, spinach, tomato, onion, garlic, pepper |
| Bakery | bread, bagel, muffin, croissant, loaf |
| Meat & Seafood | chicken, beef, pork, fish, salmon, tuna |
| Beverages | water, juice, soda, coffee, tea, wine |
| Snacks | chips, cookie, candy, chocolate, popcorn |
| Clothing | shirt, pants, jeans, jacket, dress, shoes |
| Personal Care | toothpaste, shampoo, soap, lotion |
| Household | detergent, cleaner, tissue, towel |

### 💡 Smart Suggestions

**Cart-Based Recommendations** — Co-purchase patterns:
- Has shirt/top in cart → suggests Belt
- Has pants/jeans → suggests Sneakers
- Has dress → suggests Heels
- Has jacket/coat → suggests Scarf

**Seasonal Picks** — Changes by current month:
- Spring (Mar-May): Light Jacket, Rain Coat, Floral Dress
- Summer (Jun-Aug): Shorts, Sunglasses, Swimwear
- Fall (Sep-Nov): Sweater, Hoodie, Boots
- Winter (Dec-Feb): Winter Coat, Thermal Shirt, Woolen Socks

**Featured Product Recs** — Products marked `isFeatured: true` in the DB that aren't already on the shopping list, shown as clickable product cards.

### 🛒 Shopping List — `voiceSlice.js`
The shopping list is:
- Stored in **Redux** for real-time UI updates
- Automatically **persisted to `localStorage`** via `saveToStorage()` called inside every reducer
- Loaded back from `localStorage` on page load via `loadFromStorage()` as the initial state
- Fully manageable by **voice** or **manual input**
- **Grouped by category** in the UI for easy scanning
- Color-coded by category (dairy = cyan, fruits = green, clothing = pink, etc.)

---

## 🎨 Comic Theme Design System

The entire visual language is defined in `tailwind.config.js` and `index.css`.

### Custom Color Palette
```javascript
comic: {
  yellow:  "#FFD60A"  // Primary CTA color — buttons, highlights, badges
  red:     "#E63946"  // Danger, sale badges, action alerts
  blue:    "#1D3557"  // Info, PayPal, links
  cyan:    "#00B4D8"  // Secondary accent, hover states, borders
  pink:    "#FF6B9D"  // Women's collection, personal care category
  green:   "#06D6A0"  // Success states, prices, stock info
  orange:  "#FF6B35"  // Pending status, bakery category
  dark:    "#1A1A2E"  // All borders, shadows, text — creates comic outline effect
  cream:   "#FFFDF7"  // Page backgrounds — warm off-white
  purple:  "#7B2FF7"  // Personal care, admin accents
}
```

### Typography
- **`font-comic` (Bangers)** — Google Fonts. All headings, labels, prices, buttons. Tall, bold, condensed lettering — pure comic book energy.
- **`font-body` (Comic Neue)** — Google Fonts. All body text, descriptions, form labels. Readable but still playful.

### Custom Utility Classes (`index.css`)
| Class | Effect |
|---|---|
| `.comic-card` | White bg, 3px border, offset shadow, hover lift + bigger shadow |
| `.comic-panel` | White bg, 3px border, rounded-2xl, large offset shadow, overflow hidden |
| `.comic-btn` | Bold uppercase font, 3px border, offset shadow that "presses" on click |
| `.comic-btn-primary` | Yellow button |
| `.comic-btn-danger` | Red button |
| `.comic-btn-dark` | Dark bg, yellow text button |
| `.comic-input` | Full-width input, 3px border, cyan focus ring |
| `.comic-badge` | Inline pill label with comic border |
| `.comic-heading` | Bangers font + tracking-wider |
| `.halftone::before` | Dot grid overlay using `radial-gradient` — classic comic book texture |
| `.speech-bubble` | CSS speech bubble with triangle tail using `::after` pseudo-element |

### Custom Box Shadows
```javascript
comic:        "4px 4px 0px 0px #1A1A2E"   // Standard offset shadow
comic-lg:     "6px 6px 0px 0px #1A1A2E"   // Large offset shadow
comic-xl:     "8px 8px 0px 0px #1A1A2E"   // Extra large
comic-yellow: "4px 4px 0px 0px #FFD60A"   // Yellow shadow (selected items)
comic-red:    "4px 4px 0px 0px #E63946"   // Red shadow (listening state)
comic-cyan:   "4px 4px 0px 0px #00B4D8"   // Cyan shadow
neon-blue:    "0 0 20px rgba(0,180,216,0.4)" // Glow effect
neon-pink:    "0 0 20px rgba(255,107,157,0.4)"
```

### Custom Animations
| Name | Effect | Used In |
|---|---|---|
| `pop-in` | Scale 0→1 with bounce overshoot (`cubic-bezier(0.68,-0.55,0.265,1.55)`) | Modal, order confirmation |
| `slide-up` | translateY(40px)→0 with fade | Product cards on load |
| `slide-right` | translateX(-40px)→0 | Product detail, checkout form |
| `wiggle` | -3deg → 3deg rotation | KAPOW/BAM badges on collection section |
| `float` | translateY 0 → -10px loop (3s) | Hero decorative dots |
| `bounce-slow` | Standard bounce (2s) | Cart icon badge, loading states |
| `fade-in` | opacity 0→1 | Product grid, page transitions |
| `spin-slow` | 360° rotation (3s) | Loading indicators |
| `blob` | translate + scale loop (7s) | Background decoration blobs |
| `shake` | translateX ±5px | Error states |

### Stagger Animation Classes
`.stagger-1` through `.stagger-8` add `animation-delay` from 0.1s to 0.8s — used to cascade product card entrance animations.

---

## 📱 Mobile Responsiveness

Every component has been audited and updated for screens from 320px upward:

| Component | Mobile Strategy |
|---|---|
| **Navbar** | Hamburger menu → slide-in drawer with full nav links. Logo scales from `text-2xl`. Icons tighter spacing. |
| **VoiceSearchBar** | Expands full-width on open. Language picker shown in dropdown. Input takes 80% width on mobile. |
| **Hero** | Heading scales: `text-4xl` → `text-5xl sm` → `text-8xl md` → `text-9xl lg`. |
| **GenderCollectionSection** | Images: `h-[400px]` → `h-[550px] sm` → `h-[700px] md`. |
| **ProductGrid** | `grid-cols-2` from smallest screen, `grid-cols-4` on lg. Card image height scales. |
| **NewArrivals** | Card min-width `220px` on mobile. Scroll buttons center below carousel on mobile. |
| **FeaturedCollection** | Padding reduces, heading text smaller on mobile. |
| **Footer** | Newsletter form stacks vertically on mobile (`flex-col sm:flex-row`). |
| **Login/Register** | Form padding reduces: `p-6 sm:p-10`. Outer container `p-4 sm:p-8 md:p-16`. |
| **MyOrdersPage** | Card layout (with image + badges) shown below `sm`. Full table shown `sm:block`. Date/Address columns hidden on xs. |
| **Checkout** | Stacks form above order summary. Form grids collapse to 1 column. |
| **ProductsDetails** | Main image: `h-[320px] sm:h-[420px] md:h-[500px]`. Info stacks below image. |
| **CollectionPage** | Heading size scales. Sidebar remains a slide-in overlay on mobile. |
| **Admin Tables** | ID columns hidden on mobile, email hidden on xs. Action buttons wrap with gap. |
| **ShoppingListPage** | Voice tips grid collapses to 1 column. Add form stacks vertically. Category pills wrap. |

---

## ⚙️ Environment Variables

### Backend (`.env`)
```env
PORT=9000
MONGO_URI=mongodb+srv://<user>:<password>@cluster.mongodb.net/rabbit
JWT_SECRET=<your-long-random-secret>
CLOUDINARY_CLOUD_NAME=<your-cloudinary-name>
CLOUDINARY_API_KEY=<your-cloudinary-key>
CLOUDINARY_API_SECRET=<your-cloudinary-secret>
```

### Frontend (`.env`)
```env
VITE_BACKEND_URL=http://localhost:9000
VITE_PAYPAL_CLIENT_ID=<your-paypal-sandbox-client-id>
```

---

## 🚀 Running the Project

### Prerequisites
- Node.js 18+ 
- npm 9+
- MongoDB Atlas account (or local MongoDB)
- Chrome or Edge browser (for voice features)

### Step 1 — Clone and Install

```bash
# Clone the repository
git clone https://github.com/pacemaker143/Ecommerce-with-voice-communication
cd "Ecommerce-with-voice-communication"

# Install backend dependencies
cd backend
npm install

# Install frontend dependencies
cd ../frontend
npm install
```

### Step 2 — Configure Environment

Create `backend/.env`:
```env
PORT=9000
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret_here
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret
```

Create `frontend/.env`:
```env
VITE_BACKEND_URL=http://localhost:9000
VITE_PAYPAL_CLIENT_ID=your_paypal_sandbox_client_id
```

### Step 3 — Seed the Database

```bash
cd backend
node seeder.js
```

This will:
- Clear existing products, users, and carts
- Create an admin account: `admin@example.com` / `123456`
- Insert 40 clothing products across men's/women's collections

Expected output:
```
MongoDB connected successfully
Connected to MongoDB
Data seeded successfully: 40 products
Admin login: admin@example.com / 123456
```

### Step 4 — Start the Backend

```bash
cd backend
npm run dev        # with nodemon (auto-restart)
# or
node server.js     # direct
```

Server runs on: `http://localhost:9000`

### Step 5 — Start the Frontend

```bash
cd frontend
npm run dev
```

App runs on: `http://localhost:5173`

### Quick Verification
```bash
# Test API is running
curl http://localhost:9000/
# → WELCOME TO THE Rabbit API

# Test products endpoint
curl http://localhost:9000/api/products?limit=1
# → Returns first product

# Test login
curl -X POST http://localhost:9000/api/users/login \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@example.com","password":"123456"}'
# → Returns token + user object
```

---

## 🔐 Authentication & Security

### JWT Flow
1. User logs in via `POST /api/users/login` or registers via `POST /api/users/register`
2. Server creates JWT: `jwt.sign({ id, role }, JWT_SECRET, { expiresIn: '10h' })`
3. Client stores token in `localStorage` as `userToken` and user info as `userInfo`
4. Axios interceptor auto-attaches `Authorization: Bearer <token>` to every request
5. Protected routes run `protect` middleware which decodes the token, fetches the user, and attaches to `req.user`
6. Admin routes additionally run `admin` middleware checking `req.user.role === 'admin'`

### Password Security
- Passwords are **never stored in plaintext**
- `pre("save")` hook on User model hashes password using `bcrypt.genSalt(10)` + `bcrypt.hash()`
- Login uses `bcrypt.compare()` to verify — the original password is never retrievable

### Guest Identity
- On first visit, a `guestId` like `"guest_1720000000000"` is generated and stored in `localStorage`
- All cart operations work with just this ID — no login required
- On login, `POST /api/cart/merge` seamlessly transfers the guest cart to the user's account
- A new `guestId` is regenerated on logout to prevent cart pollution

### Protected Routes (Frontend)
The `ProtectedRoute` component wraps sensitive pages. It reads from Redux `auth.user` — if null, redirects to `/login`. For admin routes, it also checks `user.role === 'admin'`.

---

## 👑 Admin Dashboard

Access: Login as `admin@example.com` / `123456`, then navigate to `/admin`.

### Dashboard (`/admin`)
- Revenue card: sum of all order `totalPrice` values
- Orders card: total order count with "Manage Orders →" link
- Products card: total product count with "Manage Products →" link
- Recent Orders table: last 5 orders with ID, customer name, total, status

### Product Management (`/admin/products`)
- Lists all products with ID (hidden mobile), name, price, SKU (hidden xs), Edit + Delete actions
- Edit button navigates to `/admin/products/:id/edit`
- Delete dispatches `deleteAdminProduct` which calls `DELETE /api/products/:id`
- Edit page (`EditProductPage.jsx`) allows updating all product fields including re-uploading images to Cloudinary

### User Management (`/admin/users`)
- Lists all users with role dropdown for live role changes
- "Add New User" form at top
- Delete button with confirmation
- Email column hidden on mobile for space

### Order Management (`/admin/orders`)
- All orders with inline status dropdown (Pending → Processing → Shipped → Delivered)
- "Mark Delivered" quick action button (hidden on mobile)
- Status change auto-updates `isDelivered` and `deliveredAt` when "Delivered" is selected

---

## 🛒 Shopping Flow — End to End

### Guest User Journey
```
1. Land on homepage
   ↓ guestId auto-created in localStorage
2. Browse products (CollectionPage, ProductsDetails)
   ↓ filter by voice or sidebar filters
3. Click "Add to Cart"
   ↓ POST /api/cart with guestId
4. Open cart drawer
   ↓ GET /api/cart with guestId
5. Click "Checkout" → redirected to /login
6. Login / Register
   ↓ POST /api/cart/merge called automatically
   ↓ guest cart merged into user cart
7. Continue checkout
```

### Checkout — COD Flow
```
1. Fill shipping form (name, address, city, postal, country, phone)
2. Select "Cash on Delivery"
3. Click "Place Order"
   ↓ POST /api/checkout (creates Checkout document)
   ↓ PUT /api/checkout/:id/pay (paymentStatus: "Pending")
   ↓ Creates Order document (isPaid: false)
   ↓ Deletes user's cart
4. Redirected to /order-confirmation
5. Download invoice (browser print dialog)
```

### Checkout — PayPal Flow
```
1. Fill shipping form
2. Select "PayPal"
3. Click "Proceed to PayPal"
   ↓ POST /api/checkout (creates Checkout document)
   ↓ checkoutId stored in component state
4. PayPal Buttons appear
5. User completes PayPal payment in popup
6. onApprove: actions.order.capture()
   ↓ PUT /api/checkout/:id/pay (paymentStatus: "Completed")
   ↓ Creates Order (isPaid: true, paidAt: now)
   ↓ Deletes cart
7. Redirected to /order-confirmation
```

---

## 📦 All Pages & Routes

### Public Routes
| Path | Component | Description |
|---|---|---|
| `/` | `Home.jsx` | Hero, new arrivals, featured collection, gender sections, features |
| `/login` | `Login.jsx` | Email/password form. Dispatches `loginUser` thunk. |
| `/register` | `Register.jsx` | Name/email/password form. Dispatches `registerUser` thunk. |
| `/collections/:collection` | `CollectionPage.jsx` | Product grid with filter sidebar. Handles `men`, `women`, `top-wear`, `bottom-wear`, `all`. |
| `/product/:id` | `ProductsDetails.jsx` | Product detail with gallery, size/color picker, add to cart, similar products. |
| `/shopping-list` | `ShoppingListPage.jsx` | Voice shopping list with suggestions tab. |

### Protected User Routes (login required)
| Path | Component | Description |
|---|---|---|
| `/profile` | `Profile.jsx` | User account info |
| `/checkout` | `Checkout.jsx` | Shipping form + COD/PayPal payment |
| `/order-confirmation` | `OrderConfirmationPage.jsx` | Success page with invoice download |
| `/my-orders` | `MyOrdersPage.jsx` | Order history (card on mobile, table on desktop) |
| `/orders/:id` | `OrderDetailsPage.jsx` | Full order detail view |

### Protected Admin Routes (`role: admin` required)
| Path | Component | Description |
|---|---|---|
| `/admin` | `AdminHomePage.jsx` | Dashboard with stats + recent orders |
| `/admin/users` | `UserManagement.jsx` | User CRUD + role management |
| `/admin/products` | `ProductManagement.jsx` | Product list + delete |
| `/admin/products/:id/edit` | `EditProductPage.jsx` | Full product edit form with image upload |
| `/admin/orders` | `Ordermanagement.jsx` | All orders + status management |

---

## 🎤 Voice Command Quick Reference

Open the mic from:
- **Navbar** — mic icon next to search
- **Floating FAB** — bottom-right corner of every page
- **Shopping List page** — "🎤 Voice Command" button

| Say | What Happens |
|---|---|
| `"Add milk"` | Adds milk to shopping list (qty: 1, category: Dairy) |
| `"Add 3 bottles of water"` | Adds water ×3 to shopping list |
| `"I need five oranges"` | Adds oranges ×5 to shopping list |
| `"I want to buy a winter coat"` | Adds Winter Coat ×1 to list |
| `"Remove bread from my list"` | Removes bread from shopping list |
| `"I don't need sugar"` | Removes sugar from list |
| `"Change milk to 4"` | Updates milk quantity to 4 |
| `"Find cotton shirts"` | Navigates to /collections/all?search=cotton+shirts |
| `"Find women's jeans under $60"` | Filters: gender=Women, category=Bottom Wear, maxPrice=60 |
| `"Show men's tops between $20 and $50"` | Filters: gender=Men, category=Top Wear, min/maxPrice |
| `"Sort by cheapest"` | Applies sortBy=priceAsc filter |
| `"Show popular items"` | Applies sortBy=popularity filter |
| `"Go to men's section"` | Navigates to /collections/men |
| `"Open cart"` | Opens cart drawer |
| `"Show my shopping list"` | Navigates to /shopping-list |

---

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/your-feature`
3. Commit changes: `git commit -m "Add your feature"`
4. Push: `git push origin feature/your-feature`
5. Open a Pull Request

---

## 📄 License

This project is open source and available under the [MIT License](LICENSE).

---

<div align="center">

**Built with ⚡ by Tanmay**

*🐰 RABBIT — Where shopping meets the comic universe*

```
POW! BAM! KAPOW! Shop on! 🎤
```

[![GitHub](https://img.shields.io/badge/GitHub-pacemaker143-181717?style=for-the-badge&logo=github)](https://github.com/pacemaker143/Ecommerce-with-voice-communication)

</div>
