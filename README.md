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

Note: All API endpoints are prefixed with `http://localhost:<portnumber>`.

### Authentication

[Authentication endpoints remain unchanged]

### Projects

#### Create Project

- **URL:** `/createProject`
- **Method:** `POST`
- **Headers:**
  - `Authorization: Bearer <jwt-token>`
- **Request Body:**
  ```json
  {
    "name": "Project Name",
    "members": ["user1@example.com", "user2@example.com"],
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
- **Headers:**
  - `Authorization: Bearer <jwt-token>`
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

#### Get Single Project

- **URL:** `/getProject/:projectId`
- **Method:** `GET`
- **Headers:**
  - `Authorization: Bearer <jwt-token>`
- **Response:**
  - **Success (200):**
    ```json
    {
      "projectId": "unique-project-id",
      "name": "Project Name",
      "host": "user@example.com",
      "members": ["user1@example.com", "user2@example.com"],
      "tasks": [],
      "start": "YYYY-MM-DD",
      "end": "YYYY-MM-DD"
    }
    ```

#### Update Project

- **URL:** `/updateProject/:projectId`
- **Method:** `PUT`
- **Headers:**
  - `Authorization: Bearer <jwt-token>`
- **Request Body:**
  ```json
  {
    "name": "Updated Project Name",
    "end": "YYYY-MM-DD"
  }
  ```
- **Response:**
  - **Success (200):**
    ```json
    {
      "message": "Project updated successfully"
    }
    ```

### Tasks

#### Create Task

- **URL:** `/createTask/:projectId`
- **Method:** `POST`
- **Headers:**
  - `Authorization: Bearer <jwt-token>`
- **Request Body:**
  ```json
  {
    "name": "Task Name",
    "status": "Pending",
    "dueDate": "YYYY-MM-DD",
    "assignee": "user@example.com"
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

- **URL:** `/getAllTasks/:projectId`
- **Method:** `GET`
- **Headers:**
  - `Authorization: Bearer <jwt-token>`
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

#### Get Single Task

- **URL:** `/getTask/:projectId/:taskId`
- **Method:** `GET`
- **Headers:**
  - `Authorization: Bearer <jwt-token>`
- **Response:**
  - **Success (200):**
    ```json
    {
      "taskId": "unique-task-id",
      "name": "Task Name",
      "status": "Pending",
      "dueDate": "YYYY-MM-DD",
      "assignee": "user@example.com",
      "comments": []
    }
    ```

#### Update Task

- **URL:** `/updateTask/:projectId/:taskId`
- **Method:** `PUT`
- **Headers:**
  - `Authorization: Bearer <jwt-token>`
- **Request Body:**
  ```json
  {
    "status": "In Progress",
    "dueDate": "YYYY-MM-DD"
  }
  ```
- **Response:**
  - **Success (200):**
    ```json
    {
      "message": "Task updated successfully"
    }
    ```

### Comments

#### Add Comment

- **URL:** `/addComment/:projectId/:taskId`
- **Method:** `POST`
- **Headers:**
  - `Authorization: Bearer <jwt-token>`
- **Request Body:**
  ```json
  {
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

#### Get Comments for a Task

- **URL:** `/getComments/:projectId/:taskId`
- **Method:** `GET`
- **Headers:**
  - `Authorization: Bearer <jwt-token>`
- **Response:**
  - **Success (200):**
    ```json
    [
      {
        "commentId": "unique-comment-id",
        "userId": "user@example.com",
        "text": "This is a comment.",
        "timestamp": "YYYY-MM-DD HH:MM:SS"
      }
    ]
    ```
