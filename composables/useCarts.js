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
            cart_id: data.id,
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



    return {
        add,
        getOrCreateCart,
        getCart,
        removeItem,
        updateItemQuantity
    }
}
