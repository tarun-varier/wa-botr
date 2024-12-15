export const initialNodes = [
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

export const initialEdges = [
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
