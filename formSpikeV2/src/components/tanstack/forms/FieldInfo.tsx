import type { FieldInfoProps } from '../types/form'

export function FieldInfo({ field }: FieldInfoProps) {
  return (
    <>
      {field.state.meta.isTouched && !field.state.meta.isValid && (
        <div className="text-sm text-red-500 mt-1">
          {Array.from(new Set((field.state.meta.errors || []).filter(Boolean))).map(
            (error: string, index: number) => (
              <div key={index}>{error}</div>
            )
          )}
        </div>
      )}
      {field.state.meta.isValidating && (
        <div className="text-sm text-blue-500 mt-1">Validating...</div>
      )}
    </>
  )
}
