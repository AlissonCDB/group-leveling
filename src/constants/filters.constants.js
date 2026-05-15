// src/constants/filters.constants.js

// 1. MAPEAMENTO DO BANCO DE DADOS (Supabase 'Filters' table)
// Usado no filter.service.js para buscar e agrupar os dados corretamente
export const DB_FILTER_CATEGORIES = {
    // Trabalhos (Works)
    WORK_TYPE: 'work_type',
    SEMESTER: 'semester',
    
    // Raids / Reuniões
    RAID_CATEGORY: 'group_category',
    RAID_TEMPLATE: 'meeting_tamplate',
    RAID_THEME: 'theme',
    RAID_PLATFORM: 'plataform_meeting',
};

// 2. ESTADOS INICIAIS (Default States)
// Usado nos Custom Hooks (useWorksFilter e useRaidsFilter) para inicializar o useState
export const DEFAULT_WORK_FILTERS = {
    time: 'newest', // newest | oldest
    type: 'all',    // all | <id_ou_nome_do_tipo>
    semester: 'all' // all | <id_ou_nome_do_semestre>
};

export const DEFAULT_RAID_FILTERS = {
    time: 'upcoming', // upcoming | past | all
    category: 'all',  // all | <id_category>
    template: 'all',  // all | <id_template>
    platform: 'all',  // all | <id_platform>
    theme: 'all'      // all | <id_theme>
};

// 3. OPÇÕES ESTÁTICAS DE TEMPO (Que não vêm do banco de dados)
export const TIME_OPTIONS_WORKS = [
    { value: 'newest', label: 'Mais Recentes' },
    { value: 'oldest', label: 'Mais Antigos' }
];

export const TIME_OPTIONS_RAIDS = [
    { value: 'all', label: 'Todas' },
    { value: 'upcoming', label: 'Agendadas' },
    { value: 'past', label: 'Finalizadas' }
];

// 4. CONFIGURAÇÕES VISUAIS PARA OS COMPONENTES DE FILTRO (DynamicFilterPanel)
// Em vez de criar isso dentro do ClientView, importamos direto de cá.
export const getWorksFiltersConfig = (workTypesOptions, semesterOptions) => [
    { 
        key: 'time', 
        label: 'Ordem de Publicação', 
        options: TIME_OPTIONS_WORKS, 
        color: 'blue' 
    },
    { 
        key: 'type', // Alinhado com o DEFAULT_WORK_FILTERS
        label: 'Tipo de Arquivo', 
        options: workTypesOptions, 
        color: 'blue' 
    },
    { 
        key: 'semester', 
        label: 'Nível / Semestre', 
        options: semesterOptions, 
        color: 'blue' 
    }
];

export const getRaidsFiltersConfig = (categories, templates, platforms, themes) => [
    { 
        key: 'time', 
        label: 'Status das Raids', 
        options: TIME_OPTIONS_RAIDS, 
        color: 'cyan' 
    },
    { 
        key: 'category', 
        label: 'Categorias das Raids', 
        options: categories, 
        color: 'purple' 
    },
    { 
        key: 'template', 
        label: 'Modelos', 
        options: templates, 
        color: 'emerald' 
    },
    { 
        key: 'platform', 
        label: 'Plataformas', 
        options: platforms, 
        color: 'blue' 
    },
        { 
        key: 'theme', 
        label: 'Temas', 
        options: themes, 
        color: 'red' 
    }
];