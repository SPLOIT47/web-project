/**
 * Проверка строки как UUID (v1–v5), чтобы не слать в Profile batch мусор из ленты/моков.
 */
export function isUuidString(value: string): boolean {
    const s = value.trim();
    // RFC 4122 UUID (v1-v5): version nibble + variant nibble are validated.
    return /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(
        s,
    );
}
