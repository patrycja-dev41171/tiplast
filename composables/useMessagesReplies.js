export const useMessagesReplies = () => {
    const { $supabase } = useNuxtApp()

    const getAllMessagesRepliesById = async (id) => {
        const res = await $supabase
            .from("messages_replies")
            .select("*")
            .eq("message_id", id)
            .order("created_at", { ascending: true });

        return res
    }

    const addMessageReplies = async (payload) => {
        const res = await $supabase.from("messages_replies").insert(payload)
    }


    return {
        getAllMessagesRepliesById, addMessageReplies
    }
}
