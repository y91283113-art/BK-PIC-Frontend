<template>
  <div class="auth-wrapper">
    <div class="auth-card">
      <div class="brand-section">
        <h2 class="auth-brand">✨ BK Digital</h2>
        <p class="auth-subtitle">Daftar Akun Siswa Baru</p>
      </div>
      
      <div v-if="error" class="alert-danger">
        {{ error }}
      </div>

      <form @submit.prevent="handleRegister" class="auth-form">
        <div class="form-group">
          <label>Nama Lengkap</label>
          <input 
            type="text" 
            v-model="form.nama" 
            class="form-control" 
            placeholder="Contoh: Budi Santoso" 
            required 
            :disabled="isLoading"
          />
        </div>

        <div class="form-row">
          <div class="form-group flex-1">
            <label>Nomor Induk Siswa (NIS)</label>
            <input 
              type="text" 
              v-model="form.nis" 
              class="form-control" 
              placeholder="Contoh: 12345" 
              required 
              :disabled="isLoading"
            />
          </div>
          <div class="form-group flex-1">
            <label>Kelas</label>
            <input 
              type="text" 
              v-model="form.kelas" 
              class="form-control" 
              placeholder="Contoh: XII RPL 1" 
              required 
              :disabled="isLoading"
            />
          </div>
        </div>

        <div class="form-group">
          <label>Jurusan</label>
          <input
            type="text"
            v-model="form.jurusan"
            class="form-control"
            placeholder="Contoh: TJKT"
            required
            :disabled="isLoading"
          />
          <small class="form-help">Ketik jurusan kamu, misal TJKT, KIMIA, MESIN, TKR, DKV, TOI.</small>
        </div>
        
        <div class="form-group">
          <label>Password Akun</label>
          <input 
            type="password" 
            v-model="form.password" 
            class="form-control" 
            placeholder="Buat password rahasia" 
            required 
            :disabled="isLoading"
          />
        </div>

        <div class="form-group">
          <label>Konfirmasi Password</label>
          <input 
            type="password" 
            v-model="form.password_confirmation" 
            class="form-control" 
            placeholder="Ketik ulang password" 
            required 
            :disabled="isLoading"
          />
        </div>
        
        <button type="submit" class="btn btn-primary login-btn" :disabled="isLoading">
          <span v-if="isLoading">Mendaftar...</span>
          <span v-else>Daftar</span>
        </button>

        <div class="login-link">
          Sudah punya akun? <router-link to="/login">Masuk di sini</router-link>
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
  nama: '',
  nis: '',
  kelas: '',
  jurusan: 'KIMIA',
  password: '',
  password_confirmation: ''
});

const handleRegister = async () => {
  if (!form.jurusan || !form.jurusan.trim()) {
    error.value = 'Jurusan wajib diisi.';
    return;
  }

  if (form.password !== form.password_confirmation) {
    error.value = 'Password dan Konfirmasi Password tidak cocok!';
    return;
  }
  
  if (form.password.length < 6) {
    error.value = 'Password minimal harus 6 karakter!';
    return;
  }

  isLoading.value = true;
  error.value = '';
  
  try {
    await api.post('/register', {
      nama: form.nama,
      nis: form.nis,
      kelas: form.kelas,
      jurusan: form.jurusan,
      password: form.password
    });

    localStorage.removeItem('bk_token');
    localStorage.removeItem('bk_user');

    alert('Pendaftaran berhasil! Silakan masuk menggunakan akun baru Anda.');
    router.push('/login');
  } catch (err) {
    if (err.response && err.response.data && err.response.data.message) {
      // Check if it's validation error
      if (err.response.data.errors) {
        const firstError = Object.values(err.response.data.errors)[0][0];
        error.value = firstError;
      } else {
        error.value = err.response.data.message;
      }
    } else {
      error.value = 'Terjadi kesalahan saat pendaftaran. Silakan coba lagi.';
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
  padding: 2rem 1rem;
}

.auth-card {
  background: rgba(255, 255, 255, 0.95);
  backdrop-filter: blur(10px);
  padding: 2.5rem 3rem;
  border-radius: 1.5rem;
  box-shadow: 0 20px 40px rgba(0,0,0,0.2);
  width: 100%;
  max-width: 500px;
  animation: slideUp 0.6s cubic-bezier(0.16, 1, 0.3, 1);
}

.brand-section {
  text-align: center;
  margin-bottom: 2rem;
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

.form-row {
  display: flex;
  gap: 1rem;
}

.flex-1 {
  flex: 1;
}

.form-group {
  margin-bottom: 1.25rem;
}

.form-group label {
  display: block;
  margin-bottom: 0.4rem;
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
  margin-top: 0.5rem;
}

.login-btn:disabled {
  opacity: 0.7;
  cursor: not-allowed;
}

.login-link {
  text-align: center;
  margin-top: 1.5rem;
  font-size: 0.95rem;
  color: #6b7280;
}

.login-link a {
  color: var(--primary);
  font-weight: 600;
  text-decoration: none;
}

.login-link a:hover {
  text-decoration: underline;
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

@keyframes slideUp {
  from { opacity: 0; transform: translateY(30px); }
  to { opacity: 1; transform: translateY(0); }
}

@keyframes fadeIn {
  from { opacity: 0; }
  to { opacity: 1; }
}
</style>
