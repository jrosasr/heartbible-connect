export type Module = {
    name: string;
    value: string;
}
export type ModuleStory = {
    title: string
    text: string
    verseCount: number
}

export const MODULES_AVAILABLE : Module[] = [
    { name: "Módulo 1", value: "modulo-1" },
    { name: "Módulo 2", value: "modulo-2" },
    { name: "Módulo 3", value: "modulo-3" },
];

export const STORIES_AVAILABLE_FROM_MODULE : Record<string, ModuleStory[]> = {
    "modulo-1": [
        { title: "Jesús sana a un paralítico", text: "Marcos 2:1-12", verseCount: 12 },
        { title: "Jesús calma la tormenta", text: "Marcos 4:32-45", verseCount: 14 },
        { title: "El endemoniado gadareno", text: "Marcos 5:1-20", verseCount: 20 },
        { title: "La hija de Jairo, y la mujer que tocó el manto de Jesús", text: "Marcos 5:21-43", verseCount: 23 },
        { title: "Alimentación de los cinco mil", text: "Marcos 6:30-44", verseCount: 15 },
        { title: "El ciego Bartimeo recibe la vista", text: "Marcos 10:46-52", verseCount: 7 },
    ],
    "modulo-2": [
        { title: "El hijo prodigo", text: "Lucas 15:11-32", verseCount: 22 },
    ],
    "modulo-3": [
        { title: "Creación", text: "Génesis 1:1-2:3", verseCount: 34 },
        { title: "Adán y Eva", text: "Génesis 2:4-25", verseCount: 22 },
        { title: "La Caída", text: "Génesis 3:1-15", verseCount: 15 },
        { title: "El Diluvio", text: "Génesis 6:9-9:17", verseCount: 77 },
        { title: "Abraham", text: "Génesis 12:1-7", verseCount: 7 },
        
        { title: "Sacrificio de Isaac", text: "Génesis 22:1-19", verseCount: 19 },
        { title: "Las Dos Parteras", text: "Exodo 1:15-21", verseCount: 7 },
        { title: "Nacimiento de Moisés", text: "Éxodo 1:22 - 2:10", verseCount: 11 },
        { title: "La Zarza Ardiente", text: "Éxodo 3:1-12", verseCount: 12 },
        { title: "Los Diez Mandamientos", text: "Éxodo 20:1-20", verseCount: 20 },

        { title: "La Serpiente de Bronce", text: "Números 21:4-9", verseCount: 6 },
        { title: "Nacimiento de Jesús", text: "Mateo 1:18-25", verseCount: 7 },
        { title: "Nacimiento de Jesús", text: "Lucas 2:4-20", verseCount: 16 },
        { title: "El Bautismo de Jesús", text: "Mateo 3:13-17", verseCount: 5 },
        { title: "Jesús Calma la Tormenta", text: "Marcos 4:35-41", verseCount: 7 },

        { title: "Jesús Sana al Endemoniado Gadareno", text: "Marcos 5:1-20", verseCount: 20 },
        { title: "Jesús, Jairo y la Mujer", text: "Marcos 5:21-43", verseCount: 23 },
        { title: "La Parábola del Hijo Pródigo", text: "Lucas 15:11-32", verseCount: 22 },
        { title: "Jesús le Habla a Nicodemo", text: "Juan 3:1-16", verseCount: 16 },
        { title: "Crucifixión y Muerte", text: "Lucas 23:33-49", verseCount: 17 },

        { title: "Resurrección", text: "Lucas 24:1-12", verseCount: 12 },
        { title: "Ascensión", text: "Hechos 1:3-11", verseCount: 9 },
    ],
};
