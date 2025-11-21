import React, { useCallback, useEffect } from 'react';
import {
    ReactFlow,
    Controls,
    Background,
    useNodesState,
    useEdgesState,
    Node,
    Edge,
    BackgroundVariant,
    MarkerType,
    useReactFlow,
    ReactFlowProvider,
    Position
} from '@xyflow/react';
import dagre from 'dagre';
import '@xyflow/react/dist/style.css';
import { Roadmap } from '../../types/api';
import { RoadmapNode } from './RoadmapNode';
import { useIsMobile } from '../../hooks/useIsMobile';

import { RoadmapNote } from './RoadmapNote';
import { RoadmapInfoNode } from './RoadmapInfoNode';
import { RoadmapCodeNode } from './RoadmapCodeNode';
import { RoadmapGroupNode } from './RoadmapGroupNode';
import { RoadmapVideoNode } from './RoadmapVideoNode';
import { RoadmapChecklistNode } from './RoadmapChecklistNode';
import { RoadmapQuizNode } from './RoadmapQuizNode';
import { RoadmapResourceNode } from './RoadmapResourceNode';
import { SimpleFloatingEdge } from './edges/SimpleFloatingEdge';

// Define custom node types
const nodeTypes = {
    start: RoadmapNode,
    end: RoadmapNode,
    milestone: RoadmapNode,
    decision: RoadmapNode,
    note: RoadmapNote,
    info: RoadmapInfoNode,
    code: RoadmapCodeNode,
    group: RoadmapGroupNode,
    video: RoadmapVideoNode,
    checklist: RoadmapChecklistNode,
    quiz: RoadmapQuizNode,
    resource: RoadmapResourceNode,
};

const edgeTypes = {
    floating: SimpleFloatingEdge,
};

const SQUARE_SIZE = 192; // w-48
const RECT_WIDTH = 256;  // w-64
const RECT_HEIGHT = 100; // Approximate height for rectangles
const INFO_WIDTH = 288;  // w-72
const CODE_WIDTH = 320;  // w-80

const getLayoutedElements = (nodes: Node[], edges: Edge[], direction = 'TB') => {
    const dagreGraph = new dagre.graphlib.Graph();
    dagreGraph.setDefaultEdgeLabel(() => ({}));

    const isHorizontal = direction === 'LR';
    dagreGraph.setGraph({ rankdir: direction });

    nodes.forEach((node) => {
        const style = (node.data.style as any) || {};
        const shape = style.shape || 'rectangle';
        const isSquare = shape === 'diamond' || shape === 'circle';
        const isInfo = node.type === 'info';
        const isCode = node.type === 'code';
        const isGroup = node.type === 'group';
        const isVideo = node.type === 'video';
        const isChecklist = node.type === 'checklist';
        const isQuiz = node.type === 'quiz';
        const isResource = node.type === 'resource';

        let width = isSquare ? SQUARE_SIZE : RECT_WIDTH;
        let height = isSquare ? SQUARE_SIZE : RECT_HEIGHT;

        if (isInfo) {
            width = INFO_WIDTH;
            height = 400;
        } else if (isCode) {
            width = CODE_WIDTH;
            height = 200;
        } else if (isGroup) {
            width = 400;
            height = 300;
        } else if (isVideo) {
            width = 320;
            height = 300;
        } else if (isChecklist) {
            width = 288;
            height = 300;
        } else if (isQuiz) {
            width = 320;
            height = 400;
        } else if (isResource) {
            width = 288;
            height = 300;
        }

        dagreGraph.setNode(node.id, { width, height });
    });

    edges.forEach((edge) => {
        dagreGraph.setEdge(edge.source, edge.target);
    });

    dagre.layout(dagreGraph);

    const newNodes = nodes.map((node) => {
        const nodeWithPosition = dagreGraph.node(node.id);

        // Re-calculate dimensions for this specific node to ensure consistency
        const style = (node.data.style as any) || {};
        const shape = style.shape || 'rectangle';
        const isSquare = shape === 'diamond' || shape === 'circle';
        const isInfo = node.type === 'info';
        const isCode = node.type === 'code';
        const isGroup = node.type === 'group';
        const isVideo = node.type === 'video';
        const isChecklist = node.type === 'checklist';

        let width = isSquare ? SQUARE_SIZE : RECT_WIDTH;
        let height = isSquare ? SQUARE_SIZE : RECT_HEIGHT;

        if (isInfo) {
            width = INFO_WIDTH;
            height = 400;
        } else if (isCode) {
            width = CODE_WIDTH;
            height = 200;
        } else if (isGroup) {
            width = 400;
            height = 300;
        } else if (isVideo) {
            width = 320;
            height = 300;
        } else if (isChecklist) {
            width = 288;
            height = 300;
        }

        return {
            ...node,
            targetPosition: isHorizontal ? Position.Left : Position.Top,
            sourcePosition: isHorizontal ? Position.Right : Position.Bottom,
            // We are shifting the dagre node position (anchor=center center) to the top left
            // so it matches the React Flow node anchor point (top left).
            position: {
                x: nodeWithPosition.x - width / 2,
                y: nodeWithPosition.y - height / 2,
            },
            width,
            height,
        };
    });

    return { nodes: newNodes, edges };
};

interface RoadmapTreeViewProps {
    roadmap: Roadmap;
    onNodeClick: (node: Node) => void;
}

const RoadmapTreeContent: React.FC<RoadmapTreeViewProps> = ({ roadmap, onNodeClick }) => {
    const isMobile = useIsMobile();
    const { fitView } = useReactFlow();

    const [nodes, setNodes, onNodesChange] = useNodesState<Node>([]);
    const [edges, setEdges, onEdgesChange] = useEdgesState<Edge>([]);

    useEffect(() => {
        const direction = isMobile ? 'TB' : 'LR';
        const { nodes: layoutedNodes, edges: layoutedEdges } = getLayoutedElements(
            roadmap.nodes,
            roadmap.edges,
            direction
        );

        setNodes(layoutedNodes);
        setEdges(layoutedEdges.map(e => ({
            ...e,
            type: e.type || 'smoothstep', // Use provided type or default to smoothstep
            animated: e.animated || false,
            style: e.style || { stroke: '#94a3b8', strokeWidth: 2, strokeDasharray: '5,5' },
            markerEnd: e.markerEnd || { type: MarkerType.ArrowClosed, color: '#94a3b8' },
            markerStart: e.markerStart,
        })));

        // Wait for render then fit view
        setTimeout(() => {
            fitView();
        }, 50);
    }, [roadmap, isMobile, setNodes, setEdges, fitView]);

    const handleNodeClick = useCallback((_: React.MouseEvent, node: Node) => {
        onNodeClick(node);
    }, [onNodeClick]);

    return (
        <ReactFlow
            nodes={nodes}
            edges={edges}
            onNodesChange={onNodesChange}
            onEdgesChange={onEdgesChange}
            onNodeClick={handleNodeClick}
            nodeTypes={nodeTypes}
            edgeTypes={edgeTypes}
            fitView
            attributionPosition="bottom-right"
            proOptions={{ hideAttribution: true }}
            nodesDraggable={true}
            nodesConnectable={false}
            elementsSelectable={true}
            minZoom={0.5}
            maxZoom={1.5}
        >
            <Controls showInteractive={false} className="bg-white border-gray-200 shadow-sm text-gray-700" />
            <Background color="#f8fafc" gap={20} size={1} variant={BackgroundVariant.Dots} />
        </ReactFlow>
    );
};

export const RoadmapTreeView: React.FC<RoadmapTreeViewProps> = (props) => {
    return (
        <div className="w-full h-full bg-white">
            <ReactFlowProvider>
                <RoadmapTreeContent {...props} />
            </ReactFlowProvider>
        </div>
    );
};
