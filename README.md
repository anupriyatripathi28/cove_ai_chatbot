# ◈ Cove — AI Chatbot

Cove is a modern AI chatbot built with HTML, CSS, and JavaScript. It uses the Google Gemini API to generate AI responses and provides a clean, responsive chat interface.

## ✨ Features

* 🤖 AI-powered conversations using Gemini
* 💬 Real-time chat interface
* 💾 Chat history saved using `localStorage`
* 🌙 Dark/Light mode
* 🗑️ Clear Chat functionality
* ➕ New conversation button
* 📱 Responsive design for desktop and mobile
* ⌨️ Press Enter to send messages
* 💡 Suggested prompts
* ⏳ Typing indicator
* 🎨 Modern UI with CSS animations

## 🛠️ Technologies Used

* HTML5
* CSS3
* JavaScript
* Google Gemini API
* Browser `localStorage`

## 📁 Project Structure

```text
cove-ai-chatbot/
│
├── index.html
├── style.css
├── script.js
└── README.md
```

## 🚀 How to Run

1. Clone the repository:

```bash
git clone YOUR_GITHUB_REPOSITORY_URL
```

2. Open the project folder.

3. Add your Gemini API configuration.

4. Open `index.html` in your browser.

## 🔑 API Key

This project uses the Google Gemini API to generate responses.

**Never upload your API key directly to GitHub.**

For a production-ready application, the API request should be handled through a backend server and the API key should be stored securely using environment variables.

## 💾 Local Storage

Cove uses the browser's `localStorage` to save:

* Chat history
* Dark/Light mode preference

This allows the conversation and selected theme to remain after refreshing the page.

## 📱 Responsive Design

The interface adapts to different screen sizes, including:

* Desktop
* Tablet
* Mobile

## 🔮 Future Improvements

* Secure backend for Gemini API requests
* User authentication
* Multiple saved conversations
* Delete individual conversations
* Markdown support for AI responses
* Code syntax highlighting
* Voice input
* Deployment with a live URL

## 👩‍💻 Author

**Anupriya Tripathi**

Built as a personal AI/web development project.
