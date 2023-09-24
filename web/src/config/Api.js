let api;

if (process.env.NODE_ENV === 'development') {
    // Assuming you want to use localhost:3002 in development
    api = "http://localhost:3002";
} else {
    api = "https://api.example.com";
}

export { api };