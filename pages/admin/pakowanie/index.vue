<template>
    <section class="inventory-page">
        <div class="page-top">
            <AdminPageHeader text="Kartony / Pakowanie" />
            <button class="export-btn" :disabled="exporting" @click="exportExcel">
                <v-icon :icon="exporting ? 'mdi-loading' : 'mdi-microsoft-excel'" size="18"
                    :style="exporting ? 'animation:spin .8s linear infinite' : ''" />
                {{ exporting ? 'Generowanie...' : 'Eksportuj reguły do Excel' }}
            </button>
        </div>

        <PakowanieTable :cartoons="cartoonsWithStock" />
    </section>
</template>

<script setup>
definePageMeta({
    layout: 'admin',
    middleware: 'admin-client'
});

const { getAllCartoons } = useCartoons();
const { getAllCartoonsStock } = useCartoonsStock();

const cartoonsWithStock = ref([]);
const exporting = ref(false);

onMounted(async () => {
    const { data: cartoons } = await getAllCartoons();
    const stock = await getAllCartoonsStock();

    cartoonsWithStock.value = cartoons.map((p) => {
        const s = stock.find((i) => i.record_id === p.id);
        return { ...p, quantity: s?.quantity ?? 0, updated_at: s?.updated_at };
    });
});

const exportExcel = async () => {
    exporting.value = true;
    try {
        const rows = await $fetch('/api/export/packaging');
        const { utils, writeFile } = await import('xlsx');

        const sheetData = rows.map(r => ({
            'SKU produktu':         r.products?.sku ?? '—',
            'Nazwa produktu':       r.products?.display_name ?? '—',
            'SKU kartonu':          r.cartoons?.sku ?? '—',
            'Wymiary kartonu (cm)': r.cartoons
                ? `${r.cartoons.length} × ${r.cartoons.width} × ${r.cartoons.height}`
                : '—',
            'Max ilość (szt.)':     r.quantity_per_cartoon ?? '',
            'Max waga (kg)':        r.max_weight ?? '',
            'Instrukcje pakowania': r.instructions ?? '',
        }));

        const wb = utils.book_new();
        const ws = utils.json_to_sheet(sheetData);

        // szerokości kolumn
        ws['!cols'] = [
            { wch: 18 }, { wch: 40 }, { wch: 16 }, { wch: 24 },
            { wch: 16 }, { wch: 14 }, { wch: 50 },
        ];

        utils.book_append_sheet(wb, ws, 'Reguły pakowania');
        writeFile(wb, `reguly-pakowania-${new Date().toISOString().slice(0, 10)}.xlsx`);
    } catch (e) {
        console.error(e);
        alert('Błąd podczas eksportu.');
    }
    exporting.value = false;
};
</script>

<style scoped>
.inventory-page { padding: 30px; }

.page-top {
    display: flex;
    align-items: center;
    justify-content: space-between;
    flex-wrap: wrap;
    gap: 12px;
    margin-bottom: 4px;
}

.export-btn {
    display: inline-flex;
    align-items: center;
    gap: 8px;
    padding: 10px 18px;
    background: #217346;
    color: #fff;
    border: none;
    border-radius: 8px;
    font-size: 14px;
    font-weight: 500;
    cursor: pointer;
    transition: background .15s;
    white-space: nowrap;
}
.export-btn:hover:not(:disabled) { background: #185c38; }
.export-btn:disabled { opacity: .6; cursor: default; }

@keyframes spin { to { transform: rotate(360deg); } }
</style>
