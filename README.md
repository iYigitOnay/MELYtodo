# MELYtodo

A modern and fully-featured full-stack Todo application built with the MERN stack (MongoDB, Express.js, React, Node.js) and TypeScript.

## Features

- **Full CRUD Functionality:** Create, Read, Update (mark as complete), and Delete todos.
- **RESTful API:** A well-structured backend API built with Node.js and Express.
- **Modern Frontend:** A responsive and stylish user interface built with React and Vite.
- **Component-Based Architecture:** The frontend is structured into modular and reusable components.
- **Styled with CSS Modules:** Scoped CSS to avoid style conflicts and improve maintainability.
- **Database Integration:** All data is persisted in a MongoDB database.

## Tech Stack

- **Backend:** Node.js, Express.js, Mongoose, TypeScript
- **Frontend:** React, Vite, TypeScript, CSS Modules
- **Database:** MongoDB

## Getting Started

Follow these instructions to get the project up and running on your local machine.

### Prerequisites

- [Node.js](https://nodejs.org/) (v16 or later recommended)
- [MongoDB](https://www.mongodb.com/try/download/community) installed and running locally, or a connection string for a cloud instance (e.g., MongoDB Atlas).

### Installation & Setup

1.  **Clone the repository:**
    ```bash
    git clone <your-repository-url>
    cd MELYtodo
    ```

2.  **Install Backend Dependencies:**
    From the root directory (`MELYtodo`), run:
    ```bash
    npm install
    ```

3.  **Configure Backend Environment:**
    The backend connects to MongoDB using a connection string. The recommended approach is to use an environment variable.
    *   In the root directory (`MELYtodo`), create a file named `.env`.
    *   Add your MongoDB connection string to this file:
        ```
        MONGO_URI=mongodb://localhost:27017/MELYtodo
        ```
    *   *Note: You will need to install `dotenv` (`npm install dotenv`) and modify `src/config/db.ts` and `src/index.ts` to use it.* 

4.  **Install Frontend Dependencies:**
    Navigate to the frontend directory and install its dependencies:
    ```bash
    cd frontend
    npm install
    ```

### Running the Application

You will need two separate terminals to run both the backend and frontend servers simultaneously.

1.  **Run the Backend Server:**
    In the first terminal, from the **root directory** (`MELYtodo`):
    ```bash
    npm run dev
    ```
    The API server should now be running on `http://localhost:3000`.

2.  **Run the Frontend Server:**
    In the second terminal, from the **frontend directory** (`MELYtodo/frontend`):
    ```bash
    npm run dev
    ```
    The React application should now be running, typically on `http://localhost:5173`. You can open this URL in your browser.
