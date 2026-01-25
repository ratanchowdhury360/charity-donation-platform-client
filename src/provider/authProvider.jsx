
import React, { useContext, useState, useEffect } from 'react';
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
import { syncUserWithServer } from './authSync';
import { AuthContext } from './authContext';
import { getStoredRole, persistRole } from './authRoleHelpers';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'https://charity-donation-platform-server.vercel.app';

// eslint-disable-next-line react-refresh/only-export-components
export const useAuth = () => {
    return useContext(AuthContext);
};

export const AuthProvider = ({ children }) => {
    const [currentUser, setCurrentUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const [userRole, setUserRole] = useState(null);

    // Google Auth Provider
    const googleProvider = new GoogleAuthProvider();

    // Helpers for role persistence
    const getRole = () => getStoredRole();

    const setRole = (role) => {
        const normalized = persistRole(role);
        setUserRole(normalized);
    };

    // Fallback: get role from backend users collection by email
    const fetchRoleFromServer = async (email) => {
        if (!email) return null;
        try {
            const res = await fetch(`${API_BASE_URL}/users`);
            if (!res.ok) return null;
            const data = await res.json();
            const found = (data || []).find((u) => (u.email || '').toLowerCase() === email.toLowerCase());
            return found?.role ? found.role.toLowerCase() : null;
        } catch (err) {
            console.error('Failed to fetch role from server:', err);
            return null;
        }
    };

    const hasRole = (role) => userRole === role;
    const isAdmin = () => userRole === 'admin';
    const isCharity = () => userRole === 'charity';
    const isDonor = () => userRole === 'donor';

    // Sign up with email and password
    const signup = async (email, password, userData) => {
            const result = await createUserWithEmailAndPassword(auth, email, password);
            // Save user profile to Firestore
            const user = result.user;
        const rawRole = userData?.role || 'donor';
        const role = rawRole.toLowerCase();
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
    };

    // Sign in with email and password
    const login = async (email, password) => {
            const result = await signInWithEmailAndPassword(auth, email, password);
            const user = result.user;
            const ref = doc(db, 'users', user.uid);
            const snap = await getDoc(ref);

        // Prefer role from Firestore; fall back to backend role, then stored/local role or donor
        let roleFromProfile = null;
        if (snap.exists()) {
            const data = snap.data() || {};
            roleFromProfile = (data.role && data.role.toLowerCase()) || null;
        }
        const roleFromApi = roleFromProfile ? null : await fetchRoleFromServer(user.email);
        const role = (roleFromProfile || roleFromApi || getRole() || 'donor').toLowerCase();

            const userPayload = {
                uid: user.uid,
                email: user.email,
                displayName: user.displayName || '',
                photoURL: user.photoURL || '',
            role,
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
        // Keep context/localStorage in sync
        setRole(role);
        return { result, role };
    };

    // Sign in with Google
    const loginWithGoogle = async () => {
            const result = await signInWithPopup(auth, googleProvider);
            // Ensure user profile exists/updated in Firestore
            const user = result.user;
            const ref = doc(db, 'users', user.uid);
            const snap = await getDoc(ref);

        // Prefer role from Firestore; fall back to backend role, then stored/local role; default donor
        let roleFromProfile = null;
        if (snap.exists()) {
            const data = snap.data() || {};
            roleFromProfile = (data.role && data.role.toLowerCase()) || null;
        }
        const roleFromApi = roleFromProfile ? null : await fetchRoleFromServer(user.email);
        const role = (roleFromProfile || roleFromApi || getRole() || 'donor').toLowerCase();

            const userPayload = {
                uid: user.uid,
                email: user.email,
                displayName: user.displayName || '',
                photoURL: user.photoURL || '',
            role,
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
        setRole(role);
        return { result, role };
    };

    // Sign out
    const logout = async () => {
            await signOut(auth);
        setRole(null);
    };

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, async (user) => {
            setCurrentUser(user);

            if (!user) {
                setUserRole(null);
                localStorage.removeItem('userRole');
                setLoading(false);
                return;
            }

            try {
                // Load role from Firestore first; if missing, check backend; then localStorage
                const ref = doc(db, 'users', user.uid);
                const snap = await getDoc(ref);
                let roleFromProfile = null;

                if (snap.exists()) {
                    const data = snap.data() || {};
                    roleFromProfile = (data.role && data.role.toLowerCase()) || null;
                }

                const roleFromApi = roleFromProfile ? null : await fetchRoleFromServer(user.email);
                const effectiveRole = (roleFromProfile || roleFromApi || getRole() || 'donor').toLowerCase();

                setUserRole(effectiveRole);
                persistRole(effectiveRole);
            } catch (error) {
                console.error('Failed to load user role:', error);
                const fallbackRole = (getRole() || 'donor').toLowerCase();
                setUserRole(fallbackRole);
                if (fallbackRole) {
                    persistRole(fallbackRole);
                }
            } finally {
                setLoading(false);
            }
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