export class RegexUtils {
    static getCharacterIdFromUrl(props: {url: string}): number | null {
        const { url } = props;
        return Number(url.match(/\/(\d+)(?:\/)?(?:\?.*)?$/)?.[1]) || null;
    }
}
