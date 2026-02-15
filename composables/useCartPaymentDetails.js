export const useCartPaymentDetails = () => {
    const { $supabase } = useNuxtApp()

    const savePaymentDetails = async (payload) => {
        const { data, error } = await $supabase
            .from('cart_payment_details')
            .upsert(payload, {
                onConflict: 'cart_id'
            })
            .select()
            .single()

        if (error) throw error
        return data
    }

    return {
        savePaymentDetails,
    }
}
