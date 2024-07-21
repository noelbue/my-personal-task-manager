# Personal Task Manager
The "Personal Task Manager" is a web application developed to manage daily tasks. It provides a straightforward interface to track tasks efficiently.

## Table of Contents
- [Features](#features)
- [Usage](#usage)
- [Recent Updates](#recent-updates)
- [Target User Group](#target-user-group)
- [Benefits of the Application](#benefits-of-the-application)
- [Technical Components](#technical-components)
- [High-Level Architecture Diagram](#high-level-architecture-diagram)
- [Setup and Installation](#setup-and-installation)
- [API Endpoints](#api-endpoints)

## Features
- Create, edit, duplicate, and delete tasks
- Mark tasks as complete or incomplete
- Set task priorities (Low, Medium, High)
- Add, edit, and delete tags for better task organization
- Sort tasks by title, priority, deadline, or creation date
- Filter tasks by completion status and tags
- Customizable background color
- Search functionality for tasks
- "Due Soon" indicator for tasks approaching their deadline
- Visual feedback for task editing

## Usage
1. Click the '+' button to open the 'Add New Task' form.
2. Add a new task by entering a title, selecting a priority, setting a deadline, and optionally adding tags.
3. Edit a task by clicking the edit icon, modifying the details, and clicking the save icon.
4. Duplicate a task by clicking the clone icon.
5. Delete a task by clicking the trash icon.
6. Mark a task as complete or incomplete by clicking the checkbox next to it.
7. Sort tasks by clicking on the column headers (Title, Priority, Deadline).
8. Filter tasks using the dropdown menu or by clicking on tags in the tag filter section.
9. Customize the background color using the color picker in the bottom left corner.
10. Manage tags by clicking the "Manage Tags" button.
11. Use the search bar to find tasks by title or tags.
12. Look for the "Due Soon" badge on tasks that are approaching their deadline (within 3 days).

## Recent Updates
- Implemented column sorting with clickable headers
- Added task duplication feature
- Improved tag management with creation, editing, and deletion capabilities
- Enhanced tag filtering for tasks
- Introduced background color customization
- Enhanced UI with Font Awesome icons and toast notifications
- Added search functionality for tasks
- Implemented "Due Soon" indicator for tasks nearing their deadline
- Added visual feedback for task editing

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
```bash
git clone git@github.com:noelbuergler-iustudy/PJWD_P2_S.git
cd PJWD_P2_S
```
3. Install dependencies:
```bash
npm install
cd frontend
npm install
npm install -D tailwindcss postcss autoprefixer
npx tailwindcss init -p
```

### Run it
To start the backend:
```bash
cd PJWD_P2_S
node server.js
```
To start the frontend:
```bash
cd PJWD_P2_S/frontend
npm run serve
```

### Dependencies
- Express.js
- SQLite3
- Vue.js
- Tailwind CSS
- vue-toast-notification
- @fortawesome/vue-fontawesome
- @fortawesome/fontawesome-svg-core
- @fortawesome/free-solid-svg-icons

Make sure to have Node.js and npm installed on your system before starting the setup process.

## API Endpoints
The server provides the following RESTful API endpoints:

### Tags
1. `GET /api/tags`
    - Retrieves all tags
    - Response: JSON array of tag objects
    ```bash
    curl -X GET http://localhost:3000/api/tags
    ```
    Sample response:
    ```json
    {"tags":[{"id":1,"name":"Sample Tag","color":"#E6F3FF"}]}
    ```

2. `POST /api/tags`
    - Creates a new tag
    - Request body: JSON object with tag details (name, color)
    - Response: JSON object with the new tag's ID
    ```bash
    curl -X POST http://localhost:3000/api/tags \
    -H "Content-Type: application/json" \
    -d '{"name":"Work","color":"#FF5733"}'
    ```
    Sample response:
    ```json
    {"id":2,"name":"Work","color":"#FF5733"}
    ```

3. `DELETE /api/tags/:id`
    - Deletes a tag
    - URL parameter: tag ID
    - Response: JSON object confirming the number of changes
    ```bash
    curl -X DELETE http://localhost:3000/api/tags/2
    ```
    Sample response:
    ```json
    {"changes":1}
    ```

### Tasks
1. `GET /api/tasks`
    - Retrieves all tasks
    - Response: JSON array of task objects
    ```bash
    curl -X GET http://localhost:3000/api/tasks
    ```
    Sample response:
    ```json
    {"tasks":[{"id":1,"title":"Task","completed":0,"priority":1,"deadline":"2024-07-20","creationDate":"2024-07-20T05:03:06.185Z","tags":[]}]}
    ```

2. `POST /api/tasks`
    - Creates a new task
    - Request body: JSON object with task details (title, completed, priority, deadline, tags)
    - Response: JSON object with the new task's ID
    - Note: Only existing tags can be assigned to a task
    ```bash
    curl -X POST http://localhost:3000/api/tasks \
    -H "Content-Type: application/json" \
    -d '{"title":"Complete project","completed":false,"priority":2,"deadline":"2024-12-31","tags":["Sample Tag"]}'
    ```
    Sample response:
    ```json
    {"id":2}
    ```

3. `PUT /api/tasks/:id`
    - Updates an existing task
    - URL parameter: task ID
    - Request body: JSON object with updated task details
    - Response: JSON object confirming the number of changes
    ```bash
    curl -X PUT http://localhost:3000/api/tasks/2 \
    -H "Content-Type: application/json" \
    -d '{"title":"Updated task title","completed":true,"priority":3,"deadline":"2024-11-30","tags":["Sample Tag"]}'
    ```
    Sample response:
    ```json
    {"changes":1}
    ```

4. `DELETE /api/tasks/:id`
    - Deletes a task
    - URL parameter: task ID
    - Response: JSON object confirming the number of changes
    ```bash
    curl -X DELETE http://localhost:3000/api/tasks/2
    ```
    Sample response:
    ```json
    {"changes":1}
    ```

Note: When creating or updating tasks, only existing tags can be assigned. If a non-existent tag is provided, it will be ignored.

Each task object includes:
- id: Unique identifier (auto-generated)
- title: Task description (required)
- completed: Boolean indicating completion status
- priority: Integer representing task priority
- deadline: Date string for the task due date
- creationDate: Date string when the task was created
- tags: Array of strings for categorizing tasks

Each tag object includes:
- id: Unique identifier (auto-generated)
- name: Tag name (required, unique)
- color: Color code for the tag (e.g., "#E6F3FF")

The server uses SQLite for data storage, with the database created in memory for this implementation.

## Test Cases

To ensure the reliability and correctness of the Personal Task Manager, the following test cases have been implemented:

### Frontend Tests

1. **Task Creation**
   - Input: New task details (title, priority, deadline, tags)
   - Expected Output: New task appears in the task list
   - Test Steps:
     1. Click the '+' button to open the 'Add New Task' form
     2. Fill in task details
     3. Click 'Add Task'
     4. Verify the new task appears in the list

2. **Task Editing**
   - Input: Updated task details
   - Expected Output: Task details are updated in the list
   - Test Steps:
     1. Click the edit icon on an existing task
     2. Modify task details
     3. Click the save icon
     4. Verify the task details are updated in the list

3. **Task Deletion**
   - Input: Task to be deleted
   - Expected Output: Task is removed from the list
   - Test Steps:
     1. Click the delete icon on an existing task
     2. Confirm deletion in the prompt
     3. Verify the task is removed from the list

4. **Task Filtering**
   - Input: Filter criteria (e.g., completed tasks, specific tag)
   - Expected Output: Only tasks meeting the criteria are displayed
   - Test Steps:
     1. Select a filter option or click on a tag
     2. Verify only relevant tasks are displayed

5. **Task Sorting**
   - Input: Sort criteria (e.g., by title, priority, deadline)
   - Expected Output: Tasks are sorted according to the selected criteria
   - Test Steps:
     1. Click on a column header to sort
     2. Verify tasks are arranged in the correct order

### Backend Tests

1. **GET /api/tasks**
   - Input: GET request to /api/tasks
   - Expected Output: JSON array of all tasks
   - Test: Use curl or Postman to send a GET request and verify the response

2. **POST /api/tasks**
   - Input: POST request with new task data
   - Expected Output: JSON object with the new task's ID
   - Test: Use curl or Postman to send a POST request with task data and verify the response

3. **PUT /api/tasks/:id**
   - Input: PUT request with updated task data
   - Expected Output: JSON object confirming the number of changes
   - Test: Use curl or Postman to send a PUT request with updated task data and verify the response

4. **DELETE /api/tasks/:id**
   - Input: DELETE request with task ID
   - Expected Output: JSON object confirming the number of changes
   - Test: Use curl or Postman to send a DELETE request with a task ID and verify the response

### Integration Tests

1. **End-to-End Task Management**
   - Test the full lifecycle of a task from creation to deletion
   - Verify that frontend actions correctly interact with the backend API

2. **Data Persistence**
   - Create multiple tasks, refresh the page, and verify all tasks are still present
   - Test that task updates persist after page reloads

These test cases cover the core functionalities of the Personal Task Manager. They ensure that the application behaves correctly for various user interactions and API operations.