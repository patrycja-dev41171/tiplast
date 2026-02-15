<template>
    <section class="inventory-page">
        <AdminPageHeader :text="`Reguły pakowania dla ${product.sku}`" />
            <h2 class="mb-10">{{ product.display_name }}</h2>

        <Table v-if="options.length && product && cartoons.length" :columns="columns" :rows="tableData">
            <template #cell-cartoon_sku="{ row }">
                <select v-model="row.cartoon_id">
                    <option v-for="cartoon in cartoons" :key="cartoon.id" :value="cartoon.id">
                        {{ cartoon.sku }}
                        ({{ cartoon.length }} cm × {{ cartoon.width }} cm × {{ cartoon.height }} cm)
                    </option>
                </select>
            </template>

            <template #cell-quantity_per_cartoon="{ row }">
                <input type="number" min="1" class="input" v-model.number="row.quantity_per_cartoon" />
            </template>

            <template #cell-weight="{ row }">
                <input type="number" min="0" step="0.01" class="input" v-model.number="row.weight" />
            </template>

             <template #cell-instructions="{ row }">
                <textarea rows="1" type="text"  class="input wide" v-model="row.instructions" />
            </template>



            <template #cell-actions="{ row }">
                <button class="save-btn mr-2" @click="saveRow(row)">
                    <v-icon icon="mdi-content-save" size="small" /> Zapisz
                </button>

                <button class="delete-btn" @click="deleteRow(row)">
                    <v-icon icon="mdi-delete" size="small" /> Usuń
                </button>
            </template>
        </Table>
        <AddNewPackagingOption :cartoons="cartoons" @add="addRule"/>
    </section>
</template>


<script setup>
definePageMeta({
    layout: 'admin',
    middleware: "admin-client",
});

const route = useRoute()

const { getProductById } = useProducts()
const { getPackagingOptionsById, updatePackagingOption,
    deletePackagingOption, createPackagingOption } = usePackagingOptions()
const { getAllCartoons } = useCartoons()

const product = ref(null)
const options = ref([])
const cartoons = ref([])

const getProduct = async () => {
    const { data } = await getProductById(route.params.id)
    product.value = data;
}

const getOptions = async () => {
    const { data } = await getPackagingOptionsById(route.params.id)
    options.value = data;
}

const getCartoons = async () => {
    const { data } = await getAllCartoons()
    cartoons.value = data;
}

const loadData = async () => {
    await Promise.all([
    getProduct(),
    getOptions(),
    getCartoons()
  ])
}


await loadData()

const tableData = computed(() => {
    if (!product.value) return []
    if (!options.value.length) return []
    if (!cartoons.value.length) return []

    return options.value.map((option, index) => {
        const cartoon = cartoons.value.find(
            c => c.id === option.cartoon_id
        )

        return {
            id: option.id,
            row_id: index + 1,
            display_name: product.value.display_name,
            cartoon_id: option.cartoon_id,
            cartoon_sku: cartoon?.sku ?? '—',
            cartoon_width: cartoon?.width,
            cartoon_lenght: cartoon?.length,
            cartoon_height: cartoon?.height,
            quantity_per_cartoon: option.quantity_per_cartoon,
            weight: option.max_weight,
            instructions: option.instructions,
        }
    })
})


const columns = [
    { label: "Reguła", key: "row_id" },
    { label: "Karton", key: "cartoon_sku" },
    { label: "Max ilość [sztuk]", key: "quantity_per_cartoon" },
    { label: "Max waga [kg]", key: "weight" },
    { label: "Instrukcje pakowania", key: "instructions" },
    { label: "Akcje", key: "actions" }
];

const saveRow = async (row) => {
    await updatePackagingOption(row.id, {
        cartoon_id: row.cartoon_id,
        quantity_per_cartoon: row.quantity_per_cartoon,
        max_weight: row.weight,
        instructions: row.instructions
    })

    alert("Zapisano zmiany!")

    await getOptions()
}

const deleteRow = async (row) => {
    if (!confirm('Czy na pewno usunąć tę regułę?')) return

    await deletePackagingOption(row.id)

    await getOptions()
}

const addRule = async (rule) => {
     await createPackagingOption({
    product_id: product.value.id,
    cartoon_id: rule.cartoon_id,
    quantity_per_cartoon: rule.quantity_per_cartoon,
    max_weight: rule.max_weight,
    instructions: rule.instructions
  })

  await getOptions()
}


</script>

<style scoped lang="scss">
.inventory-page {
    padding: 30px;
}

.section {
    background-color: #ebebeb;
    padding: 30px;
    border-radius: 8px;
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05);
}

.actions {
    display: flex;
    gap: 12px;

    button {
        height: 44px;
        display: flex;
        align-items: center;
        gap: 8px;
    }
}

.save-btn {
    background: #2563eb;
    color: white;
    border: none;
    padding: 8px 14px;
    border-radius: 4px;
    cursor: pointer;
    white-space: nowrap;
}

.save-btn:hover {
    background: #1d4ed8;
}

.delete-btn {
    background: #ffecec;
    border: none;
    padding: 8px 14px;
    border-radius: 4px;
    cursor: pointer;
    color: #c0392b;
    white-space: nowrap;
}

.delete-btn:hover {
    background: #ffd6d6;
}

input,
select, textarea {
    width: 140px;
    padding: 10px 12px;
    border-radius: 6px;
    border: 1px solid #cbd5e1; 
    background: #fff;
    font-size: 15px;
    color: #111;

    transition: border-color 0.15s ease, box-shadow 0.15s ease;

    &:focus {
        border-color: #2563eb;
        box-shadow: 0 0 0 3px rgba(37, 99, 235, 0.25);
        outline: none;
    }
}

select, .wide {
    width: 350px;
    height: auto;
}

td input {
    background: #f8fafc;
}
</style>