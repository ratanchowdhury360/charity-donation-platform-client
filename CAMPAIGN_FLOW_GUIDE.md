# Campaign Submission & Approval Flow

## 📋 Overview
This guide explains how campaigns flow from charity submission to admin approval using **localStorage** as temporary storage (until you implement a database).

---

## 🔄 How It Works

### 1️⃣ **Charity Creates Campaign**
- **Location**: `/dashboard/charity/campaigns/create`
- **Component**: `CreateCampaignForm.jsx`
- **What happens**:
  - Charity fills out the campaign form
  - On submit, campaign is saved to **localStorage** with status: `'pending'`
  - Charity is redirected to their dashboard with success message
  - Campaign gets a unique ID: `campaign_[timestamp]_[random]`

### 2️⃣ **Admin Reviews Campaign**
- **Location**: `/dashboard/admin` or `/dashboard/admin/campaigns`
- **Component**: `AdminCampaignApproval.jsx`
- **What happens**:
  - Admin sees all campaigns with status: `'pending'`
  - Admin can view details, approve, or reject campaigns
  - Tabs available: Pending | Approved | Rejected

### 3️⃣ **Admin Actions**
- **Approve**: Changes campaign status to `'approved'`
- **Reject**: Changes campaign status to `'rejected'`
- Status updates are saved to localStorage

---

## 🗂️ Storage Structure

### File: `src/utils/campaignStorage.js`

**Available Functions**:
```javascript
// Get all campaigns
getCampaigns()

// Get campaigns by status ('pending', 'approved', 'rejected')
getCampaignsByStatus(status)

// Add a new campaign
addCampaign(campaignData)

// Update campaign status
updateCampaignStatus(campaignId, status)

// Delete a campaign
deleteCampaign(campaignId)

// Get campaigns by charity
getCampaignsByCharity(charityId)

// Clear all campaigns (for testing)
clearAllCampaigns()
```

---

## 🧪 How to Test

### Step 1: Create a Campaign
1. Login as a **Charity** user
2. Go to Dashboard → Click "Create Campaign" button
3. Fill out the form with campaign details
4. Submit the form
5. You should see a success message on the charity dashboard

### Step 2: View Pending Campaigns
1. Logout and login as an **Admin** user
2. Go to Admin Dashboard
3. You should see the campaign you just created in the "Pending" tab
4. Click "View Details" to see full campaign information

### Step 3: Approve/Reject
1. Click "Approve" or "Reject" button
2. Campaign will move to the respective tab (Approved/Rejected)
3. Campaign disappears from Pending tab

---

## 🔍 How to Find Your Submitted Campaigns

### Method 1: Browser DevTools
1. Open browser DevTools (F12)
2. Go to **Application** tab (Chrome) or **Storage** tab (Firefox)
3. Expand **Local Storage** → Select your domain
4. Look for key: `charity_campaigns`
5. You'll see all campaigns in JSON format

### Method 2: Console Commands
Open browser console and run:
```javascript
// View all campaigns
console.table(JSON.parse(localStorage.getItem('charity_campaigns')))

// View only pending campaigns
const campaigns = JSON.parse(localStorage.getItem('charity_campaigns'))
console.table(campaigns.filter(c => c.status === 'pending'))

// Clear all campaigns (reset)
localStorage.removeItem('charity_campaigns')
```

---

## 📊 Campaign Data Structure

```javascript
{
  id: "campaign_1234567890_abc123",
  title: "Help Build a School",
  description: "Campaign description...",
  goalAmount: 50000,
  currentAmount: 0,
  donors: 0,
  category: "education",
  endDate: "2024-12-31T00:00:00.000Z",
  bankAccount: "1234-5678-9012-3456",
  charityId: "user_uid_from_firebase",
  charityName: "Charity Name or Email",
  image: "data:image/png;base64,..." or "https://...",
  status: "pending", // or "approved" or "rejected"
  createdAt: "2024-10-10T00:00:00.000Z",
  updatedAt: "2024-10-10T00:00:00.000Z"
}
```

---

## 🚀 Next Steps (When Adding Database)

When you're ready to implement a real database (Firebase, MongoDB, etc.):

1. Replace `localStorage` calls with API calls
2. Update these files:
   - `src/utils/campaignStorage.js` → Add API endpoints
   - `CreateCampaignForm.jsx` → Call API instead of localStorage
   - `AdminCampaignApproval.jsx` → Fetch from API

3. The data structure remains the same!

---

## 🐛 Troubleshooting

**Problem**: Campaign not showing in admin dashboard
- **Solution**: Check if you're logged in as admin
- **Solution**: Open DevTools → Check localStorage has the campaign
- **Solution**: Refresh the admin dashboard page

**Problem**: Success message not showing
- **Solution**: Check browser console for errors
- **Solution**: Make sure you're redirected to `/dashboard/charity`

**Problem**: Want to reset/clear all campaigns
- **Solution**: Run in console: `localStorage.removeItem('charity_campaigns')`

---

## 📝 Notes

- Data persists across page refreshes (localStorage)
- Data is stored per browser/device
- Data is cleared if user clears browser data
- This is temporary until you implement a real database
- Each campaign gets a unique ID automatically
