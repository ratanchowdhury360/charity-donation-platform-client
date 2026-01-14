const API_BASE_URL = import.meta.env.VITE_API_URL || 'https://charity-donation-platform-server.vercel.app';

export const syncUserWithServer = async (userPayload) => {
    const response = await fetch(`${API_BASE_URL}/users`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(userPayload),
    });

    if (!response.ok && response.status !== 409) {
        // 409 = already exists -> ignore; log others for debugging
        console.error('Server responded with an error while syncing user:', response.status);
    }
};


