// Helpers for working with user roles (kept separate for fast-refresh friendliness)

const ROLE_KEY = 'userRole';

export const getStoredRole = () => {
    const stored = localStorage.getItem(ROLE_KEY);
    return stored ? stored.toLowerCase() : null;
};

export const persistRole = (role) => {
    const normalized = role ? role.toLowerCase() : null;
    if (normalized) {
        localStorage.setItem(ROLE_KEY, normalized);
    } else {
        localStorage.removeItem(ROLE_KEY);
    }
    return normalized;
};


