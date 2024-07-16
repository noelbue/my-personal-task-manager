<template>
  <div>
    <h1 class="text-2xl font-bold mb-4">Task List</h1>
    <ul v-if="tasks.length" class="bg-white shadow rounded-lg divide-y divide-gray-200">
      <li v-for="task in tasks" :key="task.id" class="flex items-center justify-between p-4">
        <span>{{ task.title }}</span>
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
  },
};
</script>