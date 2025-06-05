
import { DEFAULT_PAGE } from "@/constants";
import { createLoader, parseAsInteger, parseAsString, parseAsStringEnum } from "nuqs/server";
import { MeetingStatus } from "./types";

// NUQS for server component

/**
 * ✅ Qu’est-ce que Nuqs ?
Nuqs est une bibliothèque qui permet de synchroniser automatiquement un état (useState) avec les paramètres d’URL (searchParams) dans une application Next.js.

🔄 Fonctionnement (Two-way binding)
Si l’utilisateur tape 123 dans un champ de recherche, l’URL devient :
localhost:3000?search=123
Si l’utilisateur modifie manuellement l’URL (ex. ?search=hello), le champ de recherche affiche automatiquement hello.

🔒 Protection de certains paramètres
Nuqs permet aussi de protéger certains paramètres de l’URL contre la modification par l’utilisateur.
Exemple :
url
localhost:3000?search=hello&pageSize=10
→ Tu peux empêcher la modification de pageSize.
 */
export const filterSearchParams = {
    search: parseAsString.withDefault("").withOptions({clearOnDefault: true}),
    page: parseAsInteger.withDefault(DEFAULT_PAGE).withOptions({clearOnDefault: true}),
    status: parseAsStringEnum(Object.values(MeetingStatus)),
    agentId: parseAsString.withDefault("").withOptions({ clearOnDefault: true })
};

export const loadSearchParams = createLoader(filterSearchParams)

