/**
 * Должно совпадать с `validator.isUUID(str, "all")` (class-validator @IsUUID("all")).
 * См. node_modules/validator/lib/isUUID.js — паттерн `all`.
 */
const VALIDATOR_UUID_ALL =
    /^(?:[0-9a-f]{8}-[0-9a-f]{4}-[1-8][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}|00000000-0000-0000-0000-000000000000|ffffffff-ffff-ffff-ffff-ffffffffffff)$/i;

export function isUuidString(value: string): boolean {
    const s = value.trim();
    return VALIDATOR_UUID_ALL.test(s);
}
