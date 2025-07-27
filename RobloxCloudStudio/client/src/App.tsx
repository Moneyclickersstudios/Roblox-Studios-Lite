import { Suspense } from "react";
import { StudioInterface } from "./components/studio/StudioInterface";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import "@fontsource/inter";

const queryClient = new QueryClient();

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <div style={{ 
        width: '100vw', 
        height: '100vh', 
        overflow: 'hidden',
        backgroundColor: '#2b2b2b',
        fontFamily: 'Inter, sans-serif'
      }}>
        <Suspense fallback={
          <div className="w-full h-full flex items-center justify-center bg-gray-800 text-white">
            Loading Roblox Studio...
          </div>
        }>
          <StudioInterface />
        </Suspense>
      </div>
    </QueryClientProvider>
  );
}

export default App;
