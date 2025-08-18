import { usePeople } from "./context/usePeople";

export default function RequirePeople({ children }: { children: React.ReactNode }) {
    const { loading, error } = usePeople();
    if (loading) return <p>Loading galaxy data…</p>;
    if (error) return <p style={{ color: "crimson" }}>Failed to load characters: {error}</p>;
    return <>{children}</>;
}