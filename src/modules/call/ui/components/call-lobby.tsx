import { Button } from '@/components/ui/button';
import { authClient } from '@/lib/auth-client';
import { generateAvatarUri } from '@/lib/avatar';
import { DefaultVideoPlaceholder, StreamVideoParticipant, useCallStateHooks, VideoPreview, ToggleAudioPreviewButton, ToggleVideoPreviewButton } from '@stream-io/video-react-sdk';
import '@stream-io/video-react-sdk/dist/css/styles.css';
import { CameraIcon, LogInIcon, MicIcon } from 'lucide-react';
import Link from 'next/link';



interface Props {
    onJoin: () => void;
}

const DisabledVideoPreview = () => {
    const { data } = authClient.useSession();

    return (
        <DefaultVideoPlaceholder
            participant={
                 {
                    name: data?.user.name ?? "",
                    image: data?.user.image ?? generateAvatarUri({ seed: data?.user.name ?? "", variant: "initials"})
                 } as StreamVideoParticipant
            }
        />
    )
};


const AllowBrowserPermissions = () => {
    return (
        <div className='text-sm'>
            Please grant your browser a permission to access your <CameraIcon/> camera and <MicIcon/> microphone

        </div>
    )
}

export const CallLobby = ({ onJoin }: Props) => {

    const { useCameraState, useMicrophoneState } = useCallStateHooks();

    const { hasBrowserPermission: hasMicPermission } = useMicrophoneState();
    const { hasBrowserPermission: hasCameraPermission } = useCameraState();

    const hasBrowserMediaPermission = hasCameraPermission && hasMicPermission;


    return (
        <div className='min-h-screen flex flex-col items-center justify-center bg-radial from-sidebar-accent to-sidebar'>

            <div className='py-4 px-8 flex flex-1 items-center justify-center'>
                <div className='flex flex-col items-center justify-center gap-y-6 bg-background rounded-lg p-10 shadow-sm'>
                  <div className='flex flex-col gap-y-2 text-center'>
                    <h6 className='text-lg font-medium'>Ready to join?</h6>
                    <p className='text-sm'>Setup your call before joining</p>
                  </div>  
                  <VideoPreview
                    DisabledVideoPreview={
                        hasBrowserMediaPermission ? DisabledVideoPreview : AllowBrowserPermissions
                    }
                  />
                  <div className='flex gap-x-2'>
                      <ToggleAudioPreviewButton /> 
                      <ToggleVideoPreviewButton/> 
                  </div>
                  <div className='flex gap-x-2 justify-between w-full'>
                    <Button asChild variant={"outline"}>
                        <Link href="/meetings">
                            Cancel
                        </Link>
                    </Button>
                    <Button onClick={onJoin}>
                        <LogInIcon/> Join call
                    </Button>

                  </div>
                </div>
            </div> 
        </div>

    )
}

