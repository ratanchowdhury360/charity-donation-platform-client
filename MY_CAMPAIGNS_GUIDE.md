# My Campaigns Feature Guide

## ✨ New Feature Added

Charity users can now view all their submitted campaigns in one place!

---

## 📍 How to Access

### From Charity Dashboard Sidebar:
1. Login as a **Charity** user
2. Look at the **left sidebar**
3. Click on **"My Campaigns"** (with heart icon 💗)

### Direct URL:
`/dashboard/charity/campaigns`

---

## 🎯 What You'll See

### 1. **Statistics Cards** (Top Section)
- **Total Campaigns**: All campaigns you've created
- **Pending**: Campaigns waiting for admin approval
- **Approved**: Campaigns approved by admin
- **Rejected**: Campaigns rejected by admin

### 2. **Filter Tabs**
- **All**: Shows all your campaigns
- **Pending**: Only pending campaigns
- **Approved**: Only approved campaigns
- **Rejected**: Only rejected campaigns

### 3. **Campaign Cards**
Each campaign shows:
- Campaign image
- Status badge (Pending/Approved/Rejected)
- Title
- Goal amount
- Amount raised
- Category
- End date
- Created date
- Progress bar
- Action buttons (View Details, Edit)

---

## 🔄 Campaign Flow

### Step 1: Create Campaign
1. Click **"Create Campaign"** in sidebar
2. Fill out the form
3. Submit for approval

### Step 2: View in "My Campaigns"
1. Click **"My Campaigns"** in sidebar
2. You'll see your campaign with **"Pending"** status badge (⏰ yellow)

### Step 3: Admin Reviews
1. Admin logs in
2. Admin sees your campaign in Admin Dashboard
3. Admin approves or rejects

### Step 4: Check Status
1. Go back to **"My Campaigns"**
2. Status will be updated:
   - ✅ **Approved** (green badge)
   - ❌ **Rejected** (red badge)

---

## 🎨 Status Badges

| Status | Badge Color | Icon | Meaning |
|--------|-------------|------|---------|
| Pending | Yellow | ⏰ | Waiting for admin review |
| Approved | Green | ✅ | Campaign is live |
| Rejected | Red | ❌ | Campaign was rejected |

---

## 📊 Features

### ✅ What's Working:
- View all your campaigns
- Filter by status (All/Pending/Approved/Rejected)
- See campaign statistics
- View campaign details
- Progress tracking
- Status badges

### 🚧 Coming Soon:
- Edit campaign functionality
- Delete campaign
- View detailed analytics
- Export campaign data

---

## 🧪 Test It

### Test Scenario:
1. **Login as Charity**
   - Email: `charity@test.com`
   - Password: `123456`

2. **Create a Campaign**
   - Click "Create Campaign"
   - Fill form and submit

3. **View in My Campaigns**
   - Click "My Campaigns" in sidebar
   - You should see your campaign with "Pending" status

4. **Login as Admin**
   - Logout
   - Login with admin credentials
   - Approve the campaign

5. **Check Status**
   - Logout and login as charity again
   - Go to "My Campaigns"
   - Status should now be "Approved" ✅

---

## 💡 Tips

- **Empty State**: If you haven't created any campaigns, you'll see a message with a button to create your first campaign
- **Filter Counts**: Each filter tab shows the count of campaigns in that status
- **Progress Bar**: Shows how much of the goal has been raised
- **Responsive**: Works on mobile, tablet, and desktop

---

## 🐛 Troubleshooting

### Problem: "My Campaigns" is empty
**Solution**: Make sure you've created at least one campaign

### Problem: Campaign not showing
**Solution**: 
1. Check if you're logged in as the same charity user who created it
2. Open browser console and run:
   ```javascript
   console.table(JSON.parse(localStorage.getItem('charity_campaigns')))
   ```

### Problem: Status not updating
**Solution**: Refresh the page after admin approves/rejects

---

## 📝 Notes

- Campaigns are stored in localStorage (temporary until database)
- Each campaign is linked to your user ID (charityId)
- Only your campaigns are shown (filtered by charityId)
- Real-time updates require page refresh
