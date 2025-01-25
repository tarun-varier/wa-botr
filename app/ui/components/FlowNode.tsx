import React from 'react';
import { Handle, Position, NodeProps } from '@xyflow/react';
import { IFlowNode } from '@/app/lib/types';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { EditNode } from './EditNode';
import { Trash2 } from 'lucide-react';


const FlowNode = ({ id, data, type }: NodeProps<IFlowNode>) => {
    return (
        <Card className={"w-[200px]"}>
            <CardContent className='p-4 pt-0'>
                {/* Trigger Preview */}
                <div className="preview-section">
                    <label>Trigger:</label>
                    <div className="flex w-full max-w-sm items-center ">
                        <Input disabled value={data.trigger?.label} className='disabled:cursor-pointer' />
                    </div>
                </div>

                {/* Response Preview */}
                <div className="preview-section">
                    <label>Response:</label>
                    <div className="flex w-full max-w-sm items-center ">
                        <Input disabled value={data.response?.label} className='disabled:cursor-pointer' />
                    </div>
                </div>

                <div className="w-full flex flex-row">
                    <EditNode nodeData={data} updateNodeData={data.updateNodeData ? data.updateNodeData : () => console.log("not available")} />
                    <Button className="w-full" onClick={() => data.deleteNode ? data.deleteNode(id) : console.log("not available")}><Trash2 /></Button>
                </div>
            </CardContent>

            {/* Handles */}
            {type === "flowNode" && <Handle type="target" position={Position.Top} />}
            <Handle type="source" position={Position.Bottom} />
        </Card>
    );
};

export default FlowNode;
