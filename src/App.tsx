import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { Toaster } from '@/components/ui/toaster'
import { Toaster as Sonner } from '@/components/ui/sonner'
import { TooltipProvider } from '@/components/ui/tooltip'
import { AppProvider } from '@/context/AppContext'
import { AuthProvider } from '@/hooks/use-auth'
import { ProtectedRoute } from '@/components/ProtectedRoute'
import Layout from './components/Layout'
import Login from './pages/Login'
import Index from './pages/Index'
import SpecificDays from './pages/SpecificDays'
import Database from './pages/Database'
import Integrations from './pages/Integrations'
import Analysis from './pages/Analysis'
import Consolidated from './pages/Consolidated'
import Predictability from './pages/Predictability'
import History from './pages/History'
import ActivityLog from './pages/ActivityLog'
import UserManual from './pages/UserManual'
import Admin from './pages/Admin'
import NotFound from './pages/NotFound'

const App = () => (
  <AuthProvider>
    <AppProvider>
      <BrowserRouter future={{ v7_startTransition: false, v7_relativeSplatPath: false }}>
        <TooltipProvider>
          <Toaster />
          <Sonner />
          <Routes>
            <Route path="/login" element={<Login />} />

            <Route element={<ProtectedRoute />}>
              <Route element={<Layout />}>
                <Route path="/" element={<Index />} />
                <Route path="/specific-days" element={<SpecificDays />} />
                <Route path="/consolidated" element={<Consolidated />} />
                <Route path="/predictability" element={<Predictability />} />
                <Route path="/database" element={<Database />} />
                <Route path="/integrations" element={<Integrations />} />
                <Route path="/analysis" element={<Analysis />} />
                <Route path="/history" element={<History />} />
                <Route path="/activity-log" element={<ActivityLog />} />
                <Route path="/manual" element={<UserManual />} />
                <Route path="/admin" element={<Admin />} />
              </Route>
            </Route>

            <Route path="*" element={<NotFound />} />
          </Routes>
        </TooltipProvider>
      </BrowserRouter>
    </AppProvider>
  </AuthProvider>
)

export default App
