<template>
  <table class="base-table">
    <thead>
      <tr>
        <th v-for="col in columns" :key="col.key">
          {{ col.label }}
        </th>
      </tr>
    </thead>

    <tbody>
      <tr v-for="row in rows" :key="row[idKey]">
        <td
          v-for="col in columns"
          :key="col.key"
        >
          <!-- Slot dynamiczny -->
          <slot
            :name="`cell-${col.key}`"
            :row="row"
            :value="row[col.key]"
          >
            <!-- Fallback: zwykła wartość -->
            {{ row[col.key] }}
          </slot>
        </td>
      </tr>
    </tbody>
  </table>
</template>

<script setup>
defineProps({
  columns: {
    type: Array,
    required: true
  },
  rows: {
    type: Array,
    required: true
  },
  idKey: {
    type: String,
    default: "id"
  }
});
</script>

<style scoped lang="scss">
.base-table {
  width: 100%;
  border-collapse: collapse;
  background: white;
  border-radius: 8px;
  overflow: hidden;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05);
}

.base-table th {
  padding: 14px;
  background: #f7f7f7;
  font-weight: 600;
  border-bottom: 1px solid #e3e3e3;
  text-align: center;
}

.base-table td {
  padding: 14px;
  border-bottom: 1px solid #e5e5e5;
  text-align: center;
}

.base-table tr:last-child td {
  border-bottom: none;
}

@media (max-width: 600px) {
  .base-table th,
  .base-table td {
    padding: 10px;
    font-size: 14px;
  }
}


</style>
