interface Node {
  id: string;
  x: number;
  y: number;
}

interface Edge {
  id?: string;
  from: string;
  to: string;
  weight?: number;
}

interface GraphCanvasProps {
  nodes: Node[];
  edges: Edge[];
  directed?: boolean;
  width?: number;
  height?: number;
  onNodeClick?: (id: string) => void;
  onEdgeClick?: (id: string) => void;
  highlightedNodes?: string[];
  highlightedEdges?: string[];
  nodeNumbers?: Record<string, string | number>;
}

export function GraphCanvas({
  nodes,
  edges,
  directed = false,
  width = 500,
  height = 340,
  onNodeClick,
  onEdgeClick,
  highlightedNodes = [],
  highlightedEdges = [],
  nodeNumbers = {},
}: GraphCanvasProps) {
  const RADIUS = 22;

  const nodeMap = Object.fromEntries(nodes.map((n) => [n.id, n]));

  const edgeId = (e: Edge) => e.id ?? `${e.from}-${e.to}`;

  const getMidpoint = (e: Edge) => {
    const a = nodeMap[e.from];
    const b = nodeMap[e.to];
    if (!a || !b) return { mx: 0, my: 0 };
    return { mx: (a.x + b.x) / 2, my: (a.y + b.y) / 2 };
  };

  const getLinePoints = (e: Edge) => {
    const a = nodeMap[e.from];
    const b = nodeMap[e.to];
    if (!a || !b) return { x1: 0, y1: 0, x2: 0, y2: 0 };
    const dx = b.x - a.x;
    const dy = b.y - a.y;
    const len = Math.sqrt(dx * dx + dy * dy) || 1;
    return {
      x1: a.x + (dx / len) * RADIUS,
      y1: a.y + (dy / len) * RADIUS,
      x2: b.x - (dx / len) * (RADIUS + (directed ? 6 : 0)),
      y2: b.y - (dy / len) * (RADIUS + (directed ? 6 : 0)),
    };
  };

  const VB_PAD = 6;
  const vbMinX = nodes.length ? Math.min(...nodes.map((n) => n.x)) - RADIUS - VB_PAD : 0;
  const vbMinY = nodes.length ? Math.min(...nodes.map((n) => n.y)) - RADIUS - VB_PAD : 0;
  const vbMaxX = nodes.length ? Math.max(...nodes.map((n) => n.x)) + RADIUS + VB_PAD : width;
  const vbMaxY = nodes.length ? Math.max(...nodes.map((n) => n.y)) + RADIUS + VB_PAD : height;

  return (
    <svg
      viewBox={`${vbMinX} ${vbMinY} ${vbMaxX - vbMinX} ${vbMaxY - vbMinY}`}
      width="100%"
      style={{ maxWidth: width }}
      className="select-none"
    >
      <defs>
        <marker id="arrow" markerWidth="10" markerHeight="7" refX="9" refY="3.5" orient="auto">
          <polygon points="0 0, 10 3.5, 0 7" fill="#94a3b8" />
        </marker>
        <marker id="arrow-hi" markerWidth="10" markerHeight="7" refX="9" refY="3.5" orient="auto">
          <polygon points="0 0, 10 3.5, 0 7" fill="#3b82f6" />
        </marker>
      </defs>

      {/* Edges */}
      {edges.map((e) => {
        const id = edgeId(e);
        const hi = highlightedEdges.includes(id);
        const { x1, y1, x2, y2 } = getLinePoints(e);
        const { mx, my } = getMidpoint(e);
        return (
          <g key={id} onClick={() => onEdgeClick?.(id)} style={{ cursor: onEdgeClick ? 'pointer' : 'default' }}>
            <line
              x1={x1} y1={y1} x2={x2} y2={y2}
              stroke={hi ? '#3b82f6' : '#cbd5e1'}
              strokeWidth={hi ? 2.5 : 1.8}
              markerEnd={directed ? (hi ? 'url(#arrow-hi)' : 'url(#arrow)') : undefined}
            />
            {/* Invisible wider hit area */}
            <line
              x1={x1} y1={y1} x2={x2} y2={y2}
              stroke="transparent"
              strokeWidth={14}
            />
            {e.weight !== undefined && (
              <text x={mx} y={my - 6} textAnchor="middle" fontSize={11} fill={hi ? '#3b82f6' : '#64748b'} fontWeight="600">
                {e.weight}
              </text>
            )}
          </g>
        );
      })}

      {/* Nodes */}
      {nodes.map((n) => {
        const hi = highlightedNodes.includes(n.id);
        return (
          <g key={n.id} onClick={() => onNodeClick?.(n.id)} style={{ cursor: onNodeClick ? 'pointer' : 'default' }}>
            <circle
              cx={n.x} cy={n.y} r={RADIUS}
              fill={hi ? '#dbeafe' : '#f8fafc'}
              stroke={hi ? '#3b82f6' : '#94a3b8'}
              strokeWidth={hi ? 2.5 : 1.5}
            />
            <text x={n.x} y={n.y + 1} textAnchor="middle" dominantBaseline="middle"
              fontSize={13} fontWeight="600" fill={hi ? '#1d4ed8' : '#334155'}>
              {nodeNumbers[n.id] ?? n.id}
            </text>
          </g>
        );
      })}
    </svg>
  );
}
