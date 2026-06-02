<template>
  <div class="landing-wrapper">
    <!-- Navbar -->
    <nav class="landing-nav">
      <div class="nav-content">
        <div class="brand">✨ BK Digital</div>
        <div class="nav-actions">
          <router-link to="/login" class="btn btn-outline">Masuk</router-link>
          <router-link to="/register" class="btn btn-primary">Daftar Baru</router-link>
        </div>
      </div>
    </nav>

    <!-- Hero Section -->
    <header class="hero-section">
      <div class="hero-content">
        <h1 class="hero-title">Layanan Bimbingan & Konseling Digital</h1>
        <p class="hero-subtitle">
          Ruang aman untuk berbagi cerita, keluh kesah, dan merencanakan masa depan. Kami di sini untuk mendengarkan dan mendampingi Anda meraih potensi terbaik.
        </p>
        <div class="hero-cta">
          <router-link to="/register" class="btn btn-primary btn-lg">Daftar Sesi Sekarang</router-link>
        </div>
      </div>
    </header>

    <!-- Features Section -->
    <section class="features-section">
      <div class="container">
        <h2 class="section-title">Mengapa Menggunakan BK Digital?</h2>
        <div class="features-grid">
          <div class="feature-card">
            <div class="feature-icon">🔒</div>
            <h3 class="feature-title">Kerahasiaan Terjamin</h3>
            <p class="feature-desc">Setiap sesi dan data yang Anda bagikan akan dijaga kerahasiaannya dengan standar etika konseling profesional.</p>
          </div>
          <div class="feature-card">
            <div class="feature-icon">⏰</div>
            <h3 class="feature-title">Jadwal Fleksibel</h3>
            <p class="feature-desc">Tentukan waktu yang paling nyaman bagi Anda untuk melakukan sesi bimbingan bersama Guru BK pilihan.</p>
          </div>
          <div class="feature-card">
            <div class="feature-icon">💬</div>
            <h3 class="feature-title">Terhubung via WhatsApp</h3>
            <p class="feature-desc">Setelah sesi disetujui, Anda dapat langsung terhubung dengan Guru BK melalui WhatsApp untuk komunikasi yang lebih personal.</p>
          </div>
        </div>
      </div>
    </section>

    <!-- Footer -->
    <footer class="landing-footer">
      <p>&copy; 2026 BK Digital. Sistem Informasi Bimbingan dan Konseling.</p>
    </footer>
  </div>
</template>

<script setup>
</script>

<style scoped>
.landing-wrapper {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  background-color: #fafafa;
}

.landing-nav {
  background: rgba(255, 255, 255, 0.9);
  backdrop-filter: blur(10px);
  position: fixed;
  top: 0;
  width: 100%;
  z-index: 100;
  box-shadow: 0 1px 3px rgba(0,0,0,0.05);
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
  font-weight: 800;
  color: var(--primary);
}

.nav-actions {
  display: flex;
  gap: 1rem;
}

.btn-outline {
  border: 2px solid var(--primary);
  color: var(--primary);
  background: transparent;
}

.btn-outline:hover {
  background: rgba(79, 70, 229, 0.1);
  transform: translateY(-2px);
}

.hero-section {
  padding: 10rem 2rem 6rem;
  background: linear-gradient(135deg, #f3e8ff 0%, #e0e7ff 100%);
  text-align: center;
  position: relative;
  overflow: hidden;
}

.hero-content {
  max-width: 800px;
  margin: 0 auto;
  position: relative;
  z-index: 2;
  animation: slideUp 0.8s cubic-bezier(0.16, 1, 0.3, 1);
}

.hero-title {
  font-size: 3.5rem;
  font-weight: 800;
  color: #1e1b4b;
  line-height: 1.2;
  margin-bottom: 1.5rem;
}

.hero-subtitle {
  font-size: 1.2rem;
  color: #4b5563;
  margin-bottom: 2.5rem;
  line-height: 1.6;
}

.btn-lg {
  padding: 1rem 2.5rem;
  font-size: 1.2rem;
  border-radius: 3rem;
  box-shadow: 0 10px 25px rgba(79, 70, 229, 0.4);
}

.btn-lg:hover {
  box-shadow: 0 15px 35px rgba(79, 70, 229, 0.5);
}

.features-section {
  padding: 5rem 2rem;
  background: white;
}

.container {
  max-width: 1200px;
  margin: 0 auto;
}

.section-title {
  text-align: center;
  font-size: 2.5rem;
  font-weight: 700;
  color: var(--dark);
  margin-bottom: 3rem;
}

.features-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 2rem;
}

.feature-card {
  padding: 2.5rem 2rem;
  background: #f8fafc;
  border-radius: 1.5rem;
  text-align: center;
  transition: all 0.4s ease;
  border: 1px solid #e2e8f0;
}

.feature-card:hover {
  transform: translateY(-10px);
  box-shadow: 0 20px 40px rgba(0,0,0,0.08);
  background: white;
}

.feature-icon {
  font-size: 3rem;
  margin-bottom: 1.5rem;
}

.feature-title {
  font-size: 1.25rem;
  font-weight: 700;
  color: var(--dark);
  margin-bottom: 1rem;
}

.feature-desc {
  color: #64748b;
  line-height: 1.6;
}

.landing-footer {
  text-align: center;
  padding: 2rem;
  background: var(--dark);
  color: #94a3b8;
  margin-top: auto;
}

@keyframes slideUp {
  from { opacity: 0; transform: translateY(40px); }
  to { opacity: 1; transform: translateY(0); }
}

@media (max-width: 768px) {
  .hero-title {
    font-size: 2.5rem;
  }
}
</style>
