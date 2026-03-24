/**
 * Проверка строки как UUID (v1–v5), чтобы не слать в Profile batch мусор из ленты/моков.
 */
export function isUuidString(value: string): boolean {
    const s = value.trim();
    return /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(
        s,
    );
}
