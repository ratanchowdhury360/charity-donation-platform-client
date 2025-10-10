# User Role Persistence Fix

## 🐛 Problem Fixed
User roles were not persisting after logout/login. Charity users were being redirected to donor dashboard after logging back in.

---

## ✅ What Was Changed

### 1. **Created User Storage Utility** (`src/utils/userStorage.js`)
- Stores user roles by email address
- Persists across browser sessions
- Better than single `userRole` key in localStorage

### 2. **Updated Login.jsx**
- Now retrieves user role by email on login
- Uses `getUserRole(email)` to get the correct role
- Stores role by email using `setUserRole(email, role)`

### 3. **Updated SignUp.jsx**
- Stores user role by email during signup
- Ensures role is saved before redirecting

---

## 🧪 How to Test

### Test Case 1: Charity User
1. **Sign Up** as a new charity user:
   - Email: `charity@test.com`
   - Password: `Test@123`
   - Account Type: **Charity**
2. You should be redirected to `/dashboard/charity`
3. **Logout**
4. **Login** again with same credentials
5. ✅ You should be redirected to `/dashboard/charity` (NOT donor!)

### Test Case 2: Donor User
1. **Sign Up** as a new donor user:
   - Email: `donor@test.com`
   - Password: `Test@123`
   - Account Type: **Donor**
2. You should be redirected to `/dashboard/donor`
3. **Logout**
4. **Login** again with same credentials
5. ✅ You should be redirected to `/dashboard/donor`

### Test Case 3: Multiple Users
1. Sign up as charity: `charity1@test.com`
2. Logout
3. Sign up as donor: `donor1@test.com`
4. Logout
5. Login as charity: `charity1@test.com`
6. ✅ Should go to charity dashboard
7. Logout
8. Login as donor: `donor1@test.com`
9. ✅ Should go to donor dashboard

---

## 🔍 How to Verify Stored Roles

### Browser DevTools
1. Open DevTools (F12)
2. Go to **Application** → **Local Storage**
3. Look for key: `user_roles`
4. You'll see: `{"charity@test.com": "charity", "donor@test.com": "donor"}`

### Console Commands
```javascript
// View all user roles
console.table(JSON.parse(localStorage.getItem('user_roles')))

// Check specific user role
const { getUserRole } = await import('./src/utils/userStorage.js')
console.log(getUserRole('charity@test.com')) // Should show: "charity"

// Clear all roles (reset)
localStorage.removeItem('user_roles')
```

---

## 📊 Storage Structure

### Old System (Broken)
```javascript
localStorage: {
  "userRole": "donor"  // ❌ Same for all users!
}
```

### New System (Fixed)
```javascript
localStorage: {
  "user_roles": {
    "charity@test.com": "charity",
    "donor@test.com": "donor",
    "admin@test.com": "admin"
  },
  "userRole": "charity"  // ✅ Current logged-in user's role
}
```

---

## 🔄 How It Works Now

### During Signup
1. User selects role (charity/donor)
2. Account is created
3. Role is stored by email: `setUserRole(email, role)`
4. Role is set in auth context: `setRole(role)`
5. User is redirected to correct dashboard

### During Login
1. User enters email/password
2. Firebase authenticates
3. System retrieves role by email: `getUserRole(email)`
4. Role is set in auth context: `setRole(role)`
5. User is redirected to correct dashboard

### During Logout
1. User logs out
2. `userRole` is cleared from auth context
3. Email-based roles remain in storage
4. Next login retrieves role by email again

---

## 🚀 Benefits

1. **Persistent Roles**: Roles survive logout/login
2. **Multi-User Support**: Different users can have different roles on same browser
3. **Email-Based**: Role is tied to email, not just session
4. **Easy Testing**: Can switch between users without losing roles

---

## 🐛 Troubleshooting

### Problem: Still going to wrong dashboard
**Solution**: Clear localStorage and sign up again
```javascript
localStorage.clear()
// Then sign up as new user
```

### Problem: Want to change a user's role
**Solution**: Update in console
```javascript
const roles = JSON.parse(localStorage.getItem('user_roles'))
roles['charity@test.com'] = 'admin'  // Change charity to admin
localStorage.setItem('user_roles', JSON.stringify(roles))
```

### Problem: Want to see all stored data
**Solution**: Run in console
```javascript
console.log('User Roles:', localStorage.getItem('user_roles'))
console.log('Current Role:', localStorage.getItem('userRole'))
console.log('Campaigns:', localStorage.getItem('charity_campaigns'))
```

---

## 📝 Notes

- This is a temporary solution until you implement a real database
- In production, user roles should be stored in your database (Firestore, MongoDB, etc.)
- The email-based storage is more reliable than session-based storage
- Roles persist even if you close and reopen the browser
