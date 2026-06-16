# APK.hub

A centralized hub for discovering, downloading, and reviewing APKs and Web Apps. Built with React, Vite, Tailwind CSS, Zustand, and Supabase.

## Tech Stack
- **Frontend Framework:** React + Vite
- **Styling:** Tailwind CSS
- **State Management:** Zustand
- **Routing:** React Router v6
- **Backend/Auth/Database:** Supabase

## Features

### Guest
- Browse and search app/website listings
- View app details, reviews, and star ratings
- Download APK files or visit website links directly

### Normal User
- Register, Login, and Logout
- Profile management
- Write, edit, and delete personal reviews and ratings
- All Guest privileges

### Developer
- Dedicated single-view dashboard
- Create, edit, and delete listings
- Publish directly or save as draft (Unpublish)
- Upload APK files, app icons, and screenshots
- Manage categories and publish website links
- Analytics overview: Total downloads, views, and listings
- Moderate user reviews on their own listings
- All Normal User privileges

### Admin
- Dedicated Command Center dashboard
- Platform-wide analytics (Total users, global downloads, total apps, and total reviews)
- User Management: Search users, change roles, approve developers, or ban users
- Global Listings Control: Force publish, unpublish, or delete any app on the platform
- Global Review Moderation: Delete any review across the entire platform
- Unrestricted access to all features

## Setup Instructions

1. **Install Dependencies:**
   Since your `package.json` is now fully configured, run the following command in your terminal to install all required packages:
   ```bash
   npm install