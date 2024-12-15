import { Background, Controls, ReactFlow } from "@xyflow/react";
import '@xyflow/react/dist/style.css';

const nodes = [
  {
    id: '1',
    position: { x: 0, y: 0 },
    data: { label: 'Hello' },
  },
  {
    id: '2',
    position: { x: -100, y: 200 },
    data: { label: 'World' },
  },
  {
    id: '3',
    position: { x: 100, y: 200 },
    data: { label: 'World' },
  },
];

const edges = [
  {
    id: 'e1-2',
    source: '1',
    target: '2',
    label: 'to',
  },
  {
    id: 'e1-3',
    source: '1',
    target: '3',
    label: '',
  }
];

export default function Home() {

  return (
    <div className="h-screen w-screen">
      <ReactFlow nodes={nodes} edges={edges} draggable={true}>
        <Background />
        <Controls />
      </ReactFlow>
    </div>
  );
}
