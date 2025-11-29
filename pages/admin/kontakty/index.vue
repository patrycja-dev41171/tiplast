<script setup>
definePageMeta({
  layout: 'admin',
  middleware: 'admin-client'
});

const { fetchMarketingContacts } = useMarketingContacts()

const contacts = ref([]);
const loading = ref(true);

onMounted(async () => {
 contacts.value = await fetchMarketingContacts()
  loading.value = false;
});
</script>

<template>
  <div class="marketing-page">
    <div class="top-bar">
      <h1>Kontakty marketingowe</h1>
    </div>

    <div v-if="loading" class="loading">Ładowanie...</div>

    <table v-else class="contacts-table">
      <thead>
        <tr>
          <th>Imię</th>
          <th>Email</th>
          <th>Telefon</th>
          <th>Data zapisu</th>
        </tr>
      </thead>

      <tbody>
        <tr v-for="c in contacts" :key="c.id">
          <td>{{ c.name || '—' }}</td>
          <td>{{ c.email }}</td>
          <td>{{ c.phone || '—' }}</td>
          <td>{{ new Date(c.created_at).toLocaleString() }}</td>
        </tr>
      </tbody>
    </table>

    <p v-if="contacts.length === 0 && !loading" class="empty-msg">
      Brak zapisanych kontaktów marketingowych.
    </p>
  </div>
</template>

<style scoped>
.marketing-page {
  padding: 20px;
}

/* Top bar */
.top-bar {
  display: flex;
  align-items: center;
  gap: 20px;
  margin-bottom: 25px;
}

.top-bar h1 {
  font-size: 26px;
  margin: 0;
}

.back-btn {
  background: #e5e7eb;
  padding: 8px 14px;
  border-radius: 6px;
  text-decoration: none;
  color: #111;
  font-weight: 500;
  transition: background .2s;
}

.back-btn:hover {
  background: #d1d5db;
}

.loading {
  font-size: 16px;
  padding: 20px;
}

/* Table styles */
.contacts-table {
  width: 100%;
  border-collapse: collapse;
  background: #fff;
  border-radius: 8px;
  overflow: hidden;
  box-shadow: 0 3px 10px rgba(0,0,0,0.06);
}

.contacts-table th {
  background: #f3f4f6;
  padding: 14px;
  text-align: left;
  font-weight: 600;
}

.contacts-table td {
  padding: 14px;
  border-bottom: 1px solid #eee;
}

/* Empty message */
.empty-msg {
  margin-top: 20px;
  color: #666;
}
</style>
