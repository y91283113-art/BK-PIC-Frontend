<template>
  <div class="page-wrapper">
    <nav class="navbar">
      <div class="nav-content">
        <router-link to="/dashboard" class="brand">✨ BK Digital</router-link>
      </div>
    </nav>

    <div class="container main-content" v-if="booking">
      <div class="card-container">
        <!-- Info Panel -->
        <div class="info-panel">
          <h2 class="panel-title">📋 Detail Sesi Konseling</h2>
          <table class="info-table">
            <tr>
              <td class="label">Siswa</td>
              <td class="value"><strong>{{ booking.siswa?.nama || '-' }}</strong></td>
            </tr>
            <tr>
              <td class="label">Guru BK</td>
              <td class="value"><strong>{{ booking.guru?.nama || '-' }}</strong></td>
            </tr>
            <tr>
              <td class="label">Tanggal</td>
              <td class="value">{{ formatDate(booking.tanggal) }} ({{ booking.jam }})</td>
            </tr>
            <tr>
              <td class="label">Keluhan</td>
              <td class="value">{{ booking.keluhan }}</td>
            </tr>
            <tr>
              <td class="label">Status</td>
              <td class="value">
                <span class="badge" :class="`badge-${booking.status}`">
                  {{ capitalize(booking.status) }}
                </span>
              </td>
            </tr>
          </table>
        </div>

        <!-- SISWA VIEW -->
        <div v-if="userRole === 'siswa'" class="action-panel text-center">
          <template v-if="booking.guru && booking.guru.no_hp">
            <div class="icon-big">📱</div>
            <h3>Nomor WhatsApp Guru BK</h3>
            <p class="text-gray">Guru BK <strong>{{ booking.guru.nama }}</strong> telah memberikan nomor WhatsApp untuk konseling lanjutan:</p>

            <div class="wa-number-box">
              <span>{{ booking.guru.no_hp }}</span>
            </div>

            <a :href="waLink" target="_blank" class="btn-wa">
              💬 Chat via WhatsApp
            </a>
            <p class="help-text">Klik tombol di atas untuk langsung membuka WhatsApp</p>
          </template>
          
          <template v-else>
            <div class="icon-big">⏳</div>
            <h3>Menunggu Nomor WA dari Guru</h3>
            <p class="text-gray">Guru BK <strong>{{ booking.guru?.nama || 'Guru' }}</strong> belum memberikan nomor WhatsApp. Silakan cek kembali nanti.</p>
          </template>
        </div>

        <!-- GURU/ADMIN VIEW -->
        <div v-else class="action-panel">
          <h3 class="panel-title text-primary">📱 Berikan Nomor WhatsApp ke Siswa</h3>
          <p class="text-gray mb-4">Masukkan nomor WhatsApp Anda agar siswa <strong>{{ booking.siswa?.nama || 'Siswa' }}</strong> dapat menghubungi Anda.</p>

          <div v-if="successMsg" class="alert-success">
            ✅ {{ successMsg }}
          </div>

          <form @submit.prevent="updateWa">
            <div class="form-group">
              <label>Nomor WhatsApp Anda</label>
              <input type="text" v-model="noHp" class="form-control" placeholder="Contoh: 08123456789" required>
              <small class="help-text">* Nomor ini akan ditampilkan ke siswa yang bersangkutan</small>
            </div>
            <button type="submit" class="btn btn-primary submit-btn" :disabled="isSubmitting">
              {{ isSubmitting ? 'Menyimpan...' : 'Simpan & Kirim ke Siswa' }}
            </button>
          </form>

          <div v-if="booking.guru && booking.guru.no_hp" class="current-wa">
            <small>Nomor WA Anda saat ini:</small><br>
            <strong>{{ booking.guru.no_hp }}</strong>
          </div>
        </div>

        <div class="back-link">
          <router-link to="/dashboard">← Kembali ke Dashboard</router-link>
        </div>
      </div>
    </div>
    
    <div v-else-if="isLoading" class="container text-center" style="padding-top: 4rem;">
      Memuat data...
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue';
import { useRoute } from 'vue-router';
import api from '../api';

const route = useRoute();
const booking = ref(null);
const userRole = ref('');
const isLoading = ref(true);

const noHp = ref('');
const isSubmitting = ref(false);
const successMsg = ref('');

const loadData = async () => {
  const userData = localStorage.getItem('bk_user');
  if (userData) {
    const u = JSON.parse(userData);
    userRole.value = u.role;
  }

  try {
    const res = await api.get(`/chat/${route.params.booking_id}`);
    booking.value = res.data.booking;
    if (booking.value.guru && booking.value.guru.no_hp) {
      noHp.value = booking.value.guru.no_hp;
    }
  } catch (err) {
    console.error('Failed to load chat data', err);
  } finally {
    isLoading.value = false;
  }
};

const updateWa = async () => {
  isSubmitting.value = true;
  successMsg.value = '';
  
  try {
    const res = await api.post(`/chat/${booking.value.id}/update-wa`, { no_hp: noHp.value });
    successMsg.value = res.data.message;
    // Update local state so current-wa shows up immediately
    if (booking.value.guru) {
      booking.value.guru.no_hp = noHp.value;
    }
  } catch (err) {
    alert('Gagal menyimpan nomor WA: ' + (err.response?.data?.message || err.message));
  } finally {
    isSubmitting.value = false;
  }
};

const waLink = computed(() => {
  if (!booking.value || !booking.value.guru || !booking.value.guru.no_hp) return '#';
  
  let nomorBersih = booking.value.guru.no_hp.replace(/[^0-9]/g, '');
  if (nomorBersih.startsWith('0')) {
    nomorBersih = '62' + nomorBersih.substring(1);
  }
  
  const guruName = booking.value.guru.nama || '';
  const siswaName = booking.value.siswa?.nama || 'Siswa';
  const dateStr = formatDate(booking.value.tanggal);
  
  const msg = `Halo Bu/Pak ${guruName}, saya ${siswaName}. Saya ingin melanjutkan konseling terkait booking tanggal ${dateStr}. Terima kasih.`;
  return `https://wa.me/${nomorBersih}?text=${encodeURIComponent(msg)}`;
});

const formatDate = (dateString) => {
  if (!dateString) return '-';
  const date = new Date(dateString);
  return new Intl.DateTimeFormat('id-ID', {
    day: '2-digit', month: '2-digit', year: 'numeric'
  }).format(date);
};

const capitalize = (s) => {
  if (typeof s !== 'string') return '';
  return s.charAt(0).toUpperCase() + s.slice(1);
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
}

.brand {
  font-size: 1.5rem;
  font-weight: 700;
  color: var(--primary);
  text-decoration: none;
}

.main-content {
  display: flex;
  justify-content: center;
  padding-top: 3rem;
}

.card-container {
  width: 100%;
  max-width: 600px;
  animation: slideUp 0.5s ease-out;
}

.info-panel {
  background: white;
  padding: 1.5rem 2rem;
  border-radius: 1rem;
  box-shadow: 0 4px 6px -1px rgba(0,0,0,0.05);
  margin-bottom: 1.5rem;
}

.panel-title {
  color: var(--primary);
  margin-bottom: 1rem;
  font-size: 1.25rem;
}

.info-table {
  width: 100%;
  font-size: 0.95rem;
}

.info-table td {
  padding: 0.5rem 0;
  border-bottom: 1px solid #f3f4f6;
}

.info-table tr:last-child td {
  border-bottom: none;
}

.label {
  color: #6b7280;
  width: 130px;
}

.value {
  color: var(--dark);
}

.badge {
  padding: 0.25rem 0.75rem;
  border-radius: 1rem;
  font-size: 0.85rem;
  font-weight: 600;
  color: white;
}

.badge-diterima { background: #10b981; }
.badge-ditolak { background: #ef4444; }
.badge-pending { background: #f59e0b; }

.action-panel {
  background: white;
  padding: 2rem;
  border-radius: 1rem;
  box-shadow: 0 4px 6px -1px rgba(0,0,0,0.05);
}

.text-center { text-align: center; }
.text-primary { color: var(--primary); }
.text-gray { color: #6b7280; }
.mb-4 { margin-bottom: 1.5rem; }

.icon-big {
  font-size: 3.5rem;
  margin-bottom: 1rem;
}

.wa-number-box {
  background: #f0fdf4;
  border: 2px solid #10b981;
  border-radius: 1rem;
  padding: 1.5rem;
  margin: 1.5rem 0;
}

.wa-number-box span {
  font-size: 1.8rem;
  font-weight: 800;
  color: #065f46;
  letter-spacing: 1px;
}

.btn-wa {
  display: inline-block;
  background: #25D366;
  color: white;
  padding: 1rem 2.5rem;
  border-radius: 2rem;
  text-decoration: none;
  font-weight: 700;
  font-size: 1.1rem;
  transition: all 0.3s;
  box-shadow: 0 4px 15px rgba(37, 211, 102, 0.3);
}

.btn-wa:hover {
  transform: translateY(-2px);
  box-shadow: 0 6px 20px rgba(37, 211, 102, 0.4);
}

.help-text {
  color: #9ca3af;
  font-size: 0.85rem;
  margin-top: 1rem;
}

.alert-success {
  background: #f0fdf4;
  color: #065f46;
  padding: 1rem;
  border-radius: 0.75rem;
  margin-bottom: 1.5rem;
  text-align: center;
  border: 1px solid #10b981;
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
}

.form-control {
  width: 100%;
  padding: 0.85rem 1rem;
  border: 1px solid #d1d5db;
  border-radius: 0.75rem;
  font-size: 1rem;
  transition: all 0.3s ease;
}

.form-control:focus {
  outline: none;
  border-color: var(--primary);
  box-shadow: 0 0 0 4px rgba(79, 70, 229, 0.15);
}

.submit-btn {
  width: 100%;
  padding: 1rem;
  font-size: 1.1rem;
  border-radius: 0.75rem;
}

.current-wa {
  margin-top: 2rem;
  padding: 1.5rem;
  background: #f0fdf4;
  border-radius: 0.75rem;
  border: 1px dashed #10b981;
  text-align: center;
}

.current-wa strong {
  font-size: 1.5rem;
  color: #065f46;
  display: block;
  margin-top: 0.5rem;
}

.back-link {
  text-align: center;
  margin-top: 1.5rem;
}

.back-link a {
  color: #6b7280;
  text-decoration: none;
  font-weight: 500;
  transition: color 0.3s;
}

.back-link a:hover {
  color: var(--primary);
}

@keyframes slideUp {
  from { opacity: 0; transform: translateY(20px); }
  to { opacity: 1; transform: translateY(0); }
}
</style>
