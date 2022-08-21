export function zip<A, B>(array1: A[], array2: B[]): [A, B][] {
    return Array.from({ length: Math.max(array1?.length, array2?.length) }, (_, idx) => [array1[idx], array2[idx]])
}
