import { Routes, Route, Navigate } from 'react-router-dom';
import AppShell from './components/AppShell';
import Dashboard from './pages/Dashboard';
import Transactions from './pages/Transactions';
import NewTransaction from './pages/NewTransaction';
import Insights from './pages/Insights';
import Profile from './pages/Profile';
import StrategicIntelligence from './pages/StrategicIntelligence';

import Landing from './pages/Landing';
import Onboarding from './pages/Onboarding';
import Login from './pages/Login';
import Legal from './pages/Legal';

function App() {
  return (
    <Routes>
      <Route path="/" element={<Landing />} />
      <Route path="/onboarding" element={<Onboarding />} />
      <Route path="/login" element={<Login />} />
      <Route path="/privacy" element={<Legal type="privacy" />} />
      <Route path="/terms" element={<Legal type="terms" />} />
      
      {/* Dashboard Routes wrapped in AppShell */}
      <Route path="/*" element={
        <AppShell>
          <Routes>
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/transactions" element={<Transactions />} />
            <Route path="/transactions/new" element={<NewTransaction />} />
            <Route path="/transactions/edit/:id" element={<NewTransaction />} />
            <Route path="/intelligence" element={<StrategicIntelligence />} />
            <Route path="/insights" element={<Insights />} />
            <Route path="/profile" element={<Profile />} />
            <Route path="*" element={<div className="p-8 text-center text-gray-500">Page not found</div>} />
          </Routes>
        </AppShell>
      } />
    </Routes>
  );
}

export default App;
