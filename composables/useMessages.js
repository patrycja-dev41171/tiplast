export const useMessages = () => {
    const { $supabase } = useNuxtApp()

    const addMessage = async (form, message, type, subject) => {
        const res = await $supabase
            .from("messages")
            .insert({
                form_type: type,
                name: form.name,
                email: form.email,
                phone: form.phone,
                message: message,
                status: "nowa",
                subject: subject,
            })
        return res
    }

    const getAllMessages = async () => {
        const res = await $supabase
            .from("messages")
            .select("*")
            .order("created_at", { ascending: false });

        return res
    }

    const getMessageById = async (id) => {
        const res = await $supabase
            .from("messages")
            .select("*")
            .eq("id", id)
            .single();

        return res
    }


    return {
        addMessage,
        getAllMessages,
        getMessageById
    }
}
