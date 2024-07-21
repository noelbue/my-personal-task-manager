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

3. `PUT /api/tags/:id`
    - Updates an existing tag
    - URL parameter: tag ID
    - Request body: JSON object with updated tag details (name, color)
    - Response: JSON object confirming the number of changes
    ```bash
    curl -X PUT http://localhost:3000/api/tags/1 \
    -H "Content-Type: application/json" \
    -d '{"name":"Updated Tag","color":"#00FF00"}'
    ```
    Sample response:
    ```json
    {"changes":1}
    ```

4. `DELETE /api/tags/:id`
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
   - Action: Click '+' button, enter "Complete project report" as title, select "High" priority, set deadline to tomorrow, add tag "Work"
   - Expected Result: New task "Complete project report" appears in the task list with high priority, tomorrow's date, and "Work" tag

2. **Task Editing**
   - Action: Click edit icon on "Complete project report" task, change title to "Finish project report", change priority to "Medium", add tag "Urgent"
   - Expected Result: Task updates in the list with new title "Finish project report", medium priority, and both "Work" and "Urgent" tags

3. **Task Duplication**
   - Action: Click duplicate icon on "Finish project report" task
   - Expected Result: New task appears in the list with title "Finish project report (Copy)" and all other details matching the original task

4. **Task Deletion**
   - Action: Click delete icon on "Finish project report (Copy)" task, confirm deletion
   - Expected Result: "Finish project report (Copy)" task is removed from the task list

5. **Task Filtering**
   - Action: Click on "Work" tag in the filter section
   - Expected Result: Only tasks with the "Work" tag are displayed in the task list

6. **Task Sorting**
   - Action: Click on "Priority" column header
   - Expected Result: Tasks are sorted by priority (High to Low)

7. **Task Search**
   - Action: Type "report" in the search bar
   - Expected Result: Only tasks containing "report" in their title or tags are displayed

8. **Tag Creation**
   - Action: Click "Manage Tags", enter "Personal" as tag name, select color blue, click "Add Tag"
   - Expected Result: New tag "Personal" with blue color appears in the tag list

9. **Tag Editing**
   - Action: In tag management, click edit icon on "Work" tag, change color to red
   - Expected Result: "Work" tag color updates to red in the tag list and on all associated tasks

10. **Tag Deletion**
    - Action: In tag management, click delete icon on "Personal" tag, confirm deletion
    - Expected Result: "Personal" tag is removed from the tag list and from all tasks that had this tag

11. **Background Color Customization**
    - Action: Use the color picker in the bottom left to select a new background color
    - Expected Result: Application background changes to the selected color

12. **"Due Soon" Indicator**
    - Action: Create a new task "Urgent meeting" with deadline set to 2 days from now
    - Expected Result: "Urgent meeting" task appears in the list with a "Due Soon" indicator

### Backend Tests

1. `GET /api/tasks`
   - Action: Send GET request to /api/tasks
   - Expected Result: JSON array of all tasks is returned

2. `POST /api/tasks`
   - Action: Send POST request to /api/tasks with new task data including tags
   - Expected Result: JSON object with the new task's ID is returned

3. `PUT /api/tasks/:id`
   - Action: Send PUT request to /api/tasks/:id with updated task data including modified tags
   - Expected Result: JSON object confirming the number of changes is returned

4. `DELETE /api/tasks/:id`
   - Action: Send DELETE request to /api/tasks/:id
   - Expected Result: JSON object confirming the number of changes is returned

5. `GET /api/tags`
   - Action: Send GET request to /api/tags
   - Expected Result: JSON array of all tags is returned

6. `POST /api/tags`
   - Action: Send POST request to /api/tags with new tag data
   - Expected Result: JSON object with the new tag's ID, name, and color is returned

7. `PUT /api/tags/:id`
   - Action: Send PUT request to /api/tags/:id with updated tag data
   - Expected Result: JSON object confirming the number of changes is returned

8. `DELETE /api/tags/:id`
   - Action: Send DELETE request to /api/tags/:id
   - Expected Result: JSON object confirming the number of changes is returned

### Integration Tests

1. **End-to-End Task Management**
   - Action: 
     1. Create a task "Buy groceries" with "Shopping" tag
     2. Edit it to add "Urgent" tag
     3. Mark as complete
     4. Duplicate the task
     5. Delete the original task
   - Expected Result: 
     1. Task is created with correct details
     2. Task is updated with new tag
     3. Task is marked as complete
     4. A duplicate task appears with all details of the original
     5. Original task is removed from the list, duplicate remains

2. **Data Persistence**
   - Action: Create multiple tasks with various tags, refresh the page
   - Expected Result: All previously created tasks and tags are still present and correctly displayed

3. **Tag Management Impact**
   - Action: 
     1. Create two tasks with a "Work" tag
     2. Edit the "Work" tag to change its color
     3. Delete the "Work" tag
   - Expected Result: 
     1. Both tasks show the "Work" tag
     2. The color change is reflected on both tasks
     3. The "Work" tag is removed from both tasks

These test cases cover the core functionalities of the Personal Task Manager, including task and tag operations, filtering, sorting, searching, and UI customization. They ensure that the application behaves correctly for various user interactions and API operations.