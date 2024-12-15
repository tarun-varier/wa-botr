"use client"
import { addEdge, Background, Connection, Controls, Edge, Node, ReactFlow, ReactFlowProvider, useEdgesState, useNodesState, useReactFlow } from "@xyflow/react";
import { useState } from "react";
import '@xyflow/react/dist/style.css';
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { initialNodes, initialEdges } from "./lib/initialData";
import { BlockSidebar } from "./ui/components/BlockSidebar";
export default function Home() {

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
      x: event.clientX - (nodes[0].measured?.width ?? 0),
      y: event.clientY - (nodes[0].measured?.height ?? 0),
    })

    const newNode: Node = {
      id: `node-${nodes.length + 1}`,
      position: canvasPosition,
      data: { label: `Node ${nodes.length + 1}` },
      type: "default", // React Flow node type
    };


    setNodes((prevNodes) => [...prevNodes, newNode]);
    console.log(nodes);
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
      x: event.clientX - 255,
      y: event.clientY,
    });
    setPreviewPosition(canvasPosition);
  };
  return (
    <SidebarProvider>
      <BlockSidebar setnodes={handleAddNode} />
      <div>
        <div className="h-screen w-screen" onClick={handleMainClick} onMouseMove={handleMouseMove}>
          <ReactFlow nodes={nodes} edges={edges} draggable={true} onNodesChange={onNodesChange} onEdgesChange={onEdgesChange} onConnect={handleConnect} fitView>
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
      </div>
    </SidebarProvider>
  );
}
