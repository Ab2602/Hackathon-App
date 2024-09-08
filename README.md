# Hackathon App

This is a simple application for managing challenges for a hackathon. It allows you to create, read, update, and delete challenges from a PostgreSQL database hosted on Vercel.

## Getting Started

### Clone the repository

```bash
git clone https://github.com/Ab2602/Hackathon-App.git
```
### Frontend Setup
Navigate to the frontend folder:

```bash
cd frontend
```
### Install the dependencies:
```bash
npm install
```
or use:
```bash
npm i react-scripts
```
### Start the frontend development server:

```bash
npm run dev
```
### Backend Setup
Navigate to the backend folder:

```bash
cd backend
```

### Install the dependencies:
```bash
npm install
```

### Start the backend server:

```bash
node server.js
```

### Features
1. Read: The main page displays all the challenges present in the database.
2. Create: Click on "Create Challenge" on the main page to add a new challenge.
3. Edit/Delete: Click on any challenge, and you will be redirected to the edit-challenge page where you can either update or delete the challenge.
### Database
The app uses Vercel PostgreSQL as the database.
