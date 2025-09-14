import { useEffect, useMemo, useState } from 'react'
import { useParams } from 'react-router-dom'
import axios from 'axios'
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
  const params = useParams<{ formType: string; config: string }>()
  const formType = params.formType || 'tanstack'
  const configName = params.config || 'demo'
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [apiData, setApiData] = useState<ApiResponse | null>(null)

  useEffect(() => {
    const controller = new AbortController()
    const load = async () => {
      try {
        setLoading(true)
        setError(null)
        const url = `http://localhost:3001/api/config/${encodeURIComponent(formType)}/${encodeURIComponent(configName)}`
        const res = await axios.get<ApiResponse>(url, { signal: controller.signal })
        setApiData(res.data)
      } catch (e) {
        if ((e as any)?.name === 'CanceledError' || (e as any)?.name === 'AbortError') return
        const msg = (axios.isAxiosError(e) && e.response)
          ? `API error: ${e.response.status}`
          : (e instanceof Error ? e.message : 'Failed to load config')
        setError(msg)
      } finally {
        setLoading(false)
      }
    }
    load()
    return () => controller.abort()
  }, [formType, configName])

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
        try {
          await axios.post(`http://localhost:3001/api/submit/${encodeURIComponent(formType)}`, value)
          alert('Submitted!')
        } catch (e) {
          const msg = (axios.isAxiosError(e) && e.response)
            ? `Submit failed: ${e.response.status}`
            : (e instanceof Error ? e.message : 'Submit failed')
          alert(msg)
        }
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

          {!loading && !error && (
            formType.toLowerCase() === 'tanstack' ? (
              formConfig ? (
                <DynamicForm config={formConfig} />
              ) : null
            ) : (
              <div className="text-sm text-gray-600">
                Renderer "{formType}" not implemented yet. Try tanstack.
              </div>
            )
          )}
        </div>
      </div>
    </div>
  )
}
