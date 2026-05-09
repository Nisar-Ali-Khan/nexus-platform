# 🚀 Business Nexus — Entrepreneur & Investor Platform

> A modern platform connecting ambitious entrepreneurs with the right investors to turn ideas into reality.

![React](https://img.shields.io/badge/React-18-blue?logo=react)
![TypeScript](https://img.shields.io/badge/TypeScript-5-blue?logo=typescript)
![Tailwind CSS](https://img.shields.io/badge/Tailwind-3-38bdf8?logo=tailwindcss)
![Vite](https://img.shields.io/badge/Vite-5-purple?logo=vite)

---

## 📌 About the Project

**Business Nexus** is a full-featured web application that bridges the gap between entrepreneurs and investors. Entrepreneurs can post their startup ideas with detailed pitches, and investors can explore, filter, and connect with the startups that match their interests.

---

## ✨ Features

### 👤 Authentication
- Secure login & registration for both Entrepreneurs and Investors
- Role-based access (different dashboards and permissions per role)
- Protected routes — unauthenticated users are redirected to login

### 💡 Startup Ideas Feed
- Entrepreneurs can post detailed startup ideas with multi-step form
- Investors can browse, search, filter, and like ideas
- Filter by industry, funding stage, location
- Full idea detail page with problem, solution, business model & traction

### 📊 Smart Dashboards
- **Entrepreneur Dashboard** — profile views chart, my ideas widget, collaboration requests, recommended investors
- **Investor Dashboard** — industry breakdown chart, trending ideas feed, startup directory with search

### 🔍 Search & Discovery
- Search startups by name, industry, or keywords
- Filter investors by investment stage and interests
- Real-time result count

### 💬 Messaging
- Direct messaging between entrepreneurs and investors
- Conversation history with timestamps

### 🤝 Collaboration Requests
- Investors can send collaboration/investment requests directly from idea pages
- Entrepreneurs can accept or reject requests from their dashboard

### 🔔 Notifications
- Real-time notifications for messages, likes, collaboration requests, connections
- Unread badge count in sidebar
- Mark individual or all notifications as read

### 📁 Documents
- Upload and manage pitch decks, financial reports, and other documents

---

## 🛠️ Tech Stack

| Technology | Purpose |
|---|---|
| React 18 | Frontend framework |
| TypeScript | Type safety |
| Vite | Build tool & dev server |
| Tailwind CSS | Styling |
| React Router v6 | Client-side routing |
| Lucide React | Icons |
| React Hot Toast | Notifications |
| date-fns | Date formatting |

---

## 🚀 Getting Started

### Prerequisites
- Node.js 18+
- npm or yarn

### Installation

```bash
# Clone the repository
git clone https://github.com/Nisar-Ali-Khan/nexus-platform.git

# Navigate to project folder
cd nexus-platform

# Install dependencies
npm install

# Start development server
npm run dev
```

Open [http://localhost:5173](http://localhost:5173) in your browser.

---

## 🔑 Demo Accounts

| Role | Email | Password |
|---|---|---|
| Entrepreneur | sarah@techwave.io | password123 |
| Investor | michael@vcinnovate.com | password123 |

---

## 📁 Project Structure

```
src/
├── components/
│   ├── auth/          # Protected route component
│   ├── layout/        # Navbar, Sidebar, DashboardLayout
│   ├── ui/            # Reusable UI components (Button, Card, Badge...)
│   ├── entrepreneur/  # Entrepreneur-specific components
│   ├── investor/      # Investor-specific components
│   └── collaboration/ # Collaboration request cards
├── context/
│   └── AuthContext.tsx   # Global authentication state
├── data/
│   ├── users.ts              # Mock users data
│   ├── startupIdeas.ts       # Startup ideas data & helpers
│   ├── notifications.ts      # Notifications data & helpers
│   ├── messages.ts           # Messages mock data
│   └── collaborationRequests.ts
├── pages/
│   ├── auth/          # Login, Register
│   ├── dashboard/     # Entrepreneur & Investor dashboards
│   ├── ideas/         # Ideas feed, Post idea, Idea detail
│   ├── profile/       # Entrepreneur & Investor profiles
│   ├── chat/          # Messaging
│   └── notifications/ # Notifications
└── types/
    └── index.ts       # All TypeScript interfaces & types
```

---

## 📸 Key Pages

- `/login` — Role-based login
- `/register` — Account creation
- `/dashboard/entrepreneur` — Entrepreneur home
- `/dashboard/investor` — Investor home
- `/ideas` — Browse all startup ideas
- `/ideas/post` — Post a new startup idea (entrepreneurs only)
- `/ideas/:id` — Detailed idea view
- `/investors` — Browse all investors
- `/entrepreneurs` — Browse all startups
- `/chat/:userId` — Direct messaging
- `/notifications` — Activity feed

---

## 🤝 Contributing

Pull requests are welcome! For major changes, please open an issue first to discuss what you'd like to change.

---

## 📄 License

This project is open source and available under the [MIT License](LICENSE).

---

<p align="center">Built with ❤️ by Nisar Ali Khan</p>
EOF
