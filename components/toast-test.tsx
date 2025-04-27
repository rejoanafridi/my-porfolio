'use client'

import { Button } from '@/components/ui/button'
import { useToastNotification } from '@/hooks/use-toast-notification'

export function ToastTest() {
    const { showSuccessToast, showErrorToast } = useToastNotification()

    return (
        <div className="flex gap-2">
            <Button
                onClick={() => showSuccessToast('This is a success toast!')}
                variant="default"
            >
                Show Success Toast
            </Button>

            <Button
                onClick={() => showErrorToast('This is an error toast!')}
                variant="destructive"
            >
                Show Error Toast
            </Button>
        </div>
    )
}
