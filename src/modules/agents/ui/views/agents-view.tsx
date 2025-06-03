"use client";

import { ErrorState } from "@/components/error-state";
import { LoadingState } from "@/components/loading-state";
import { useTRPC } from "@/trpc/client";
import { useSuspenseQuery } from "@tanstack/react-query";
import { DataTable } from "../components/data-table";
import { columns, } from "../components/columns";
import { EmptyState } from "@/components/empty-state";

export const AgentsView = () => {
    const trpc = useTRPC();
    // useSuspenseQuery is much quicker
    // but to use it need to make sure that in the parent server component page.tsx
    //  we add the proper HydrationBoundary (see page.tsx for e.g)
    const {data} = useSuspenseQuery(trpc.agents.getMany.queryOptions());

    return (
        <div className="flex-1 pb-4 px-4 md:px-8 flex flex-col gap-y-4">
            <DataTable data={data} columns={columns} />
            {data.length === 0 && (
                <EmptyState
                    title="Create your first Agent"
                    description="And join join your meetings. Each Agent will follow your instructions and cans interact with pariticpants during the call."
                />
            )}
        </div>
    );
};

export const AgentsViewLoading = () => {
    return(
        <LoadingState
            title="Loading agents"
            description="This make take a few seconds..."
        />
    )
};

export const AgentsViewError = () => {
    return(
        <ErrorState
            title="Error Loading Agents"
            description="Please try again later"
        />
    )
};
