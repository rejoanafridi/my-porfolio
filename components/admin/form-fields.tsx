'use client'

import type React from 'react'

import { useFormContext, Controller } from 'react-hook-form'
import { Label } from '@/components/ui/label'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue
} from '@/components/ui/select'
import { Switch } from '@/components/ui/switch'
import { Button } from '@/components/ui/button'
import { Plus, Trash2 } from 'lucide-react'
import { iconMap } from '@/lib/icon-map'

interface FormInputProps {
    name: string
    label: string
    placeholder?: string
    type?: string
    required?: boolean
}

export function FormInput({
    name,
    label,
    placeholder,
    type = 'text',
    required = false
}: FormInputProps) {
    const { register, formState } = useFormContext()
    const { errors } = formState

    return (
        <div className="space-y-2">
            <Label htmlFor={name} className="flex items-center">
                {label}
                {required && <span className="text-red-500 ml-1">*</span>}
            </Label>
            <Input
                id={name}
                type={type}
                placeholder={placeholder}
                {...register(name)}
                className={errors[name] ? 'border-red-500' : ''}
            />
            {errors[name] && (
                <p className="text-sm text-red-500">
                    {errors[name]?.message as string}
                </p>
            )}
        </div>
    )
}

interface FormTextareaProps {
    name: string
    label: string
    placeholder?: string
    rows?: number
    required?: boolean
}

export function FormTextarea({
    name,
    label,
    placeholder,
    rows = 4,
    required = false
}: FormTextareaProps) {
    const { register, formState } = useFormContext()
    const { errors } = formState

    return (
        <div className="space-y-2">
            <Label htmlFor={name} className="flex items-center">
                {label}
                {required && <span className="text-red-500 ml-1">*</span>}
            </Label>
            <Textarea
                id={name}
                placeholder={placeholder}
                rows={rows}
                {...register(name)}
                className={errors[name] ? 'border-red-500' : ''}
            />
            {errors[name] && (
                <p className="text-sm text-red-500">
                    {errors[name]?.message as string}
                </p>
            )}
        </div>
    )
}

interface FormSelectProps {
    name: string
    label: string
    options: { value: string; label: string }[]
    placeholder?: string
    required?: boolean
}

export function FormSelect({
    name,
    label,
    options,
    placeholder,
    required = false
}: FormSelectProps) {
    const { control, formState } = useFormContext()
    const { errors } = formState

    return (
        <div className="space-y-2">
            <Label htmlFor={name} className="flex items-center">
                {label}
                {required && <span className="text-red-500 ml-1">*</span>}
            </Label>
            <Controller
                name={name}
                control={control}
                render={({ field }) => (
                    <Select
                        onValueChange={field.onChange}
                        value={field.value}
                        defaultValue={field.value}
                    >
                        <SelectTrigger
                            id={name}
                            className={errors[name] ? 'border-red-500' : ''}
                        >
                            <SelectValue placeholder={placeholder} />
                        </SelectTrigger>
                        <SelectContent>
                            {options.map((option) => (
                                <SelectItem
                                    key={option.value}
                                    value={option.value}
                                >
                                    {option.label}
                                </SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                )}
            />
            {errors[name] && (
                <p className="text-sm text-red-500">
                    {errors[name]?.message as string}
                </p>
            )}
        </div>
    )
}

interface FormIconSelectProps {
    name: string
    label: string
    placeholder?: string
    required?: boolean
}

export function FormIconSelect({
    name,
    label,
    placeholder,
    required = false
}: FormIconSelectProps) {
    const { control, formState } = useFormContext()
    const { errors } = formState

    return (
        <div className="space-y-2">
            <Label htmlFor={name} className="flex items-center">
                {label}
                {required && <span className="text-red-500 ml-1">*</span>}
            </Label>
            <Controller
                name={name}
                control={control}
                render={({ field }) => (
                    <Select
                        onValueChange={field.onChange}
                        value={field.value}
                        defaultValue={field.value}
                    >
                        <SelectTrigger
                            id={name}
                            className={errors[name] ? 'border-red-500' : ''}
                        >
                            <SelectValue placeholder={placeholder} />
                        </SelectTrigger>
                        <SelectContent>
                            {Object.keys(iconMap).map((iconName) => (
                                <SelectItem key={iconName} value={iconName}>
                                    <div className="flex items-center">
                                        <span className="mr-2">
                                            {iconMap[iconName]}
                                        </span>
                                        <span>{iconName}</span>
                                    </div>
                                </SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                )}
            />
            {errors[name] && (
                <p className="text-sm text-red-500">
                    {errors[name]?.message as string}
                </p>
            )}
        </div>
    )
}

interface FormSwitchProps {
    name: string
    label: string
}

export function FormSwitch({ name, label }: FormSwitchProps) {
    const { control } = useFormContext()

    return (
        <div className="flex items-center space-x-2">
            <Controller
                name={name}
                control={control}
                render={({ field }) => (
                    <Switch
                        id={name}
                        checked={field.value}
                        onCheckedChange={field.onChange}
                    />
                )}
            />
            <Label htmlFor={name}>{label}</Label>
        </div>
    )
}

interface FormArrayFieldProps {
    name: string
    label: string
    addButtonText: string
    renderItem: (
        index: number,
        remove: (index: number) => void
    ) => React.ReactNode
    minItems?: number
}

export function FormArrayField({
    name,
    label,
    addButtonText,
    renderItem,
    minItems = 1
}: FormArrayFieldProps) {
    const { control, getValues } = useFormContext()

    return (
        <Controller
            name={name}
            control={control}
            render={({ field }) => {
                const items = field.value || []

                const addItem = () => {
                    field.onChange([...items, {}])
                }

                const removeItem = (index: number) => {
                    const newItems = [...items]
                    newItems.splice(index, 1)
                    field.onChange(newItems)
                }

                return (
                    <div className="space-y-4">
                        <div className="flex justify-between items-center">
                            <Label>{label}</Label>
                            <Button
                                type="button"
                                variant="outline"
                                size="sm"
                                onClick={addItem}
                            >
                                <Plus size={16} className="mr-1" />
                                {addButtonText}
                            </Button>
                        </div>

                        {items.map((_, index) => (
                            <div
                                key={index}
                                className="flex gap-2 items-center"
                            >
                                {renderItem(index, removeItem)}
                                <Button
                                    type="button"
                                    variant="destructive"
                                    size="icon"
                                    onClick={() => removeItem(index)}
                                    disabled={items.length <= minItems}
                                >
                                    <Trash2 size={16} />
                                </Button>
                            </div>
                        ))}
                    </div>
                )
            }}
        />
    )
}
