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

    const getAllCategories = async (orderBy) => {
        const res = await $supabase
            .from("categories")
            .select("*")
            .order(orderBy);

        return res
    }

    const addNewCategory = async (category) => {
        const res = await $supabase.from("categories").insert(category);

        return res
    }

    const updateCategory = async (cat) => {
        const res = await $supabase.from("categories")
            .update({
                display_name: cat.display_name,
                slug: cat.slug,
            })
            .eq("id", cat.id);

        return res
    }

    const deleteCategoryById = async (id) => {
        const res = await $supabase
            .from("categories")
            .delete()
            .eq("id", Number(id));

        return res
    }

    return { getCategoryBySlug, getAllCategories, addNewCategory, updateCategory, deleteCategoryById }
}
