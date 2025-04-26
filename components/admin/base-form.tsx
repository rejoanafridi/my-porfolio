'use client'

import type React from 'react'

import { useState } from 'react'
import {
    useForm,
    FormProvider,
    type UseFormReturn,
    type FieldValues,
    type DefaultValues
} from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import type { z } from 'zod'
import { Button } from '@/components/ui/button'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { Loader2, Save } from 'lucide-react'
import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle
} from '@/components/ui/card'

interface BaseFormProps<T extends FieldValues> {
    title: string
    description?: string
    schema: z.ZodType<T>
    defaultValues: DefaultValues<T>
    onSubmit: (data: T) => Promise<{ success: boolean; error?: string }>
    children: (methods: UseFormReturn<T>) => React.ReactNode
    submitButtonText?: string
}

export function BaseForm<T extends FieldValues>({
    title,
    description,
    schema,
    defaultValues,
    onSubmit,
    children,
    submitButtonText = 'Save Changes'
}: BaseFormProps<T>) {
    const [isSubmitting, setIsSubmitting] = useState(false)
    const [error, setError] = useState('')
    const [success, setSuccess] = useState('')

    const methods = useForm<T>({
        resolver: zodResolver(schema),
        defaultValues,
        mode: 'onBlur'
    })

    const handleSubmit = async (data: T) => {
        setIsSubmitting(true)
        setError('')
        setSuccess('')

        try {
            const result = await onSubmit(data)

            if (result.success) {
                setSuccess('Changes saved successfully')
                setTimeout(() => setSuccess(''), 3000)
            } else {
                setError(result.error || 'An error occurred while saving')
            }
        } catch (err) {
            setError('An unexpected error occurred')
            console.error(err)
        } finally {
            setIsSubmitting(false)
        }
    }

    return (
        <Card>
            <CardHeader>
                <CardTitle>{title}</CardTitle>
                {description && (
                    <CardDescription>{description}</CardDescription>
                )}
            </CardHeader>

            <FormProvider {...methods}>
                <form onSubmit={methods.handleSubmit(handleSubmit)}>
                    <CardContent>
                        {error && (
                            <Alert variant="destructive" className="mb-4">
                                <AlertDescription>{error}</AlertDescription>
                            </Alert>
                        )}

                        {success && (
                            <Alert className="mb-4 border-green-500 text-green-500">
                                <AlertDescription>{success}</AlertDescription>
                            </Alert>
                        )}

                        <div className="space-y-6">{children(methods)}</div>
                    </CardContent>

                    <CardFooter>
                        <Button
                            type="submit"
                            disabled={isSubmitting}
                            className="w-full md:w-auto"
                        >
                            {isSubmitting ? (
                                <>
                                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                    Saving...
                                </>
                            ) : (
                                <>
                                    <Save className="mr-2 h-4 w-4" />
                                    {submitButtonText}
                                </>
                            )}
                        </Button>
                    </CardFooter>
                </form>
            </FormProvider>
        </Card>
    )
}
