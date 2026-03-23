import React from 'react';

export default function DashboardRootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="dashboard-root-layout">
      {/* 
        This layout wraps /dashboard, /core, and /admin.
        It intentionally DOES NOT include the site-wide Navbar/Footer.
        Each sub-dashboard handles its own Sidebar via its local layout.tsx.
      */}
      {children}
    </div>
  );
}
