import { Outlet } from 'react-router-dom';
import Sidebar from './Sidebar';
import Header from './Header';

export default function DashboardLayout() {
  return (
    <div className="min-h-screen flex bg-[var(--color-surface-900)]">
      <Sidebar />
      {/* Main content area — pushed right of the fixed sidebar */}
      <div className="flex-1 flex flex-col" style={{ marginLeft: '260px', minWidth: 0 }}>
        <Header />
        <main className="flex-1 p-8 lg:p-10 overflow-y-auto overflow-x-hidden">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
