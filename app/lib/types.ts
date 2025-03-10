import { Position } from "@xyflow/react";

export interface FlowNodeData {
    trigger?: Message;
    response?: Message;
    rules?: Rule[];
    properties?: Property[];
    updateNodeData?: (d: FlowNodeData) => void;
    deleteNode?: (id: string) => void;
    [key: string]: unknown;
}

export interface IFlowNode {
    id: string;
    data: FlowNodeData;
    type: string;
    position: {
        x: number;
        y: number;
    };
    width?: number; // Optional
    height?: number; // Optional
    sourcePosition?: Position;
    targetPosition?: Position;
    selected?: boolean;
    dragHandle?: string;
    selectable?: boolean;
    deletable?: boolean;
    draggable?: boolean; // Optional
    parentId?: string;
}

export interface Message {
    id: string;
    label: string;
    triggerFields: Field[];
    responseFields: Field[];
}

export interface Operator {
    id: string;
    label: string;
}

export interface ButtonType {
    id: string;
    text: string;
}

export interface Rule {
    operator: string;
    value: string;
    field: string;
}

export interface Property {
    type: string;
    id: string;
    label: string;
    value: string | File | ButtonType[];
}

export interface Field {
    id: string;
    label: string;
    type: string;
    possibleValues?: { id: string, label: string }[];
}
