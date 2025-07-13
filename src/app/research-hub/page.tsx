"use client";
import SidebarWrapper from "../components/SidebarWrapper";
import ResearchHubClient from "./components/client/ResearchHub";
import { useRequireAuth } from "@/hooks/useRequireAuth";
import LoadingScreen from "@/components/LoadingScreen";

export default function ResearchHubPage() {
    const checking = useRequireAuth();
    if (checking) {
        return (
            <LoadingScreen />
        );
    }
    return (
        <div className="flex">
            <SidebarWrapper loading={false} />
            <main className="flex-1">
                <ResearchHubClient />
            </main>
        </div>
    );
}

