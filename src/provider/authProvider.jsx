
import React, { createContext, useContext, useState, useEffect } from 'react';
import {
    signInWithEmailAndPassword,
    createUserWithEmailAndPassword,
    signInWithPopup,
    GoogleAuthProvider,
    signOut,
    onAuthStateChanged
} from 'firebase/auth';
import { auth } from '../firebase/firebase.config';
                       

const AuthContext = createContext();

export const useAuth = () => {
    return useContext(AuthContext);
};

export const AuthProvider = ({ children }) => {
    const [currentUser, setCurrentUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const [userRole, setUserRole] = useState(null);

    // Google Auth Provider
    const googleProvider = new GoogleAuthProvider();

    // Sign up with email and password
    const signup = async (email, password, userData) => {
        try {
            const result = await createUserWithEmailAndPassword(auth, email, password);
            // Here you would typically save additional user data to Firestore
            return result;
        } catch (error) {
            throw error;
        }
    };

    // Sign in with email and password
    const login = async (email, password) => {
        try {
            const result = await signInWithEmailAndPassword(auth, email, password);
            return result;
        } catch (error) {
            throw error;
        }
    };

    // Sign in with Google
    const loginWithGoogle = async () => {
        try {
            const result = await signInWithPopup(auth, googleProvider);
            return result;
        } catch (error) {
            throw error;
        }
    };

    // Sign out
    const logout = async () => {
        try {
            await signOut(auth);
            setUserRole(null);
        } catch (error) {
            throw error;
        }
    };

    // Set user role (this would typically come from your database)
    const setRole = (role) => {
        setUserRole(role);
        localStorage.setItem('userRole', role);
    };

    // Get user role from localStorage
    const getRole = () => {
        return localStorage.getItem('userRole');
    };

    // Check if user has specific role
    const hasRole = (role) => {
        return userRole === role;
    };

    // Check if user is admin
    const isAdmin = () => {
        return userRole === 'admin';
    };

    // Check if user is charity
    const isCharity = () => {
        return userRole === 'charity';
    };

    // Check if user is donor
    const isDonor = () => {
        return userRole === 'donor';
    };

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, (user) => {
            setCurrentUser(user);
            if (user) {
                // Get role from localStorage or set default
                const role = getRole() || 'donor';
                setUserRole(role);
            } else {
                setUserRole(null);
                localStorage.removeItem('userRole');
            }
            setLoading(false);
        });

        return unsubscribe;
    }, []);

    const value = {
        currentUser,
        userRole,
        signup,
        login,
        loginWithGoogle,
        logout,
        setRole,
        hasRole,
        isAdmin,
        isCharity,
        isDonor,
        loading
    };

    return (
        <AuthContext.Provider value={value}>
            {!loading && children}
        </AuthContext.Provider>
    );
};

export default AuthProvider;