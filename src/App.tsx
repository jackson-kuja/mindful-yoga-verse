import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import Sessions from "./pages/Sessions";
import SessionDetail from "./pages/SessionDetail";
import PracticePage from "./pages/Practice";
import About from "./pages/About";
import NotFound from "./pages/NotFound";
import Layout from "./components/Layout";
import { AuthProvider } from "./providers/AuthProvider";
import AuthPage from "./pages/Auth";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <AuthProvider>
          <Routes>
            <Route path="/practice/:id" element={<PracticePage />} />
            <Route path="/auth" element={<AuthPage />} />
            <Route element={<Layout />}>
              <Route path="/" element={<Index />} />
              <Route path="/sessions" element={<Sessions />} />
              <Route path="/sessions/:id" element={<SessionDetail />} />
              <Route path="/about" element={<About />} />
              <Route path="*" element={<NotFound />} />
            </Route>
          </Routes>
        </AuthProvider>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
