// import { Toaster } from "@/components/ui/toaster";
// import { Toaster as Sonner } from "@/components/ui/sonner";
// import { TooltipProvider } from "@/components/ui/tooltip";
// import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
// import { BrowserRouter, Routes, Route } from "react-router-dom";
// import { FraudDetectionProvider } from "./contexts/FraudDetectionContext";
// import { AuthProvider } from "./contexts/AuthContext";
// import Home from "./pages/Home";
// import Dashboard from "./pages/Dashboard";
// import Login from "./pages/Login";
// import Features from "./pages/Features";
// import About from "./pages/About";
// import NotFound from "./pages/NotFound";

// const queryClient = new QueryClient();

// const App = () => (
//   <QueryClientProvider client={queryClient}>
//     <AuthProvider>
//       <FraudDetectionProvider>
//         <TooltipProvider>
//           <Toaster />
//           <Sonner />
//           <BrowserRouter>
//             <Routes>
//               <Route path="/" element={<Home />} />
//               <Route path="/dashboard" element={<Dashboard />} />
//               <Route path="/login" element={<Login />} />
//               <Route path="/features" element={<Features />} />
//               <Route path="/about" element={<About />} />
//               <Route path="*" element={<NotFound />} />
//             </Routes>
//           </BrowserRouter>
//         </TooltipProvider>
//       </FraudDetectionProvider>
//     </AuthProvider>
//   </QueryClientProvider>
// );

// export default App;









import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";

// Existing Providers
import { FraudDetectionProvider } from "./contexts/FraudDetectionContext";
import { AuthProvider } from "./contexts/AuthContext";

// NEW Providers
import { RealTimeProvider } from "./contexts/RealTimeContext";
import { AlertProvider } from "./contexts/AlertContext";
import { BehaviorProvider } from "./contexts/BehaviorContext";

// Pages
import Home from "./pages/Home";
import Dashboard from "./pages/Dashboard";
import Login from "./pages/Login";
import Features from "./pages/Features";
import About from "./pages/About";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <AuthProvider>
      <FraudDetectionProvider>
        <RealTimeProvider>
          <AlertProvider>
            <BehaviorProvider>
              <TooltipProvider>
                
                {/* Toast Systems */}
                <Toaster />
                <Sonner />

                <BrowserRouter>
                  <Routes>
                    <Route path="/" element={<Home />} />
                    <Route path="/dashboard" element={<Dashboard />} />
                    <Route path="/login" element={<Login />} />
                    <Route path="/features" element={<Features />} />
                    <Route path="/about" element={<About />} />
                    <Route path="*" element={<NotFound />} />
                  </Routes>
                </BrowserRouter>

              </TooltipProvider>
            </BehaviorProvider>
          </AlertProvider>
        </RealTimeProvider>
      </FraudDetectionProvider>
    </AuthProvider>
  </QueryClientProvider>
);

export default App;
