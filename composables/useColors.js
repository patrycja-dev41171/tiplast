export const useColors = () => {
    const { $supabase } = useNuxtApp();

    /** Pobiera wszystkie kolory */
    const getAllColors = async () => {
        const { data, error } = await $supabase
            .from("colors")
            .select("*")
            .order("id");

        if (error) throw error;
        return data || [];
    };

    /** Pobiera pojedynczy kolor po ID */
    const getColor = async (id) => {
        const { data, error } = await $supabase
            .from("colors")
            .select("*")
            .eq("id", id)
            .maybeSingle();

        if (error) throw error;
        return data || null;
    };

    /** Dodaje nowy kolor */
    const createColor = async ({ display_name, value }) => {
        const { error } = await $supabase
            .from("colors")
            .insert({
                display_name,
                value,
            });

        if (error) throw error;
        return true;
    };

    /** Aktualizuje istniejący kolor */
    const updateColor = async (id, payload) => {
        const { error } = await $supabase
            .from("colors")
            .update(payload)
            .eq("id", id);

        if (error) throw error;
        return true;
    };

    /** Usuwa kolor, ale tylko jeśli nie jest używany */
    const deleteColor = async (colorValue) => {
        // sprawdzenie: czy kolor jest powiązany z produktami?
        const { count } = await $supabase
            .from("products")
            .select("id", { count: "exact", head: true })
            .eq("color", colorValue);

        if (count > 0) {
            throw new Error(`Nie można usunąć — kolor jest używany w ${count} produktach.`);
        }

        const { error } = await $supabase
            .from("colors")
            .delete()
            .eq("value", colorValue);

        if (error) throw error;
        return true;
    };

    return {
        getAllColors,
        getColor,
        createColor,
        updateColor,
        deleteColor,
    };
};
