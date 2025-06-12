"use client"
import { ErrorState } from "@/components/error-state";
import { LoadingState } from "@/components/loading-state";
import { useTRPC } from "@/trpc/client";
import { useMutation, useQueryClient, useSuspenseQuery } from "@tanstack/react-query";
import { MeetingIdViewHeader } from "../components/meeting-Id-view-header";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";
import { UpdateMeetingDialog } from "../components/update-meeting-dialog";
import { useConfirm } from "@/hooks/use-confirm";
import UpcomingState from "../components/upcoming-state";
import ActiveState from "../components/active-state";
import CancelledState from "../components/cancelled-state";
import ProcessingState from "../components/processing-state";
import { CompletedState } from "../components/completed-state";

interface Props {
    meetingId: string,
}

export const MeetingIdView = ({meetingId}: Props) => {

    const router = useRouter();
    
    const trpc = useTRPC();
    const { data } = useSuspenseQuery(
        trpc.meetings.getOne.queryOptions({id: meetingId})
    );

    const queryClient = useQueryClient();

    const [updateMeetingDialogOpen, setUpdateMeetingDialogOpen] = useState(false);

    const removeMeeting = useMutation(
        trpc.meetings.remove.mutationOptions({
            onSuccess: async () => {
               await queryClient.invalidateQueries(trpc.meetings.getMany.queryOptions({}));
               
                // invalidate the free usage query to update the free usage count
                await queryClient.invalidateQueries(
                    trpc.premium.getFreeUsage.queryOptions(),
                );  
                             
               router.push("/meetings")
            },
            onError: (error) => {
              toast.error(error.message);  
            }
        })
    ); 

    const [RemoveConfirmation, confirmRemove] = useConfirm(
        "Are you sure?",
        `The following action will remove this meetings`
    ); 

    const handleRemoveMeeting = async () => {
        const ok = await confirmRemove();
        if(!ok) return;

        await removeMeeting.mutateAsync({id: meetingId});
    };

   const isUpcoming   = data.status === "upcoming";
   const isActive     = data.status === "active";
   const isCompleted  = data.status === "completed";
   const isProcessing = data.status === "processing";
   const isCancelled  = data.status === "cancelled";


    return (
        <>
            <RemoveConfirmation/>
            <UpdateMeetingDialog
                open={updateMeetingDialogOpen}
                onOpenChange={setUpdateMeetingDialogOpen}
                initialValues={data}
            />
            <div className="flex-1 py-4 px-4 md:px-8 flex flex-col gap-y-4">
                <MeetingIdViewHeader 
                    meetingId={meetingId} 
                    meetingName={data.name} 
                    onEdit={()=> setUpdateMeetingDialogOpen(true) } 
                    onRemove={handleRemoveMeeting}
                />
                {isCancelled  && <CancelledState />}
                {isProcessing && <ProcessingState/>}
                {isCompleted  && <CompletedState data={data} />}
                {isUpcoming  &&  ( 
                    <UpcomingState
                        meetingId={meetingId}
                        onCancelMeeting={() => {}}
                        isCancelling={false}
                    />
                )}
                {isActive  &&  <ActiveState meetingId={meetingId} />}


            </div>
        </>
    )
};

export const MeetingIdViewLoading = () => {
    return(
        <LoadingState
            title="Loading Meetings"
            description="This may take a few seconds..."
        />
    )
};

export const MeetingIdViewError = () => {
    return(
        <ErrorState
            title="Error Loading Meeting"
            description="Please try again later"
        />
    )
};
