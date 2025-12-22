export const useCartoons = () => {
    const { $supabase } = useNuxtApp()

    const getAllCartoons = async () => {
        const { data, error } = await $supabase
            .from("cartoons")
            .select("*")

        return data || []
    }

    const getCartoonById = async (id) => {
        const { data, error } = await $supabase
            .from("cartoons")
            .select("*")
            .eq("id", id)
            .single()

        return data
    }

    return {
        getAllCartoons,
        getCartoonById,
    }
}
