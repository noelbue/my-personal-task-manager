<template>
  <div class="container mx-auto p-4">

    <!-- Header Section -->
    <!-- This section contains the main title and the button to add a new task -->
    <div class="flex justify-between items-center mb-4">
      <h1 class="text-3xl font-bold">Personal Task Manager</h1>
      <button @click="toggleAddTask" class="bg-blue-500 text-white w-12 h-12 flex items-center justify-center rounded-full hover:bg-blue-700 text-2xl font-bold">+</button>
    </div>

    <!-- Tag Management Section -->
    <!-- This section allows users to manage (add, edit, delete) tags -->
    <div class="mb-4 text-left">

      <!-- Toggle button for showing/hiding tag management -->
      <button @click="toggleManageTags" class="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-700 mb-2">
        {{ showManageTags ? 'Hide' : 'Manage' }} Tags
      </button>

      <!-- Tag management form (visible when showManageTags is true) -->
      <div v-if="showManageTags">
        <div :style="{ borderBottom: '1px solid black', margin: '20px 0' }"></div>
        <h3 class="text-xl font-bold mb-2 text-left">Manage Tags</h3>
        <div class="flex mb-2 items-center">
          <input v-model="newTagName" placeholder="New tag name" class="border p-2 mr-4" />
          <input type="color" v-model="newTagColor" class="w-10 h-10 p-0 border-none cursor-pointer rounded-full mr-4" />
          <button @click="addTag" class="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-700">Add Tag</button>
        </div>
        <div class="flex flex-wrap">
          <div v-for="tag in tags" :key="tag.name" class="mr-2 mb-2">
            <span v-if="!tag.isEditing" 
                  :style="{ backgroundColor: tag.color, color: getTextColor(tag.color) }" 
                  class="px-2 py-1 rounded-full text-sm">
              {{ tag.name }}
              <button @click="editTag(tag)" class="ml-1">
                <font-awesome-icon :icon="['fas', 'pen']" />
              </button>
              <button @click="deleteTag(tag)" class="ml-1">
                <font-awesome-icon :icon="['fas', 'trash']" />
              </button>
            </span>
            <div v-else class="flex">
              <input v-model="tag.name" class="border p-1 w-24" />
              <input type="color" v-model="tag.color" class="w-8 h-8 p-0 border-none cursor-pointer rounded-full" />
              <button @click="saveTagEdit(tag)" class="bg-blue-500 text-white px-2 py-1 rounded hover:bg-blue-700">Save</button>
            </div>
          </div>
        </div>
        <div :style="{ borderBottom: '1px solid black', margin: '20px 0' }"></div>
      </div>

      <!-- Search Input -->
      <!-- Allows users to search for tasks by title or tags -->
      <div class="mb-4">
        <input v-model="searchQuery" placeholder="Search tasks..." class="border p-2 w-full rounded" />
      </div>

    </div>

    <!-- Add New Task Form -->
    <!-- This form is displayed when the user clicks the add task button -->
    <div v-if="showAddTaskForm" class="mb-8 p-6 bg-gray-100 rounded-lg shadow-md text-left">
      <h2 class="text-2xl font-bold mb-4">Add New Task</h2>
      <input v-model="newTask.title" placeholder="Task title" class="border p-2 w-full mb-3 rounded" />
      <select v-model="newTask.priority" class="border p-2 w-full mb-3 rounded">
        <option value="" disabled selected>Select priority</option>
        <option value="1">Low ⚪</option>
        <option value="2">Medium 🟡</option>
        <option value="3">High 🔴</option>
      </select>
      <input type="date" v-model="newTask.deadline" class="border p-2 w-full mb-3 rounded" />
      <div class="mb-3">
        <h4 class="font-bold mb-1">Tags:</h4>
        <div v-if="tags.length > 0" class="flex flex-wrap">
          <span v-for="tag in tags" :key="tag.name" 
                @click="toggleTaskTag(newTask.tags, tag.name)"
                :style="{ backgroundColor: tag.color, color: getTextColor(tag.color) }"
                :class="{'opacity-30': !newTask.tags.includes(tag.name)}"
                class="px-2 py-1 rounded-full text-sm mr-2 mb-2 cursor-pointer">
            {{ tag.name }}
          </span>
        </div>
        <div v-else class="text-gray-500 italic">
          No tags available. You can create tags in the Manage Tags section.
        </div>
      </div>
      <button @click="addTask" class="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-700 w-full transition duration-300">Add Task</button>
    </div>

    <!-- Task Filtering and Sorting Controls -->
    <!-- These controls allow users to filter tasks by status and sort them -->
    <div class="mb-6 flex flex-wrap justify-between items-center">

      <!-- Dropdown for filtering tasks by completion status -->
      <div class="mb-2 sm:mb-0">
        <label class="mr-2 font-semibold">Filter:</label>
        <select v-model="filterBy" class="border p-2 rounded">
          <option value="all">All</option>
          <option value="completed">Completed</option>
          <option value="active">Active</option>
        </select>
      </div>
    </div>

    <!-- Tag Filtering Section -->
    <!-- Allows users to filter tasks by tags -->
    <div class="mb-4 text-left">
      <label class="font-semibold block mb-2">Filter by tags:</label>
      <div class="flex flex-wrap">
        <span v-for="tag in uniqueTags" :key="tag" 
              @click="toggleTagFilter(tag)"
              :class="{'bg-blue-500 text-white': tagFilters.includes(tag), 'bg-gray-200': !tagFilters.includes(tag)}"
              class="px-2 py-1 rounded-full text-sm mr-2 mb-2 cursor-pointer">
          {{ tag }}
        </span>
      </div>
    </div>

    <!-- Task List Header -->
    <!-- Displays column headers for the task list and allows sorting -->
    <div class="grid grid-cols-custom gap-4 font-bold mb-2">
      <div class="text-left cursor-pointer" @click="toggleSort('title')">
        Title
        <span class="ml-1">{{ getSortIcon('title') }}</span>
      </div>
      <div class="text-center cursor-pointer" @click="toggleSort('priority')">
        Priority
        <span class="ml-1">{{ getSortIcon('priority') }}</span>
      </div>
      <div class="text-center cursor-pointer" @click="toggleSort('deadline')">
        Deadline
        <span class="ml-1">{{ getSortIcon('deadline') }}</span>
      </div>
      <div class="text-center">Tags</div>
      <div class="text-right">Actions</div>
    </div>

    <!-- Task List -->
    <!-- Displays the list of tasks with transition effects -->
    <transition-group name="list" tag="ul" class="bg-white shadow-lg rounded-lg divide-y divide-gray-200">

      <!-- Each task item -->
      <li v-for="task in filteredAndSortedTasks" :key="task.id" 
        :class="{
          'bg-blue-50 border-2 border-blue-300': task.isEditing,
          'hover:bg-gray-50': !task.isEditing
        }"
        class="p-4 transition duration-150 ease-in-out rounded">

      <!-- Task item content -->
        <div class="grid grid-cols-custom gap-4 items-center">

          <!-- Task title and completion checkbox -->
          <div class="col-span-1 flex items-center">
            <input type="checkbox" :checked="task.completed" @change="toggleTaskCompletion(task)"
              class="mr-3 form-checkbox h-5 w-5 text-blue-600 transition duration-150 ease-in-out" />
            <span v-if="!task.isEditing" :class="{ 'line-through text-gray-500': task.completed }" class="flex-grow text-left">
              {{ task.title }}
              <span v-if="isDueSoon(task.deadline)" 
                    class="ml-2 bg-red-200 text-red-800 rounded-full text-xs inline-flex items-center justify-center w-6 h-6 sm:w-auto sm:h-auto sm:px-2 sm:py-1">
                <span class="hidden sm:inline">Due Soon</span>
                <span class="sm:hidden">!</span>
              </span>
            </span>
            <input v-else v-model="task.editTitle" class="border p-1 mr-2 flex-grow rounded" />
          </div>

          <!-- Task priority -->
          <div class="col-span-1 text-center">
            <span v-if="!task.isEditing">{{ getPriorityEmoji(task.priority) }}</span>
            <select v-else v-model="task.editPriority" class="border p-1 rounded">
              <option value="1">Low ⚪</option>
              <option value="2">Medium 🟡</option>
              <option value="3">High 🔴</option>
            </select>
          </div>

          <!-- Task deadline -->
          <div class="col-span-1 text-center">
            <span v-if="!task.isEditing">{{ formatDate(task.deadline) }}</span>
            <input v-else type="date" v-model="task.editDeadline" class="border p-1 rounded" />
          </div>

          <!-- Task tags -->
          <div class="col-span-1">
            <div v-if="!task.isEditing" class="flex flex-wrap">
              <span v-for="tagName in task.tags" :key="tagName"
                    :style="{ backgroundColor: tags.find(t => t.name === tagName)?.color || '#cccccc', color: getTextColor(tags.find(t => t.name === tagName)?.color) }"
                    class="px-2 py-1 rounded-full text-sm mr-2 mb-2">
                {{ tagName }}
              </span>
            </div>
            <div v-else class="flex flex-wrap">
              <span v-for="tag in tags" :key="tag.name" 
                    @click="toggleTaskTag(task.editTags, tag.name)"
                    :style="{ backgroundColor: tag.color, color: getTextColor(tag.color) }"
                    :class="{'opacity-50': !task.editTags.includes(tag.name)}"
                    class="px-2 py-1 rounded-full text-sm mr-2 mb-2 cursor-pointer">
                {{ tag.name }}
              </span>
            </div>
          </div>

          <!-- Task actions (edit, delete, duplicate) -->
          <div class="col-span-1 flex sm:justify-end">
            <div class="flex flex-col sm:flex-row">
              <button v-if="!task.isEditing" @click="editTask(task)" 
                      :disabled="task.completed"
                      :class="{'opacity-50 cursor-not-allowed': task.completed}"
                      class="text-gray-500 hover:text-blue-700 mb-2 sm:mb-0 sm:mr-2 transition duration-150 ease-in-out">
                <font-awesome-icon :icon="['fas', 'pen']" />
              </button>
              <button v-if="task.isEditing" @click="saveTaskEdit(task)" class="text-green-500 hover:text-green-700 mb-2 sm:mb-0 sm:mr-2 transition duration-150 ease-in-out">
                <font-awesome-icon :icon="['fas', 'check']" />
              </button>
              <button v-if="task.isEditing" @click="cancelTaskEdit(task)" class="text-red-500 hover:text-red-700 mb-2 sm:mb-0 sm:mr-2 transition duration-150 ease-in-out">
                <font-awesome-icon :icon="['fas', 'times']" />
              </button>
              <button v-if="!task.isEditing" @click="duplicateTask(task)" class="text-gray-500 hover:text-blue-700 mb-2 sm:mb-0 sm:mr-2 transition duration-150 ease-in-out">
                <font-awesome-icon :icon="['fas', 'clone']" />
              </button>
              <button v-if="!task.isEditing" @click="deleteTask(task.id)" class="text-gray-500 hover:text-red-700 transition duration-150 ease-in-out">
                <font-awesome-icon :icon="['fas', 'trash']" />
              </button>
            </div>
          </div>
        </div>
    </li>
  </transition-group>

    <!-- Message for when no tasks are available -->
    <div v-if="!filteredAndSortedTasks.length" class="text-center text-gray-500 mt-4">
      No tasks available
    </div>
  </div>

  <!-- Background Color Picker -->
  <!-- Allows users to change the background color of the application -->
  <div class="fixed bottom-4 left-4 flex items-center bg-white p-2 rounded-lg shadow-md">
    <label for="bgColor" class="mr-2 text-sm font-medium text-gray-700">Change background color:</label>
    <input type="color" id="bgColor" v-model="bgColor"
      class="w-8 h-8 p-0 border-none cursor-pointer" />
  </div>
</template>

<script>
/**
 * TaskList component
 * @displayName TaskList
 * @description A comprehensive task management component that allows users to create, edit, delete, and organize tasks with tags, priorities, and deadlines.
 */
export default {
  name: 'TaskList',
  data() {
    return {

      /**
       * Array of task objects
       * @type {Array<Object>}
       */
      tasks: [],

      /**
       * Current sort criteria for tasks
       * @type {string}
       */
      sortBy: 'creationDate',

      /**
       * Current filter criteria for tasks
       * @type {string}
       */
      filterBy: 'all',

      /**
       * Background color of the application
       * @type {string}
       */
      bgColor: localStorage.getItem('bgColor') || '#f3f4f6',

      /**
       * Array of tags used for filtering tasks
       * @type {Array<string>}
       */
      tagFilters: [],

      /**
       * Sort direction (ascending or descending)
       * @type {string}
       */
      sortDirection: 'asc',

      /**
       * Flag to show/hide the add task form
       * @type {boolean}
       */
      showAddTaskForm: false,

      /**
       * Array of tag objects
       * @type {Array<Object>}
       */
      tags: [],

      /**
       * Name for a new tag
       * @type {string}
       */
      newTagName: '',

      /**
       * Color for a new tag
       * @type {string}
       */
      newTagColor: '#E6F3FF',

      /**
       * Object to hold data for a new task
       * @type {Object}
       */
      newTask: {
        title: '',
        priority: '',
        deadline: new Date().toISOString().split('T')[0], // Today's date in YYYY-MM-DD format
        tags: []
      },

      /**
       * Flag to show/hide the tag management section
       * @type {boolean}
       */
      showManageTags: false,

      /**
       * Query string for searching tasks
       * @type {string}
       */
      searchQuery: '',
    };
  },
  computed: {

    /**
     * Filters and sorts tasks based on current criteria
     * @returns {Array<Object>} Filtered and sorted array of tasks
     */
    filteredAndSortedTasks() {
      let filteredTasks = this.tasks;
      if (this.searchQuery.trim()) {
        const query = this.searchQuery.toLowerCase();
        filteredTasks = filteredTasks.filter(task => 
          task.title.toLowerCase().includes(query) ||
          task.tags.some(tag => tag.toLowerCase().includes(query))
        );
      }
      if (this.filterBy === 'completed') {
        filteredTasks = filteredTasks.filter(task => task.completed);
      } else if (this.filterBy === 'active') {
        filteredTasks = filteredTasks.filter(task => !task.completed);
      }
      if (this.tagFilters.length > 0) {
        filteredTasks = filteredTasks.filter(task => 
          this.tagFilters.every(tag => task.tags.includes(tag))
        );
      }
      return filteredTasks.sort((a, b) => {
        let comparison = 0;
        if (this.sortBy === 'title') {
          comparison = a.title.localeCompare(b.title);
        } else if (this.sortBy === 'priority') {
          comparison = b.priority - a.priority;
        } else if (this.sortBy === 'deadline') {
          comparison = new Date(a.deadline) - new Date(b.deadline);
        } else {
          comparison = new Date(b.creationDate) - new Date(a.creationDate);
        }
        return this.sortDirection === 'asc' ? comparison : -comparison;
      });
    },

    /**
     * Computes unique tags from all tasks
     * @returns {Array<string>} Array of unique tag names
     */
    uniqueTags() {
      const allTags = this.tasks.flatMap(task => task.tags);
      return [...new Set(allTags)];
    }
  },
  mounted() {
    /**
     * Lifecycle hook to fetch initial data and set up the component
     */
    this.fetchTasks();
    this.fetchTags();
    document.body.style.backgroundColor = this.bgColor;
  },
  watch: {
    /**
     * Watcher for background color changes
     * @param {string} newColor - The new background color
     */
    bgColor(newColor) {
      document.body.style.backgroundColor = newColor;
      localStorage.setItem('bgColor', newColor);
    },
  },
  methods: {

    /**
     * Fetches tasks from the API
     * @async
     */
    async fetchTasks() {
      try {
        const response = await fetch('/api/tasks');
        const data = await response.json();
        this.tasks = data.tasks.map(task => ({ 
          ...task, 
          isEditing: false, 
          editTitle: task.title, 
          editPriority: task.priority,
          editDeadline: task.deadline,
          tags: task.tags || []
        }));
      } catch (error) {
        console.error('Error fetching tasks:', error);
        this.$toast.error('Failed to fetch tasks. Please try again.', {
          position: 'top-right',
          duration: 3000
        });
      }
    },
    
    /**
     * Adds a new task
     * @async
     */
    async addTask() {
      if (!this.newTask.title || !this.newTask.priority || !this.newTask.deadline) {
        this.$toast.error('Please fill in all required fields.', {
          position: 'top-right',
          duration: 3000
        });
        return;
      }
      const newTask = {
        title: this.newTask.title,
        completed: false,
        priority: parseInt(this.newTask.priority),
        deadline: this.newTask.deadline,
        tags: this.newTask.tags,
        creationDate: new Date().toISOString()
      };
      try {
        const response = await fetch('/api/tasks', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(newTask),
        });
        const data = await response.json();
        this.tasks.push({ ...newTask, id: data.id, isEditing: false, editTitle: newTask.title, editPriority: newTask.priority, editDeadline: newTask.deadline });
        this.newTask = {
          title: '',
          priority: '',
          deadline: new Date().toISOString().split('T')[0],
          tags: []
        };
        this.showAddTaskForm = false;
        this.$toast.success('Task added successfully', {
          position: 'top-right',
          duration: 3000
        });
      } catch (error) {
        console.error('Error adding task:', error);
        this.$toast.error('Failed to add task. Please try again.', {
          position: 'top-right',
          duration: 3000
        });
      }
    },

    /**
     * Toggles the completion status of a task
     * @async
     * @param {Object} task - The task to toggle
     */
    async toggleTaskCompletion(task) {
      const updatedTask = { ...task, completed: !task.completed };
      try {
        await fetch(`/api/tasks/${task.id}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(updatedTask),
        });
        task.completed = !task.completed;
      } catch (error) {
        console.error('Error updating task completion:', error);
        this.$toast.error('Failed to update task. Please try again.', {
          position: 'top-right',
          duration: 3000
        });
      }
    },

    /**
     * Puts a task into edit mode
     * @param {Object} task - The task to edit
     */
    editTask(task) {
      task.isEditing = true;
      task.editTitle = task.title;
      task.editPriority = task.priority;
      task.editDeadline = task.deadline;
      task.editTags = [...task.tags];
    },

    /**
     * Saves edits made to a task
     * @async
     * @param {Object} task - The task being edited
     */
    async saveTaskEdit(task) {
      const updatedTask = { 
        ...task, 
        title: task.editTitle, 
        priority: parseInt(task.editPriority), 
        deadline: task.editDeadline,
        tags: task.editTags,
        isEditing: false,
      };
      try {
        await fetch(`/api/tasks/${task.id}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(updatedTask),
        });
        Object.assign(task, updatedTask);
      } catch (error) {
        console.error('Error saving task edit:', error);
        this.$toast.error('Failed to save task changes. Please try again.', {
          position: 'top-right',
          duration: 3000
        });
      }
    },

    /**
     * Cancels the editing of a task
     * @param {Object} task - The task being edited
     */
    cancelTaskEdit(task) {
      task.isEditing = false;
    },

    /**
     * Deletes a task
     * @async
     * @param {number} taskId - The ID of the task to delete
     */
    async deleteTask(taskId) {
      if (confirm('Are you sure you want to delete this task?')) {
        try {
          await fetch(`/api/tasks/${taskId}`, { method: 'DELETE' });
          this.tasks = this.tasks.filter(task => task.id !== taskId);
        } catch (error) {
          console.error('Error deleting task:', error);
          this.$toast.error('Failed to delete task. Please try again.', {
            position: 'top-right',
            duration: 3000
          });
        }
      }
    },

    /**
     * Returns an emoji based on the task priority
     * @param {number} priority - The priority level
     * @returns {string} An emoji representing the priority
     */
    getPriorityEmoji(priority) {
      switch (parseInt(priority)) {
        case 1: return '⚪';
        case 2: return '🟡';
        case 3: return '🔴';
        default: return '';
      }
    },

    /**
     * Formats a date string
     * @param {string} dateString - The date string to format
     * @returns {string} Formatted date string
     */
    formatDate(dateString) {
      if (!dateString) return 'No deadline';
      const date = new Date(dateString);
      return date.toLocaleDateString();
    },

    /**
     * Duplicates a task
     * @async
     * @param {Object} task - The task to duplicate
     */
    async duplicateTask(task) {
      const duplicatedTask = {
        title: `${task.title} (Copy)`,
        completed: false,
        priority: task.priority,
        deadline: task.deadline,
        tags: [...task.tags],
        creationDate: new Date().toISOString()
      };
      try {
        const response = await fetch('/api/tasks', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(duplicatedTask),
        });
        const data = await response.json();
        this.tasks.push({ ...duplicatedTask, id: data.id, isEditing: false, editTitle: duplicatedTask.title, editPriority: duplicatedTask.priority, editDeadline: duplicatedTask.deadline });
      } catch (error) {
        console.error('Error duplicating task:', error);
        this.$toast.error('Failed to duplicate task. Please try again.', {
            position: 'top-right',
            duration: 3000
        });
      }
    },

    /**
     * Toggles a tag filter
     * @param {string} tag - The tag to toggle in the filter
     */
    toggleTagFilter(tag) {
      const index = this.tagFilters.indexOf(tag);
      if (index === -1) {
        this.tagFilters.push(tag);
      } else {
        this.tagFilters.splice(index, 1);
      }
    },

    /**
     * Toggles the sort direction for a given field
     * @param {string} field - The field to sort by
     */
    toggleSort(field) {
      if (this.sortBy === field) {
        this.sortDirection = this.sortDirection === 'asc' ? 'desc' : 'asc';
      } else {
        this.sortBy = field;
        this.sortDirection = 'asc';
      }
    },

    /**
     * Returns the appropriate sort icon
     * @param {string} field - The field being sorted
     * @returns {string} An emoji representing the sort direction
     */
    getSortIcon(field) {
      if (this.sortBy !== field) return '↕️';
      return this.sortDirection === 'asc' ? '↑' : '↓';
    },

    /**
     * Toggles the visibility of the add task form
     */
    toggleAddTask() {
      this.showAddTaskForm = !this.showAddTaskForm;
    },

    /**
     * Adds a new tag
     * @async
     */
    async addTag() {
      if (this.newTagName.trim() && !this.tags.some(tag => tag.name === this.newTagName.trim())) {
        const newTag = { name: this.newTagName.trim(), color: this.newTagColor };
        try {
          const response = await fetch('/api/tags', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(newTag),
          });
          const data = await response.json();
          this.tags.push({ ...newTag, id: data.id });
          this.newTagName = '';
          this.newTagColor = '#E6F3FF';
        } catch (error) {
          console.error('Error adding tag:', error);
          this.$toast.error('Failed to add tag. Please try again.', {
            position: 'top-right',
            duration: 3000
          });
        }
      } else {
        this.$toast.error('Tag name is empty or already exists', {
          position: 'top-right',
          duration: 3000
        });
      }
    },

    /**
     * Puts a tag into edit mode
     * @param {Object} tag - The tag to edit
     */
    editTag(tag) {
      tag.isEditing = true;
    },

    /**
     * Saves edits made to a tag
     * @param {Object} tag - The tag being edited
     */
    saveTagEdit(tag) {
      if (tag.name.trim() && !this.tags.some(t => t.name === tag.name.trim() && t !== tag)) {
        tag.name = tag.name.trim();
        tag.isEditing = false;
      } else {
        this.$toast.error('Tag name is empty or already exists', {
          position: 'top-right',
          duration: 3000
        });
      }
    },

    /**
     * Deletes a tag
     * @async
     * @param {Object} tagToDelete - The tag to delete
     */
    async deleteTag(tagToDelete) {
      try {
        await fetch(`/api/tags/${tagToDelete.id}`, { method: 'DELETE' });
        this.tags = this.tags.filter(tag => tag.id !== tagToDelete.id);
        this.tasks.forEach(task => {
          task.tags = task.tags.filter(tag => tag !== tagToDelete.name);
          this.updateTask(task);
        });
      } catch (error) {
        console.error('Error deleting tag:', error);
        this.$toast.error('Failed to delete tag. Please try again.', {
          position: 'top-right',
          duration: 3000
        });
      }
    },

    /**
     * Updates a task on the server
     * @async
     * @param {Object} task - The task to update
     */
    async updateTask(task) {
      try {
        await fetch(`/api/tasks/${task.id}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(task),
        });
      } catch (error) {
        console.error('Error updating task:', error);
      }
    },

    /**
     * Determines the text color based on the background color
     * @param {string} backgroundColor - The background color
     * @returns {string} Either 'black' or 'white'
     */
    getTextColor(backgroundColor) {
      if (!backgroundColor) return 'black';
      const r = parseInt(backgroundColor.slice(1, 3), 16);
      const g = parseInt(backgroundColor.slice(3, 5), 16);
      const b = parseInt(backgroundColor.slice(5, 7), 16);
      const brightness = (r * 299 + g * 587 + b * 114) / 1000;
      return brightness > 128 ? 'black' : 'white';
    },

    /**
     * Fetches tags from the API
     * @async
     */
    async fetchTags() {
      try {
        const response = await fetch('/api/tags');
        const data = await response.json();
        this.tags = data.tags;
      } catch (error) {
        console.error('Error fetching tags:', error);
        this.$toast.error('Failed to fetch tags. Please try again.', {
          position: 'top-right',
          duration: 3000
        });
      }
    },

    /**
     * Toggles a tag for a task
     * @param {Array<string>} taskTags - The task's current tags
     * @param {string} tagName - The tag to toggle
     */
    toggleTaskTag(taskTags, tagName) {
      const index = taskTags.indexOf(tagName);
      if (index === -1) {
        taskTags.push(tagName);
      } else {
        taskTags.splice(index, 1);
      }
    },

    /**
     * Toggles the visibility of the tag management section
     */
    toggleManageTags() {
      this.showManageTags = !this.showManageTags;
    },

    /**
     * Checks if a task is due soon (within 3 days)
     * @param {string} deadline - The task's deadline
     * @returns {boolean} True if the task is due soon, false otherwise
     */
    isDueSoon(deadline) {
      if (!deadline) return false;
      const dueDate = new Date(deadline);
      const today = new Date();
      const diffTime = dueDate - today;
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
      return diffDays >= 0 && diffDays <= 3;
    },
  },
};
</script>

<style scoped>
.list-enter-active, .list-leave-active {
  transition: all 0.5s ease;
}
.list-enter-from, .list-leave-to {
  opacity: 0;
  transform: translateX(30px);
}
input[type="color"] {
  -webkit-appearance: none;
  -moz-appearance: none;
  appearance: none;
  width: 40px;
  height: 40px;
  background-color: transparent;
  border: none;
  cursor: pointer;
}
input[type="color"]::-webkit-color-swatch-wrapper {
  padding: 0;
}
input[type="color"]::-webkit-color-swatch {
  border: none;
  border-radius: 50%;
}
input[type="color"]::-moz-color-swatch {
  border: none;
  border-radius: 50%;
}
.grid-cols-custom {
  display: grid;
  grid-template-columns: 3fr 0.5fr 1fr 1fr 0.5fr;
}
</style>