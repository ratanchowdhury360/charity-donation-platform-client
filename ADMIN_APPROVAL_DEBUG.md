# Admin Campaign Approval - Debug Guide

## 🔍 Problem: Admin Not Seeing Campaigns

If you login as admin but don't see any campaigns for approval, follow these steps:

---

## ✅ Step-by-Step Testing

### Step 1: Create a Campaign as Charity

1. **Logout** if you're logged in as admin
2. **Login as Charity** (or create new charity account):
   - Email: `charity@test.com`
   - Password: `123456`
   - Role: **Charity**

3. **Create a Campaign**:
   - Click **"Create Campaign"** in sidebar
   - Fill out the form:
     - Title: `Test Campaign for Admin`
     - Description: (at least 100 characters)
     - Goal Amount: `50000`
     - Category: `Education`
     - End Date: (any future date)
     - Bank Account: `1234-5678-9012`
     - Upload an image
     - Check terms checkbox
   - Click **"Submit for Approval"**
   - You should see success message

4. **Verify Campaign is Saved**:
   - Open browser console (F12)
   - Run this command:
   ```javascript
   console.table(JSON.parse(localStorage.getItem('charity_campaigns')))
   ```
   - You should see your campaign with `status: "pending"`

---

### Step 2: Login as Admin

1. **Logout** from charity account
2. **Login as Admin**:
   - Use your admin credentials from `.env` file
   - Check `.env` for:
     ```
     VITE_ADMIN_EMAIL=your_admin_email
     VITE_ADMIN_PASSWORD=your_admin_password
     ```

3. **Go to Admin Dashboard**:
   - You should be at `/dashboard/admin`
   - You should see the "Campaign Approvals" page

4. **Check for Campaigns**:
   - Look at the **"Pending"** tab (should be active by default)
   - You should see the campaign you created

---

## 🐛 Debugging Steps

### Check 1: Verify Campaigns Exist in Storage

Open browser console and run:
```javascript
// Check if campaigns exist
const campaigns = JSON.parse(localStorage.getItem('charity_campaigns'));
console.log('Total campaigns:', campaigns ? campaigns.length : 0);
console.log('Campaigns:', campaigns);

// Check pending campaigns
const pending = campaigns ? campaigns.filter(c => c.status === 'pending') : [];
console.log('Pending campaigns:', pending.length);
console.table(pending);
```

**Expected Result**: You should see at least one campaign with `status: "pending"`

---

### Check 2: Verify Admin Route

1. Check the URL in browser address bar
2. Should be: `/dashboard/admin` or `/dashboard/admin/campaigns`
3. If not, manually navigate to: `http://localhost:5173/dashboard/admin`

---

### Check 3: Check Console for Errors

1. Open browser console (F12)
2. Look for any red error messages
3. Common errors:
   - `Cannot read property 'filter' of null` → No campaigns in storage
   - `getCampaignsByStatus is not defined` → Import issue

---

### Check 4: Verify You're Logged in as Admin

Open console and run:
```javascript
// Check current user role
console.log('User Role:', localStorage.getItem('userRole'));

// Should show: "admin"
```

If it shows `"donor"` or `"charity"`, you're not logged in as admin.

---

## 🔧 Quick Fixes

### Fix 1: Clear Storage and Start Fresh

```javascript
// Clear everything
localStorage.clear();

// Refresh page
location.reload();
```

Then:
1. Sign up as charity
2. Create campaign
3. Logout
4. Login as admin
5. Check admin dashboard

---

### Fix 2: Manually Add Test Campaign

If you want to quickly test, run this in console:

```javascript
// Add a test campaign
const testCampaign = {
  id: 'test_' + Date.now(),
  title: 'Test Campaign',
  description: 'This is a test campaign for admin approval. It should appear in the pending campaigns list.',
  goalAmount: 50000,
  currentAmount: 0,
  donors: 0,
  category: 'education',
  endDate: new Date(Date.now() + 30*24*60*60*1000).toISOString(),
  bankAccount: '1234-5678-9012',
  charityId: 'test_charity_123',
  charityName: 'Test Charity',
  image: 'https://via.placeholder.com/800x400',
  status: 'pending',
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString()
};

// Get existing campaigns
const campaigns = JSON.parse(localStorage.getItem('charity_campaigns') || '[]');

// Add test campaign
campaigns.push(testCampaign);

// Save back
localStorage.setItem('charity_campaigns', JSON.stringify(campaigns));

// Refresh page
location.reload();
```

---

## 📊 Expected Admin Dashboard View

When working correctly, you should see:

### Pending Tab (Default):
- Campaign cards with:
  - Campaign image
  - Title
  - Charity name
  - Goal amount
  - Category
  - End date
  - **Yellow "Pending" badge**
  - "View Details" button
  - "Approve" button (green)
  - "Reject" button (red)

### Empty State:
If no campaigns, you should see:
- Message: "No pending campaigns"
- Text: "There are no campaigns waiting for approval."

---

## 🎯 Common Issues

### Issue 1: "No pending campaigns" message
**Cause**: No campaigns with `status: "pending"` exist
**Solution**: Create a campaign as charity user first

### Issue 2: Campaigns showing in "My Campaigns" but not in Admin
**Cause**: Campaign might have wrong charityId or status
**Solution**: Check campaign data in console (see Check 1 above)

### Issue 3: Admin dashboard shows loading spinner forever
**Cause**: Error in fetching campaigns
**Solution**: Check console for errors, verify localStorage has data

### Issue 4: Wrong user logged in
**Cause**: Not logged in as admin
**Solution**: Verify admin credentials in `.env` file

---

## 📝 Checklist

Before reporting an issue, verify:

- [ ] Created at least one campaign as charity user
- [ ] Campaign has `status: "pending"` in localStorage
- [ ] Logged in with correct admin credentials
- [ ] URL is `/dashboard/admin` or `/dashboard/admin/campaigns`
- [ ] No errors in browser console
- [ ] localStorage has `charity_campaigns` key with data
- [ ] `userRole` in localStorage is `"admin"`

---

## 🚀 Quick Test Script

Run this complete test in console:

```javascript
// Complete diagnostic
console.log('=== ADMIN APPROVAL DIAGNOSTIC ===');
console.log('1. User Role:', localStorage.getItem('userRole'));
console.log('2. Current URL:', window.location.pathname);

const campaigns = JSON.parse(localStorage.getItem('charity_campaigns') || '[]');
console.log('3. Total Campaigns:', campaigns.length);

const pending = campaigns.filter(c => c.status === 'pending');
console.log('4. Pending Campaigns:', pending.length);

if (pending.length > 0) {
  console.log('5. Pending Campaign Details:');
  console.table(pending);
} else {
  console.log('5. No pending campaigns found!');
  console.log('   Create a campaign as charity user first.');
}

console.log('=== END DIAGNOSTIC ===');
```

---

## 💡 Need Help?

If campaigns still don't show:
1. Share the output of the diagnostic script above
2. Check if you see any error messages
3. Verify you completed Step 1 (Create Campaign as Charity)
