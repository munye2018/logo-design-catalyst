import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { GlobalProvider } from '@/context/GlobalContext';
import { AuthProvider } from '@/contexts/AuthContext';
import Index from '@/pages/Index';
import Onboarding from '@/pages/Onboarding';
import Program from '@/pages/Program';
import Session from '@/pages/Session';
import Analysis from '@/pages/Analysis';
import History from '@/pages/History';
import Auth from '@/pages/Auth';
import NotFound from '@/pages/NotFound';

const queryClient = new QueryClient();

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <GlobalProvider>
          <BrowserRouter>
            <Routes>
              <Route path="/" element={<Index />} />
              <Route path="/auth" element={<Auth />} />
              <Route path="/onboarding" element={<Onboarding />} />
              <Route path="/program" element={<Program />} />
              <Route path="/session/:sessionId" element={<Session />} />
              <Route path="/analysis/:exerciseId?" element={<Analysis />} />
              <Route path="/history" element={<History />} />
              <Route path="*" element={<NotFound />} />
            </Routes>
          </BrowserRouter>
        </GlobalProvider>
      </AuthProvider>
    </QueryClientProvider>
  );
}

export default App;
