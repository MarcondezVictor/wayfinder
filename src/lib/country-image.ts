// Resolve uma imagem relevante a partir de um nome (país, cidade ou local),
// usando a REST API pública da Wikipédia — sem chave de API.
// As respostas são cacheadas em memória para não repetir pedidos.

const cache = new Map<string, Promise<string | null>>();

async function lookup(title: string, lang: "pt" | "en"): Promise<string | null> {
    try {
        const res = await fetch(
            `https://${lang}.wikipedia.org/api/rest_v1/page/summary/${encodeURIComponent(title)}`,
            { headers: { accept: "application/json" } }
        );
        if (!res.ok) return null;
        const data = await res.json();
        // originalimage = alta resolução; thumbnail = versão pequena (fallback)
        return data?.originalimage?.source ?? data?.thumbnail?.source ?? null;
    } catch {
        return null;
    }
}

/**
 * Devolve o URL de uma imagem relevante para `title`, ou null se não encontrar.
 * Tenta primeiro a Wikipédia em português e, se falhar, em inglês.
 */
export function wikiImage(title: string): Promise<string | null> {
    const key = title.trim();
    if (!key) return Promise.resolve(null);
    if (!cache.has(key)) {
        cache.set(
            key,
            lookup(key, "pt").then((pt) => pt ?? lookup(key, "en"))
        );
    }
    return cache.get(key)!;
}
