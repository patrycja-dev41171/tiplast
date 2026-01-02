export const useProducts = () => {
    const { $supabase } = useNuxtApp()

    const getAllProducts = async (hidden) => {
        let query = $supabase
            .from("products")
            .select(`
      *,
      packaging_options (
       *
      ),
      product_stock (
       *
      ),
      kit_stock (
      quantity
    )
    `)

        if (hidden !== undefined) {
            query = query.eq("hidden", hidden)
        }

        const res = await query

        if (res.error) {
            console.error(res.error)
            return []
        }

        return res || []
    }


    const getProductById = async (id) => {
        const res = await $supabase
            .from("products")
            .select(`*,
                kit_stock (
      quantity
    )`)
            .eq("id", id)
            .single()

        return res
    }

    const getProductsByCategory = async (categoryId) => {
        const { data, error } = await $supabase
            .from("products")
            .select("*")
            .contains("categories", [String(categoryId)])

        return data || []
    }

    const getProductByUrl = async (url) => {
        const { data, error } = await $supabase
            .from("products")
            .select(`
            *,
            stock:product_stock (
                quantity,
             updated_at
            ),
            kit_stock (
      quantity
    )
            `)
            .eq("url", url)
            .maybeSingle();

        if (error) {
            console.error("Error fetching product by URL:", error);
            throw error;
        }

        return data;
    };


    const addProduct = async (payload) => {
        console.log(payload)
        const res = await $supabase.from("products").insert(payload)

        return res
    }

    const getLastSku = async () => {
        const res = await $supabase
            .from("products")
            .select("sku")
            .order("sku", { ascending: false })
            .limit(1);

        return res
    }

    const getProductsByUrlPrefix = async (baseUrl) => {
        const res = await $supabase
            .from("products")
            .select("url")
            .like("url", `${baseUrl}%`);

        return res
    }

    const deleteProductsById = async (id) => {
        const res = await $supabase
            .from("products")
            .delete()
            .eq("id", id);

        return res
    }

    const updateProductById = async (payload, id) => {
        const res = await $supabase
            .from("products")
            .update(payload)
            .eq("id", id);

        return res
    }


    return {
        getAllProducts,
        getProductById,
        getProductsByCategory,
        getProductByUrl,
        getProductsByUrlPrefix,
        addProduct,
        getLastSku,
        deleteProductsById,
        updateProductById
    }
}
