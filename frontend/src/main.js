import { createApp } from 'vue';
import App from './App.vue';
import './main.css';
import 'vue-toast-notification/dist/theme-sugar.css';
import VueToast from 'vue-toast-notification';
import { library } from '@fortawesome/fontawesome-svg-core';
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome';
import { faTrash, faPen, faClone, faCheck, faTimes } from '@fortawesome/free-solid-svg-icons';

library.add(faTrash, faPen, faClone, faCheck, faTimes);

const app = createApp(App);
app.use(VueToast);
app.component('font-awesome-icon', FontAwesomeIcon);
app.mount('#app');