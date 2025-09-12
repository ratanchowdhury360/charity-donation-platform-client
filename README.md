# Charity Donation Platform - Frontend

A comprehensive charity donation platform built with React, TailwindCSS, and Firebase. This platform connects donors with verified charity organizations to create meaningful impact in communities across Bangladesh.

## 🚀 Features

### User Functionalities
- **Authentication**: Email/password and Google login integration
- **Role-based Access**: Donor, Charity, and Admin roles
- **Donation Process**: Browse campaigns, view details, and donate securely
- **Donor Dashboard**: Track donation history, receipts, and impact reports

### Charity Organization Functionalities
- **Registration & Verification**: Upload documents and await admin approval
- **Campaign Management**: Create, update, and manage fundraising campaigns
- **Team Profiles**: Showcase verified volunteers and team members

### Admin Functionalities
- **Dashboard**: Manage users, charities, and campaigns
- **Verification**: Approve/reject registrations and campaigns
- **Analytics**: Monitor donations and generate reports

### Platform Features
- **Real-time Fund Tracking**: Visual progress bars and updates
- **Security & Trust**: Firebase Auth with role-based access
- **Search & Filter**: Advanced campaign filtering and search
- **Responsive Design**: Mobile-first design with desktop support
- **Notifications**: Email/SMS confirmations and alerts

## 🛠️ Tech Stack

- **Frontend**: React 19, TailwindCSS, DaisyUI
- **Authentication**: Firebase Auth
- **State Management**: React Context API
- **Forms**: React Hook Form with validation
- **Routing**: React Router v7
- **Icons**: React Icons
- **Data Fetching**: TanStack Query
- **SEO**: React Helmet Async

## 📦 Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd charity-donation-platform-Client
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up Firebase**
   - Create a Firebase project at [Firebase Console](https://console.firebase.google.com/)
   - Enable Authentication (Email/Password and Google)
   - Enable Firestore Database
   - Enable Storage
   - Copy your Firebase config

4. **Environment Variables**
   Create a `.env` file in the root directory:
   ```env
   VITE_FIREBASE_API_KEY=your_api_key_here
   VITE_FIREBASE_AUTH_DOMAIN=your_project_id.firebaseapp.com
   VITE_FIREBASE_PROJECT_ID=your_project_id
   VITE_FIREBASE_STORAGE_BUCKET=your_project_id.appspot.com
   VITE_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
   VITE_FIREBASE_APP_ID=your_app_id
   ```

5. **Run the development server**
   ```bash
   npm run dev
   ```

6. **Build for production**
   ```bash
   npm run build
   ```

## 🎨 Design Features

- **Parallax Effects**: Fixed background images with scrolling text
- **Responsive Design**: Mobile-first approach with desktop optimization
- **Modern UI**: Clean, intuitive interface with DaisyUI components
- **Animations**: Smooth transitions and hover effects
- **Accessibility**: Focus management and keyboard navigation

## 📱 Pages & Components

### Public Pages
- **Home**: Hero section with parallax, featured campaigns, testimonials
- **Campaigns**: Browse, search, and filter campaigns
- **Campaign Details**: Detailed campaign information and donation flow
- **Charities**: List of verified charity organizations
- **About**: Platform information and team details
- **Contact**: Contact form and information

### Authentication
- **Login**: Email/password and Google authentication
- **Signup**: Registration with role selection and validation

### Protected Pages
- **Dashboard**: Role-based dashboards (Donor/Charity/Admin)
- **Profile**: User profile management
- **Donation Flow**: Secure payment processing
- **Campaign Creation**: Charity campaign creation form

## 🔐 Authentication & Authorization

The platform uses Firebase Authentication with role-based access control:

- **Donors**: Can browse campaigns, make donations, view history
- **Charities**: Can create campaigns, manage donations, view analytics
- **Admins**: Can manage users, verify charities, moderate content

## 📊 Mock Data

The platform includes comprehensive mock data for:
- Campaigns with various categories and urgency levels
- Charity organizations with verification status
- User profiles with different roles
- Donation history and statistics
- Testimonials and reviews

## 🚀 Getting Started

1. **Start the development server**
   ```bash
   npm run dev
   ```

2. **Open your browser**
   Navigate to `http://localhost:5173`

3. **Test the features**
   - Browse campaigns without authentication
   - Sign up as a donor or charity
   - Test the donation flow
   - Explore different dashboards

## 📁 Project Structure

```
src/
├── components/          # Reusable components
├── data/               # Mock data and constants
├── firebase/           # Firebase configuration
├── hooks/             # Custom React hooks
├── Layout/            # Layout components
├── Pages/             # Page components
│   ├── Dashboard/     # Dashboard pages
│   ├── Home/          # Home page components
│   ├── Login/         # Authentication pages
│   ├── Campaigns/     # Campaign-related pages
│   ├── Charities/     # Charity-related pages
│   └── Shared/        # Shared components
├── provider/          # Context providers
└── Routes/            # Routing configuration
```

## 🎯 Future Enhancements

- **Backend Integration**: Connect to Node.js/Express backend
- **Payment Gateway**: Integrate bKash, PayPal, and card payments
- **Real-time Updates**: WebSocket integration for live updates
- **Advanced Analytics**: Detailed reporting and insights
- **Mobile App**: React Native mobile application
- **Multi-language**: Internationalization support

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License.

## 📞 Support

For support and questions:
- Email: support@charityplatform.com
- Phone: +880-2-1234567
- Website: [Charity Platform](https://charityplatform.com)

---

**Built with ❤️ for making a positive impact in communities across Bangladesh**