import { useState, useEffect } from "react";

export function useDebounce<T>(value: T, delay: number): T {
    const [debouncedval, setDebouncedVal] = useState(value);

    useEffect(() => {
        const handler = setTimeout(() => setDebouncedVal(value), delay);
        return () => clearTimeout(handler);
    }, [value, delay])
    return debouncedval;
}