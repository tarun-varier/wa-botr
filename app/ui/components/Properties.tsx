import { FC, useRef } from "react";
import { Input } from "@/components/ui/input";
import { PhoneInput } from "@/components/ui/phone-input";
import { ButtonsInput } from "./ButtonsInput";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";

interface PropertiesProps {
    properties: any[];
    updateProperties: (newProperties: any[]) => void;
}

export const Properties: FC<PropertiesProps> = ({ properties = [], updateProperties }) => {

    const fileInputRef = useRef<HTMLInputElement>(null);

    const handlePropertyChange = (id: string, value: any) => {
        const updatedProperties = properties.map((p) =>
            p.id === id ? { ...p, value } : p
        );
        console.log(updatedProperties)
        updateProperties(updatedProperties);
    };

    return (
        <div>
            {properties.map((property) => (
                property.type === "buttons" ? (
                    <ButtonsInput
                        key={property.id}
                        buttons={property.value}
                        updateButtons={(idx, button) => handlePropertyChange(property.id, [...property.value.slice(0, idx), button, ...property.value.slice(idx + 1)])}
                        addButton={() => handlePropertyChange(property.id, [...property.value, { id: "", text: "" }])}
                    />
                ) : (
                    <div className="grid grid-cols-4 items-center space-x-2 my-2" key={property.id}>
                        <span >{property.label}:</span>
                        <span className="col-span-3">
                            {property.type === "phnum" ? (
                                <PhoneInput
                                    value={property.value || ""}
                                    onChange={(value) => handlePropertyChange(property.id, value)}
                                />
                            ) : property.type === "file" ? (
                                <>
                                    {property.value && (
                                        <div className="flex items-center space-x-2 w-full">
                                            <span className="text-ellipsis whitespace-nowrap overflow-hidden">{property.value.name}</span>
                                            <Button
                                                onClick={() => {
                                                    handlePropertyChange(property.id, null)
                                                    if (fileInputRef.current) fileInputRef.current.value = ""
                                                }}
                                            >
                                                Remove
                                            </Button>
                                        </div>
                                    )}
                                    <Input
                                        type="file"
                                        accept="image/*, application/pdf"
                                        onChange={(e) => {
                                            handlePropertyChange(property.id, e.target.files?.[0] || "")
                                        }}
                                        ref={fileInputRef}
                                        style={{ display: property.value ? "none" : "block" }}
                                    />
                                </>
                            ) : (property.type === "text") ? (
                                <Textarea placeholder="Enter message" rows={5} className="resize-none" value={property.value || ""} onChange={(e) => handlePropertyChange(property.id, e.target.value)} />
                            ) : (
                                <Input
                                    value={property.value || ""}
                                    onChange={(e) =>
                                        handlePropertyChange(property.id, e.target.value)
                                    }
                                />)
                            }
                        </span>
                    </div>
                )
            ))}
        </div>
    );
};

