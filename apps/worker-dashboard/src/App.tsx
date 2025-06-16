import { Toaster } from 'sonner';
import Dashboard from './pages/Dashboard';
import './index.css';

function App() {
  return (
    <div className="App">
      <Dashboard />
      <Toaster 
        position="top-right" 
        toastOptions={{
          duration: 3000,
          style: {
            fontSize: '14px',
          }
        }}
      />
    </div>
  );
}

export default App;