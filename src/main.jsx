import React from 'react';
import ReactDOM from 'react-dom/client';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import './index.css';
import App from './App.jsx';
import CreateTrip from './create-trip';
import Header from './components/ui/custom/Header.jsx'; // ✅ Add this
import { Toaster } from 'sonner';
import { GoogleOAuthProvider } from '@react-oauth/google';
import Viewtrip from './view-trip/[tripId]';
import MyTrips from './my-trips';
import UserTripCardItem from './my-trips/components/UserTripCardItem';

const router = createBrowserRouter([
  {
    path: '/',
    element: <App />,
  },
  {
    path: '/create-trip',
    element: (
      <>
        <Header />
        <CreateTrip />
      </>
    ),
  },
  {
    path:'/view-trip/:tripId',
    element:(
      <>
        <Header />
        <Viewtrip />
      </>
    ),
  },
  {
    path:'/my-trips',
    element:(
      <>
        <Header />
        <MyTrips />
        
      </>
    ),
  }
]);

ReactDOM.createRoot(document.getElementById('root')).render(
<GoogleOAuthProvider clientId={import.meta.env.VITE_GOOGLE_AUTH_CLIENT_ID}>
  <Toaster />
  <RouterProvider router={router} />
</GoogleOAuthProvider>
);
