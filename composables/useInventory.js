export const useInventory = () => {
    const { $supabase } = useNuxtApp()
    const { getUser } = useAuth()
    
    const getCurrentUser = async () => {
        const { data } = await getUser();
        return data.user
    }


    /**
     * Pobiera stany magazynowe dla wszystkich produktów
     */
    const getAllStock = async () => {
        const { data, error } = await $supabase
            .from("product_stock")
            .select("*")

        return data || []
    }

    /**
     * Pobiera stock jednego produktu
     */
    const getStock = async (productId) => {
        const { data, error } = await $supabase
            .from("product_stock")
            .select("*")
            .eq("record_id", productId)
            .maybeSingle()

        return data || null
    }

    /**
     * Zapisuje nowy stan magazynu (upsert)
     */
    const updateStock = async (productId, newQty) => {
        const user = await getCurrentUser()
        if (!user) throw new Error("Brak zalogowanego użytkownika")

        // Pobierz poprzednią wartość
        const oldStock = await getStock(productId)
        const before = oldStock?.quantity ?? 0

        const { data, error } = await $supabase
            .from("product_stock")
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

    /**
     * Tworzy log zmiany stocku
     */
    const createStockLog = async ({
        productId,
        before,
        after,
        changeType = "manual_update",
        note = ""
    }) => {
        const user = await getCurrentUser()
        if (!user) throw new Error("Brak zalogowanego użytkownika")

        const { data, error } = await $supabase
            .from("product_stock_logs")
            .insert({
                record_id: productId,
                quantity_before: before,
                quantity_after: after,
                change_type: changeType,
                note,
                created_by: user.id
            })

        return data
    }

    /**
     * Pobiera logi dla produktu
     */
    const getLogs = async (productId) => {
        const { data, error } = await $supabase
            .from("product_stock_logs")
            .select(`
        id,
        change_type,
        quantity_before,
        quantity_after,
        difference,
        created_at,
        note,
        created_by,
        profiles!inner (
          email
        )
    `)
            .eq("record_id", productId)
            .order("created_at", { ascending: false })

        return data || []
    }

    return {
        getAllStock,
        getStock,
        updateStock,
        createStockLog,
        getLogs
    }
}
