
import React, { createContext, useContext, useState, useEffect } from 'react';
import {
    signInWithEmailAndPassword,
    createUserWithEmailAndPassword,
    signInWithPopup,
    GoogleAuthProvider,
    signOut,
    onAuthStateChanged
} from 'firebase/auth';
import { auth, db } from '../firebase/firebase.config';
import { doc, setDoc, getDoc, serverTimestamp } from 'firebase/firestore';
                       
const AuthContext = createContext();
const API_BASE_URL = import.meta.env.VITE_API_URL || 'https://charity-donation-platform-server.vercel.app';

const syncUserWithServer = async (userPayload) => {
    try {
        const response = await fetch(`${API_BASE_URL}/users`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(userPayload),
        });
        if (!response.ok && response.status !== 409) {
            console.error('Server responded with an error while syncing user:', response.status);
        }
    } catch (error) {
        console.error('Failed to sync user with server:', error);
    }
};

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
            // Save user profile to Firestore
            const user = result.user;
            const role = userData?.role || 'donor';
            const userPayload = {
                uid: user.uid,
                email: user.email,
                displayName: user.displayName || userData?.displayName || '',
                photoURL: user.photoURL || userData?.photoURL || '',
                role,
                providerId: user.providerData?.[0]?.providerId || 'password',
            };
            await setDoc(doc(db, 'users', user.uid), {
                ...userPayload,
                createdAt: serverTimestamp(),
                updatedAt: serverTimestamp()
            }, { merge: true });
            await syncUserWithServer(userPayload);
            return result;
        } catch (error) {
            throw error;
        }
    };

    // Sign in with email and password
    const login = async (email, password) => {
        try {
            const result = await signInWithEmailAndPassword(auth, email, password);
            // Ensure user profile exists in Firestore
            const user = result.user;
            const ref = doc(db, 'users', user.uid);
            const snap = await getDoc(ref);
            const userPayload = {
                uid: user.uid,
                email: user.email,
                displayName: user.displayName || '',
                photoURL: user.photoURL || '',
                role: getRole() || 'donor',
                providerId: user.providerData?.[0]?.providerId || 'password',
            };
            if (!snap.exists()) {
                await setDoc(ref, {
                    ...userPayload,
                    createdAt: serverTimestamp(),
                    updatedAt: serverTimestamp()
                });
            } else {
                await setDoc(ref, { updatedAt: serverTimestamp() }, { merge: true });
            }
            await syncUserWithServer(userPayload);
            return result;
        } catch (error) {
            throw error;
        }
    };

    // Sign in with Google
    const loginWithGoogle = async () => {
        try {
            const result = await signInWithPopup(auth, googleProvider);
            // Ensure user profile exists/updated in Firestore
            const user = result.user;
            const ref = doc(db, 'users', user.uid);
            const snap = await getDoc(ref);
            const userPayload = {
                uid: user.uid,
                email: user.email,
                displayName: user.displayName || '',
                photoURL: user.photoURL || '',
                role: getRole() || 'donor',
                providerId: user.providerData?.[0]?.providerId || 'google.com',
            };
            if (!snap.exists()) {
                await setDoc(ref, {
                    ...userPayload,
                    createdAt: serverTimestamp(),
                    updatedAt: serverTimestamp()
                });
            } else {
                await setDoc(ref, {
                    email: user.email,
                    displayName: user.displayName || '',
                    photoURL: user.photoURL || '',
                    providerId: user.providerData?.[0]?.providerId || 'google.com',
                    updatedAt: serverTimestamp()
                }, { merge: true });
            }
            await syncUserWithServer(userPayload);
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