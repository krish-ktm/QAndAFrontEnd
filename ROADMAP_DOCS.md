# Roadmap Feature Documentation

## Overview
The Roadmap feature provides an interactive, visual representation of learning paths or decision trees. It is built using **React Flow** for the graph visualization and **Dagre** for automatic layout calculation. The system supports various custom node types, responsive layouts (vertical on mobile, horizontal on desktop), and advanced edge routing.

## Architecture

### Core Technologies
- **React Flow (@xyflow/react)**: Handles the rendering of nodes and edges, zooming, panning, and interaction.
- **Dagre**: A directed graph layout engine used to automatically calculate the positions of nodes and edges.
- **Custom Components**: React components defined in `src/components/roadmaps/` represent different node types.

### Key Files
- `src/components/roadmaps/RoadmapTreeView.tsx`: The main entry point. It initializes React Flow, registers node/edge types, and handles the Dagre layout logic.
- `src/components/roadmaps/RoadmapNode.tsx`: The generic node component used for standard shapes (start, end, milestone, decision).
- `src/utils/graphUtils.ts`: Contains logic for "floating edges" that snap to the closest handle on a node, with special support for diamond and circle shapes.
- `src/types/api.ts`: Defines the TypeScript interfaces for the roadmap data structure.

## Data Structure

The roadmap data is defined by the `Roadmap` interface in `src/types/api.ts`.

### Roadmap Object
```typescript
interface Roadmap {
  id: string;
  title: string;
  description: string;
  type: 'LEARNING_PATH' | 'DECISION_TREE';
  nodes: RoadmapNode[];
  edges: RoadmapEdge[];
}
```

### Roadmap Node
Nodes are the building blocks of the roadmap.
```typescript
interface RoadmapNode {
  id: string;
  type: 'start' | 'end' | 'milestone' | 'decision' | 'note' | 'group' | 'info' | 'code' | 'video' | 'checklist' | 'quiz' | 'resource';
  position: { x: number; y: number }; // Calculated automatically by Dagre, but required by type
  data: {
    label: string;
    subLabel?: string;
    content?: string; // Markdown supported
    image?: string;
    tags?: { text: string; color?: string }[];
    
    // Specific to node types
    items?: string[];          // For 'checklist' or 'info'
    code?: string;             // For 'code'
    language?: string;         // For 'code'
    videoUrl?: string;         // For 'video'
    question?: string;         // For 'quiz'
    options?: string[];        // For 'quiz'
    correctAnswer?: number;    // For 'quiz' (index)
    resources?: Resource[];    // For 'resource'
    
    // Styling
    style?: {
      shape?: 'rectangle' | 'rounded' | 'circle' | 'diamond';
      backgroundColor?: string;
      textColor?: string;
      borderColor?: string;
    };
  };
}
```

## Node Types

| Type | Component | Description |
|------|-----------|-------------|
| `start` / `end` | `RoadmapNode` | Standard nodes, usually rounded or capsular. |
| `milestone` | `RoadmapNode` | Represents a key achievement or step. |
| `decision` | `RoadmapNode` | Diamond-shaped node for branching paths. |
| `note` | `RoadmapNote` | A sticky-note style node for annotations. |
| `info` | `RoadmapInfoNode` | Rich node with image, tags, and description. |
| `code` | `RoadmapCodeNode` | Displays a snippet of code with syntax highlighting. |
| `video` | `RoadmapVideoNode` | Embeds a video player (e.g., YouTube). |
| `checklist` | `RoadmapChecklistNode` | Displays a list of actionable items. |
| `quiz` | `RoadmapQuizNode` | Interactive multiple-choice question. |
| `resource` | `RoadmapResourceNode` | List of external links, PDFs, or downloads. |
| `group` | `RoadmapGroupNode` | A container node that can visually group others. |

## Layout System

The layout is handled in `RoadmapTreeView.tsx` via the `getLayoutedElements` function.

1.  **Direction**: 
    - **Desktop**: Left-to-Right (`LR`)
    - **Mobile**: Top-to-Bottom (`TB`)
    - This is determined dynamically using the `useIsMobile` hook.

2.  **Sizing**:
    - The layout engine needs to know the dimensions of each node *before* rendering to calculate positions.
    - Dimensions are hardcoded in `getLayoutedElements` based on node type/shape (e.g., `SQUARE_SIZE` for diamonds, `INFO_WIDTH` for info nodes).
    - **Important**: If you change the CSS size of a node, you MUST update the constants in `RoadmapTreeView.tsx` to match, otherwise the layout will overlap or have gaps.

## Edge System

The project uses **Floating Edges** (`SimpleFloatingEdge` in `src/components/roadmaps/edges/`).

- **Dynamic Connection**: Edges do not connect to fixed handles (like "top-left"). Instead, they calculate the intersection point between the edge and the node border.
- **Shape Awareness**: 
    - For `rectangle` nodes, edges connect to the intersection point.
    - For `diamond` and `circle` nodes, logic in `src/utils/graphUtils.ts` snaps the connection to the closest "cardinal" point (Top, Right, Bottom, Left) to look cleaner.

## How to Create a New Node

To add a new node type (e.g., `RoadmapAudioNode`):

### 1. Create the Component
Create `src/components/roadmaps/RoadmapAudioNode.tsx`.
```tsx
import React, { memo } from 'react';
import { Handle, Position, NodeProps } from '@xyflow/react';

export const RoadmapAudioNode = memo(({ data }: NodeProps) => {
  return (
    <div className="roadmap-node audio-node bg-white p-4 rounded shadow-md border border-gray-200 w-72">
      {/* Universal Handles - allow connections from any side */}
      <Handle type="target" position={Position.Top} className="opacity-0" />
      <Handle type="target" position={Position.Left} className="opacity-0" />
      <Handle type="target" position={Position.Right} className="opacity-0" />
      <Handle type="target" position={Position.Bottom} className="opacity-0" />
      
      <div className="font-bold mb-2">{data.label}</div>
      <audio controls src={data.audioUrl} className="w-full" />
      
      <Handle type="source" position={Position.Top} className="opacity-0" />
      <Handle type="source" position={Position.Left} className="opacity-0" />
      <Handle type="source" position={Position.Right} className="opacity-0" />
      <Handle type="source" position={Position.Bottom} className="opacity-0" />
    </div>
  );
});
```

### 2. Update Types
Edit `src/types/api.ts`:
- Add `'audio'` to the `type` union in `RoadmapNode`.
- Add `audioUrl?: string;` to the `data` object in `RoadmapNode`.

### 3. Register the Node
Edit `src/components/roadmaps/RoadmapTreeView.tsx`:
- Import your component.
- Add it to the `nodeTypes` object:
  ```typescript
  const nodeTypes = {
      // ...
      audio: RoadmapAudioNode,
  };
  ```

### 4. Update Layout Logic
Edit `getLayoutedElements` in `RoadmapTreeView.tsx`:
- Define the dimensions for your new node.
  ```typescript
  const isAudio = node.type === 'audio';
  
  if (isAudio) {
      width = 288; // w-72 = 18rem = 288px
      height = 150; // Approximate height
  }
  ```

### 5. Usage
You can now use the node in your roadmap data:
```json
{
  "id": "node-audio-1",
  "type": "audio",
  "data": {
    "label": "Listen to this podcast",
    "audioUrl": "https://example.com/podcast.mp3"
  },
  "position": { "x": 0, "y": 0 }
}
```

## How to Create a Roadmap

To create a new roadmap, you need to define a `Roadmap` object. This is typically done in a TypeScript file (e.g., `src/data/roadmaps/my-new-roadmap.ts`).

### 1. Define the Roadmap Object

```typescript
import { Roadmap } from '../../types/api';
import { MarkerType } from '@xyflow/react';

export const myNewRoadmap: Roadmap = {
    id: 'my-new-roadmap',
    productId: 'product-id-123',
    title: 'My New Learning Path',
    description: 'A guide to mastering a new skill.',
    type: 'LEARNING_PATH',
    nodes: [
        // Define your nodes here
    ],
    edges: [
        // Define connections between nodes here
    ]
};
```

### 2. Add Nodes

Nodes are the content blocks of your roadmap. Each node needs a unique `id`, a `type`, and a `data` object.

**Example: Basic Start Node**
```typescript
{
    id: '1',
    type: 'start',
    position: { x: 0, y: 0 }, // Initial position (will be recalculated by layout engine)
    data: {
        label: 'Start Here',
        content: 'Welcome to the roadmap!',
        style: { shape: 'rounded', backgroundColor: '#ffffff', borderColor: '#cbd5e1' }
    }
}
```

**Example: Interactive Quiz Node**
```typescript
{
    id: 'quiz-1',
    type: 'quiz',
    position: { x: 0, y: 0 },
    data: {
        label: 'Check Your Knowledge',
        question: 'What is the capital of France?',
        options: ['London', 'Berlin', 'Paris', 'Madrid'],
        correctAnswer: 2, // Index of 'Paris'
        explanation: 'Paris is the capital and most populous city of France.',
        style: { borderColor: '#cbd5e1' }
    }
}
```

### 3. Connect Nodes with Edges

Edges define the flow between nodes. You need to specify the `source` node ID and the `target` node ID.

**Example: Standard Edge**
```typescript
{
    id: 'e1-2',
    source: '1',
    target: 'quiz-1',
    type: 'smoothstep', // Options: 'default', 'straight', 'step', 'smoothstep', 'floating'
    animated: true,
    style: { stroke: '#94a3b8' },
    markerEnd: { type: MarkerType.ArrowClosed }
}
```

**Example: Floating Edge (Smart Connection)**
Use `type: 'floating'` for edges that should automatically snap to the closest side of a node (useful for diamond/circle shapes).
```typescript
{
    id: 'e-floating',
    source: 'diamond-node-id',
    target: 'circle-node-id',
    type: 'floating',
    style: { stroke: '#3b82f6', strokeWidth: 2 },
    markerEnd: { type: MarkerType.ArrowClosed, color: '#3b82f6' }
}
```

### 4. Register the Roadmap

Once your roadmap data file is created, you typically need to export it and include it in your application's data aggregation logic (e.g., in `src/data/roadmaps/index.ts` if it exists, or wherever your app fetches roadmap data).

