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
```
git clone git@github.com:noelbuergler-iustudy/PJWD_P2_S.git
cd PJWD_P2_S
```
3. Install dependencies:
```
npm install
cd frontend
npm install
npm install -D tailwindcss postcss autoprefixer
npx tailwindcss init -p
```

### Run it
To start the backend:
```
cd PJWD_P2_S
node server.js
```
To start the frontend:
```
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

### Tasks
1. `GET /api/tasks`
    - Retrieves all tasks
    - Response: JSON array of task objects
2. `POST /api/tasks`
    - Creates a new task
    - Request body: JSON object with task details (title, completed, priority, deadline, tags)
    - Response: JSON object with the new task's ID
3. `PUT /api/tasks/:id`
    - Updates an existing task
    - URL parameter: task ID
    - Request body: JSON object with updated task details
    - Response: JSON object confirming the number of changes
4. `DELETE /api/tasks/:id`
    - Deletes a task
    - URL parameter: task ID
    - Response: JSON object confirming the number of changes

### Tags
1. `GET /api/tags`
    - Retrieves all tags
    - Response: JSON array of tag objects
2. `POST /api/tags`
    - Creates a new tag
    - Request body: JSON object with tag details (name, color)
    - Response: JSON object with the new tag's ID
3. `DELETE /api/tags/:id`
    - Deletes a tag
    - URL parameter: tag ID
    - Response: JSON object confirming the number of changes

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