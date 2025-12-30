export const useAuth = () => {
    const { $supabase } = useNuxtApp()

    const getUser = async () => {
        const res = await $supabase.auth.getUser();
        return res
    }

    const logout = async () => {
        await $supabase.auth.signOut();
    }

    const getSession = async () => {
        const res = await $supabase.auth.getSession();
        return res
    }

    const login = async (credentials) => {
        const res = await $supabase.auth.signInWithPassword(credentials);
        return res
    }

    return {
        getUser,
        logout,
        getSession,
        login
    }
}