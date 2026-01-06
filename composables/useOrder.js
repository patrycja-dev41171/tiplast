export const useOrder = () => {
    const { $supabase } = useNuxtApp()

    const addOrder = async ({ cart, customer, shipping, payment }) => {

        // 1️⃣ ORDER
        const { data: order, error } = await $supabase
            .from('orders')
            .insert({
                ...customer,
                order_number: null,
                order_id: cart.id,
                status: cart.cart_payment_details.cod ? 'pending_approval' : 'awaiting_payment',
                payment_status: cart.cart_payment_details.cod ? 'cod' : 'pending',
            })
            .select()
            .single()

        if (error) throw error

        // 2️⃣ ITEMS
        await addOrderItems(order.order_id, cart.items)

        // 3️⃣ SHIPPING
        await addOrderShippingDetails(order.order_id, cart)

        // 4️⃣ PAYMENT
        await addOrderPaymentDetails(order.order_id, cart)


        await addOrderParcels(order.order_id, cart)

        return order
    }

    const addOrderItems = async (orderId, cartItems) => {
        const orderItems = cartItems.map(item => ({
            order_id: orderId,
            product_id: item.product.id,
            quantity: item.quantity,
            price_snapshot: item.price_snapshot
        }))

        const { error } = await $supabase
            .from('order_items')
            .insert(orderItems)

        if (error) throw error

        return
    }

    const addOrderShippingDetails = async (orderId, cart) => {
        if (!cart.cart_shipping_details) return

        const {
            cart_id,
            created_at,
            ...shippingDetails
        } = cart.cart_shipping_details

        const payload = {
            order_id: orderId,
            ...shippingDetails
        }

        const { error } = await $supabase
            .from('order_shipping_details')
            .insert(payload)

        if (error) throw error
    }

    const addOrderPaymentDetails = async (orderId, cart) => {
        if (!cart.cart_payment_details) return

        const {
            cart_id,
            ...paymentDetails
        } = cart.cart_payment_details

        const payload = {
            order_id: orderId,
            ...paymentDetails
        }

        const { error } = await $supabase
            .from('order_payment_details')
            .insert(payload)

        if (error) throw error
    }

    const addOrderParcels = async (orderId, cart) => {
        const cartParcels = cart.cart_parcels
        if (!cartParcels?.length) return

        for (const cartParcel of cartParcels) {
            const { data: orderParcel, error } = await $supabase
                .from('order_parcels')
                .insert({
                    order_id: orderId,
                    cartoon_id: cartParcel.cartoon_id,
                    packaging_option_id: cartParcel.packaging_option_id,
                    length: cartParcel.length,
                    width: cartParcel.width,
                    height: cartParcel.height,
                    weight: cartParcel.weight
                })
                .select()
                .single()

            if (error) throw error

            await addOrderParcelItems(orderParcel.id, cartParcel.cart_parcel_items)

            await addOrderPackingInstructions(orderParcel.id, cartParcel.cart_packing_instructions)
        }
    }

    const addOrderParcelItems = async (orderParcelId, cartParcelItems = []) => {
        if (!cartParcelItems.length) return

        const payload = cartParcelItems.map(i => ({
            order_parcel_id: orderParcelId,
            product_id: i.product_id,
            quantity: i.quantity
        }))

        const { error } = await $supabase
            .from('order_parcel_items')
            .insert(payload)

        if (error) throw error
    }

    const addOrderPackingInstructions = async (orderParcelId, instruction) => {
        if (!instruction) return

        const {
            cart_parcel_id,
            ...data
        } = instruction

        const payload = {
            order_parcel_id: orderParcelId,
            ...data
        }

        const { error } = await $supabase
            .from('order_packing_instructions')
            .insert(payload)

        if (error) throw error
    }

    const deleteOrder = async (orderId) => {
        if (!orderId) throw new Error("orderId required")

        const { error } = await $supabase
            .from('orders')
            .delete()
            .eq('order_id', orderId)

        if (error) throw error
    }

    const getOrders = async () => {
        const { data, error } = await $supabase
            .from('orders')
            .select(`
        *,
        order_shipping_details (*),
        order_payment_details (*),
        order_items (*)
      `)

        if (error) {
            console.error('[getOrders]', error)
            throw error
        }

        return data
    }

    const getOrderById = async (orderId) => {
        const { data, error } = await $supabase
            .from('orders')
            .select(`
        *,
        order_items (
          *,
          product:products (
            *
          )
        ),
        order_shipping_details (*),
        order_payment_details (*),
        order_parcels (
          *,
          order_parcel_items (
           *,
            product:products (
              *
            )
          ),
          order_packing_instructions (
            *
          )
        )
      `)
            .eq('order_id', orderId)
            .single()

        if (error) {
            console.error('[getOrderById]', error)
            throw error
        }

        return data
    }

    const updateOrderStatus = async (orderId, status) => {
        if (!orderId) throw new Error("orderId required");
        if (!status) throw new Error("status required");

        // opcjonalnie: czy chcesz też zaktualizować timestamp
        const payload = {
            status,
            updated_at: new Date().toISOString(),
        };

        const { error } = await $supabase
            .from("orders")
            .update(payload)
            .eq("order_id", orderId);

        if (error) throw error;
    };


    return {
        addOrder,
        deleteOrder,
        getOrders,
        getOrderById,
        updateOrderStatus
    }
}