# Personal Task Manager Introduction
The "Personal Task Manager" is a web application developed to manage daily tasks. It provides a straightforward interface to track tasks efficiently.

## Target User Group
The application is designed for individuals like students, freelancers, and professionals who need a simple tool to organize their daily tasks.

## Benefits of the Application
* **Increased Productivity:** By clearly listing tasks, the application helps prioritize daily activities.
* **Organization:** Users can categorize tasks by priority and deadlines, aiding in focus and task management.
* **Time Management:** The tool allows for scheduling tasks throughout the day, promoting efficient time use.

## Technical Components
* **Front-End:**
    * **Vue.js:** Chosen for its ease of integrating reactive elements, facilitating real-time UI updates without page reloads.
    * **TailwindCSS:** Selected for its utility-first approach to apply styles directly, simplifying responsive design.
    * **JavaScript:** Used to handle interactions such as adding, deleting, and marking tasks as complete.
* **Back-End:**
    * **Express.js:** Utilized tomanage API requests, including task additions, updates, and deletions.
    * **SQLite:** Chosen for its simplicity and effectiveness in managing data storage for small scale applications.

## High-Level Architecture Diagram (created with Structurizr)
![High-Level Architecture Diagram (created with Structurizr)](/docs/images/structurizr-93763-Container-001.png)

## Setup and Installation
To run this project locally, follow these steps:
1. Ensure you have Node.js and npm installed on your system.
2. Clone the repository:
```
git clone git@github.com:noelbuergler-iustudy/PJWD_P2_S.git
cd [repository-name]
```
3. Install backend dependencies:
```
npm install
```
4. Set up the frontend:
```
cd frontend
npm install
```
5. Install global dependencies:
```
npm install -g @vue/cli
```
6. Set up Tailwind CSS:
```
npm install -D tailwindcss postcss autoprefixer
npx tailwindcss init -p
```

### Dependencies

#### Backend:
- Express.js
- SQLite3

#### Frontend:
- Vue.js
- Tailwind CSS

Make sure to have Node.js and npm installed on your system before starting the setup process.

## API Endpoints
The server provides the following RESTful API endpoints:
1. GET /api/tasks
    - Retrieves all tasks
    - Response: JSON array of task objects
2. POST /api/tasks
    - Creates a new task
    - Request body: JSON object with task details (title, completed, priority, deadline, tags)
    - Response: JSON object with the new task's ID
3. PUT /api/tasks/:id
    - Updates an existing task
    - URL parameter: task ID
    - Request body: JSON object with updated task details
    - Response: JSON object confirming the number of changes
4. DELETE /api/tasks/:id
    - Deletes a task
    - URL parameter: task ID
    - Response: JSON object confirming the number of changes

Each task object includes:
- id: Unique identifier (auto-generated)
- title: Task description (required)
- completed: Boolean indicating completion status
- priority: Integer representing task priority
- deadline: Date string for the task due date
- creationDate: Date string when the task was created
- tags: Array of strings for categorizing tasks

The server uses SQLite for data storage, with the database created in memory for this implementation.