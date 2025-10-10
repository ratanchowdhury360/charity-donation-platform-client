// Temporary storage utility for user roles (until database is implemented)
// This uses localStorage to persist user roles across sessions

const USER_ROLES_KEY = 'user_roles';

// Get all user roles
const getAllUserRoles = () => {
    try {
        const data = localStorage.getItem(USER_ROLES_KEY);
        return data ? JSON.parse(data) : {};
    } catch (error) {
        console.error('Error reading user roles:', error);
        return {};
    }
};

// Get user role by email
export const getUserRole = (email) => {
    if (!email) return null;
    const userRoles = getAllUserRoles();
    return userRoles[email.toLowerCase()] || null;
};

// Set user role by email
export const setUserRole = (email, role) => {
    if (!email || !role) return false;
    try {
        const userRoles = getAllUserRoles();
        userRoles[email.toLowerCase()] = role;
        localStorage.setItem(USER_ROLES_KEY, JSON.stringify(userRoles));
        return true;
    } catch (error) {
        console.error('Error setting user role:', error);
        return false;
    }
};

// Remove user role
export const removeUserRole = (email) => {
    if (!email) return false;
    try {
        const userRoles = getAllUserRoles();
        delete userRoles[email.toLowerCase()];
        localStorage.setItem(USER_ROLES_KEY, JSON.stringify(userRoles));
        return true;
    } catch (error) {
        console.error('Error removing user role:', error);
        return false;
    }
};

// Clear all user roles (for testing)
export const clearAllUserRoles = () => {
    localStorage.removeItem(USER_ROLES_KEY);
};
