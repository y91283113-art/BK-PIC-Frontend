import { createRouter, createWebHistory } from 'vue-router';

// Page Components
import LandingPage from './pages/LandingPage.vue';
import LoginPage from './pages/LoginPage.vue';
import RegisterPage from './pages/RegisterPage.vue';
import DashboardPage from './pages/DashboardPage.vue';
import BookingPage from './pages/BookingPage.vue';
import ChatPage from './pages/ChatPage.vue';
import ProfilePage from './pages/ProfilePage.vue';

const routes = [
    {
        path: '/',
        name: 'Landing',
        component: LandingPage,
        meta: { guest: true }
    },
    {
        path: '/login',
        name: 'Login',
        component: LoginPage,
        meta: { guest: true }
    },
    {
        path: '/register',
        name: 'Register',
        component: RegisterPage,
        meta: { guest: true }
    },
    {
        path: '/dashboard',
        name: 'Dashboard',
        component: DashboardPage,
        meta: { requiresAuth: true }
    },
    {
        path: '/booking/create',
        name: 'BookingCreate',
        component: BookingPage,
        meta: { requiresAuth: true, role: 'siswa' }
    },
    {
        path: '/chat/:booking_id',
        name: 'Chat',
        component: ChatPage,
        meta: { requiresAuth: true }
    },
    {
        path: '/profile',
        name: 'Profile',
        component: ProfilePage,
        meta: { requiresAuth: true }
    }
];

const router = createRouter({
    history: createWebHistory(),
    routes,
});

router.beforeEach((to, from, next) => {
    const token = localStorage.getItem('bk_token');
    
    if (to.meta.requiresAuth && !token) {
        next('/login');
    } else if (to.meta.guest && token && to.path !== '/register') {
        next('/dashboard');
    } else {
        next();
    }
});

export default router;
