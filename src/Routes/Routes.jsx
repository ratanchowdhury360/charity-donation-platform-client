import { createBrowserRouter } from "react-router-dom";
import Main from "../Layout/Main";
import DashboardLayout from "../Layout/Dashboard";
import Home from "../Pages/Home/Home/Home";
import Login from "../Pages/Login/Login";
import SignUp from "../Pages/SignUp/SignUp";
import Campaigns from "../Pages/Campaigns/Campaigns";
import CampaignDetails from "../Pages/Campaigns/CampaignDetails";
import Donate from "../Pages/Campaigns/Donate";
import CreateCampaign from "../Pages/Campaigns/CreateCampaign";
import Charities from "../Pages/Charities/Charities";
import CharityDetails from "../Pages/Charities/CharityDetails";
import RegisterCharity from "../Pages/Charities/RegisterCharity";
import DonorDashboard from "../Pages/Dashboard/DonorDashboard";
import CharityDashboard from "../Pages/Dashboard/CharityDashboard";
import AdminDashboard from "../Pages/Dashboard/AdminDashboard";
import Profile from "../Pages/Profile/Profile";
import About from "../Pages/About/About";
import Contact from "../Pages/Contact/Contact";
import ProtectedRoute from "../components/ProtectedRoute";
import NotFound from "../Pages/NotFound/NotFound";

export const router = createBrowserRouter([
  {
    path: "/",
    element: <Main />,
    children: [
      {
        path: "/",
        element: <Home />
      },
      {
        path: "/login",
        element: <Login />
      },
      {
        path: "/signup",
        element: <SignUp />
      },
      {
        path: "/campaigns",
        element: <Campaigns />
      },
      {
        path: "/campaigns/:id",
        element: <CampaignDetails />
      },
      {
        path: "/campaigns/:id/donate",
        element: (
          <ProtectedRoute>
            <Donate />
          </ProtectedRoute>
        )
      },
      {
        path: "/campaigns/create",
        element: (
          <ProtectedRoute requiredRole="charity">
            <CreateCampaign />
          </ProtectedRoute>
        )
      },
      {
        path: "/charities",
        element: <Charities />
      },
      {
        path: "/charities/:id",
        element: <CharityDetails />
      },
      {
        path: "/charities/register",
        element: <RegisterCharity />
      },
      {
        path: "/about",
        element: <About />
      },
      {
        path: "/contact",
        element: <Contact />
      },
      {
        path: "/profile",
        element: (
          <ProtectedRoute>
            <Profile />
          </ProtectedRoute>
        )
      },
      {
        path: "/dashboard",
        element: (
          <ProtectedRoute>
            <DashboardLayout />
          </ProtectedRoute>
        ),
        children: [
          {
            path: "/dashboard",
            element: <DonorDashboard />
          },
          {
            path: "/dashboard/charity",
            element: (
              <ProtectedRoute requiredRole="charity">
                <CharityDashboard />
              </ProtectedRoute>
            )
          },
          {
            path: "/dashboard/admin",
            element: (
              <ProtectedRoute requiredRole="admin">
                <AdminDashboard />
              </ProtectedRoute>
            )
          }
        ]
      },
      {
        path: "*",
        element: <NotFound />
      }
    ]
  }
]);