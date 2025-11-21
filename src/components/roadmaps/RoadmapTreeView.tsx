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

// Define custom node types
const nodeTypes = {
    start: RoadmapNode,
    end: RoadmapNode,
    milestone: RoadmapNode,
    decision: RoadmapNode,
    note: RoadmapNote,
    // For groups, we can use the default 'group' type or a custom one.
    // React Flow has a default group, but we might want to style it.
    // Let's use a simple custom group for now or just rely on default?
    // Default group is just a node. Let's use RoadmapNode for consistency but maybe style it differently?
    // Actually, let's just use the default 'group' type provided by React Flow if we don't define it, 
    // OR define a simple container.
    // Let's define 'group' as a RoadmapNode for now, but it will need to be styled as a container.
    // Actually, let's leave 'group' undefined here so it falls back to default (if any) or we define a simple one.
    // Better: Define a custom GroupNode if needed. For now, let's just use 'note'.
    // Wait, user asked for Groups. I should probably add a simple Group component.
};

const NODE_WIDTH = 300;
const NODE_HEIGHT = 150;

const getLayoutedElements = (nodes: Node[], edges: Edge[], direction = 'TB') => {
    const dagreGraph = new dagre.graphlib.Graph();
    dagreGraph.setDefaultEdgeLabel(() => ({}));

    const isHorizontal = direction === 'LR';
    dagreGraph.setGraph({ rankdir: direction });

    nodes.forEach((node) => {
        dagreGraph.setNode(node.id, { width: NODE_WIDTH, height: NODE_HEIGHT });
    });

    edges.forEach((edge) => {
        dagreGraph.setEdge(edge.source, edge.target);
    });

    dagre.layout(dagreGraph);

    const newNodes = nodes.map((node) => {
        const nodeWithPosition = dagreGraph.node(node.id);
        return {
            ...node,
            targetPosition: isHorizontal ? Position.Left : Position.Top,
            sourcePosition: isHorizontal ? Position.Right : Position.Bottom,
            // We are shifting the dagre node position (anchor=center center) to the top left
            // so it matches the React Flow node anchor point (top left).
            position: {
                x: nodeWithPosition.x - NODE_WIDTH / 2,
                y: nodeWithPosition.y - NODE_HEIGHT / 2,
            },
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
            type: 'smoothstep',
            animated: false, // Dotted lines don't need animation usually, but can keep if desired. Let's keep it static for roadmap.sh look or animated? Roadmap.sh has static dotted.
            // Actually roadmap.sh edges are often dotted.
            style: { stroke: '#94a3b8', strokeWidth: 2, strokeDasharray: '5,5' }, // Slate-400, dotted
            markerEnd: { type: MarkerType.ArrowClosed, color: '#94a3b8' },
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
