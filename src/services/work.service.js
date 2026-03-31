// app/actions.js
'use server';

import { createClient } from '@/utils/supabase/server'; // Ajuste o caminho conforme seu projeto
import { workService } from '@/services/workService'; // O service que criamos antes
import { revalidatePath } from 'next/cache';

export async function publishWorkAction(prevState, formData) {
    const supabase = await createClient();

    try {
        const file = formData.get('arquivo');
        const subject = formData.get('disciplina');
        const type = formData.get('tema');
        const graduation = formData.get('graduation'); // Adicionei esse campo

        if (!file || file.size === 0) throw new Error("Arquivo é obrigatório");

        // 1. Upload do Arquivo para o Supabase Storage
        const fileName = `${Date.now()}_${file.name}`;
        const { data: storageData, error: storageError } = await supabase.storage
            .from('works_archives') // Certifique-se de que este bucket existe no seu Supabase
            .upload(fileName, file);

        if (storageError) throw storageError;

        // Pegar a URL pública do arquivo
        const { data: { publicUrl } } = supabase.storage
            .from('works_archives')
            .getPublicUrl(fileName);

        // 2. Salvar no Banco de Dados usando o Service
        const workData = {
            subject: subject,
            type: type,
            archive: publicUrl,
            graduation: graduation || 'Não informada'
        };

        await workService.createWork(supabase, workData);

        revalidatePath('/caminho-da-sua-pagina'); // Atualiza a lista de trabalhos na UI
        return { success: true, message: "Trabalho publicado com sucesso!" };

    } catch (error) {
        console.error('Erro na action:', error);
        return { success: false, message: error.message || "Erro ao publicar trabalho." };
    }
}

export const workService = {
    /**
     * @param {Object} supabase - Instância do Supabase
     * @param {Object} workData - Objeto contendo { type, archive, subject, graduation }
     */
    async createWork(supabase, workData) {
        const { data, error } = await supabase
            .from('Work')
            .insert([workData])
            .select()
            .single();

        if (error) throw error;
        return data;
    },

    /**
     * Busca todos os trabalhos cadastrados
     */
    async getAllWorks(supabase) {
        const { data, error } = await supabase
            .from('Work')
            .select('*')
            .order('id', { ascending: false }); // Ordena pelos mais recentes (ID maior)

        if (error) throw error;
        return data;
    },

    /**
     * Busca trabalhos por um campo específico (ex: por graduação)
     */
    async getWorksByGraduation(supabase, graduation) {
        const { data, error } = await supabase
            .from('Work')
            .select('*')
            .eq('graduation', graduation);

        if (error) throw error;
        return data;
    }
};