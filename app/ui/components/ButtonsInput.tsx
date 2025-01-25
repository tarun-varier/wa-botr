import React from 'react'
import { ButtonType } from '@/app/lib/types'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Plus } from 'lucide-react'
interface IButtonsInputProps {
    buttons: ButtonType[]
    updateButtons: (idx: number, button: ButtonType) => void
    addButton: () => void
}

export function ButtonsInput({ buttons, updateButtons, addButton }: IButtonsInputProps) {
    return (
        <div className="w-full my-4">
            <div className="flex items-center space-x-2 my-2">
                <span className="flex-1">Button ID</span>
                <span className="flex-1">Button Text</span>
            </div>
            {buttons.map((button) => (
                <div key={buttons.indexOf(button)} className="flex items-center space-x-2 my-2">
                    <Input value={button.id} onChange={(e) => updateButtons(buttons.indexOf(button), { ...button, id: e.target.value })} />
                    <Input value={button.text} onChange={(e) => updateButtons(buttons.indexOf(button), { ...button, text: e.target.value })} />
                </div>
            ))}
            <Button onClick={addButton} className="my-2 w-full"><Plus /></Button>
        </div>
    )
}
