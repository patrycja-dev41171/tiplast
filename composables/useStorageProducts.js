export const useStorageProducts = () => {
  const { $supabase } = useNuxtApp()

  const BUCKET = "products"

  const uploadFile = async ({ folder, file }) => {
    const filename = `${Date.now()}-${file.name}`
    const path = `${folder}/${filename}`

    const { data, error } = await $supabase.storage
      .from(BUCKET)
      .upload(path, file)

    if (error) {
      console.error("Upload error:", error)
      return { error }
    }

    const { data: publicData } = $supabase.storage
      .from(BUCKET)
      .getPublicUrl(path)

    return {
      path,
      publicUrl: publicData.publicUrl,
    }
  }

  const uploadFiles = async ({ folder, files }) => {
    const uploaded = []

    for (const file of files) {
      const res = await uploadFile({ folder, file })
      if (!res?.error) {
        uploaded.push(res)
      }
    }

    return uploaded
  }

  const removeFile = async (path) => {
    const { error } = await $supabase.storage
      .from(BUCKET)
      .remove([path])

    if (error) {
      console.error("Remove error:", error)
      return false
    }

    return true
  }



  return {
    uploadFile,
    uploadFiles,
    removeFile,
  }
}
