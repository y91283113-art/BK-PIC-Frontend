<template>
  <div class="auth-wrapper">
    <div class="auth-card">
      <div class="brand-section">
        <h2 class="auth-brand">✨ BK Digital</h2>
        <p class="auth-subtitle">Kami di sini untuk mendengar cerita Anda.</p>
      </div>
      
      <div v-if="error" class="alert-danger">
        {{ error }}
      </div>

      <form @submit.prevent="handleLogin" class="auth-form">
        <div class="form-group">
          <label>Email / NIS</label>
          <input 
            type="text" 
            v-model="form.login_id" 
            class="form-control" 
            placeholder="Masukan Email atau NIS Anda" 
            required 
            :disabled="isLoading"
          />
        </div>
        
        <div class="form-group">
          <label>Password</label>
          <input 
            type="password" 
            v-model="form.password" 
            class="form-control" 
            placeholder="Masukan Password" 
            required 
            :disabled="isLoading"
          />
        </div>
        
        <button type="submit" class="btn btn-primary login-btn" :disabled="isLoading">
          <span v-if="isLoading">Loading...</span>
          <span v-else>Masuk ke Sistem</span>
        </button>

        <div class="register-link">
          Belum punya akun? <router-link to="/register">Daftar di sini</router-link>
        </div>
      </form>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive } from 'vue';
import { useRouter } from 'vue-router';
import api from '../api';

const router = useRouter();
const isLoading = ref(false);
const error = ref('');

const form = reactive({
  login_id: '',
  password: ''
});

const handleLogin = async () => {
  isLoading.value = true;
  error.value = '';
  
  try {
    const response = await api.post('/login', form);
    
    // Save token & user info
    localStorage.setItem('bk_token', response.data.token);
    localStorage.setItem('bk_user', JSON.stringify(response.data.user));
    
    // Set axios default header immediately
    api.defaults.headers.common['Authorization'] = `Bearer ${response.data.token}`;
    
    router.push('/dashboard');
  } catch (err) {
    if (err.response && err.response.data && err.response.data.message) {
      error.value = err.response.data.message;
    } else {
      error.value = 'Terjadi kesalahan saat login. Silakan coba lagi.';
    }
  } finally {
    isLoading.value = false;
  }
};
</script>

<style scoped>
.auth-wrapper {
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 100vh;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  padding: 1rem;
}

.auth-card {
  background: rgba(255, 255, 255, 0.95);
  backdrop-filter: blur(10px);
  padding: 3rem;
  border-radius: 1.5rem;
  box-shadow: 0 20px 40px rgba(0,0,0,0.2);
  width: 100%;
  max-width: 420px;
  animation: slideUp 0.6s cubic-bezier(0.16, 1, 0.3, 1);
}

.brand-section {
  text-align: center;
  margin-bottom: 2.5rem;
}

.auth-brand {
  font-size: 2rem;
  font-weight: 800;
  color: var(--primary);
  margin-bottom: 0.2rem;
}

.auth-subtitle {
  color: #6b7280;
  font-size: 1rem;
  font-weight: 500;
}

.form-group {
  margin-bottom: 1.5rem;
}

.form-group label {
  display: block;
  margin-bottom: 0.5rem;
  font-weight: 600;
  color: #4b5563;
  font-size: 0.9rem;
}

.form-control {
  width: 100%;
  padding: 0.85rem 1rem;
  border: 1px solid #d1d5db;
  border-radius: 0.75rem;
  font-size: 1rem;
  transition: all 0.3s ease;
  background: #f9fafb;
}

.form-control:focus {
  outline: none;
  border-color: var(--primary);
  box-shadow: 0 0 0 4px rgba(79, 70, 229, 0.15);
  background: white;
}

.login-btn {
  width: 100%;
  padding: 0.9rem;
  font-size: 1.1rem;
  border-radius: 0.75rem;
  margin-top: 1rem;
}

.login-btn:disabled {
  opacity: 0.7;
  cursor: not-allowed;
}

.alert-danger {
  background: #fef2f2;
  color: #dc2626;
  padding: 1rem;
  border-radius: 0.75rem;
  margin-bottom: 1.5rem;
  text-align: center;
  border: 1px solid #fecaca;
  font-weight: 500;
  animation: fadeIn 0.3s ease;
}

.register-link {
  text-align: center;
  margin-top: 1.5rem;
  font-size: 0.95rem;
  color: #6b7280;
}

.register-link a {
  color: var(--primary);
  font-weight: 600;
  text-decoration: none;
}

.register-link a:hover {
  text-decoration: underline;
}

@keyframes slideUp {
  from { opacity: 0; transform: translateY(30px); }
  to { opacity: 1; transform: translateY(0); }
}

@keyframes fadeIn {
  from { opacity: 0; }
  to { opacity: 1; }
}
</style>
