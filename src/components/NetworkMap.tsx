import React, { useEffect, useRef } from 'react';
import * as d3 from 'd3';
import { Target } from '../types';
import { motion } from 'motion/react';
import { Share2, Zap, Shield, Activity } from 'lucide-react';

interface NetworkMapProps {
  targets: Target[];
  activeTargetId: string | null;
  onTargetSelect: (id: string) => void;
}

interface Node extends d3.SimulationNodeDatum {
  id: string;
  name: string;
  type: 'target' | 'gateway' | 'sentinel';
  status: Target['status'];
}

interface Link extends d3.SimulationLinkDatum<Node> {
  source: string;
  target: string;
  value: number;
}

export const NetworkMap: React.FC<NetworkMapProps> = ({ targets, activeTargetId, onTargetSelect }) => {
  const svgRef = useRef<SVGSVGElement>(null);

  useEffect(() => {
    if (!svgRef.current) return;

    const width = svgRef.current.clientWidth;
    const height = svgRef.current.clientHeight;

    // Clear previous SVG content
    d3.select(svgRef.current).selectAll("*").remove();

    const svg = d3.select(svgRef.current)
      .attr("viewBox", [0, 0, width, height]);

    // Define nodes
    const nodes: Node[] = [
      { id: 'sentinel-core', name: 'SENTINEL_CORE', type: 'sentinel', status: 'online' },
      ...targets.map(t => ({ id: t.id, name: t.name, type: 'target' as const, status: t.status }))
    ];

    // Define links
    const links: Link[] = targets.map(t => ({
      source: 'sentinel-core',
      target: t.id,
      value: 1
    }));

    const simulation = d3.forceSimulation<Node>(nodes)
      .force("link", d3.forceLink<Node, Link>(links).id(d => d.id).distance(150))
      .force("charge", d3.forceManyBody().strength(-500))
      .force("center", d3.forceCenter(width / 2, height / 2))
      .force("collision", d3.forceCollide().radius(60));

    // Glow filter
    const defs = svg.append("defs");
    const filter = defs.append("filter")
      .attr("id", "glow");
    filter.append("feGaussianBlur")
      .attr("stdDeviation", "3")
      .attr("result", "coloredBlur");
    const feMerge = filter.append("feMerge");
    feMerge.append("feMergeNode").attr("in", "coloredBlur");
    feMerge.append("feMergeNode").attr("in", "SourceGraphic");

    // Draw links
    const link = svg.append("g")
      .selectAll("line")
      .data(links)
      .join("line")
      .attr("stroke", "var(--accent-cyan)")
      .attr("stroke-opacity", 0.3)
      .attr("stroke-width", 1)
      .attr("stroke-dasharray", "5,5")
      .attr("class", "network-link");

    // Draw nodes
    const node = svg.append("g")
      .selectAll("g")
      .data(nodes)
      .join("g")
      .attr("class", "node-group")
      .call(d3.drag<SVGGElement, Node>()
        .on("start", dragstarted)
        .on("drag", dragged)
        .on("end", dragended) as any)
      .on("click", (event, d) => {
        if (d.type === 'target') onTargetSelect(d.id);
      });

    // Node circles
    node.append("circle")
      .attr("r", d => d.type === 'sentinel' ? 25 : 18)
      .attr("fill", d => {
        if (d.type === 'sentinel') return "var(--accent-purple)";
        if (d.status === 'online') return "var(--accent-green)";
        if (d.status === 'scanning') return "var(--accent-orange)";
        return "var(--text-muted)";
      })
      .attr("fill-opacity", 0.2)
      .attr("stroke", d => {
        if (d.type === 'sentinel') return "var(--accent-purple)";
        if (d.status === 'online') return "var(--accent-green)";
        if (d.status === 'scanning') return "var(--accent-orange)";
        return "var(--text-muted)";
      })
      .attr("stroke-width", 2)
      .attr("filter", "url(#glow)")
      .attr("class", d => activeTargetId === d.id ? "selected-node" : "");

    // Node icons (simplified as text for now, or could use SVG paths)
    node.append("text")
      .attr("dy", ".35em")
      .attr("text-anchor", "middle")
      .attr("fill", "white")
      .attr("font-size", "10px")
      .attr("font-family", "monospace")
      .text(d => d.type === 'sentinel' ? "CORE" : "NODE");

    // Node labels
    node.append("text")
      .attr("dy", 40)
      .attr("text-anchor", "middle")
      .attr("fill", "var(--text-secondary)")
      .attr("font-size", "9px")
      .attr("font-family", "monospace")
      .attr("font-weight", "bold")
      .text(d => d.name);

    simulation.on("tick", () => {
      link
        .attr("x1", d => (d.source as any).x)
        .attr("y1", d => (d.source as any).y)
        .attr("x2", d => (d.target as any).x)
        .attr("y2", d => (d.target as any).y);

      node
        .attr("transform", d => `translate(${d.x},${d.y})`);
    });

    function dragstarted(event: any) {
      if (!event.active) simulation.alphaTarget(0.3).restart();
      event.subject.fx = event.subject.x;
      event.subject.fy = event.subject.y;
    }

    function dragged(event: any) {
      event.subject.fx = event.x;
      event.subject.fy = event.y;
    }

    function dragended(event: any) {
      if (!event.active) simulation.alphaTarget(0);
      event.subject.fx = null;
      event.subject.fy = null;
    }

    return () => simulation.stop();
  }, [targets, activeTargetId, onTargetSelect]);

  return (
    <div className="flex-1 flex flex-col overflow-hidden bg-[var(--bg-secondary)] relative">
      {/* Overlay Info */}
      <div className="absolute top-6 left-6 z-10 pointer-events-none">
        <div className="flex items-center gap-3 mb-2">
          <div className="p-2 rounded-md bg-[rgba(170,85,255,0.1)] text-[var(--accent-purple)] border border-[rgba(170,85,255,0.2)]">
            <Share2 size={20} />
          </div>
          <div>
            <h2 className="text-lg font-black uppercase tracking-[3px] text-[var(--text-primary)]">خريطة الشبكة العصبية</h2>
            <p className="text-[10px] text-[var(--text-muted)] font-mono uppercase tracking-widest">NEURAL_NETWORK_TOPOLOGY_V2.0</p>
          </div>
        </div>
        <div className="flex gap-4 mt-4">
          <div className="flex items-center gap-2 px-3 py-1 rounded bg-[rgba(0,255,157,0.05)] border border-[rgba(0,255,157,0.1)]">
            <Activity size={12} className="text-[var(--accent-green)]" />
            <span className="text-[9px] font-mono text-[var(--text-secondary)]">ACTIVE_NODES: {targets.filter(t => t.status === 'online').length}</span>
          </div>
          <div className="flex items-center gap-2 px-3 py-1 rounded bg-[rgba(255,136,0,0.05)] border border-[rgba(255,136,0,0.1)]">
            <Zap size={12} className="text-[var(--accent-orange)]" />
            <span className="text-[9px] font-mono text-[var(--text-secondary)]">SCANNING: {targets.filter(t => t.status === 'scanning').length}</span>
          </div>
        </div>
      </div>

      {/* Neural Link Overlay (Revolutionary Element) */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-[radial-gradient(circle,rgba(170,85,255,0.03)_0%,transparent_70%)]" />
        <div className="neural-grid" />
      </div>

      <svg ref={svgRef} className="w-full h-full cursor-move" />

      {/* Legend */}
      <div className="absolute bottom-6 right-6 p-4 rounded-lg bg-[rgba(10,14,23,0.8)] border border-[var(--border-color)] backdrop-blur-md">
        <div className="text-[9px] font-black uppercase tracking-widest text-[var(--text-muted)] mb-3">دليل الخريطة</div>
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-[var(--accent-purple)]" />
            <span className="text-[9px] font-mono text-[var(--text-secondary)]">SENTINEL_CORE</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-[var(--accent-green)]" />
            <span className="text-[9px] font-mono text-[var(--text-secondary)]">TARGET_ONLINE</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-[var(--accent-orange)]" />
            <span className="text-[9px] font-mono text-[var(--text-secondary)]">TARGET_SCANNING</span>
          </div>
        </div>
      </div>
    </div>
  );
};
