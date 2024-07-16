<template>
  <div>
    <h1 class="text-2xl font-bold mb-4">Task List</h1>
    <div class="mb-4">
      <input v-model="newTaskTitle" placeholder="New task title" class="border p-2 mr-2" />
      <button @click="addTask" class="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-700">Add Task</button>
    </div>
    <ul v-if="tasks.length" class="bg-white shadow rounded-lg divide-y divide-gray-200">
      <li v-for="task in tasks" :key="task.id" class="flex items-center justify-between p-4">
        <div class="flex items-center">
          <input type="checkbox" :checked="task.completed" @change="toggleTaskCompletion(task)"
            class="mr-2 form-checkbox h-5 w-5 text-blue-600" />
          <span :class="{ 'line-through': task.completed }">{{ task.title }}</span>
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
    };
  },
  mounted() {
    this.fetchTasks();
  },
  methods: {
    async fetchTasks() {
      const response = await fetch('/api/tasks');
      const data = await response.json();
      this.tasks = data.tasks;
    },
    async addTask() {
      if (!this.newTaskTitle) return;
      const newTask = {
        title: this.newTaskTitle,
        completed: false,
      };
      const response = await fetch('/api/tasks', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(newTask),
      });
      const data = await response.json();
      this.tasks.push({ ...newTask, id: data.id });
      this.newTaskTitle = '';
    },
    async toggleTaskCompletion(task) {
      const updatedTask = { ...task, completed: !task.completed };
      await fetch(`/api/tasks/${task.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(updatedTask),
      });
      task.completed = !task.completed;
    },
  },
};
</script>

<style scoped>
.line-through {
  text-decoration: line-through;
}
</style>