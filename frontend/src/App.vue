<template>
  <div id="app" class="container mx-auto p-4">
    <TaskList />
  </div>
</template>

<script>
import TaskList from './components/TaskList.vue';

/**
 * App component serves as the main container for the Personal Task Manager application.
 * It includes the TaskList component which handles all task management functionality.
 */
export default {
  name: 'App',
  components: {
    /**
     * TaskList component handles the display and management of tasks.
     */
    TaskList,
  },
};
</script>

<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 60px;
}
</style>