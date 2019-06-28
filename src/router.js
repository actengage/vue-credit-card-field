import App from './App';
import VueRouter from 'vue-router';

export default new VueRouter({
    routes: [
        {
            path: '/*',
            name: 'home',
            component: App
        }
    ]
});