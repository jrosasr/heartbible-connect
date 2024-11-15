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
    ]
};
