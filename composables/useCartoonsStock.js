export const useCartoonsStock = () => {
    const { $supabase } = useNuxtApp()

    const getCurrentUser = async () => {
        const { data } = await $supabase.auth.getUser()
        return data.user
    }

    const getAllCartoonsStock = async () => {
        const { data, error } = await $supabase
            .from("cartoons_stock")
            .select("*")

        return data || []
    }

    const getCartoonStock = async (productId) => {
        const { data, error } = await $supabase
            .from("cartoons_stock")
            .select("*")
            .eq("record_id", productId)
            .maybeSingle()

        return data || null
    }

    const updateCartoonStock = async (productId, newQty) => {
        const user = await getCurrentUser()
        if (!user) throw new Error("Brak zalogowanego użytkownika")

        const oldStock = await getCartoonStock(productId)
        const before = oldStock?.quantity ?? 0

        const { data, error } = await $supabase
            .from("cartoons_stock")
            .upsert({
                record_id: productId,
                quantity: newQty,
                updated_by: user.id,
                updated_at: new Date().toISOString()
            }, { onConflict: "record_id" })  // 👈 KLUCZOWE !!!
            .select()
            .maybeSingle()


        return {
            before,
            after: newQty
        }
    }

    const createCartoonStockLog = async ({
        recordId,
        before,
        after,
        changeType = "manual_update",
        note = ""
    }) => {
        const user = await getCurrentUser()
        if (!user) throw new Error("Brak zalogowanego użytkownika")

        const { data, error } = await $supabase
            .from("cartoons_stock_logs")
            .insert({
                record_id: recordId,
                quantity_before: before,
                quantity_after: after,
                change_type: changeType,
                note,
                created_by: user.id
            })

        return data
    }

    const getCartoonLogs = async (recordId) => {
        const { data, error } = await $supabase
            .from("cartoons_stock_logs")
            .select(`*,  profiles!inner (
          email
        )`)
            .eq("record_id", recordId)
            .order("created_at", { ascending: false })

        return data || []
    }

    return {
        getAllCartoonsStock,
        getCartoonStock,
        updateCartoonStock,
        createCartoonStockLog,
        getCartoonLogs
    }
}
