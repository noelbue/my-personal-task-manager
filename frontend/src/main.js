import { createApp } from 'vue';
import App from './App.vue';
import './main.css';
import 'vue-toast-notification/dist/theme-sugar.css';
import VueToast from 'vue-toast-notification';
import { library } from '@fortawesome/fontawesome-svg-core';
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome';
import { faTrash, faPen, faClone, faCheck, faTimes, faEllipsisV } from '@fortawesome/free-solid-svg-icons';

/**
 * Add FontAwesome icons to the library.
 * These icons are used throughout the application for various UI elements.
 */
library.add(faTrash, faPen, faClone, faCheck, faTimes, faEllipsisV);

/**
 * Create the Vue application instance.
 * @type {import('vue').App}
 */
const app = createApp(App);

/**
 * Use the VueToast plugin for displaying toast notifications.
 */
app.use(VueToast);

/**
 * Register the FontAwesomeIcon component globally.
 * This allows the use of FontAwesome icons in all components.
 */
app.component('font-awesome-icon', FontAwesomeIcon);

/**
 * Mount the Vue application to the DOM.
 * The application will be rendered inside the element with id 'app'.
 */
app.mount('#app');