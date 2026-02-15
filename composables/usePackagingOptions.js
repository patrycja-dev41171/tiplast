export const usePackagingOptions = () => {
    const { $supabase } = useNuxtApp()

    const getPackagingOptionsById = async (product_id) => {
        const res = await $supabase
            .from("packaging_options")
            .select("*")
            .eq("product_id", product_id)


        return res
    }

    const updatePackagingOption = async (id, payload) => {
        const { error } = await $supabase
            .from('packaging_options')
            .update(payload)
            .eq('id', id)

        if (error) throw error
    }

    const deletePackagingOption = async (id) => {
        const { error } = await $supabase
            .from('packaging_options')
            .delete()
            .eq('id', id)

        if (error) throw error
    }

    const createPackagingOption = async (payload) => {
        const { error } = await $supabase
            .from('packaging_options')
            .insert(payload)

        if (error) throw error
    }

    return {
        getPackagingOptionsById,
        updatePackagingOption,
        deletePackagingOption,
        createPackagingOption
    }
}
