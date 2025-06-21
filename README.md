# DevNexus

DevNexus is a social network platform inspired by LinkedIn, focused on programmers and tech professionals.  
The goal is to connect developers, showcase portfolios, and foster professional networking and opportunities in the tech community.

---

## 🚀 Project Overview

DevNexus aims to be a hub where developers can:

- Create and manage professional profiles
- Showcase skills, projects, and experiences
- Connect with other programmers
- Explore opportunities and collaborations

This repository contains the backend API and server-side rendering built with:

- **Node.js** — Main server and application logic
- **Express.js** — API routing and middleware
- **EJS** — Templating for dynamic web pages
- **MongoDB & Mongoose** — Database and ODM for storing user profiles, projects, and connections

---

## 🛠️ Technologies Used

<p>
  <img src="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/nodejs/nodejs-original.svg" width="40" alt="Node.js"/>
  <img src="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/express/express-original.svg" width="40" alt="Express.js"/>
  <img src="https://www.svgrepo.com/show/373574/ejs.svg" width="40" alt="EJS"/>
  <img src="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/mongodb/mongodb-original.svg" width="40" alt="MongoDB"/>
  <img src="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/javascript/javascript-original.svg" width="40" alt="JavaScript"/>
</p>

---

## 📁 Project Structure

- `/models` — Mongoose schemas and models (Users, Projects, etc.)
- `/routes` — Express routes for authentication, profiles, and more
- `/views` — EJS page templates
- `/public` — Static files (CSS, JS, images)
- `/controllers` — Business logic for each route
- `server.js` — Main entry point

---

## 🚧 Status

> **Note:** This project is currently under development and not feature-complete.  
You are welcome to fork, contribute, or provide feedback!

---

## 🛠️ Getting Started

### Prerequisites

- Node.js (v18+ recommended)
- MongoDB (Local or Atlas)
- npm

### Installation

```bash
git clone https://github.com/Otavio-Emanoel/DevNexusBackend.git
cd DevNexusBackend
npm install
```

### Environment Setup

Create a `.env` file with your MongoDB connection string and other secrets:

```
MONGODB_URI=your_mongodb_connection_string
PORT=3000
```

### Running the Project

```bash
npm start
```
Access at: `http://localhost:3000`

---

## ✨ Author

Made with ❤️ by [Otavio Emanoel](https://github.com/Otavio-Emanoel)

---

## 📃 License

This project is for educational and personal use.  
Feel free to explore, study, and suggest improvements!
