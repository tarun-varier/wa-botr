"use client"
import { addEdge, Background, Connection, Controls, Edge, Node, NodeTypes, ReactFlow, ReactFlowProvider, useEdgesState, useNodesState, useReactFlow } from "@xyflow/react";
import { useCallback, useEffect, useMemo, useState } from "react";
import '@xyflow/react/dist/style.css';
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { initialNodes, initialEdges } from "@/lib/initialData";
import { BlockSidebar } from "./ui/components/BlockSidebar";
import FlowNode from "./ui/components/FlowNode";
import { IFlowNode } from "./lib/types";
import "@xyflow/react/dist/style.css";
import { messageTypes } from "./lib/progData";
import JSZip from "jszip";



export default function Home() {

  const nodeTypes: NodeTypes = useMemo(() => ({ flowNode: FlowNode, flowStartNode: FlowNode }), []);

  const [nodes, setNodes, onNodesChange] = useNodesState<Node>(initialNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState<Edge>(initialEdges);
  const [isAddingNode, setIsAddingNode] = useState(false);
  const [nodeType, setNodeType] = useState<string>("flowNode");
  const [previewPosition, setPreviewPosition] = useState<{ x: number; y: number } | null>(null);
  const reactFlowInstance = useReactFlow(); // Access React Flow instance to use `project`

  useEffect(() => {
    console.log({
      nodes: nodes,
      edges: edges
    })
  }, [nodes, edges])

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
      type: nodeType, // React Flow node type
    };


    setNodes((prevNodes) => [...prevNodes, newNode]);
    setIsAddingNode(false); // Disable node-adding mode
    setNodeType("flowNode");
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

  const handleExport = async () => {
    const zip = new JSZip();
    zip.file("data.json", JSON.stringify({ nodes, edges }));
    const engineProg = await fetch("/bot/main.py").then((res) => res.text());
    zip.file("engine.py", engineProg);
    const media = zip.folder("media");
    for (const node of nodes) {
        if (node.data.response.id === "media") {
            const file = node.data.properties[0].value;
            media?.file(file.name, file);
        }
    }

    zip.generateAsync({ type: "blob" }).then((content) => {
        const url = URL.createObjectURL(content);
        const a = document.createElement("a");
        a.href = url;
        a.download = "export.zip";
        a.click();
        URL.revokeObjectURL(url);
    });
  }

  return (
    <SidebarProvider>
      <BlockSidebar addClick={handleAddNode} setNodeType={setNodeType} onExport={handleExport} />
      <div className="h-screen w-screen" onClick={handleMainClick} onMouseMove={handleMouseMove} onDragStart={(event) => event.preventDefault()}>
        <ReactFlow colorMode="dark" nodeTypes={nodeTypes} nodes={nodes} edges={edges} draggable={true} onNodesChange={onNodesChange} onEdgesChange={onEdgesChange} onConnect={handleConnect} fitView isValidConnection={(c) => !!(c.source && c.target)}>
          <Background />
          <Controls />
          {isAddingNode && previewPosition && (
            <PreviewBox x={previewPosition.x} y={previewPosition.y} />
          )}
        </ReactFlow>
      </div>
    </SidebarProvider>
  );
}

function PreviewBox(previewPosition: { x: number; y: number; }) {
  return <div
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
  </div>;
}

