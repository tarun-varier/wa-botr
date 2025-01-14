import { FC } from "react";
import { Input } from "@/components/ui/input";
import { PhoneInput } from "@/components/ui/phone-input";

interface PropertiesProps {
  properties: any[];
  updateProperties: (newProperties: any[]) => void;
}

export const Properties: FC<PropertiesProps> = ({ properties = [], updateProperties }) => {
  const handlePropertyChange = (id: string, value: any) => {
    const updatedProperties = properties.map((p) =>
      p.id === id ? { ...p, value } : p
    );
    updateProperties(updatedProperties);
  };

  return (
    <div>
      {properties.map((property) => (
        <div className="flex items-center space-x-2 my-2" key={property.id}>
          <span className="flex-1">{property.label}:</span>
          <span className="flex-2">
            {property.type === "phnum" ? (
              <PhoneInput
                value={property.value || ""}
                onChange={(value) => handlePropertyChange(property.id, value)}
              />
            ) : property.type === "file" ? (
              <Input
                type="file"
                className="w-3/4"
                accept="image/*, application/pdf"
                onChange={(e) =>
                  handlePropertyChange(property.id, e.target.files?.[0] || "")
                }
              />
            ) : (
              <Input
                value={property.value || ""}
                onChange={(e) =>
                  handlePropertyChange(property.id, e.target.value)
                }
              />
            )}
          </span>
        </div>
      ))}
    </div>
  );
};

