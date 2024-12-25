import { Field, Message, Operator, } from "./types";

export const Is: Operator = { id: "is", label: "Is" };
export const IsNot: Operator = { id: "is-not", label: "Is Not" };
export const Contains: Operator = { id: "contains", label: "Contains" };
export const NotContains: Operator = { id: "not-contains", label: "Does not contain" };
export const LessThan: Operator = { id: "less-than", label: "Less Than" };
export const LessThanEquals: Operator = { id: "less-than-equals", label: "Less Than Equals" };
export const GreaterThan: Operator = { id: "greater-than", label: "Greater Than" };
export const GreaterThanEquals: Operator = { id: "greater-than-equals", label: "Greater Than Equals" };
export const Equals: Operator = { id: "equals", label: "Equals" };
export const NotEquals: Operator = { id: "not-equals", label: "Not Equals" };

const stringOperators = [Is, IsNot, Contains, NotContains];
const numOperators = [LessThan, LessThanEquals, GreaterThan, GreaterThanEquals, Equals, NotEquals];

export const MessageField: Field = {
    id: "message",
    label: "Message",
    operators: stringOperators,
};

export const messageTypes: Message[] = [
    { id: "text", value: "Text Message", label: "Text Message", fields: [MessageField] },
    { id: "media", value: "Media Message", label: "Media Message", fields: [{ id: "file-name", label: "File Name", operators: stringOperators }] },
    { id: "location", value: "Location Message", label: "Location Message", fields: [{ id: "latitude", label: "Latitude", operators: numOperators }, { id: "longitude", label: "Longitude", operators: numOperators }] },
    { id: "contact", value: "Contact Message", label: "Contact Message", fields: [{ id: "name", label: "Name", operators: stringOperators }, { id: "number", label: "Number", operators: stringOperators }] },
    { id: "interactive", value: "Interactive Message", label: "Interactive Message", fields: [{ id: "type", label: "Type", operators: stringOperators }, { id: "value", label: "Value", operators: stringOperators }] },
    { id: "reply", value: "Reply To Message", label: "Reply To Message", fields: [MessageField] },
    { id: "reaction", value: "Reaction Message", label: "Reaction Message", fields: [MessageField] },
];
