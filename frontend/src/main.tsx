import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import { QueryClientProvider } from '@tanstack/react-query';
import './styles/styles.css';
import './styles/app.css';
import { queryClient } from './api/queryClient';
import { UserProvider } from './state/UserContext';
import { UiProvider } from './state/UiContext';
import { Shell } from './Shell';


ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <QueryClientProvider client={queryClient}>
      <UserProvider>
        <UiProvider>
          <BrowserRouter future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
            <Shell />
          </BrowserRouter>
        </UiProvider>
      </UserProvider>
    </QueryClientProvider>
  </React.StrictMode>,
);
