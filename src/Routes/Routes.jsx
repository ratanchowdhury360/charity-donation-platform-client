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
import MyDonations from "../Pages/Dashboard/MyDonations";
import SavedCampaigns from "../Pages/Dashboard/SavedCampaigns";
import MyReviews from "../Pages/Dashboard/MyReviews";
import Profile from "../Pages/Dashboard/Profile";
import CharityDashboard from "../Pages/Dashboard/CharityDashboard";
import AdminDashboard from "../Pages/Dashboard/AdminDashboard";
import AdminCampaignApproval from "../Pages/Dashboard/AdminCampaignApproval";
import RoleDashboardIndex from "../Pages/Dashboard/RoleDashboardIndex";
import MyCampaigns from "../Pages/Dashboard/MyCampaigns";
import CreateCampaignForm from "../Pages/Campaigns/CreateCampaignForm";
import About from "../Pages/About/About";
import Contact from "../Pages/Contact/Contact";
import ProtectedRoute from "../components/ProtectedRoute";
import NotFound from "../Pages/NotFound/NotFound";
import AdminUsers from "../Pages/Dashboard/AdminUsers";
import AdminCharities from "../Pages/Dashboard/AdminCharities";

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
            index: true,
            element: <RoleDashboardIndex />
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
            path: "/dashboard/charity/campaigns",
            element: (
              <ProtectedRoute requiredRole="charity">
                <MyCampaigns />
              </ProtectedRoute>
            )
          },
          {
            path: "/dashboard/charity/campaigns/create",
            element: (
              <ProtectedRoute requiredRole="charity">
                <CreateCampaignForm />
              </ProtectedRoute>
            )
          },
          {
            path: "/dashboard/charity/reviews",
            element: (
              <ProtectedRoute requiredRole="charity">
                <MyReviews />
              </ProtectedRoute>
            )
          },
          {
            path: "/dashboard/charity/profile",
            element: (
              <ProtectedRoute requiredRole="charity">
                <Profile />
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
          },
          {
            path: "/dashboard/admin/users",
            element: (
              <ProtectedRoute requiredRole="admin">
                <AdminUsers />
              </ProtectedRoute>
            )
          },
          {
            path: "/dashboard/admin/charities",
            element: (
              <ProtectedRoute requiredRole="admin">
                <AdminCharities />
              </ProtectedRoute>
            )
          },
          {
            path: "/dashboard/admin/campaigns",
            element: (
              <ProtectedRoute requiredRole="admin">
                <AdminCampaignApproval />
              </ProtectedRoute>
            )
          },
          {
            path: "/dashboard/admin/profile",
            element: (
              <ProtectedRoute requiredRole="admin">
                <Profile />
              </ProtectedRoute>
            )
          },
          {
            path: "/dashboard/donor",
            element: (
              <ProtectedRoute requiredRole="donor">
                <DonorDashboard />
              </ProtectedRoute>
            )
          },
          {
            path: "/dashboard/donor/donations",
            element: (
              <ProtectedRoute requiredRole="donor">
                <MyDonations />
              </ProtectedRoute>
            )
          },
          {
            path: "/dashboard/donor/saved",
            element: (
              <ProtectedRoute requiredRole="donor">
                <SavedCampaigns />
              </ProtectedRoute>
            )
          },
          {
            path: "/dashboard/donor/reviews",
            element: (
              <ProtectedRoute requiredRole="donor">
                <MyReviews />
              </ProtectedRoute>
            )
          },
          {
            path: "/dashboard/donor/profile",
            element: (
              <ProtectedRoute requiredRole="donor">
                <Profile />
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
], {
  basename: '/'
});