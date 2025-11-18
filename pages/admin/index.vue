<script setup>
onMounted(async () => {
  const { data } = await $supabase.auth.getSession();
  if (data.session) {
    router.push("/admin/dashboard");
  }
});

const email = ref("");
const password = ref("");
const loading = ref(false);
const errorMsg = ref("");

const { $supabase } = useNuxtApp();
const router = useRouter();

const login = async () => {
  loading.value = true;
  errorMsg.value = "";

  const { data, error } = await $supabase.auth.signInWithPassword({
    email: email.value,
    password: password.value,
  });

  loading.value = false;

  if (error) {
    errorMsg.value = error.message;
    return;
  }

  router.push("/admin/dashboard");
};
</script>

<template>
  <div class="login-wrapper">
    <form class="login-box" @submit.prevent="login">
      <h1>Panel administratora</h1>

      <label>Email</label>
      <input v-model="email" type="email" required />

      <label>Hasło</label>
      <input v-model="password" type="password" required />

      <button type="submit" :disabled="loading">
        {{ loading ? "Loguję..." : "Zaloguj się" }}
      </button>

      <p v-if="errorMsg" class="error">{{ errorMsg }}</p>
    </form>
  </div>
</template>

<style scoped>
.login-wrapper {
  min-height: 100vh;
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 20px;
}

.login-box {
  max-width: 350px;
  width: 100%;
  display: flex;
  flex-direction: column;
  gap: 15px;
  background: #fff;
  padding: 25px;
  border-radius: 8px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
}

input {
  padding: 8px 10px;
  border: 1px solid #ccc;
  border-radius: 6px;
}

button {
  padding: 10px;
  background: #2e7d32;
  border: none;
  color: white;
  cursor: pointer;
  border-radius: 6px;
  font-weight: bold;
}

button:disabled {
  opacity: 0.6;
}

.error {
  color: #d32f2f;
  font-size: 14px;
}
</style>
