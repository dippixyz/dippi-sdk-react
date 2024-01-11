const getAuthToken = () => {
    if (typeof window === 'undefined') {
        return undefined;
    }
    const token = window.localStorage.getItem('token');
    if (!token) {
        return undefined;
    }
    return token;
};

export { getAuthToken };
