import { HashRouter, Routes, Route, Navigate } from 'react-router-dom';
import DashboardLayout from './components/layout/DashboardLayout';
import Overview from './pages/dashboard/Overview';
import EmployeeDirectory from './pages/employees/EmployeeDirectory';
import EmployeeDetail from './pages/employees/EmployeeDetail';
import ProjectMonitor from './pages/projects/ProjectMonitor';
import SalaryAnalysis from './pages/finance/SalaryAnalysis';
import Reports from './pages/reports/Reports';
import AttendanceOvertime from './pages/attendance/AttendanceOvertime';
import Notifications from './pages/notifications/Notifications';
import Settings from './pages/settings/Settings';
import Login from './pages/auth/Login';

function App() {
  return (
    <HashRouter>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route element={<DashboardLayout />}>
          <Route path="/" element={<Overview />} />
          <Route path="/employees" element={<EmployeeDirectory />} />
          <Route path="/employees/:id" element={<EmployeeDetail />} />
          <Route path="/projects" element={<ProjectMonitor />} />
          <Route path="/salary" element={<SalaryAnalysis />} />
          <Route path="/reports" element={<Reports />} />
          <Route path="/attendance" element={<AttendanceOvertime />} />
          <Route path="/notifications" element={<Notifications />} />
          <Route path="/settings" element={<Settings />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Route>
      </Routes>
    </HashRouter>
  );
}

export default App;