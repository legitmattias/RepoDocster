import React from 'react'
import './ProcessorOptions.css'

interface ProcessorOptionsProps {
  bypassProcessor: boolean
  selectedMethods: string[]
  onToggleBypass: () => void
  onMethodChange: (method: string) => void
  methods: string[] // Add this line to define the available methods
}

const ProcessorOptions: React.FC<ProcessorOptionsProps> = ({
  bypassProcessor,
  selectedMethods,
  onToggleBypass,
  onMethodChange,
  methods
}) => (
  <div className="processor-options">
    <label>
      <input
        type="checkbox"
        checked={bypassProcessor}
        onChange={onToggleBypass}
      />
      Bypass Processor
    </label>

    {!bypassProcessor && (
      <>
        <h3>Select Processing Methods:</h3>
        {methods.map((method) => (
          <label key={method}>
            <input
              type="checkbox"
              value={method}
              checked={selectedMethods.includes(method)}
              onChange={() => onMethodChange(method)}
            />
            {method}
          </label>
        ))}
      </>
    )}
  </div>
)

export default ProcessorOptions
