export const getOrderStatusMeta = (status) => {
    const map = {
        awaiting_payment: {
            label: "Oczekuje na płatność",
            color: "#e86006ff" // pomarańczowy
        },
        pending_approval: {
            label: "Do zatwierdzenia",
            color: "#d8c516ff",
            customer_label: "Oczekuje na zatwierdzenie"
        },
        processing: {
            label: "W przygotowaniu",
            color: "#1d63cdff" // zielony
        },
        shipped: {
            label: "Wysłane",
            color: "#8e44ad" // fioletowy
        },
        completed: {
            label: "Zrealizowane",
            color: "#2ecc71" // zielony jasny
        },
        cancelled: {
            label: "Anulowane",
            color: "#e74c3c" // czerwony
        },
        partial_refund: {
            label: "Częściowy zwrot",
            color: "#f59e0b"
        },
        full_refund: {
            label: "Całkowity zwrot",
            color: "#6b7280"
        }
    }

    return map[status] || {
        label: "Nieznany status",
        color: "#7f8c8d"
    }
}

export const getPaymentStatusMeta = (status) => {
    const map = {
        pending: {
            label: "Oczekuje na płatność",
            color: "#e86006ff"
        },
        cod: {
            label: "Przy odbiorze",
            color: "#8e44ad"
        },
        paid: {
            label: "Opłacone",
            color: "#2ecc71"
        },
        paid_cod: {
            label: "Opłacone przy odbiorze",
            color: "#2ecc71"
        },
        cancelled: {
            label: "Anulowane",
            color: "#e74c3c"
        },
        partial_refund_issued: {
            label: "Zlecono częściowy zwrot kosztów",
            color: "#f59e0b"
        },
        full_refund_issued: {
            label: "Zlecono całkowity zwrot kosztów",
            color: "#6b7280"
        }
    }

    return map[status] || {
        label: "Nieznany status",
        color: "#7f8c8d"
    }
}
