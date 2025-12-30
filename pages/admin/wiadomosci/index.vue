<script setup>
definePageMeta({
  layout: 'admin',
  middleware: 'admin-client',
});

const { getAllMessages } = useMessages()

const messages = ref([]);
const loading = ref(true);

const fetchMessages = async () => {
  const { data, error } = await getAllMessages();

  if (!error) messages.value = data;

  loading.value = false;
};

onMounted(fetchMessages);
</script>

<template>
  <div class="admin-messages">
    <div class="top-bar">
      <h1>Wiadomości</h1>
    </div>

    <div v-if="loading" class="loader">Ładowanie...</div>

    <table v-else class="messages-table">
      <thead>
        <tr>
          <th>Typ</th>
          <th>Imię</th>
          <th>Email</th>
          <th>Temat</th>
          <th>Data</th>
          <th></th>
        </tr>
      </thead>

      <tbody>
        <tr 
          v-for="msg in messages" 
          :key="msg.id"
          class="row"
        >
          <td class="type">{{ msg.form_type }}</td>
          <td>{{ msg.name }}</td>
          <td>{{ msg.email }}</td>
          <td>{{ msg.subject }}</td>
          <td>{{ new Date(msg.created_at).toLocaleString() }}</td>
          <td>
            <NuxtLink :to="`/admin/wiadomosci/${msg.id}`" class="open-link">
              Otwórz
            </NuxtLink>
          </td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<style scoped>
.admin-messages {
  padding: 25px;
  min-height: 100vh;
}

/* 🔙 Górny pasek */
.top-bar {
  display: flex;
  align-items: center;
  gap: 20px;
  margin-bottom: 25px;
}

.back-btn {
  padding: 8px 14px;
  background: #e5e7eb;
  border-radius: 6px;
  text-decoration: none;
  color: #111;
  font-weight: 500;
  transition: 0.2s;
}

.back-btn:hover {
  background: #d1d5db;
}

.type {
  text-transform: capitalize;
}

h1 {
  font-size: 26px;
  font-weight: 700;
  margin: 0;
}

.messages-table {
  width: 100%;
  border-collapse: collapse;
  background: white;
  border-radius: 10px;
  overflow: hidden;
  box-shadow: 0 4px 14px rgba(0, 0, 0, 0.06);
}

.messages-table thead {
  background: #f3f4f6;
}

.messages-table th {
  padding: 14px 16px;
  text-align: left;
  font-weight: 600;
  font-size: 16x;
  color: #000000;
  border-bottom: 1px solid #e5e7eb;
}

.messages-table td {
  padding: 12px 16px;
  font-size: 14px;
  border-bottom: 1px solid #f1f1f1;
}

/* Hover wiersza */
.row:hover {
  background: #f9fafb;
  transition: 0.2s;
}

/* 🔗 Link do otwarcia wiadomości */
.open-link {
  color: #2563eb;
  font-weight: 600;
  text-decoration: underline;
}

.open-link:hover {
  color: #1d4ed8;
}

/* Loader */
.loader {
  font-size: 16px;
  padding: 20px;
  color: #444;
}
</style>
