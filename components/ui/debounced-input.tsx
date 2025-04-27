"use client"

import type React from "react"
import { useState, useEffect, useCallback } from "react"
import { Input } from "@/components/ui/input"

interface DebouncedInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  value: string
  onChange: (value: string) => void
  debounceTimeout?: number
}

export function DebouncedInput({
  value: initialValue,
  onChange,
  debounceTimeout = 300,
  ...props
}: DebouncedInputProps) {
  const [value, setValue] = useState(initialValue)

  useEffect(() => {
    setValue(initialValue)
  }, [initialValue])

  const handleChange = useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = event.target.value
    setValue(newValue)
  }, [])

  useEffect(() => {
    const timeout = setTimeout(() => {
      if (value !== initialValue) {
        onChange(value)
      }
    }, debounceTimeout)

    return () => clearTimeout(timeout)
  }, [value, initialValue, onChange, debounceTimeout])

  return <Input {...props} value={value} onChange={handleChange} />
}
