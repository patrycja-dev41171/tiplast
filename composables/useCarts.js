export const useCarts = () => {
    const { $supabase } = useNuxtApp()

    const cartId = useCookie("cart_id", {
        sameSite: "lax"
    })

    const createCart = async () => {
        const { data, error } = await $supabase
            .from("carts")
            .insert({})
            .select()
            .single()

        if (error) {
            console.error(error)
            throw error
        }

        cartId.value = data.id

        return data.id
    }

    const getOrCreateCart = async () => {
        if (cartId.value) {
            return cartId.value
        }

        return await createCart()
    }

    const normalizePrice = (value) => {
        if (typeof value === "string") {
            return Number(value.replace(",", "."))
        }
        return Number(value)
    }


    const add = async (product_id, quantity, price_snapshot) => {
        const cart_id = await getOrCreateCart()
        const price = normalizePrice(price_snapshot)

        const { data: existingItem } = await $supabase
            .from("cart_items")
            .select("id, quantity")
            .eq("cart_id", cart_id)
            .eq("product_id", product_id)
            .single()

        if (existingItem) {
            const { error } = await $supabase
                .from("cart_items")
                .update({
                    quantity: existingItem.quantity + quantity
                })
                .eq("id", existingItem.id)

            if (error) throw error
        } else {
            const { error } = await $supabase
                .from("cart_items")
                .insert({
                    cart_id,
                    product_id,
                    quantity,
                    price_snapshot: price
                })

            if (error) throw error
        }
    }


    const getCart = async () => {
        if (!cartId.value) {
            return {
                cart: null,
                items: [],
                total: 0
            }
        }

        const { data, error } = await $supabase
            .from("carts")
            .select(`
    *,
    cart_shipping_details (
      id,
      cod,
      service,
      type,
      currency,
      service_id,
      price_gross,
      price_net,
      created_at
    ),
    cart_payment_details (
*),
    cart_parcels (*,
    cart_parcel_items (*),
    cart_packing_instructions (*)
    ),
    cart_items (
      id,
      quantity,
      price_snapshot,
      product:products (
        *,
        stock:product_stock (
          quantity,
          updated_at
        )
      )
    )
  `)
            .eq("id", cartId.value)
            .single()

        if (error) {
            console.error(error)
            throw error
        }

        const items = data.cart_items || []

        const total_price_number = items.reduce((sum, item) => {
            return sum + item.quantity * item.price_snapshot
        }, 0)



        const total_price = Number(total_price_number.toFixed(2))

        const total_quantity = items.reduce((sum, item) => {
            return sum + item.quantity
        }, 0)

        return {
            ...data,
            items,
            total_price: total_price,
            total_quantity
        }
    }

    const removeItem = async (product_id) => {
        if (!cartId.value) {
            return
        }

        const { error } = await $supabase
            .from("cart_items")
            .delete()
            .eq("cart_id", cartId.value)
            .eq("product_id", product_id)

        if (error) {
            console.error(error)
            throw error
        }
    }

    const updateItemQuantity = async (product_id, quantity) => {
        if (!cartId.value) {
            return
        }

        // normalizacja
        const qty = Number(quantity)

        if (Number.isNaN(qty)) {
            throw new Error("Invalid quantity")
        }

        // jeśli 0 lub mniej → usuwamy item
        if (qty <= 0) {
            const { error } = await $supabase
                .from("cart_items")
                .delete()
                .eq("cart_id", cartId.value)
                .eq("product_id", product_id)

            if (error) {
                console.error(error)
                throw error
            }

            return
        }

        // update ilości
        const { error } = await $supabase
            .from("cart_items")
            .update({ quantity: qty })
            .eq("cart_id", cartId.value)
            .eq("product_id", product_id)

        if (error) {
            console.error(error)
            throw error
        }
    }

    const updateCartById = async (
        payload
    ) => {
        if (!cartId) {
            throw new Error('Brak cartId')
        }

        const { data, error } = await $supabase
            .from('carts')
            .update({
                ...payload,
                updated_at: new Date().toISOString()
            })
            .eq('id', cartId.value)
            .select()
            .maybeSingle()

        if (error) {
            console.error('[updateCartById]', error)
            throw error
        }

        return data
    }

    const packProduct = async (productId, quantity) => {
        let remainingQty = quantity

        const { data: rules } = await $supabase
            .from('packaging_options')
            .select(`
      id,
      quantity_per_cartoon,
      max_weight,
      instructions,
      cartoons (*)
    `)
            .eq('product_id', productId)

        if (!rules?.length) {
            console.warn(`Brak reguł pakowania dla produktu ${productId}`)
            return []
        }

        const sortedRules = [...rules].sort(
            (a, b) => b.quantity_per_cartoon - a.quantity_per_cartoon
        )

        const result = []

        for (const rule of sortedRules) {
            if (remainingQty <= 0) break

            const boxes = Math.floor(
                remainingQty / rule.quantity_per_cartoon
            )

            for (let i = 0; i < boxes; i++) {
                result.push({
                    cartoon_id: rule.cartoons.id,
                    packaging_option_id: rule.id,

                    length: rule.cartoons.length,
                    width: rule.cartoons.width,
                    height: rule.cartoons.height,
                    max_weight: rule.max_weight,

                    item: {
                        product_id: productId,
                        quantity: rule.quantity_per_cartoon
                    },

                    packing_instruction: {
                        quantity_per_cartoon: rule.quantity_per_cartoon,
                        max_weight: rule.max_weight,
                        note: rule.instructions || null
                    }
                })
            }

            remainingQty -= boxes * rule.quantity_per_cartoon
        }

        // resztka → najmniejszy karton
        if (remainingQty > 0) {
            const smallest = [...sortedRules].sort(
                (a, b) => a.quantity_per_cartoon - b.quantity_per_cartoon
            )[0]

            result.push({
                cartoon_id: smallest.cartoons.id,
                packaging_option_id: smallest.id,

                length: smallest.cartoons.length,
                width: smallest.cartoons.width,
                height: smallest.cartoons.height,
                max_weight: smallest.max_weight,

                item: {
                    product_id: productId,
                    quantity: remainingQty
                },

                packing_instruction: {
                    quantity_per_cartoon: smallest.quantity_per_cartoon,
                    max_weight: smallest.max_weight,
                    note: smallest.instructions || null
                }
            })
        }

        return result
    }

    const calculateParcels = async () => {
        if (!cartId.value) return []

        const { data: items } = await $supabase
            .from('cart_items')
            .select(`
      quantity,
      product_id,
      products (
        packaging_group_products (
          packaging_group_id
        )
      )
    `)
            .eq('cart_id', cartId.value)

        if (!items?.length) return []

        const grouped = {}
        const standalone = []

        for (const item of items) {
            const groupId =
                item.products?.packaging_group_products?.[0]?.packaging_group_id

            if (groupId) {
                grouped[groupId] ??= []
                grouped[groupId].push(item)
            } else {
                standalone.push(item)
            }
        }

        const parcels = []

        // ✅ 1) standalone: każdy produkt osobno
        for (const item of standalone) {
            const packed = await packProduct(item.product_id, item.quantity) // zwraca tablicę paczek
            // packProduct daje "item" -> zamień na "items: [...]"
            parcels.push(
                ...packed.map(p => ({
                    cartoon_id: p.cartoon_id,
                    packaging_option_id: p.packaging_option_id,
                    length: p.length,
                    width: p.width,
                    height: p.height,
                    weight: p.max_weight,
                    items: [p.item], // <--- ważne
                    packing_instruction: p.packing_instruction
                }))
            )
        }

        // ✅ 2) grupy: jedna paczka (albo kilka jeśli total wymusi), ale zawsze z itemsami wielu produktów
        for (const groupId in grouped) {
            const groupItems = grouped[groupId].map(i => ({
                product_id: i.product_id,
                quantity: i.quantity
            }))

            const totalQty = groupItems.reduce((sum, i) => sum + i.quantity, 0)

            // wybieramy "produkt bazowy" do reguł pakowania (tak jak wcześniej u Ciebie)
            const baseProductId = grouped[groupId][0].product_id

            // packProduct zwraca paczki z pojemnością w polu item.quantity
            const packed = await packProduct(baseProductId, totalQty)

            const parcelCapacities = packed.map(p => ({
                ...p,
                capacity: p.item.quantity // ile sztuk ma wejść do tej paczki
            }))

            const groupParcels = allocateGroupItemsToParcels(groupItems, parcelCapacities)
            parcels.push(...groupParcels)
        }

        await persistParcels(parcels)
        return parcels
    }


    const persistParcels = async (parcels) => {
        if (!cartId.value) return

        await $supabase
            .from('cart_parcels')
            .delete()
            .eq('cart_id', cartId.value)

        for (const parcel of parcels) {
            const { data: cartParcel, error } = await $supabase
                .from('cart_parcels')
                .insert({
                    cart_id: cartId.value,
                    cartoon_id: parcel.cartoon_id,
                    packaging_option_id: parcel.packaging_option_id,
                    length: parcel.length,
                    width: parcel.width,
                    height: parcel.height,
                    weight: parcel.weight
                })
                .select()
                .single()

            if (error) throw error

            await $supabase.from('cart_parcel_items').insert(
                parcel.items.map(i => ({
                    cart_parcel_id: cartParcel.id,
                    product_id: i.product_id,
                    quantity: i.quantity
                }))
            )

            await $supabase.from('cart_packing_instructions').insert({
                cart_parcel_id: cartParcel.id,
                quantity_per_cartoon: parcel.packing_instruction.quantity_per_cartoon,
                max_weight: parcel.packing_instruction.max_weight,
                note: parcel.packing_instruction.note
            })
        }
    }


    const allocateGroupItemsToParcels = (groupItems, parcelCapacities) => {
        const remaining = groupItems.map(i => ({ ...i })) // kopia

        return parcelCapacities.map(p => {
            let left = p.capacity
            const items = []

            for (const r of remaining) {
                if (left <= 0) break
                if (r.quantity <= 0) continue

                const take = Math.min(r.quantity, left)
                items.push({ product_id: r.product_id, quantity: take })
                r.quantity -= take
                left -= take
            }

            return {
                cartoon_id: p.cartoon_id,
                packaging_option_id: p.packaging_option_id,
                length: p.length,
                width: p.width,
                height: p.height,
                weight: p.max_weight,
                items,
                packing_instruction: p.packing_instruction
            }
        })
    }

    return {
        add,
        getOrCreateCart,
        getCart,
        removeItem,
        updateItemQuantity,
        calculateParcels,
        updateCartById
    }
}
