import { useEffect, useMemo, useState } from 'react'
import { DynamicForm } from '@/components/tanstack/forms'
import type { FieldConfig, FieldType, FormConfig } from '@/components/tanstack/types/form'

type ApiField = {
  name: string
  label: string
  type: string
  required?: boolean
  placeholder?: string
  description?: string
  disabled?: boolean
  options?: Array<{ value: string | number; label: string }>
}

type ApiResponse = {
  version: number
  form: {
    title?: string
    description?: string
    fields: ApiField[]
    submitButtonText?: string
    resetButtonText?: string
  }
}

const mapToFieldType = (t: string): FieldType => {
  const allowed: FieldType[] = ['text', 'email', 'password', 'number', 'textarea', 'select', 'checkbox', 'radio']
  return (allowed.find((v) => v === t) ?? 'text') as FieldType
}

export function RemoteForm() {
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [apiData, setApiData] = useState<ApiResponse | null>(null)

  useEffect(() => {
    const controller = new AbortController()
    const load = async () => {
      try {
        setLoading(true)
        setError(null)
        const res = await fetch('http://localhost:3001/api/config', {
          signal: controller.signal,
          headers: { 'Accept': 'application/json' },
        })
        if (!res.ok) throw new Error(`API error: ${res.status}`)
        const json: ApiResponse = await res.json()
        setApiData(json)
      } catch (e) {
        if ((e as any)?.name === 'AbortError') return
        setError(e instanceof Error ? e.message : 'Failed to load config')
      } finally {
        setLoading(false)
      }
    }
    load()
    return () => controller.abort()
  }, [])

  const formConfig: FormConfig | null = useMemo(() => {
    if (!apiData) return null
    const fields: FieldConfig[] = apiData.form.fields.map((f) => ({
      name: f.name,
      label: f.label,
      type: mapToFieldType(f.type),
      required: f.required,
      placeholder: f.placeholder,
      description: f.description,
      disabled: f.disabled,
      options: f.options,
    }))

    const defaultValues = fields.reduce<Record<string, any>>((acc, field) => {
      switch (field.type) {
        case 'checkbox':
          acc[field.name] = false
          break
        default:
          acc[field.name] = ''
      }
      return acc
    }, {})

    const cfg: FormConfig = {
      title: apiData.form.title ?? 'Remote Form',
      description: apiData.form.description,
      fields,
      defaultValues,
      submitButtonText: apiData.form.submitButtonText ?? 'Submit',
      resetButtonText: apiData.form.resetButtonText ?? 'Reset',
      onSubmit: async ({ value }) => {
        // Skip validation for now; just log and show a quick success
        console.log('Remote form submitted', value)
        await new Promise((r) => setTimeout(r, 400))
        alert('Submitted! Check console for payload.')
      },
    }
    return cfg
  }, [apiData])

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        <div className="bg-white shadow-lg rounded-lg p-8">
          <div className="mb-6">
            <div className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800 mb-4">
              Remote Config
            </div>
          </div>

          {loading && (
            <div className="text-gray-500">Loading form configuration…</div>
          )}

          {error && (
            <div className="bg-red-50 border border-red-200 rounded-md p-4 text-sm text-red-700">
              Failed to load config: {error}
            </div>
          )}

          {!loading && !error && formConfig && (
            <DynamicForm config={formConfig} />
          )}
        </div>
      </div>
    </div>
  )
}

