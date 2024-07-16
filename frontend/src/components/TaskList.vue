<template>
  <div class="container mx-auto p-4">
    <h1 class="text-3xl font-bold mb-6">Personal Task Manager</h1>
    <div class="mb-8 p-6 bg-gray-100 rounded-lg shadow-md">
      <h2 class="text-2xl font-bold mb-4">Add New Task</h2>
      <input v-model="newTaskTitle" placeholder="Task title" class="border p-2 w-full mb-3 rounded" />
      <select v-model="newTaskPriority" class="border p-2 w-full mb-3 rounded">
        <option value="" disabled selected>Select priority</option>
        <option value="1">Low ⚪</option>
        <option value="2">Medium 🟡</option>
        <option value="3">High 🔴</option>
      </select>
      <input type="date" v-model="newTaskDeadline" class="border p-2 w-full mb-3 rounded" />
      <div class="flex mb-3">
        <input v-model="newTaskTag" placeholder="Add tag" class="border p-2 flex-grow mr-2 rounded" @keyup.enter="addTag" />
        <button @click="addTag" class="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-700 transition duration-300">Add Tag</button>
      </div>
      <div class="flex flex-wrap mb-3">
        <span v-for="(tag, index) in newTaskTags" :key="index" class="bg-blue-100 text-blue-800 px-2 py-1 rounded-full text-sm mr-2 mb-2">
          {{ tag }}
          <button @click="removeTag(index)" class="ml-1 text-red-500 hover:text-red-700">&times;</button>
        </span>
      </div>
      <button @click="addTask" class="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-700 w-full transition duration-300">Add Task</button>
    </div>
    <div class="mb-6 flex flex-wrap justify-between items-center">
      <div class="mb-2 sm:mb-0">
        <label class="mr-2 font-semibold">Sort by:</label>
        <select v-model="sortBy" class="border p-2 rounded">
          <option value="title">Title</option>
          <option value="priority">Priority</option>
          <option value="deadline">Deadline</option>
          <option value="creationDate">Creation Date</option>
        </select>
      </div>
      <div class="mb-2 sm:mb-0">
        <label class="mr-2 font-semibold">Filter:</label>
        <select v-model="filterBy" class="border p-2 rounded">
          <option value="all">All</option>
          <option value="completed">Completed</option>
          <option value="active">Active</option>
        </select>
      </div>
      <div>
        <input type="checkbox" v-model="hideCompleted" id="hideCompleted" class="mr-2" />
        <label for="hideCompleted" class="font-semibold">Hide completed tasks</label>
      </div>
    </div>
    <div class="mb-4">
      <label class="mr-2 font-semibold">Filter by tags:</label>
      <div class="flex flex-wrap">
        <span v-for="tag in uniqueTags" :key="tag" 
              @click="toggleTagFilter(tag)"
              :class="{'bg-blue-500 text-white': tagFilters.includes(tag), 'bg-gray-200': !tagFilters.includes(tag)}"
              class="px-2 py-1 rounded-full text-sm mr-2 mb-2 cursor-pointer">
          {{ tag }}
        </span>
      </div>
    </div>
    <div class="grid grid-cols-5 gap-4 font-bold mb-2">
      <div class="text-left">Title</div>
      <div class="text-center">Priority</div>
      <div class="text-center">Deadline</div>
      <div class="text-center">Tags</div>
      <div class="text-right">Actions</div>
    </div>
    <transition-group name="list" tag="ul" class="bg-white shadow-lg rounded-lg divide-y divide-gray-200">
      <li v-for="task in filteredAndSortedTasks" :key="task.id" class="p-4 hover:bg-gray-50 transition duration-150 ease-in-out">
        <div class="grid grid-cols-5 gap-4 items-center">
          <div class="flex items-center">
            <input type="checkbox" :checked="task.completed" @change="toggleTaskCompletion(task)"
              class="mr-3 form-checkbox h-5 w-5 text-blue-600 transition duration-150 ease-in-out" />
            <span v-if="!task.isEditing" :class="{ 'line-through text-gray-500': task.completed }" class="flex-grow text-left">
              {{ task.title }}
            </span>
            <input v-else v-model="task.editTitle" class="border p-1 mr-2 flex-grow rounded" />
          </div>
          <div>
            <span v-if="!task.isEditing">{{ getPriorityEmoji(task.priority) }}</span>
            <select v-else v-model="task.editPriority" class="border p-1 rounded">
              <option value="1">Low ⚪</option>
              <option value="2">Medium 🟡</option>
              <option value="3">High 🔴</option>
            </select>
          </div>
          <div>
            <span v-if="!task.isEditing">{{ formatDate(task.deadline) }}</span>
            <input v-else type="date" v-model="task.editDeadline" class="border p-1 rounded" />
          </div>
          <div class="flex flex-wrap">
            <span v-for="tag in task.tags" :key="tag" class="bg-gray-200 px-2 py-1 rounded-full text-sm mr-2 mb-2">{{ tag }}</span>
          </div>
          <div class="flex items-center justify-end">
            <button v-if="!task.isEditing" @click="editTask(task)" 
                    :disabled="task.completed"
                    :class="{'opacity-50 cursor-not-allowed': task.completed}"
                    class="text-gray-500 hover:text-blue-700 mr-2 transition duration-150 ease-in-out">
              <font-awesome-icon :icon="['fas', 'pen']" />
            </button>
            <button v-if="task.isEditing" @click="saveTaskEdit(task)" class="text-green-500 hover:text-green-700 mr-2 transition duration-150 ease-in-out">
              <font-awesome-icon :icon="['fas', 'check']" />
            </button>
            <button v-if="task.isEditing" @click="cancelTaskEdit(task)" class="text-red-500 hover:text-red-700 mr-2 transition duration-150 ease-in-out">
              <font-awesome-icon :icon="['fas', 'times']" />
            </button>
            <button v-if="!task.isEditing" @click="duplicateTask(task)" class="text-gray-500 hover:text-blue-700 mr-2 transition duration-150 ease-in-out">
              <font-awesome-icon :icon="['fas', 'clone']" />
            </button>
            <button v-if="!task.isEditing" @click="deleteTask(task.id)" class="text-gray-500 hover:text-red-700 transition duration-150 ease-in-out">
              <font-awesome-icon :icon="['fas', 'trash']" />
            </button>
          </div>
        </div>
      </li>
    </transition-group>
    <div v-if="!filteredAndSortedTasks.length" class="text-center text-gray-500 mt-4">
      No tasks available
    </div>
  </div>
  <div class="fixed bottom-4 left-4 flex items-center bg-white p-2 rounded-lg shadow-md">
    <label for="bgColor" class="mr-2 text-sm font-medium text-gray-700">Change background color:</label>
    <input type="color" id="bgColor" v-model="bgColor"
      class="w-8 h-8 p-0 border-none cursor-pointer" />
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
      bgColor: localStorage.getItem('bgColor') || '#f3f4f6',
      tagFilters: [],
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
      if (this.tagFilters.length > 0) {
        filteredTasks = filteredTasks.filter(task => 
          this.tagFilters.every(tag => task.tags.includes(tag))
        );
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
    },
    uniqueTags() {
      const allTags = this.tasks.flatMap(task => task.tags);
      return [...new Set(allTags)];
    }
  },
  mounted() {
    this.fetchTasks();
    document.body.style.backgroundColor = this.bgColor;
  },
  watch: {
    bgColor(newColor) {
      document.body.style.backgroundColor = newColor;
      localStorage.setItem('bgColor', newColor);
    },
  },
  methods: {
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
        this.$toast.error('Please fill in all required fields.', {
          position: 'top-right',
          duration: 3000
        });
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
      try {
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
      } catch (error) {
        console.error('Error adding task:', error);
        this.$toast.error('Failed to add task. Please try again.', {
          position: 'top-right',
          duration: 3000
        });
      }
    },
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
    cancelTaskEdit(task) {
      task.isEditing = false;
    },
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
    toggleTagFilter(tag) {
      const index = this.tagFilters.indexOf(tag);
      if (index === -1) {
        this.tagFilters.push(tag);
      } else {
        this.tagFilters.splice(index, 1);
      }
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
</style>