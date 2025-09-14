import { Button } from '@/components/ui/button'

type FieldInfoProps = {
  field: any
}

export function FieldInfo({ field }: FieldInfoProps) {
  return (
    <div className="p-4 bg-gray-50 rounded-md">
      <h4 className="font-medium text-gray-900 mb-2">Field Debug Info</h4>
      <div className="text-sm text-gray-600 space-y-1">
        <div><strong>Name:</strong> {field.name}</div>
        <div><strong>Value:</strong> {JSON.stringify(field.state.value)}</div>
        <div><strong>Errors:</strong> {JSON.stringify(field.state.meta.errors)}</div>
        <div><strong>Touched:</strong> {field.state.meta.isTouched ? 'Yes' : 'No'}</div>
        <div><strong>Dirty:</strong> {field.state.meta.isDirty ? 'Yes' : 'No'}</div>
      </div>
    </div>
  )
}