import React, { useState, useRef, useEffect } from 'react'
import styled from 'styled-components'

interface ModelOption {
  id: string
  name: string
  status?: string
}

interface ModelPickerProps {
  selectedModel: string
  onModelSelect: (model: string) => void
}

const ModelPicker = ({ selectedModel, onModelSelect }: ModelPickerProps) => {
  const [isOpen, setIsOpen] = useState(false)
  const dropdownRef = useRef<HTMLDivElement>(null)
  const buttonRef = useRef<HTMLDivElement>(null)

  const models: ModelOption[] = [
    { id: 'claude-3.5-sonnet', name: 'Claude 3.5 Sonnet' },
    { id: 'gpt4o', name: 'GPT-4o' },
    { id: 'llama-70b-free', name: 'Llama3.1 70b' },
    { id: 'codestral-free', name: 'Codestral' },
    { id: 'claude-3-sonnet', name: 'Claude 3.5 Sonnet', status: 'Missing API key' },
  ]

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node) &&
          buttonRef.current && !buttonRef.current.contains(event.target as Node)) {
        setIsOpen(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  return (
    <Container>
      <ModelButton ref={buttonRef} onClick={() => setIsOpen(!isOpen)}>
        <CubeIcon className="codicon codicon-package" />
        <span style={{ opacity: 0.8 }}>{selectedModel}</span>
        <ChevronIcon 
          className={`codicon codicon-chevron-${isOpen ? 'up' : 'down'}`} 
        />
      </ModelButton>

      {isOpen && (
        <DropdownMenu ref={dropdownRef}>
          {models.map((model) => (
            <MenuItem
              key={model.id}
              onClick={() => {
                onModelSelect(model.name)
                setIsOpen(false)
              }}>
              <CubeIcon className="codicon codicon-package" />
              <ModelName>{model.name}</ModelName>
              {model.status && <StatusText>({model.status})</StatusText>}
            </MenuItem>
          ))}
          <Divider />
          <MenuItem>
            <PlusIcon className="codicon codicon-plus" />
            <span>Add Chat model</span>
          </MenuItem>
        </DropdownMenu>
      )}
    </Container>
  )
}

const Container = styled.div`
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
`

const ModelButton = styled.div`
  display: flex;
  align-items: center;
  gap: 4px;
  cursor: pointer;
  padding: 2px 4px;
  border-radius: 3px;
  white-space: nowrap;
  
  &:hover {
    background-color: var(--vscode-toolbar-hoverBackground);
  }
`

const DropdownMenu = styled.div`
  position: fixed;
  z-index: 1000;
  min-width: 260px;
  background-color: var(--vscode-dropdown-background);
  border: 1px solid var(--vscode-dropdown-border);
  border-radius: 3px;
  box-shadow: 0 -2px 8px rgba(0, 0, 0, 0.15);
  display: flex;
  flex-direction: column-reverse;
  left: 50%;
  transform: translateX(-50%);
  bottom: 45px;
`

const MenuItem = styled.div`
  display: flex;
  align-items: center;
  padding: 8px 12px;
  cursor: pointer;
  gap: 8px;
  &:hover {
    background-color: var(--vscode-list-hoverBackground);
  }
`

const ModelName = styled.span`
  flex-grow: 1;
`

const StatusText = styled.span`
  color: var(--vscode-descriptionForeground);
  font-style: italic;
`

const CubeIcon = styled.i`
  font-size: 14px;
  opacity: 0.8;
`

const ChevronIcon = styled.i`
  font-size: 12px;
  opacity: 0.8;
`

const PlusIcon = styled.i`
  font-size: 14px;
  opacity: 0.8;
`

const Divider = styled.div`
  height: 1px;
  background-color: var(--vscode-dropdown-border);
  margin: 4px 0;
`

const KeyboardShortcut = styled.div`
  padding: 4px 12px;
  color: var(--vscode-descriptionForeground);
  font-size: 12px;
  background-color: var(--vscode-dropdown-listBackground);
  border-top-left-radius: 3px;
  border-top-right-radius: 3px;
`

export default ModelPicker 