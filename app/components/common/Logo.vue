<template>
  <NuxtLink to="/" class="logo-link">
    <!-- Badge con icono -->
    <div class="logo-badge">
      <q-icon name="directions_car" size="22px" color="white" />
    </div>
    <!-- Texto -->
    <div class="logo-text">
      <span class="logo-title">MOBAUTO</span>
      <span class="logo-subtitle">CHAPA · PINTURA · MECÁNICA</span>
    </div>
  </NuxtLink>
</template>

<style scoped>
.logo-link {
  display: inline-flex;
  align-items: center;
  gap: 10px;
  text-decoration: none;
}

.logo-badge {
  width: 38px;
  height: 38px;
  background-color: #1B3A5C;
  border-radius: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.logo-text {
  display: flex;
  flex-direction: column;
}

.logo-title {
  font-family: 'Montserrat', sans-serif;
  font-weight: 800;
  font-size: 18px;
  color: #1B3A5C;
  letter-spacing: 1px;
  line-height: 1.1;
}

.logo-subtitle {
  font-family: 'Roboto', sans-serif;
  font-weight: 400;
  font-size: 9px;
  color: #6b7280;
  letter-spacing: 0.5px;
}
</style>