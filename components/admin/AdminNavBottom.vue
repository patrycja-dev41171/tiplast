<template>
  <div class="nav-bottom">
    <NuxtLink to="https://tiplast.pl/" target="_blank" class="web">
      www.tiplast.pl <v-icon icon="mdi-open-in-new" size="16" />
    </NuxtLink>
    <!-- <div class="user-section">
      <div class="user-avatar">AP</div>
      <div class="user-info">
        <span class="user-name">Admin Panel</span>
        <span class="user-role">Administrator</span>
      </div>
      <v-icon icon="mdi-chevron-down" size="18" class="user-chevron" />
    </div> -->
    <button class="logout-btn" @click="$emit('logout')">
      Wyloguj się <v-icon icon="mdi-logout" />
    </button>
  </div>
</template>

<script setup>
defineEmits(['logout']);
</script>

<style scoped lang="scss">
.nav-bottom {
  padding: 12px 12px 20px;
  border-top: 1px solid rgba(255, 255, 255, 0.08);
  display: flex;
  flex-direction: column;
  gap: 10px;
  margin-top: 12px;
}

.web {
  display: flex;
  align-items: center;
  gap: 6px;
  color: #4ade80;
  font-weight: 600;
  font-size: 14px;
  text-decoration: none;
  padding: 4px;

  &:hover {
    text-decoration: underline;
  }
}

.user-section {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 10px;
  border-radius: 8px;
  background: rgba(255, 255, 255, 0.06);
  cursor: default;
}

.user-avatar {
  width: 36px;
  height: 36px;
  border-radius: 50%;
  background: #2a5c2a;
  color: #fff;
  font-size: 13px;
  font-weight: 700;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}

.user-info {
  flex: 1;
  display: flex;
  flex-direction: column;
  min-width: 0;
}

.user-name {
  color: #fff;
  font-size: 13px;
  font-weight: 600;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.user-role {
  color: rgba(255, 255, 255, 0.5);
  font-size: 11px;
}

.user-chevron {
  color: rgba(255, 255, 255, 0.4);
  flex-shrink: 0;
}

.logout-btn {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  padding: 10px 14px;
  background: rgba(255, 255, 255, 0.08);
  color: rgba(255, 255, 255, 0.75);
  border: none;
  border-radius: 8px;
  cursor: pointer;
  font-weight: 500;
  font-size: 14px;
  transition: background 0.15s, color 0.15s;

  &:hover {
    background: #be123c;
    color: #fff;
  }
}
</style>
