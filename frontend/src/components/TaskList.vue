<template>
  <div>
    <h1 class="text-2xl font-bold mb-4">Task List</h1>
    <div class="mb-4">
      <input v-model="newTaskTitle" placeholder="New task title" class="border p-2 mr-2" />
      <select v-model="newTaskPriority" class="border p-2 mr-2">
        <option value="1">Low</option>
        <option value="2">Medium</option>
        <option value="3">High</option>
      </select>
      <input v-model="newTaskTag" placeholder="Add tag" class="border p-2 mr-2" />
      <button @click="addTask" class="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-700">Add Task</button>
    </div>
    <div class="mb-4">
      <label class="mr-2">Sort by:</label>
      <select v-model="sortBy" class="border p-2 mr-2">
        <option value="title">Title</option>
        <option value="priority">Priority</option>
        <option value="creationDate">Creation Date</option>
      </select>
      <label class="mr-2">Filter:</label>
      <select v-model="filterBy" class="border p-2 mr-2">
        <option value="all">All</option>
        <option value="completed">Completed</option>
        <option value="active">Active</option>
      </select>
    </div>
    <ul v-if="filteredAndSortedTasks.length" class="bg-white shadow rounded-lg divide-y divide-gray-200">
      <li v-for="task in filteredAndSortedTasks" :key="task.id" class="flex items-center justify-between p-4">
        <div class="flex items-center">
          <input type="checkbox" :checked="task.completed" @change="toggleTaskCompletion(task)"
            class="mr-2 form-checkbox h-5 w-5 text-blue-600" />
          <span v-if="!task.isEditing" :class="{ 'line-through': task.completed }">
            {{ task.title }} - Priority: {{ getPriorityText(task.priority) }}
            <span v-for="tag in task.tags" :key="tag" class="ml-2 bg-gray-200 px-2 py-1 rounded-full text-sm">{{ tag }}</span>
          </span>
          <input v-else v-model="task.editTitle" class="border p-1 mr-2" />
          <select v-if="task.isEditing" v-model="task.editPriority" class="border p-1 mr-2">
            <option value="1">Low</option>
            <option value="2">Medium</option>
            <option value="3">High</option>
          </select>
          <input v-if="task.isEditing" v-model="task.editTag" placeholder="Add tag" class="border p-1 mr-2" />
        </div>
        <div>
          <button v-if="!task.isEditing" @click="editTask(task)" class="text-blue-500 hover:text-blue-700 mr-2">Edit</button>
          <button v-if="task.isEditing" @click="saveTaskEdit(task)" class="text-green-500 hover:text-green-700 mr-2">Save</button>
          <button v-if="task.isEditing" @click="cancelTaskEdit(task)" class="text-red-500 hover:text-red-700 mr-2">Cancel</button>
          <button @click="deleteTask(task.id)" class="text-red-500 hover:text-red-700">Delete</button>
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
      newTaskPriority: '1',
      newTaskTag: '',
      sortBy: 'creationDate',
      filterBy: 'all',
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
      return filteredTasks.sort((a, b) => {
        if (this.sortBy === 'title') {
          return a.title.localeCompare(b.title);
        } else if (this.sortBy === 'priority') {
          return b.priority - a.priority;
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
        editTag: '',
        tags: task.tags || []
      }));
    },
    async addTask() {
      if (!this.newTaskTitle) return;
      const newTask = {
        title: this.newTaskTitle,
        completed: false,
        priority: parseInt(this.newTaskPriority),
        tags: this.newTaskTag ? [this.newTaskTag] : [],
        creationDate: new Date().toISOString()
      };
      const response = await fetch('/api/tasks', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newTask),
      });
      const data = await response.json();
      this.tasks.push({ ...newTask, id: data.id, isEditing: false, editTitle: newTask.title, editPriority: newTask.priority, editTag: '' });
      this.newTaskTitle = '';
      this.newTaskPriority = '1';
      this.newTaskTag = '';
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
      task.editTag = '';
    },
    async saveTaskEdit(task) {
      const updatedTask = { 
        ...task, 
        title: task.editTitle, 
        priority: parseInt(task.editPriority), 
        isEditing: false,
        tags: task.editTag ? [...task.tags, task.editTag] : task.tags
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
      await fetch(`/api/tasks/${taskId}`, { method: 'DELETE' });
      this.tasks = this.tasks.filter(task => task.id !== taskId);
    },
    getPriorityText(priority) {
      switch (priority) {
        case 1: return 'Low';
        case 2: return 'Medium';
        case 3: return 'High';
        default: return 'Unknown';
      }
    },
  },
};
</script>

<style scoped>
.line-through {
  text-decoration: line-through;
}
</style>