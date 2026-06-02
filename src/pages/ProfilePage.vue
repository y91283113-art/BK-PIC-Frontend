<template>
  <div class="page-wrapper">
    <nav class="navbar">
      <div class="nav-content">
        <router-link to="/dashboard" class="brand">✨ BK Digital</router-link>
        <div class="nav-links" v-if="user">
          <router-link to="/dashboard" class="nav-item">Dashboard</router-link>
          <button @click="handleLogout" class="btn btn-danger btn-sm">Logout</button>
        </div>
      </div>
    </nav>

    <div class="container main-content">
      <div class="profile-card" v-if="user">
        <div class="profile-header">
          <div class="avatar-circle">
            {{ user.name.charAt(0).toUpperCase() }}
          </div>
          <h2>{{ user.name }}</h2>
          <span class="role-badge" :class="'role-' + user.role">{{ capitalize(user.role) }}</span>
        </div>

        <div class="profile-body">
          <div class="info-group">
            <label>Email Terdaftar</label>
            <div class="info-value">{{ user.email || '-' }}</div>
          </div>

          <!-- Siswa Specific Info -->
          <template v-if="user.role === 'siswa' && user.siswa">
            <div class="info-group">
              <label>Nomor Induk Siswa (NIS)</label>
              <div class="info-value">{{ user.siswa.nis }}</div>
            </div>
            <div class="info-group">
              <label>Kelas</label>
              <div class="info-value">{{ user.siswa.kelas || '-' }}</div>
            </div>
            <div class="info-group">
              <label>Nomor Absen</label>
              <div class="info-value">{{ user.siswa.absen || 'Belum diisi' }}</div>
            </div>
          </template>

          <!-- Guru Specific Info -->
          <template v-if="user.role === 'guru' && user.guru">
            <div class="info-group">
              <label>NIP / ID Guru</label>
              <div class="info-value">{{ user.guru.nip || '-' }}</div>
            </div>
            <div class="info-group">
              <label>Nomor WhatsApp (Aktif)</label>
              <div class="info-value">
                <span v-if="user.guru.no_hp">{{ user.guru.no_hp }}</span>
                <span v-else class="text-danger">Belum diatur</span>
              </div>
            </div>
          </template>
        </div>
      </div>
      
      <div v-else class="loading-state">Memuat profil...</div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import api from '../api';

const router = useRouter();
const user = ref(null);

const loadData = () => {
  const userData = localStorage.getItem('bk_user');
  if (userData) {
    user.value = JSON.parse(userData);
  }
};

const handleLogout = async () => {
  try {
    await api.post('/logout');
  } catch (e) {} finally {
    localStorage.removeItem('bk_token');
    localStorage.removeItem('bk_user');
    router.push('/login');
  }
};

const capitalize = (s) => s ? s.charAt(0).toUpperCase() + s.slice(1) : '';

onMounted(() => {
  loadData();
});
</script>

<style scoped>
.page-wrapper {
  background: var(--light);
  min-height: 100vh;
}

.navbar {
  background: white;
  box-shadow: 0 2px 10px rgba(0,0,0,0.05);
  position: sticky;
  top: 0;
  z-index: 50;
}

.nav-content {
  max-width: 1200px;
  margin: 0 auto;
  padding: 1rem 2rem;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.brand {
  font-size: 1.5rem;
  font-weight: 700;
  color: var(--primary);
  text-decoration: none;
}

.nav-links {
  display: flex;
  align-items: center;
  gap: 1.5rem;
}

.nav-item {
  color: #4b5563;
  text-decoration: none;
  font-weight: 500;
  transition: color 0.2s;
}

.nav-item:hover { color: var(--primary); }

.main-content {
  display: flex;
  justify-content: center;
  padding-top: 4rem;
}

.profile-card {
  background: white;
  width: 100%;
  max-width: 500px;
  border-radius: 1.5rem;
  box-shadow: 0 10px 25px rgba(0,0,0,0.05);
  overflow: hidden;
  animation: slideUp 0.6s ease;
}

.profile-header {
  background: linear-gradient(135deg, var(--primary) 0%, #764ba2 100%);
  color: white;
  padding: 3rem 2rem 2rem;
  text-align: center;
}

.avatar-circle {
  width: 80px;
  height: 80px;
  background: white;
  color: var(--primary);
  border-radius: 50%;
  display: flex;
  justify-content: center;
  align-items: center;
  font-size: 2.5rem;
  font-weight: 800;
  margin: 0 auto 1rem;
  box-shadow: 0 4px 10px rgba(0,0,0,0.1);
}

.profile-header h2 {
  font-size: 1.5rem;
  font-weight: 700;
  margin-bottom: 0.5rem;
}

.role-badge {
  display: inline-block;
  padding: 0.25rem 1rem;
  border-radius: 2rem;
  font-size: 0.85rem;
  font-weight: 600;
  background: rgba(255,255,255,0.2);
}

.profile-body {
  padding: 2rem;
}

.info-group {
  margin-bottom: 1.5rem;
  border-bottom: 1px solid #f3f4f6;
  padding-bottom: 1rem;
}

.info-group:last-child {
  border-bottom: none;
  margin-bottom: 0;
  padding-bottom: 0;
}

.info-group label {
  display: block;
  font-size: 0.85rem;
  color: #6b7280;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  margin-bottom: 0.25rem;
}

.info-value {
  font-size: 1.1rem;
  color: var(--dark);
  font-weight: 500;
}

.text-danger { color: var(--danger); }

.loading-state {
  text-align: center;
  padding: 3rem;
  color: #6b7280;
}

.btn-sm { padding: 0.4rem 1rem; font-size: 0.9rem; }

@keyframes slideUp {
  from { opacity: 0; transform: translateY(20px); }
  to { opacity: 1; transform: translateY(0); }
}
</style>
