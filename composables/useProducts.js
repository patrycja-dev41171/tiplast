export const useProducts = () => {
    const { $supabase } = useNuxtApp()

    const getAllProducts = async () => {
        const { data, error } = await $supabase
            .from("products")
            .select("*")

        return data || []
    }

    const getProductById = async (id) => {
        const { data, error } = await $supabase
            .from("products")
            .select("*")
            .eq("id", id)
            .single()

        return data
    }

    const getProductsByCategory = async (categoryId) => {
        const { data, error } = await $supabase
            .from("products")
            .select("*")
            .contains("categories", [String(categoryId)])

        return data || []
    }

    const getProduct = async (url) => {
        const { data, error } = await $supabase
            .from("products")
            .select("*")
            .eq("url", url)
            .single();

        return data
    }

    return {
        getAllProducts,
        getProductById,
        getProductsByCategory,
        getProduct
    }
}
