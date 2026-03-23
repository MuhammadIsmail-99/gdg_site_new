# 🌐 GDGoC CUI Wah Chapter - Client Testing Guide

Welcome to the official testing guide for the **GDGoC CUI Wah Chapter** website. This document is designed to help you navigate the platform, test its core features, and understand the different user journeys across all roles.

---

## 🔑 1. Test Accounts (Personas)

Use these credentials to test the various levels of access on the platform. The default password for all test accounts is: `gdgoc2026`

| Role | Email | Purpose |
| :--- | :--- | :--- |
| **Admin** | `kashif@cuiwah.edu.pk` | Full access: manage members, settings, and recruitment. |
| **Core** | `ubaidghazi@example.com` | Manage content: events, blog, clubs, and resources. |
| **Member** | `ismail@example.com` | Personal dashboard: view ID card, update profile, register for events. |

---

## 🗺️ 2. Navigation Overview

### 🌍 **Public Site (No Login Required)**
*   **Home:** `http://localhost:3000/` (High-impact landing page)
*   **Events:** `/events` (Upcoming workshops, bootcamps, and sessions)
*   **Team:** `/team` (The core leadership and domain leads)
*   **Clubs:** `/clubs` (Technical and creative interest groups)
*   **Blog:** `/blog` (Tech insights and chapter updates)
*   **Recruitment:** `/recruitment` (Join the chapter team)

### 📊 **Authenticated Dashboard (Requires Login)**
Once logged in, click your profile in the top right to access:
*   **Personal Dashboard:** `/dashboard` (Overview of your points/contributions)
*   **Profile Management:** `/dashboard/profile` (Update bio, skills, and links)
*   **Digital ID Card:** `/dashboard/id-card` (Generate and download your chapter card)

### 🛠️ **Management Panels (Requires Role Permissions)**
*   **Core Panel:** `/core` (Events, Blogs, Clubs, Announcements, Resources)
*   **Admin Panel:** `/admin` (Member directory, Applications, Site Settings)

---

## ✅ 3. Feature Testing Checklist

### 🏗️ **Core Content Management (Role: Core/Admin)**
- [ ] **Events:** Create a new event, add tags, and set an agenda. Verify it appears on the public `/events` page.
- [ ] **Blog Posts:** Write a technical post. Toggle the "Published" switch and check the public `/blog`.
- [ ] **Clubs:** Update club descriptions or illustrations.
- [ ] **Resources:** Manage the learning tracks and tools toolbox.

### 🛡️ **Administration (Role: Admin)**
- [ ] **Member Management:** View all members, filter by role, and update their details.
- [ ] **Recruitment:** Process applications (Accept/Reject) and see the status change.
- [ ] **Site Settings:** Update global configurations.

### 👤 **Member Experience (Role: Any Logged-in User)**
- [ ] **Profile Sync:** Update your bio in the dashboard and verify it updates on your public profile page in the `/team` section.
- [ ] **ID Card:** Generate your digital identity card and verify it displays your correct name and role.
- [ ] **Event Registration:** Register for an event and see it show up in your "My Events" section.

---

## 🛠️ 4. Technical Specifications
*   **Frontend:** Next.js 15 (App Router)
*   **Styling:** Custom CSS with GDG Brand Tokens
*   **Database:** PostgreSQL with Prisma ORM
*   **Auth:** Next-Auth (Auth.js) v5
*   **Animations:** AOS (Animate on Scroll) & Framer Motion

---

## 📝 5. Notes for Feedback
When providing feedback, please categorize it as:
1. **Critical:** Functional bugs or broken links.
2. **Visual:** Styling inconsistencies or spacing issues.
3. **Optim:** Suggestions for better UX or wording.

---
© 2026 GDGoC CUI Wah Chapter - Built with ❤️ for the community.
