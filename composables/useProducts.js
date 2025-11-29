export const useProducts = () => {
    const { $supabase } = useNuxtApp()

    const getProductsByCategory = async (categoryId) => {
        const { data, error } = await $supabase
            .from("products")
            .select("*")
            .contains("categories", [String(categoryId)])

        return data || []
    }

    return { getProductsByCategory }
}
