# Liverpool Product Browser — Frontend

A modern React application that simulates Liverpool's product browsing experience, featuring product search, infinite scroll, detailed product views, and a dynamic form builder.

## Features

### Core (Base Points)
- **Product List** — Responsive grid of product cards with search functionality
- **Product Detail** — Detailed product view with rich information
- **Dynamic Form** — Auto-generated form inputs from an external API with validation
- **Redux State Management** — Centralized store using Redux Toolkit

### Extras
- **Infinite Scroll** — Loads more products on scroll using Intersection Observer
- **Loading States** — Animated loaders for all async operations
- **Error Handling** — Graceful error states with retry options
- **Responsive Design** — Works great on mobile, tablet, and desktop
- **API Fallback** — Mock data when external API (mocky.io) is unavailable

## Tech Stack

- **React 18** with functional components and hooks (JavaScript, no TypeScript)
- **Vite** — Fast build tool
- **Redux Toolkit** + **React Redux** — State management
- **React Router DOM v6** — Client-side routing
- **Vanilla CSS** — Modern styling with glassmorphism, gradients, animations
- **Rick and Morty API** — External REST API for product data

## Getting Started

### Prerequisites
- Node.js 18+ installed
- npm or yarn

### Installation

```bash
# Clone the repository
git clone <repository-url>
cd prueba-tecnica-frontend

# Install dependencies
npm install

# Start development server
npm run dev
```

The app will be available at `http://localhost:5173`

### Build for Production

```bash
npm run build
npm run preview
```

## Project Structure

```
src/
├── main.jsx                # App entry point (Provider, Router)
├── App.jsx                 # Root component with routes
├── App.css
├── index.css               # Global design system
├── store/
│   ├── store.js            # Redux store configuration
│   ├── productsSlice.js    # Products state (fetch, search, pagination)
│   └── formSlice.js        # Dynamic form state (fetch fields, validation)
├── pages/
│   ├── ProductList.jsx     # Product grid + search + infinite scroll
│   ├── ProductList.css
│   ├── ProductDetail.jsx   # Full product information view
│   ├── ProductDetail.css
│   ├── DynamicForm.jsx     # Dynamic form from API
│   └── DynamicForm.css
└── components/
    ├── Navbar.jsx          # Navigation bar
    ├── Navbar.css
    ├── ProductCard.jsx     # Product card component
    ├── ProductCard.css
    ├── SearchBar.jsx       # Search input component
    ├── SearchBar.css
    ├── Loader.jsx          # Loading spinner
    └── Loader.css
```

## Routes

| Path | Page | Description |
|------|------|-------------|
| `/` | Product List | Grid of products with search and infinite scroll |
| `/product/:id` | Product Detail | Detailed view of a single product |
| `/formulario` | Dynamic Form | Auto-generated form from external API |

## API Integration

### Rick and Morty API
- **List characters**: `GET https://rickandmortyapi.com/api/character?page={page}&name={search}`
- **Get character**: `GET https://rickandmortyapi.com/api/character/{id}`
- **Get episode**: `GET https://rickandmortyapi.com/api/episode/{id}`

### Dynamic Form API
- **Get form fields**: `GET https://run.mocky.io/v3/2a5049a2-c09b-49e6-8fd1-09aa4f0bc7bb`
- Falls back to built-in mock data if the API is unavailable

## Design Decisions

- **Functional components only** — Modern React patterns with hooks
- **Redux Toolkit** — Minimal boilerplate, built-in immutability via Immer
- **Intersection Observer** — Performant infinite scroll without third-party libraries
- **CSS custom properties** — Consistent theming via design tokens
- **Glassmorphism** — Modern UI aesthetic with backdrop blur and transparency
