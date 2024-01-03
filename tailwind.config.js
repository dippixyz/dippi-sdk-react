/** @type {import('tailwindcss').Config} */
module.exports = {
    media: false, // or 'media' or 'class'
    content: [
        './src/**/*.{js,jsx,ts,tsx}',
        './public/index.html'
    ],
    theme: {
        extend: {},
    },
    plugins: [],
}

