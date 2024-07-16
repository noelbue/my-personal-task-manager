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
      <button @click="addTask" class="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-700">Add Task</button>
    </div>
    <ul v-if="tasks.length" class="bg-white shadow rounded-lg divide-y divide-gray-200">
      <li v-for="task in tasks" :key="task.id" class="flex items-center justify-between p-4">
        <div class="flex items-center">
          <input type="checkbox" :checked="task.completed" @change="toggleTaskCompletion(task)"
            class="mr-2 form-checkbox h-5 w-5 text-blue-600" />
          <span v-if="!task.isEditing" :class="{ 'line-through': task.completed }">
            {{ task.title }} - Priority: {{ getPriorityText(task.priority) }}
          </span>
          <input v-else v-model="task.editTitle" class="border p-1 mr-2" />
          <select v-if="task.isEditing" v-model="task.editPriority" class="border p-1 mr-2">
            <option value="1">Low</option>
            <option value="2">Medium</option>
            <option value="3">High</option>
          </select>
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
    };
  },
  mounted() {
    this.fetchTasks();
  },
  methods: {
    async fetchTasks() {
      const response = await fetch('/api/tasks');
      const data = await response.json();
      this.tasks = data.tasks.map(task => ({ ...task, isEditing: false, editTitle: task.title, editPriority: task.priority }));
    },
    async addTask() {
      if (!this.newTaskTitle) return;
      const newTask = {
        title: this.newTaskTitle,
        completed: false,
        priority: parseInt(this.newTaskPriority),
      };
      const response = await fetch('/api/tasks', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newTask),
      });
      const data = await response.json();
      this.tasks.push({ ...newTask, id: data.id, isEditing: false, editTitle: newTask.title, editPriority: newTask.priority });
      this.newTaskTitle = '';
      this.newTaskPriority = '1';
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
    },
    async saveTaskEdit(task) {
      const updatedTask = { ...task, title: task.editTitle, priority: parseInt(task.editPriority), isEditing: false };
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