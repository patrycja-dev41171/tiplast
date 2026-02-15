export const useCartShippingDetails = () => {
    const { $supabase } = useNuxtApp()

    const saveShippingDetails = async (payload) => {
        const cleanPayload = {
            cart_id: payload.cart_id,
            cod: payload.cod,
            service: payload.service,
            type: payload.type,
            currency: payload.currency ?? 'PLN',
            service_id: payload.service_id,
            price_gross: payload.price_gross,
            price_net: payload.price_net
        }

        const { data, error } = await $supabase
            .from('cart_shipping_details')
            .upsert(cleanPayload, {
                onConflict: 'cart_id'
            })
            .select()
            .single()

        if (error) throw error
        return data
    }



    const getShippingDetailsByCartId = async (cart_id) => {
        if (!cart_id) return null

        const { data, error } = await $supabase
            .from('cart_shipping_details')
            .select('*')
            .eq('cart_id', cart_id)
            .maybeSingle()

        if (error) {
            console.error('[getShippingDetailsByCartId]', error)
            throw error
        }

        return data
    }


    const clearShippingDetails = async (cart_id) => {
        if (!cart_id) return

        const { error } = await $supabase
            .from('cart_shipping_details')
            .delete()
            .eq('cart_id', cart_id)

        if (error) {
            console.error('[clearShippingDetails]', error)
            throw error
        }
    }

    return {
        saveShippingDetails,
        getShippingDetailsByCartId,
        clearShippingDetails
    }
}
