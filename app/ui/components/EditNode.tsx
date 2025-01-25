import { FC } from "react";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Combobox } from "./Combobox";
import { messageTypes } from "@/app/lib/constants";
import { Edit, Plus } from "lucide-react";
import { Rules } from "./Rules";
import { Properties } from "./Properties";
import { FlowNodeData } from "@/app/lib/types";
import { Separator } from "@/components/ui/separator";

interface IEditNodeProps {
  nodeData: FlowNodeData;
  updateNodeData: (d: FlowNodeData) => void;
}

export const EditNode: FC<IEditNodeProps> = ({ nodeData, updateNodeData }) => {
  const handleTriggerChange = (trigger: any) => {
    updateNodeData({ trigger, rules: [] });
  };

  const handleResponseChange = (response: any) => {
    updateNodeData({
      response: response,
      properties: response.responseFields.map((f: any) => ({
        ...f,
        value: f.type === "buttons" ? [{ id: "button1", text: "Button 1" }] : "",
      })),
    });
  };

  const addRule = () => {
    const newRule = { field: "", operator: "", value: "" };
    updateNodeData({
      rules: [...(nodeData.rules || []), newRule],
    });
  };

  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button variant={"ghost"} className="w-full nodrag">
          <Edit />
        </Button>
      </SheetTrigger>
      <SheetContent>
        <SheetHeader>
          <SheetTitle>Change Node Settings</SheetTitle>
        </SheetHeader>
        <div className="my-8 space-y-8">
          <div>
            <h3 className="text-2xl font-bold mb-4">Trigger</h3>
            <Combobox
              itemLabel="trigger"
              items={messageTypes}
              item={nodeData.trigger}
              setItem={handleTriggerChange}
            />
            <div className="flex items-center justify-between my-4">
              <span className="text-base font-bold">Rules</span>
              <Button
                variant="ghost"
                className="flex items-center space-x-2 shadow-sm"
                onClick={addRule}
              >
                <Plus className="h-4 w-4" />
              </Button>
            </div>
            <Rules
              rules={nodeData?.rules ?? []}
              triggerFields={nodeData.trigger?.triggerFields || []}
              updateRules={(newRules) =>
                updateNodeData({ rules: newRules })
              }
            />
          </div>
          <Separator />
          <div>
            <h3 className="text-2xl font-bold mb-4">Response</h3>
            <Combobox
              itemLabel="response"
              items={messageTypes}
              item={nodeData.response}
              setItem={handleResponseChange}
            />
            <Properties
              properties={nodeData?.properties ?? []}
              updateProperties={(newProperties) =>
                updateNodeData({ properties: newProperties })
              }
            />
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
};

