import React, { useState, useEffect } from 'react';
import { Toaster } from 'sonner';
import OrderDashboard from './components/OrderDashboard';

function App() {
  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <h1 className="text-2xl font-bold text-gray-900">Worker Dashboard</h1>
            <div className="text-sm text-gray-500">
              Real-time Order Management
            </div>
          </div>
        </div>
      </header>
      
      <main className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
        <OrderDashboard />
      </main>
      
      <Toaster position="top-right" />
    </div>
  );
}

export default App;