"use client";

import { ErrorState } from "@/components/error-state";
import { LoadingState } from "@/components/loading-state";
import { useTRPC } from "@/trpc/client";
import { useSuspenseQuery } from "@tanstack/react-query";

export const AgentsView = () => {
    const trpc = useTRPC();
    // useSuspenseQuery is much quicker
    // but to use it need to make sure that in the parent server component page.tsx
    //  we add the proper HydrationBoundary (see page.tsx for e.g)
    const {data} = useSuspenseQuery(trpc.agents.getMany.queryOptions());

    return (
        <div>
            {JSON.stringify(data, null, 2)}
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
