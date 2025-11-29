export const useCategories = () => {
    const { $supabase } = useNuxtApp()

    const getCategoryBySlug = async (slug) => {
        const { data, error } = await $supabase
            .from("categories")
            .select("*")
            .eq("slug", slug)

        if (error) return null
        return data
    }

    return { getCategoryBySlug }
}
