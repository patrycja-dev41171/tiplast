export const useProducts = () => {
    const { $supabase } = useNuxtApp()

    console.log("SSR supabase:", $supabase)

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

    return { getProductsByCategory, getProduct }
}
