export const useMarketingContacts = () => {
    const { $supabase } = useNuxtApp()

    const saveMarketingContact = async (form) => {
        const { data, error } = await $supabase
            .from("marketing_contacts").upsert({
                name: form.name,
                email: form.email,
                phone: form.phone,
                consent: true,
            });

        return data || []
    }

    const fetchMarketingContacts = async () => {
        const { data, error } = await $supabase
            .from("marketing_contacts")
            .select("*")
            .eq("consent", true)
            .order("created_at", { ascending: false });

        return data || []
    }

    return { saveMarketingContact, fetchMarketingContacts }
}
