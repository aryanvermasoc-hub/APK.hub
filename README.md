# 📱 APK.hub

<div align="center">
  <img src="https://via.placeholder.com/1200x300/2563EB/FFFFFF?text=APK.hub+-+Discover+%26+Share+Great+Apps" alt="APK.hub Banner">
  <br />
  <p><strong>A modern, centralized platform for discovering, downloading, and publishing applications.</strong></p>
</div>

<div align="center">
  <img src="https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB" alt="React" />
  <img src="https://img.shields.io/badge/Vite-B73BFE?style=for-the-badge&logo=vite&logoColor=FFD62E" alt="Vite" />
  <img src="https://img.shields.io/badge/Tailwind_CSS-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white" alt="Tailwind CSS" />
  <img src="https://img.shields.io/badge/Supabase-181818?style=for-the-badge&logo=supabase&logoColor=3ECF8E" alt="Supabase" />
</div>

## 📖 About The Project

APK.hub was built to solve the fragmentation of application distribution. Whether you are a user looking for a specific Progressive Web App (PWA) or a developer trying to distribute a large Android APK without restrictive app store policies, APK.hub provides a secure, fast, and heavily moderated environment to do so.

This project demonstrates complex frontend-to-backend integration, including real-time database management, secure file storage, and a strict Role-Based Access Control (RBAC) architecture.

## ✨ Core Features

### 🛡️ Security & Admin Control
* **Role-Based Access Control:** Strict routing and database policies separating `Admin`, `Developer`, and `Normal User` tiers.
* **Approval Queue:** New developer registrations default to a "Pending" state, requiring manual Admin verification to prevent spam.
* **Command Center:** A dedicated Admin dashboard to oversee all registered users, instantly toggle permissions, and ban malicious accounts.
* **Row Level Security (RLS):** Database operations are locked at the server level, ensuring users can only mutate data they explicitly own.

### 💻 Developer Experience
* **Publishing Dashboard:** A dedicated portal for developers to upload, edit, and track their applications.
* **Heavy File Uploads:** Configured to handle massive APK files directly to secure cloud buckets.
* **Real-time Status:** Live upload spinners, error catching, and instant database syncing without page reloads.

### 👤 User Experience
* **Direct Downloads:** Clean, ad-free interface to download verified APKs directly to your device.
* **Dynamic Navigation:** The UI instantly adapts based on the user's logged-in status and authorization tier.
* **Responsive Design:** Fully mobile-optimized layout built with Tailwind CSS.

---

## 🏗️ Architecture & Tech Stack

* **Frontend:** React.js (Component-based UI)
* **Build Tool:** Vite (Ultra-fast Hot Module Replacement)
* **Styling:** Tailwind CSS (Utility-first styling)
* **Routing:** React Router DOM v6
* **State Management:** Zustand (Lightweight, fast global state)
* **Backend (BaaS):** Supabase
  * *PostgreSQL* for relational data (Profiles, Listings, Reviews)
  * *Supabase Auth* for encrypted user sessions
  * *Supabase Storage* for large file asset management

---

## 🚀 Getting Started

Follow these instructions to set up a local development environment.

### Prerequisites
* [Node.js](https://nodejs.org/) (v16.0.0 or higher)
* [Git](https://git-scm.com/)
* A free [Supabase](https://supabase.com/) account

### Installation

1. **Clone the repository**
   ```bash
   git clone [https://github.com/aryanvermasoc-hub/apk-hub.git](https://github.com/aryanvermasoc-hub/apk-hub.git)
   cd apk-hub
   cd apk-hub
Install NPM packages

Bash
npm install
Configure Environment Variables
Create a .env file in the root directory. Do not commit this file to version control.

Code snippet
VITE_SUPABASE_URL=your_project_url_here
VITE_SUPABASE_ANON_KEY=your_anon_key_here
Start the development server

Bash
npm run dev
(To test on a mobile device on your local network, use npm run dev -- --host)

🗄️ Supabase Configuration
To make this project work, your Supabase backend must be configured with the following structure:

1. Database Tables
profiles: Stores id (references auth.users), email, and role.

listings: Stores id, title, description, type, user_id, and file URLs.

reviews: Stores id, listing_id, user_id, rating, and comment.

2. Storage Buckets
Create the following buckets and ensure the Upload file size limit in your global settings is increased (e.g., 500MB) to allow for APK files:

apks (For raw application files)

icons (For image assets)

3. Security (RLS)
Ensure Row Level Security is enabled on all tables and buckets. Policies must be set to allow public reads (SELECT), but restrict INSERT, UPDATE, and DELETE exclusively to authenticated owners.

📂 Project Structure
Plaintext
src/
├── components/       # Reusable UI components (Spinners, Cards, Modals)
├── pages/            # Top-level route components
│   ├── Admin/        # Admin Command Center
│   ├── Developer/    # Dev Publishing Dashboard
│   ├── Home/         # Landing Page
│   ├── Login/        # Authentication
│   └── Register/     # Account Creation (with Approval Queue logic)
├── services/         # API and Database connections (supabase.js)
├── store/            # Global state management (Zustand)
├── router.jsx        # React Router configuration
├── App.jsx           # Root component
└── main.jsx          # React DOM mounting
🗺️ Roadmap
[x] Implement Role-Based Access Control (RBAC)

[x] Build Admin moderation dashboard

[x] Establish secure file uploading for APKs

[ ] Add Search and Filtering functionality for the Home page

[ ] Implement a 5-star community review system

[ ] Build individual App Detail pages (/apps/:id)

[ ] Add download analytics for developers

👨‍💻 Author
Aryan Verma

GitHub: @aryanvermasoc-hub

🤝 Contributing
Contributions make the open-source community an amazing place to learn, inspire, and create. Any contributions you make are greatly appreciated.

Fork the Project

Create your Feature Branch (git checkout -b feature/AmazingFeature)

Commit your Changes (git commit -m 'Add some AmazingFeature')

Push to the Branch (git push origin feature/AmazingFeature)

Open a Pull Request

📄 License
Distributed under the MIT License. See LICENSE for more information.