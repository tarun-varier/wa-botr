export interface FlowNodeData {
    trigger: string;
    response: string;
    onEdit: (id: string) => void;
};