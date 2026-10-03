// Dane dla /produkty i /produkty/[slug] – pobierane na serwerze (SSR),
// a przy przechodzeniu między kategoriami współdzielone przez ten sam klucz.
export const useCatalog = async () => {
  const { getAllProducts } = useProducts()
  const { getAllCategories } = useCategories()
  const { getAllColors } = useColors()

  const [{ data: categories }, { data: products }, { data: colors }] = await Promise.all([
    useAsyncData("catalog-categories", async () => {
      const { data, error } = await getAllCategories("display_name")

      if (error || !data) return []
      return data.sort((a, b) => a.id - b.id)
    }, { default: () => [] }),

    useAsyncData("catalog-products", async () => {
      const { data, error } = await getAllProducts(false)

      if (error || !data) {
        console.error(error)
        return []
      }
      return data.sort((a, b) => a.sku.localeCompare(b.sku))
    }, { default: () => [] }),

    useAsyncData("catalog-colors", async () => {
      const { data, error } = await getAllColors()

      if (error || !data) return []
      return data
    }, { default: () => [] }),
  ])

  return { categories, products, colors }
}
