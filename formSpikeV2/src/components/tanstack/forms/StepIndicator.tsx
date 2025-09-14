import { Check } from 'lucide-react'
import type { StepConfig } from '../types/form'

type StepIndicatorProps = {
  steps: StepConfig[]
  currentStep: number
  completedSteps: Set<number>
}

export function StepIndicator({ steps, currentStep, completedSteps }: StepIndicatorProps) {
  return (
    <div className="relative">
      {/* Progress Line Background */}
      <div className="absolute left-4 top-4 bottom-4 w-0.5 bg-gray-200"></div>

      {/* Steps */}
      <div className="relative space-y-8">
        {steps.map((step, index) => {
          const isCompleted = completedSteps.has(index)
          const isCurrent = index === currentStep
          const isActive = isCompleted || isCurrent

          return (
            <div key={step.id} className="flex items-center space-x-4">
              {/* Step Circle */}
              <div className={`
                relative z-10 flex items-center justify-center w-8 h-8 rounded-full text-sm font-semibold transition-all duration-200
                ${isCompleted
                  ? 'bg-green-500 text-white shadow-lg'
                  : isCurrent
                  ? 'bg-blue-500 text-white shadow-lg'
                  : 'bg-gray-200 text-gray-500'
                }
              `}>
                {isCompleted ? (
                  <Check className="w-4 h-4" />
                ) : (
                  <span>{index + 1}</span>
                )}
              </div>

              {/* Step Content */}
              <div className="flex-1 min-w-0">
                <div className={`
                  text-sm font-medium transition-colors duration-200
                  ${isCurrent
                    ? 'text-blue-600'
                    : isCompleted
                    ? 'text-green-600'
                    : 'text-gray-500'
                  }
                `}>
                  {step.label}
                </div>

                {/* Step Description/Status */}
                <div className="text-xs text-gray-400 mt-1">
                  {isCompleted
                    ? 'Completed'
                    : isCurrent
                    ? 'In Progress'
                    : 'Pending'
                  }
                </div>
              </div>

              {/* Progress Line Segment */}
              {index < steps.length - 1 && (
                <div className={`
                  absolute left-4 w-0.5 h-8 transition-colors duration-200
                  ${isCompleted ? 'bg-green-500' : 'bg-gray-200'}
                `}
                style={{
                  top: `${(index + 1) * 2}rem`,
                  marginTop: '1rem'
                }} />
              )}
            </div>
          )
        })}
      </div>
    </div>
  )
}