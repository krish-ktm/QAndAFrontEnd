import { Roadmap } from '../../types/api';

export const dpProblems: Roadmap = {
    id: 'dp-problems',
    productId: '1',
    title: 'Dynamic Programming Decision Tree',
    description: 'A logical flow to help you decide if a problem should be solved using Dynamic Programming.',
    type: 'DECISION_TREE',
    nodes: [
        {
            id: '1',
            type: 'start',
            position: { x: 400, y: 0 },
            data: {
                label: 'Analyze the Problem',
                content: '# Problem Analysis\n\nRead the problem statement carefully. Does it ask for:\n\n- Maximum/Minimum value?\n- Number of ways to do something?\n- True/False (is it possible)?\n\nIf yes, it **might** be DP.',
                style: { shape: 'rounded', backgroundColor: '#fef3c7', borderColor: '#d97706' }
            }
        },
        {
            id: 'note-dp',
            type: 'note',
            position: { x: 100, y: 50 },
            data: {
                label: '💡 Remember: DP is just recursion with caching!',
                style: { backgroundColor: '#fef9c3', textColor: '#854d0e' }
            }
        },
        {
            id: '2',
            type: 'decision',
            position: { x: 400, y: 200 },
            data: {
                label: 'Overlapping Subproblems?',
                content: '# Overlapping Subproblems\n\nDoes the recursive solution solve the same subproblems multiple times?\n\n**Example:** Fibonacci(5) calls Fibonacci(3) multiple times.',
                style: { shape: 'diamond', backgroundColor: '#f3e8ff', borderColor: '#9333ea', textColor: '#6b21a8' }
            }
        },
        {
            id: '3',
            type: 'decision',
            position: { x: 200, y: 450 },
            data: {
                label: 'Optimal Substructure?',
                content: '# Optimal Substructure\n\nCan the optimal solution to the problem be constructed from optimal solutions of its subproblems?',
                style: { shape: 'diamond', backgroundColor: '#f3e8ff', borderColor: '#9333ea', textColor: '#6b21a8' }
            }
        },
        {
            id: '4',
            type: 'milestone',
            position: { x: 600, y: 450 },
            data: {
                label: 'Use Greedy or Divide & Conquer',
                content: '# Not DP\n\nIf there are no overlapping subproblems, you likely need:\n\n- **Divide & Conquer** (like Merge Sort)\n- **Greedy Algorithm** (if local optimal choice leads to global optimum)',
                style: { shape: 'rectangle', backgroundColor: '#fee2e2', borderColor: '#dc2626' }
            }
        },
        {
            id: '5',
            type: 'end',
            position: { x: 200, y: 700 },
            data: {
                label: 'Use Dynamic Programming!',
                content: '# It is DP!\n\nSince it has both Overlapping Subproblems and Optimal Substructure, you should use DP.\n\n**Next Step:**\nDecide between Top-Down (Memoization) or Bottom-Up (Tabulation).',
                style: { shape: 'rounded', backgroundColor: '#dcfce7', borderColor: '#16a34a' }
            }
        }
    ],
    edges: [
        { id: 'e1-2', source: '1', target: '2' },
        { id: 'e-note-1', source: 'note-dp', target: '1', style: { strokeDasharray: '5,5', stroke: '#fbbf24' } },

        // Decision 2: Overlapping Subproblems?
        {
            id: 'e2-3',
            source: '2',
            target: '3',
            sourceHandle: 'left',
            label: 'Yes',
            style: { stroke: '#9333ea' }
        },
        {
            id: 'e2-4',
            source: '2',
            target: '4',
            sourceHandle: 'right',
            label: 'No',
            style: { stroke: '#dc2626' }
        },

        // Decision 3: Optimal Substructure?
        {
            id: 'e3-5',
            source: '3',
            target: '5',
            sourceHandle: 'bottom', // Flow down for final Yes
            label: 'Yes',
            style: { stroke: '#16a34a' }
        },
        {
            id: 'e3-4',
            source: '3',
            target: '4',
            sourceHandle: 'right', // Flow right to the "Not DP" bucket
            label: 'No',
            style: { stroke: '#dc2626' }
        }
    ]
};
