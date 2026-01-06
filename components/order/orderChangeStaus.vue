<template>
    <teleport to="body">
        <div v-if="modelValue" class="overlay" @click.self="close">
            <div class="modal">
                <h3>Zmień status zamówienia</h3>

                <label class="label">
                    Wybierz nowy status:
                    <select v-model="selectedStatus" class="select">
                        <option v-for="s in statuses" :key="s.id" :value="s.id">
                            {{ s.label }}
                        </option>
                    </select>
                </label>

                <label class="checkboxRow">
                    <input type="checkbox" v-model="notifyByEmail" />
                    Wyślij maila do klienta o zmianie statusu
                </label>

                <p v-if="error" class="error">{{ error }}</p>

                <div class="actions">
                    <button class="btn" @click="close" :disabled="loading">Anuluj</button>
                    <button class="btn primary" @click="save" :disabled="loading || !canSave">
                        {{ loading ? "Zapisywanie..." : "Zapisz" }}
                    </button>
                </div>
            </div>
        </div>
    </teleport>
</template>

<script setup>
import { computed, ref, watch } from "vue";

const props = defineProps({
    modelValue: { type: Boolean, default: false }, // sterowanie otwarciem
    orderId: { type: [String, Number], required: true },
    currentStatus: { type: String, required: true },
    statuses: { type: Array, default: () => [{ id: 'awaiting_payment', label: 'Oczekuje na płatność' }, { id: 'pending_approval', label: 'Do zatwierdzenia' }, { id: 'processing', label: 'W przygotowaniu' }, { id: 'shipped', label: 'Wysłane' }, { id: 'completed', label: 'Zrealizowane' }, { id: 'cancelled', label: 'Anulowane' }, { id: 'refunded:', label: 'Zwrócone' }] },

    // Funkcje z parenta (np. request do API)
    saveStatus: { type: Function, required: true }, // async ({ orderId, status }) => void
    sendEmail: { type: Function, default: null },   // async ({ orderId, status }) => void
});

const emit = defineEmits(["update:modelValue", "saved"]);

const selectedStatus = ref(props.currentStatus);
const notifyByEmail = ref(true);

const loading = ref(false);
const error = ref("");

watch(
    () => props.modelValue,
    (isOpen) => {
        if (isOpen) {
            // reset po otwarciu
            selectedStatus.value = props.currentStatus;
            notifyByEmail.value = false;
            error.value = "";
        }
    }
);

const canSave = computed(() => selectedStatus.value && selectedStatus.value !== props.currentStatus);

function close() {
    emit("update:modelValue", false);
}

async function save() {
    error.value = "";
    loading.value = true;

    try {
        await props.saveStatus({ orderId: props.orderId, status: selectedStatus.value });

        if (notifyByEmail.value) {
            if (!props.sendEmail) {
                throw new Error("Brak funkcji sendEmail przekazanej do komponentu.");
            }
            await props.sendEmail({ orderId: props.orderId, status: selectedStatus.value });
        }

        emit("saved", {
            orderId: props.orderId,
            status: selectedStatus.value,
            emailed: notifyByEmail.value,
        });

        close();
    } catch (e) {
        error.value = e?.message ?? "Wystąpił błąd.";
    } finally {
        loading.value = false;
    }
}
</script>

<style scoped>
.overlay {
    position: fixed;
    inset: 0;
    background: rgba(0, 0, 0, .65);
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 16px;
    z-index: 9999;
}

.modal {
    width: 100%;
    max-width: 420px;
    background: #fff;
    border-radius: 12px;
    padding: 24px;
    box-shadow: 0 10px 30px rgba(0, 0, 0, .2);
}

.label {
    display: block;
    margin-top: 12px;
    font-weight: 600;
}

.select {
    width: 100%;
    margin-top: 6px;
    padding: 10px;
    border-radius: 10px;
    border: 1px solid #ddd;
}

.checkboxRow {
    margin-top: 12px;
    display: flex;
    gap: 10px;
    align-items: center;
}

.actions {
    margin-top: 16px;
    display: flex;
    justify-content: flex-end;
    gap: 10px;
}

.btn {
    padding: 10px 14px;
    border-radius: 10px;
    border: 1px solid #ddd;
    background: #fff;
    cursor: pointer;
}

.btn.primary {
    border-color: #111;
    background: #111;
    color: #fff;
}

.btn:disabled {
    opacity: .6;
    cursor: not-allowed;
}

.error {
    margin-top: 10px;
    color: #b00020;
}
</style>
