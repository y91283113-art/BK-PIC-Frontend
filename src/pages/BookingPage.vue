<template>
  <div class="page-wrapper">
    <!-- Navbar -->
    <nav class="navbar">
      <div class="nav-content">
        <router-link to="/dashboard" class="brand">✨ BK Digital</router-link>
        <div class="nav-links">
          <router-link to="/dashboard" class="nav-item">Kembali ke Dashboard</router-link>
        </div>
      </div>
    </nav>

    <!-- Main Content -->
    <div class="container main-content">
      <div class="form-container">
        <h2 class="form-title">📝 Form Booking Konseling</h2>
        <p class="form-subtitle">Silakan isi formulir di bawah ini untuk mengatur jadwal dengan Guru BK.</p>
        
        <div v-if="error" class="alert-danger">{{ error }}</div>

        <form @submit.prevent="submitBooking" class="booking-form">
          
          <div class="identity-card">
            <div class="identity-icon">👤</div>
            <div class="identity-info">
              <div class="identity-label">Siswa yang Mengajukan</div>
              <div class="identity-name">{{ user?.siswa?.nama || user?.name }}</div>
              <div class="identity-kelas">Kelas: {{ user?.siswa?.kelas || '-' }}</div>
            </div>
          </div>

          <div class="form-group">
            <label>Nomor Absen</label>
            <input type="number" v-model="form.absen" class="form-control" placeholder="Masukkan Nomor Absen Anda" required>
            <small class="help-text">* Nomor absen akan tersimpan ke profil Anda otomatis</small>
          </div>

          <div class="form-group">
            <label>Pilih Guru BK / Konselor</label>
            <select v-model="form.guru_id" class="form-control" required>
              <option value="" disabled>-- Pilih Guru BK --</option>
              <option v-for="guru in guruList" :key="guru.id" :value="guru.id">
                {{ guru.nama }} - Guru BK
              </option>
            </select>
          </div>

          <div class="form-row">
            <div class="form-group flex-1">
              <label>Tanggal Rencana Konseling</label>
              <input type="date" v-model="form.tanggal" class="form-control" required>
            </div>
            <div class="form-group flex-1">
              <label>Jam</label>
              <input type="time" v-model="form.jam" class="form-control" required>
            </div>
          </div>

          <div class="form-group">
            <label>Keterangan / Keluhan Singkat</label>
            <textarea v-model="form.keluhan" class="form-control" rows="4" placeholder="Ceritakan singkat masalah yang ingin dikonsultasikan..." required></textarea>
            <div class="privacy-notice">
              🔒 Kerahasiaan Anda dijamin 100% oleh sistem dan Guru BK sesuai asas kerahasiaan konseling.
            </div>
          </div>

          <button type="submit" class="btn btn-primary submit-btn" :disabled="isSubmitting">
            <span v-if="isSubmitting">Mengirim...</span>
            <span v-else>Ajukan Jadwal Konseling</span>
          </button>
        </form>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import api from '../api';

const router = useRouter();
const user = ref(null);
const guruList = ref([]);
const isSubmitting = ref(false);
const error = ref('');

const form = reactive({
  absen: '',
  guru_id: '',
  tanggal: '',
  jam: '',
  keluhan: ''
});

const loadData = async () => {
  const userData = localStorage.getItem('bk_user');
  if (userData) {
    user.value = JSON.parse(userData);
    if (user.value.siswa && user.value.siswa.absen) {
      form.absen = user.value.siswa.absen;
    }
  }

  try {
    const res = await api.get('/bk/guru');
    guruList.value = res.data.data || res.data;
  } catch (err) {
    console.error('Gagal mengambil data guru', err);
  }
};

const submitBooking = async () => {
  isSubmitting.value = true;
  error.value = '';

  try {
    await api.post('/booking/store', form);
    alert('Booking berhasil diajukan!');
    router.push('/dashboard');
  } catch (err) {
    error.value = err.response?.data?.message || 'Terjadi kesalahan saat mengajukan booking.';
  } finally {
    isSubmitting.value = false;
  }
};

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

.nav-item {
  color: #4b5563;
  text-decoration: none;
  font-weight: 500;
}

.nav-item:hover { color: var(--primary); }

.main-content {
  display: flex;
  justify-content: center;
  padding-top: 3rem;
  padding-bottom: 3rem;
}

.form-container {
  background: white;
  padding: 2.5rem;
  border-radius: 1.5rem;
  box-shadow: 0 10px 25px rgba(0,0,0,0.05);
  width: 100%;
  max-width: 650px;
  animation: slideUp 0.6s ease;
}

.form-title {
  color: var(--primary);
  margin-bottom: 0.5rem;
  font-size: 1.75rem;
  font-weight: 700;
}

.form-subtitle {
  color: #6b7280;
  margin-bottom: 2rem;
}

.form-row {
  display: flex;
  gap: 1.5rem;
}

.flex-1 { flex: 1; }

.form-group {
  margin-bottom: 1.5rem;
}

.form-group label {
  display: block;
  margin-bottom: 0.5rem;
  font-weight: 600;
  color: #4b5563;
  font-size: 0.95rem;
}

.form-control {
  width: 100%;
  padding: 0.85rem 1rem;
  border: 1px solid #d1d5db;
  border-radius: 0.75rem;
  font-size: 1rem;
  transition: all 0.3s ease;
  background: white;
}

.form-control:focus {
  outline: none;
  border-color: var(--primary);
  box-shadow: 0 0 0 4px rgba(79, 70, 229, 0.15);
}

.identity-card {
  display: flex;
  align-items: center;
  background: #f8fafc;
  border: 1px solid #e2e8f0;
  padding: 1.25rem;
  border-radius: 1rem;
  margin-bottom: 2rem;
  gap: 1.25rem;
}

.identity-icon {
  font-size: 2.5rem;
  background: white;
  width: 60px;
  height: 60px;
  display: flex;
  justify-content: center;
  align-items: center;
  border-radius: 50%;
  box-shadow: 0 4px 6px rgba(0,0,0,0.05);
}

.identity-label {
  font-size: 0.85rem;
  color: #64748b;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  font-weight: 600;
  margin-bottom: 0.2rem;
}

.identity-name {
  font-size: 1.25rem;
  font-weight: 700;
  color: #1e293b;
}

.identity-kelas {
  font-size: 0.95rem;
  color: #475569;
}

.privacy-notice {
  background: #f0fdf4;
  color: #166534;
  padding: 0.75rem 1rem;
  border-radius: 0.5rem;
  font-size: 0.85rem;
  margin-top: 1rem;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  border: 1px solid #bbf7d0;
}

.help-text {
  color: #9ca3af;
  font-size: 0.85rem;
  margin-top: 0.4rem;
  display: block;
}

textarea.form-control {
  resize: vertical;
}

.submit-btn {
  width: 100%;
  padding: 1rem;
  font-size: 1.1rem;
  border-radius: 0.75rem;
  margin-top: 1rem;
}

.alert-danger {
  background: #fef2f2;
  color: #dc2626;
  padding: 1rem;
  border-radius: 0.75rem;
  margin-bottom: 1.5rem;
  border: 1px solid #fecaca;
}

@keyframes slideUp {
  from { opacity: 0; transform: translateY(20px); }
  to { opacity: 1; transform: translateY(0); }
}
</style>
