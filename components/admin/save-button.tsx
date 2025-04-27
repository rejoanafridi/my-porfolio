'use client'

import { Button } from '@/components/ui/button'
import { Loader2, Save } from 'lucide-react'
import type { ButtonProps } from '@/components/ui/button'

interface SaveButtonProps {
    isSaving: boolean
    onClick: () => void
    className?: string
    variant?: ButtonProps['variant']
}

export function SaveButton({
    isSaving,
    onClick,
    className = '',
    variant = 'outline'
}: SaveButtonProps) {
    return (
        <Button
            variant={variant}
            onClick={onClick}
            disabled={isSaving}
            className={className}
        >
            {isSaving ? (
                <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Saving...
                </>
            ) : (
                <>
                    <Save className="mr-2 h-4 w-4" />
                    Save Changes
                </>
            )}
        </Button>
    )
}
