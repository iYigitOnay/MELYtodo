# MELYtodo

Welcome to MELYtodo, your personal storytelling companion! This application is designed to help you create, manage, and revisit your stories, turning your memories and ideas into a beautiful narrative.

## The Story of MELY

MELY stands for "Memories and Stories for You." It was born from the idea that everyone has a story to tell, but we often lack the tools to capture and organize our thoughts. MELYtodo provides a simple and elegant way to bring your stories to life, whether it's a daily journal, a fictional series, or a collection of cherished memories.

## Features

*   **Story Generation:** Get inspired and create new stories with our story generator.
*   **Story History:** Keep track of all your past stories and revisit them anytime.
*   **Calendar View:** Organize your stories by date and visualize your creative journey.
*   **Translation:** Translate your stories into different languages to share with a wider audience.
*   **Secure Authentication:** Your stories are your own. We provide a secure login and registration system to protect your data.

## Tech Stack

*   **Frontend:**
    *   React
    *   Vite
    *   React Router
    *   TypeScript
*   **Backend:**
    *   Node.js
    *   Express
    *   MongoDB
    *   Mongoose
    *   TypeScript
    *   JSON Web Tokens (JWT) for authentication

## Getting Started

To get a local copy up and running, follow these simple steps.

### Prerequisites

*   Node.js and npm installed
*   MongoDB instance (local or cloud)

### Installation

1.  Clone the repo
    ```sh
    git clone https://github.com/iYigitOnay/MELYtodo.git
    ```
2.  Install NPM packages for the backend
    ```sh
    npm install
    ```
3.  Install NPM packages for the frontend
    ```sh
    npm install --prefix frontend
    ```
4.  Create a `.env` file in the root directory and add the following environment variables:
    ```
    MONGO_URI=your_mongodb_connection_string
    JWT_SECRET=your_jwt_secret
    ```

### Running the Application

*   To run the backend development server:
    ```sh
    npm run dev
    ```
*   To run the frontend development server:
    ```sh
    npm run dev --prefix frontend
    ```

## Build

To build the application for production, run the following command in the root directory:

```sh
npm run build
```

This will build both the backend and the frontend and place the production-ready files in the `dist` and `frontend/dist` directories, respectively.

## Deployment

This project is configured for deployment on Vercel. Simply connect your Git repository to Vercel and let it build and deploy your application.

**Important:** Don't forget to add your environment variables (`MONGO_URI`, `JWT_SECRET`, etc.) to your Vercel project settings.