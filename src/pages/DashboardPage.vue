<template>
  <div class="page-wrapper">
    <!-- Navbar -->
    <nav class="navbar">
      <div class="nav-content">
        <router-link to="/dashboard" class="brand">✨ BK Digital</router-link>
        
        <div class="nav-links" v-if="user">
          <router-link to="/dashboard" class="nav-item">Dashboard</router-link>
          
          <router-link 
            v-if="user.role === 'siswa'" 
            to="/booking/create" 
            class="nav-item"
          >
            Booking Konseling
          </router-link>

          <router-link to="/profile" class="nav-item">Profil Saya</router-link>
          
          <div class="user-info">
            <span class="greeting">Halo, {{ user.name }} ({{ roleLabel }})</span>
            <button @click="handleLogout" class="btn btn-danger btn-sm">Logout</button>
          </div>
        </div>
      </div>
    </nav>

    <!-- Main Content -->
    <div class="container main-content">
      <div class="welcome-section">
        <h2>Selamat Datang! 👋</h2>
        <p>Kelola jadwal konseling BK Anda dengan mudah dan cepat.</p>
      </div>

      <!-- Stats Grid -->
      <div class="stats-grid">
        <!-- Siswa Stats -->
        <template v-if="user && user.role === 'siswa'">
          <div class="stat-card">
            <h3>Jadwal Konseling Saya</h3>
            <p class="stat-value">{{ bookings.length }}</p>
          </div>
          <div class="stat-card">
            <h3>Sesi Hari Ini</h3>
            <p class="stat-value text-primary">{{ sesiHariIni }}</p>
          </div>
          <div class="stat-card action-card">
            <h3>Aksi Cepat</h3>
            <router-link to="/booking/create" class="btn btn-primary mt-2">Mulai Booking</router-link>
          </div>
        </template>

        <!-- Guru/Admin Stats -->
        <template v-else-if="user">
          <div class="stat-card">
            <h3>Total Permintaan Masuk</h3>
            <p class="stat-value">{{ bookings.length }}</p>
          </div>
          <div class="stat-card">
            <h3>Sesi Hari Ini</h3>
            <p class="stat-value text-primary">{{ sesiHariIni }}</p>
          </div>
          <div class="stat-card">
            <h3>Pesan Sistem</h3>
            <p class="stat-desc">Silakan periksa dan respon jadwal yang masuk.</p>
          </div>
        </template>
      </div>

      <!-- Table Section -->
      <div class="table-section">
        <h3 class="section-title">Riwayat & Jadwal Terbaru</h3>
        
        <div v-if="isLoading" class="loading-state">Memuat data...</div>
        
        <div v-else-if="bookings.length === 0" class="empty-state">
          Belum ada riwayat booking konseling.
        </div>
        
        <div v-else class="table-responsive">
          <table class="data-table">
            <thead>
              <tr>
                <th>No</th>
                <th>Tanggal Booking</th>
                <th v-if="user.role === 'siswa'">Guru BK</th>
                <th v-else>Siswa</th>
                <th>Keluhan Singkat</th>
                <th>Status</th>
                <th>Aksi</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="(book, index) in bookings" :key="book.id">
                <td>{{ index + 1 }}</td>
                <td>
                  <strong>{{ formatDate(book.tanggal) }}</strong><br>
                  <small class="text-gray">{{ book.jam }} WIB</small>
                </td>
                <td v-if="user.role === 'siswa'">{{ book.guru?.nama || '-' }}</td>
                <td v-else>{{ book.siswa?.nama || '-' }}</td>
                <td class="keluhan-cell">{{ book.keluhan }}</td>
                <td>
                  <span :class="['status-badge', `status-${book.status}`]">
                    {{ capitalize(book.status) }}
                  </span>
                </td>
                <td class="action-cell">
                  <!-- Actions for Approved bookings -->
                  <template v-if="book.status === 'diterima' || user.role === 'admin'">
                    <router-link 
                      :to="`/chat/${book.id}`" 
                      class="btn btn-secondary btn-sm"
                    >
                      📱 {{ user.role === 'siswa' ? 'Lihat No. WA' : 'Kirim No. WA' }}
                    </router-link>
                  </template>
                  
                  <!-- Actions for Pending bookings (Guru/Admin) -->
                  <template v-if="(user.role === 'guru' || user.role === 'admin') && book.status === 'pending'">
                    <button 
                      @click="updateStatus(book.id, 'diterima')" 
                      class="btn btn-success btn-sm"
                      style="margin-right: 0.5rem;"
                    >
                      Terima
                    </button>
                    <button 
                      @click="updateStatus(book.id, 'ditolak')" 
                      class="btn btn-danger btn-sm"
                    >
                      Tolak
                    </button>
                  </template>
                  
                  <!-- Fallback for waiting siswa -->
                  <span v-if="user.role === 'siswa' && book.status === 'pending'" class="text-gray small">
                    Menunggu konfirmasi
                  </span>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue';
import { useRouter } from 'vue-router';
import api from '../api';

const router = useRouter();
const user = ref(null);
const bookings = ref([]);
const sesiHariIni = ref(0);
const isLoading = ref(true);

const roleLabel = computed(() => {
  if (!user.value) return '';
  const r = user.value.role;
  return r.charAt(0).toUpperCase() + r.slice(1);
});

const loadDashboard = async () => {
  try {
    const userData = localStorage.getItem('bk_user');
    if (userData) user.value = JSON.parse(userData);
    
    const response = await api.get('/dashboard');
    user.value = response.data.user;
    localStorage.setItem('bk_user', JSON.stringify(user.value));
    
    bookings.value = response.data.bookings;
    sesiHariIni.value = response.data.sesiHariIni;
  } catch (err) {
    console.error('Failed to load dashboard', err);
  } finally {
    isLoading.value = false;
  }
};

const handleLogout = async () => {
  try {
    await api.post('/logout');
  } catch (e) {
    // Ignore error
  } finally {
    localStorage.removeItem('bk_token');
    localStorage.removeItem('bk_user');
    router.push('/login');
  }
};

const updateStatus = async (id, status) => {
  try {
    await api.put(`/bk/booking/${id}`, { status });
    // Reload dashboard
    loadDashboard();
  } catch (err) {
    alert('Gagal mengupdate status: ' + (err.response?.data?.message || err.message));
  }
};

const formatDate = (dateString) => {
  if (!dateString) return '-';
  const date = new Date(dateString);
  return new Intl.DateTimeFormat('id-ID', {
    day: '2-digit', month: 'long', year: 'numeric'
  }).format(date);
};

const capitalize = (s) => {
  if (typeof s !== 'string') return '';
  return s.charAt(0).toUpperCase() + s.slice(1);
};

onMounted(() => {
  loadDashboard();
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

.nav-item:hover, .nav-item.router-link-active {
  color: var(--primary);
}

.user-info {
  display: flex;
  align-items: center;
  gap: 1rem;
  padding-left: 1.5rem;
  border-left: 1px solid #e5e7eb;
}

.greeting {
  font-weight: 600;
  color: var(--dark);
}

.container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 2rem;
}

.welcome-section {
  margin-bottom: 2rem;
  animation: fadeIn 0.5s ease;
}

.welcome-section h2 {
  font-size: 2rem;
  color: var(--dark);
  margin-bottom: 0.5rem;
}

.welcome-section p {
  color: #6b7280;
  font-size: 1.1rem;
}

.stats-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 1.5rem;
  margin-bottom: 2.5rem;
  animation: slideUp 0.6s ease;
}

.stat-card {
  background: white;
  padding: 1.5rem 2rem;
  border-radius: 1rem;
  box-shadow: 0 4px 6px -1px rgba(0,0,0,0.05);
  border: 1px solid #f3f4f6;
  transition: transform 0.3s ease, box-shadow 0.3s ease;
}

.stat-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 10px 15px -3px rgba(0,0,0,0.1);
}

.stat-card h3 {
  color: #6b7280;
  font-size: 1rem;
  font-weight: 600;
  margin-bottom: 0.5rem;
}

.stat-value {
  font-size: 2.5rem;
  font-weight: 800;
  color: var(--dark);
}

.text-primary {
  color: var(--primary);
}

.action-card {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: flex-start;
}

.mt-2 { margin-top: 0.5rem; }

.table-section {
  background: white;
  border-radius: 1rem;
  padding: 2rem;
  box-shadow: 0 4px 6px -1px rgba(0,0,0,0.05);
  animation: slideUp 0.8s ease;
}

.section-title {
  font-size: 1.25rem;
  color: var(--dark);
  margin-bottom: 1.5rem;
  font-weight: 700;
}

.data-table {
  width: 100%;
  border-collapse: collapse;
}

.data-table th, .data-table td {
  padding: 1rem;
  text-align: left;
  border-bottom: 1px solid #f3f4f6;
}

.data-table th {
  background: #f9fafb;
  color: #4b5563;
  font-weight: 600;
  font-size: 0.9rem;
  text-transform: uppercase;
  letter-spacing: 0.05em;
}

.data-table tr:hover td {
  background: #f9fafb;
}

.keluhan-cell {
  max-width: 250px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.status-badge {
  padding: 0.35rem 0.75rem;
  border-radius: 2rem;
  font-size: 0.85rem;
  font-weight: 600;
  display: inline-block;
}

.status-pending { background: #fef3c7; color: #d97706; }
.status-diterima { background: #d1fae5; color: #059669; }
.status-ditolak { background: #fee2e2; color: #dc2626; }

.btn-sm {
  padding: 0.35rem 0.75rem;
  font-size: 0.85rem;
}

.btn-danger {
  background: white;
  color: var(--danger);
  border: 1px solid var(--danger);
}
.btn-danger:hover {
  background: var(--danger);
  color: white;
}

.btn-success {
  background: var(--secondary);
  color: white;
}
.btn-success:hover {
  background: #059669;
}

.btn-secondary {
  background: #6366f1;
  color: white;
}
.btn-secondary:hover {
  background: #4f46e5;
}

.text-gray { color: #6b7280; }
.small { font-size: 0.85rem; }

@keyframes slideUp {
  from { opacity: 0; transform: translateY(20px); }
  to { opacity: 1; transform: translateY(0); }
}

@keyframes fadeIn {
  from { opacity: 0; }
  to { opacity: 1; }
}
</style>
