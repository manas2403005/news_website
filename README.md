# Today Times

Today Times is a responsive and stylish web news application that fetches real-time headlines using the NewsAPI. It supports category-based browsing, search functionality, and a simulated authentication system with Register, Sign In, and Account management options.

## Features

- Category-based news filtering (U.S., India, World, Other)
- Hero section highlighting the top article
- Search bar for querying specific news topics
- Sidebar showing latest headlines
- Responsive layout for mobile and desktop screens
- Register and Sign In pages (simulated via localStorage)
- "Your Account" section with logout confirmation
- Clean, newspaper-inspired typography and design

## Tech Stack

- HTML5, CSS3 (with Playfair Display and Roboto fonts)
- Vanilla JavaScript (no frameworks)
- NewsAPI (accessed through a Netlify function proxy)
- LocalStorage for simulated login state management

## Folder Structure

/project-root
│
├── index.html # Main homepage with news interface
├── login.html # Simulated Sign In page
├── register.html # Simulated Register page
├── style.css # Main stylesheet
├── script.js # Frontend logic (news fetching, UI rendering, events)
└── netlify/functions/news.js # Serverless proxy (optional)


## Setup Instructions

1. Clone this repository.
2. Replace the `API_KEY` value in `script.js` with your own from [NewsAPI.org](https://newsapi.org/).
3. If hosting on Netlify, set up a Netlify Function named `news.js` to securely proxy NewsAPI requests.
4. Open `index.html` in your browser or deploy it using GitHub Pages, Netlify, or Vercel.

## Simulated Authentication

This project simulates user authentication using browser `localStorage`. No real user data is stored or validated. It is intended as a frontend UI prototype.

- Register or Sign In sets a `loggedIn` flag in localStorage
- When logged in, "Register / Sign In" are hidden and "Your Account" is shown
- Clicking "Your Account" allows logout with confirmation

