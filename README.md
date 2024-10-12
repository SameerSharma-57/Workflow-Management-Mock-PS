# Workflow Management Mock Project

## Setup Instructions

### 1. Install Dependencies
Every time you pull the latest changes from the repository, run the following commands to ensure all dependencies are installed:

- In the **root** folder:
  ```bash
  npm install
  ```

- In the **frontend** folder:
  ```bash
  cd frontend
  npm install
  ```

### 2. Start the Application
To start the application, run the following command in the **root** folder:
```bash
npm run start
```

This will start both the backend and frontend (if configured in the scripts).

### 3. Private Files
- Private files such as `.env` and Firebase configuration files are not included in this repository.
- Links to these files will be provided separately and will be updated when necessary.

Make sure to download these files and place them in the appropriate locations as instructed.

---

Feel free to reach out if you encounter any issues!

## API Endpoints

### Authentication

#### Sign Up
- **URL:** `/auth/signup`
- **Method:** `POST`
- **Description:** Registers a new user.
- **Request Body:**
  ```json
  {
    "email": "user@example.com",
    "password": "yourpassword",
    "name": "John Doe",
    "username": "johndoe",
    "department": "Engineering",
    "designation": "Developer"
    "UID": "unique-user-id"
  }
  ```
- **Response:**
  - **Success (201):**
    ```json
    {
      "uid": "unique-user-id"
    }
    ```
  - **Error (400):**
    ```json
    {
      "error": "Error message"
    }
    ```

#### Login
- **URL:** `/auth/login`
- **Method:** `POST`
- **Description:** Authenticates a user and returns a token along with user details.
- **Request Body:**
  ```json
  {
    "email": "user@example.com",
    "password": "yourpassword"
  }
  ```
- **Response:**
  - **Success (200):**
    ```json
    {
      "uid": "unique-user-id",
      "name": "John Doe",
      "username": "johndoe",
      "department": "Engineering",
      "designation": "Developer",
      "token": "your-jwt-token"
    }
    ```
  - **Error (400):**
    ```json
    {
      "error": "Invalid email or password"
    }
    ```

#### Logout
- **URL:** `/auth/logout`
- **Method:** `POST`
- **Description:** Logs out the user.
- **Response:**
  - **Success (200):**
    ```json
    {
      "message": "Logout successful"
    }
    ```

### Projects

#### Create Project
- **URL:** `/createProject`
- **Method:** `POST`
- **Description:** Creates a new project.
- **Request Body:**
  ```json
  {
    "name": "Project Name",
    "host": "user@example.com",
    "members": ["user1@example.com", "user2@example.com"],
    "tasks": [],
    "start": "YYYY-MM-DD",
    "end": "YYYY-MM-DD"
  }
  ```
- **Response:**
  - **Success (201):**
    ```json
    {
      "projectId": "unique-project-id"
    }
    ```

#### Get All Projects
- **URL:** `/getAllProjects`
- **Method:** `GET`
- **Description:** Retrieves all projects.
- **Response:**
  - **Success (200):**
    ```json
    [
      {
        "projectId": "unique-project-id",
        "name": "Project Name",
        "host": "user@example.com",
        "members": ["user1@example.com", "user2@example.com"],
        "tasks": [],
        "start": "YYYY-MM-DD",
        "end": "YYYY-MM-DD"
      }
    ]
    ```

### Tasks

#### Create Task
- **URL:** `/projects/projectId/createTask`
- **Method:** `POST`
- **Description:** Creates a new task within a project.
- **Request Body:**
  ```json
  {
    "name": "Task Name",
    "status": "Pending",
    "dueDate": "YYYY-MM-DD",
    "assignee": "user@example.com",
    "projectId": "unique-project-id",
    "comments": []
  }
  ```
- **Response:**
  - **Success (201):**
    ```json
    {
      "taskId": "unique-task-id"
    }
    ```

#### Get All Tasks for a Project
- **URL:** `/projects/projectId/getAllTasks`
- **Method:** `GET`
- **Description:** Retrieves all tasks associated with a specific project.
- **Response:**
  - **Success (200):**
    ```json
    [
      {
        "taskId": "unique-task-id",
        "name": "Task Name",
        "status": "Pending",
        "dueDate": "YYYY-MM-DD",
        "assignee": "user@example.com",
        "comments": []
      }
    ]
    ```

### Comments

#### Add Comment
- **URL:** `/project/projectId/task/taskId/addComment`
- **Method:** `POST`
- **Description:** Adds a comment to a specific task.
- **Request Body:**
  ```json
  {
    "userId": "user@example.com",
    "text": "This is a comment."
  }
  ```
- **Response:**
  - **Success (201):**
    ```json
    {
      "commentId": "unique-comment-id"
    }
    ```
