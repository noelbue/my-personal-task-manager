<template>
  <div>
    <h1 class="text-2xl font-bold mb-4">Personal Task Manager</h1>
    <div class="mb-4 p-4 bg-gray-100 rounded-lg">
      <h2 class="text-xl font-bold mb-2">Add New Task</h2>
      <input v-model="newTaskTitle" placeholder="Task title" class="border p-2 w-full mb-2" />
      <select v-model="newTaskPriority" class="border p-2 w-full mb-2">
        <option value="" disabled selected>Select priority</option>
        <option value="1">Low ⚪</option>
        <option value="2">Medium 🟡</option>
        <option value="3">High 🔴</option>
      </select>
      <input type="date" v-model="newTaskDeadline" class="border p-2 w-full mb-2" />
      <div class="flex mb-2">
        <input v-model="newTaskTag" placeholder="Add tag" class="border p-2 flex-grow mr-2" />
        <button @click="addTag" class="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-700">Add Tag</button>
      </div>
      <div class="flex flex-wrap mb-2">
        <span v-for="(tag, index) in newTaskTags" :key="index" class="bg-gray-200 px-2 py-1 rounded-full text-sm mr-2 mb-2">
          {{ tag }}
          <button @click="removeTag(index)" class="ml-1 text-red-500 hover:text-red-700">&times;</button>
        </span>
      </div>
      <button @click="addTask" class="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-700 w-full">Add Task</button>
    </div>
    <div class="mb-4 flex flex-wrap justify-between items-center">
      <div class="mb-2 sm:mb-0">
        <label class="mr-2">Sort by:</label>
        <select v-model="sortBy" class="border p-2">
          <option value="title">Title</option>
          <option value="priority">Priority</option>
          <option value="deadline">Deadline</option>
          <option value="creationDate">Creation Date</option>
        </select>
      </div>
      <div class="mb-2 sm:mb-0">
        <label class="mr-2">Filter:</label>
        <select v-model="filterBy" class="border p-2">
          <option value="all">All</option>
          <option value="completed">Completed</option>
          <option value="active">Active</option>
        </select>
      </div>
      <div>
        <input type="checkbox" v-model="hideCompleted" id="hideCompleted" class="mr-2" />
        <label for="hideCompleted">Hide completed tasks</label>
      </div>
    </div>
    <ul v-if="filteredAndSortedTasks.length" class="bg-white shadow rounded-lg divide-y divide-gray-200">
      <li v-for="task in filteredAndSortedTasks" :key="task.id" class="p-4">
        <div class="flex items-center justify-between">
          <div class="flex items-center flex-grow mr-4">
            <input type="checkbox" :checked="task.completed" @change="toggleTaskCompletion(task)"
              class="mr-2 form-checkbox h-5 w-5 text-blue-600" />
            <span v-if="!task.isEditing" :class="{ 'line-through': task.completed }" class="flex-grow">
              {{ task.title }} {{ getPriorityEmoji(task.priority) }}
              <span class="text-sm text-gray-500 ml-2">Due: {{ formatDate(task.deadline) }}</span>
            </span>
            <div v-else class="flex items-center flex-grow">
              <input v-model="task.editTitle" class="border p-1 mr-2 flex-grow" />
              <select v-model="task.editPriority" class="border p-1 mr-2">
                <option value="1">Low ⚪</option>
                <option value="2">Medium 🟡</option>
                <option value="3">High 🔴</option>
              </select>
              <input type="date" v-model="task.editDeadline" class="border p-1 mr-2" />
            </div>
          </div>
          <div>
            <button v-if="!task.isEditing" @click="editTask(task)" class="text-blue-500 hover:text-blue-700 mr-2">Edit</button>
            <button v-if="task.isEditing" @click="saveTaskEdit(task)" class="text-green-500 hover:text-green-700 mr-2">Save</button>
            <button v-if="task.isEditing" @click="cancelTaskEdit(task)" class="text-red-500 hover:text-red-700 mr-2">Cancel</button>
            <button @click="deleteTask(task.id)" class="text-red-500 hover:text-red-700">Delete</button>
          </div>
        </div>
        <div class="mt-2 flex flex-wrap">
          <span v-for="tag in task.tags" :key="tag" class="bg-gray-200 px-2 py-1 rounded-full text-sm mr-2 mb-2">{{ tag }}</span>
        </div>
      </li>
    </ul>
    <div v-else>
      <p class="text-center text-gray-500">No tasks available</p>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      tasks: [],
      newTaskTitle: '',
      newTaskPriority: '',
      newTaskDeadline: '',
      newTaskTag: '',
      newTaskTags: [],
      sortBy: 'creationDate',
      filterBy: 'all',
      hideCompleted: false,
    };
  },
  computed: {
    filteredAndSortedTasks() {
      let filteredTasks = this.tasks;
      if (this.filterBy === 'completed') {
        filteredTasks = filteredTasks.filter(task => task.completed);
      } else if (this.filterBy === 'active') {
        filteredTasks = filteredTasks.filter(task => !task.completed);
      }
      if (this.hideCompleted) {
        filteredTasks = filteredTasks.filter(task => !task.completed);
      }
      return filteredTasks.sort((a, b) => {
        if (this.sortBy === 'title') {
          return a.title.localeCompare(b.title);
        } else if (this.sortBy === 'priority') {
          return b.priority - a.priority;
        } else if (this.sortBy === 'deadline') {
          return new Date(a.deadline) - new Date(b.deadline);
        } else {
          return new Date(b.creationDate) - new Date(a.creationDate);
        }
      });
    }
  },
  mounted() {
    this.fetchTasks();
  },
  methods: {
    async fetchTasks() {
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
    },
    addTag() {
      if (this.newTaskTag && !this.newTaskTags.includes(this.newTaskTag)) {
        this.newTaskTags.push(this.newTaskTag);
        this.newTaskTag = '';
      }
    },
    removeTag(index) {
      this.newTaskTags.splice(index, 1);
    },
    async addTask() {
      if (!this.newTaskTitle || !this.newTaskPriority || !this.newTaskDeadline) {
        alert('Please fill in all required fields');
        return;
      }
      const newTask = {
        title: this.newTaskTitle,
        completed: false,
        priority: parseInt(this.newTaskPriority),
        deadline: this.newTaskDeadline,
        tags: this.newTaskTags,
        creationDate: new Date().toISOString()
      };
      const response = await fetch('/api/tasks', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newTask),
      });
      const data = await response.json();
      this.tasks.push({ ...newTask, id: data.id, isEditing: false, editTitle: newTask.title, editPriority: newTask.priority, editDeadline: newTask.deadline });
      this.newTaskTitle = '';
      this.newTaskPriority = '';
      this.newTaskDeadline = '';
      this.newTaskTags = [];
    },
    async toggleTaskCompletion(task) {
      const updatedTask = { ...task, completed: !task.completed };
      await fetch(`/api/tasks/${task.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updatedTask),
      });
      task.completed = !task.completed;
    },
    editTask(task) {
      task.isEditing = true;
      task.editTitle = task.title;
      task.editPriority = task.priority;
      task.editDeadline = task.deadline;
    },
    async saveTaskEdit(task) {
      const updatedTask = { 
        ...task, 
        title: task.editTitle, 
        priority: parseInt(task.editPriority), 
        deadline: task.editDeadline,
        isEditing: false,
      };
      await fetch(`/api/tasks/${task.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updatedTask),
      });
      Object.assign(task, updatedTask);
    },
    cancelTaskEdit(task) {
      task.isEditing = false;
    },
    async deleteTask(taskId) {
      if (confirm('Are you sure you want to delete this task?')) {
        await fetch(`/api/tasks/${taskId}`, { method: 'DELETE' });
        this.tasks = this.tasks.filter(task => task.id !== taskId);
      }
    },
    getPriorityEmoji(priority) {
      switch (parseInt(priority)) {
        case 1: return '⚪';
        case 2: return '🟡';
        case 3: return '🔴';
        default: return '';
      }
    },
    formatDate(dateString) {
      if (!dateString) return 'No deadline';
      const date = new Date(dateString);
      return date.toLocaleDateString();
    },
  },
};
</script>

<style scoped>
.line-through {
  text-decoration: line-through;
}
</style>