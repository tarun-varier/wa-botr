import { FC } from "react";
import { Setting } from "./Setting";

interface RulesProps {
  rules: any[];
  triggerFields: any[];
  updateRules: (newRules: any[]) => void;
}

export const Rules: FC<RulesProps> = ({ rules = [], triggerFields, updateRules }) => {
  const handleRuleChange = (index: number, updatedRule: any) => {
    const newRules = rules.map((rule, i) => (i === index ? updatedRule : rule));
    updateRules(newRules);
  };

  return (
    <div className="flex flex-col space-y-4">
      {rules.map((rule, index) => (
        <Setting
          key={index}
          fields={triggerFields}
          data={rule}
          setData={(updatedRule) => handleRuleChange(index, updatedRule)}
        />
      ))}
    </div>
  );
};

