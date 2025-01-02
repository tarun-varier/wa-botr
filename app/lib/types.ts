import { Position } from "@xyflow/react";

export interface FlowNodeData {
    trigger?: Message;
    response?: Message;
    rules?: Rule[];
    properties?: Property[];
    updateNodeData?: (d: FlowNodeData) => void;
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
    fields: Field[];
}

export interface Operator {
    id: string;
    label: string;
}

export interface Rule {
    operator: string;
    value: string;
    field: string;
}

export interface Property {
    id: string;
    label: string;
    value: string;
}

export interface Field {
    id: string;
    label: string;
    operators: Operator[];
    possibleValues?: { id: string, label: string }[];
}