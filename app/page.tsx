"use client"
import { addEdge, Background, Connection, Controls, Edge, Node, NodeTypes, ReactFlow, ReactFlowProvider, useEdgesState, useNodesState, useReactFlow } from "@xyflow/react";
import { useCallback, useMemo, useState } from "react";
import '@xyflow/react/dist/style.css';
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { initialNodes, initialEdges } from "@/lib/initialData";
import { BlockSidebar } from "./ui/components/BlockSidebar";
import FlowNode from "./ui/components/FlowNode";
import { IFlowNode } from "./lib/types";
import "@xyflow/react/dist/style.css";
import { messageTypes } from "./lib/progData";
export default function Home() {

  const nodeTypes: NodeTypes = { flowNode: FlowNode };

  const [nodes, setNodes, onNodesChange] = useNodesState<Node>(initialNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState<Edge>(initialEdges);
  const [isAddingNode, setIsAddingNode] = useState(false);
  const [previewPosition, setPreviewPosition] = useState<{ x: number; y: number } | null>(null);
  const reactFlowInstance = useReactFlow(); // Access React Flow instance to use `project`

  const handleAddNode = () => {
    setIsAddingNode(true); // Enable node-adding mode
  };

  const handleMainClick = (event: React.MouseEvent<HTMLDivElement>) => {
    if (!isAddingNode) return;
    const canvasPosition = reactFlowInstance.screenToFlowPosition({
      x: event.clientX - 100 * reactFlowInstance.getZoom(),
      y: event.clientY
    })

    const newNode: IFlowNode = {
      id: `node-${nodes.length + 1}`,
      position: canvasPosition,
      data: { trigger: messageTypes[0], response: messageTypes[0], updateNodeData: (d: IFlowNode["data"]) => updateNodeData(newNode.id, d) },
      type: "flowNode", // React Flow node type
    };


    setNodes((prevNodes) => [...prevNodes, newNode]);
    setIsAddingNode(false); // Disable node-adding mode
    setPreviewPosition(null)
  };

  const handleConnect = (params: Edge | Connection) => {

    setEdges((prevEdges) => addEdge(params, prevEdges));
  };


  const handleMouseMove = (event: React.MouseEvent) => {
    if (!isAddingNode) return;

    // Update preview node position based on cursor
    const canvasPosition = ({
      x: event.clientX - 250,
      y: event.clientY,
    });
    setPreviewPosition(canvasPosition);
  };

  const updateNodeData = useCallback((nodeId: string, newData: Partial<IFlowNode["data"]>) => {
    setNodes((nds) =>
      nds.map((node) =>
        node.id === nodeId
          ? { ...node, data: { ...node.data, ...newData } }
          : node
      )
    );
  }, [setNodes]);


  return (
    <SidebarProvider>
      <BlockSidebar setnodes={handleAddNode} />
      <div className="h-screen w-screen" onClick={handleMainClick} onMouseMove={handleMouseMove} onDragStart={(event) => event.preventDefault()}>
        <ReactFlow colorMode="dark" nodeTypes={nodeTypes} nodes={nodes} edges={edges} draggable={true} onNodesChange={onNodesChange} onEdgesChange={onEdgesChange} onConnect={handleConnect} fitView>
          <Background />
          <Controls />
          {isAddingNode && previewPosition && (
            <div
              style={{
                position: "absolute",
                top: previewPosition?.y ?? 0,
                left: previewPosition?.x ?? 0,
                width: "100px",
                height: "50px",
                background: "rgba(59, 130, 246, 0.3)", // Faint blue
                border: "1px dashed rgba(59, 130, 246, 0.5)", // Dashed border
                borderRadius: "4px",
                transform: "translate(-50%, -50%)", // Center the ghost node
                pointerEvents: "none", // Ignore mouse events
              }}
            >
              {/* Optional: Label for the ghost node */}
              <div
                style={{
                  color: "rgba(59, 130, 246, 0.8)",
                  textAlign: "center",
                  lineHeight: "50px",
                  fontSize: "12px",
                  fontWeight: "bold",
                }}
              >
                Preview
              </div>
            </div>
          )}
        </ReactFlow>
      </div>
    </SidebarProvider>
  );
}
