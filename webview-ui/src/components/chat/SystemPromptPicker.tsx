import React, { useState, useRef, useEffect } from 'react'
import styled from 'styled-components'
import { vscode } from "../../utils/vscode"
import path from 'path'
import * as os from 'os'

interface PromptOption {
  id: string
  name: string
}

interface SystemPromptProps {
  selectedPrompt: string
  onSelect: (model: string) => void
}

const SystemPromptPicker = ({ selectedPrompt, onSelect }: SystemPromptProps) => {
  const [isOpen, setIsOpen] = useState(false)
  const dropdownRef = useRef<HTMLDivElement>(null)
  const buttonRef = useRef<HTMLDivElement>(null)

  const models: PromptOption[] = [
    { id: 'cline-default', name: 'Cline' },
    { id: 'chatbot', name: 'Chatbot' },
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

  const handleEditRole = () => {
    const promptFile = path.join(os.homedir(), ".cline", "system_prompts.json")
    vscode.postMessage({
      type: "openFile",
      text: promptFile
    })
    setIsOpen(false)
  }

  return (
    <Container>
      <ModelButton ref={buttonRef} onClick={() => setIsOpen(!isOpen)}>
        <CubeIcon className="codicon codicon-json" />
        <span style={{ opacity: 0.8 }}>{selectedPrompt}</span>
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
                onSelect(model.name)
                setIsOpen(false)
              }}>
              <CubeIcon className="codicon codicon-json" />
              <ModelName>{model.name}</ModelName>
            </MenuItem>
          ))}
          <Divider />
          <MenuItem>
            <PlusIcon className="codicon codicon-plus" />
            <span>Add role</span>
          </MenuItem>
          <MenuItem onClick={handleEditRole}>
            <PlusIcon className="codicon codicon-edit" />
            <span>Edit role</span>
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

  left: 30%;
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
`

export default SystemPromptPicker 