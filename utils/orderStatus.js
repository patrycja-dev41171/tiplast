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
        refunded: {
            label: "Zwrócone",
            color: "#95a5a6" // szary
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
            color: "#e86006ff" // pomarańczowy
        },
        cod: {
            label: "Przy odbiorze",
            color: "#8e44ad" // niebieski
        },
        paid: {
            label: "Opłacone",
            color: "#2ecc71" // zielony
        },
        paid_cod: {
            label: "Opłacone przy odbiorze",
            color: "#2ecc71" // zielony jasny
        },
        cancelled: {
            label: "Anulowane",
            color: "#e74c3c" // czerwony
        },
        refunded: {
            label: "Zwrócone",
            color: "#95a5a6" // szary
        }
    }

    return map[status] || {
        label: "Nieznany status",
        color: "#7f8c8d"
    }
}
