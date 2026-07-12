import PDFDocument from 'pdfkit';
import type { Problem } from '../data/problems';

// NOTE: English only. pdfkit's built-in fonts (Helvetica/Courier) have no CJK glyphs,
// and bundling a CJK-capable TTF font is out of scope here. If Chinese PDFs are
// needed later, that requires adding a font file + doc.font(path) for zh content.

const MARGIN = 50;

interface Box { left: number; width: number }
function box(doc: PDFKit.PDFDocument): Box {
  return { left: doc.page.margins.left, width: doc.page.width - doc.page.margins.left - doc.page.margins.right };
}

function ensureSpace(doc: PDFKit.PDFDocument, needed: number): void {
  const bottom = doc.page.height - doc.page.margins.bottom;
  if (doc.y + needed > bottom) doc.addPage();
}

function capitalize(s: string): string {
  return s.charAt(0).toUpperCase() + s.slice(1);
}

// Helvetica/Courier use WinAnsi encoding, which has no arrow or emoji glyphs. Any
// \u2192/\u2190/\u26a0\ufe0f in problem text renders as garbage (e.g. "!'", "& þ").
// Swap/strip them before they ever reach doc.text(), for every call in this module.
function asciiSafe(s: string): string {
  return s.replace(/\u2192/g, '->').replace(/\u2190/g, '<-').replace(/\u26a0\ufe0f?\s*/g, '');
}

function patchTextSanitizer(doc: PDFKit.PDFDocument): void {
  const original = doc.text.bind(doc);
  doc.text = ((text: string, ...rest: unknown[]) =>
    original(asciiSafe(text), ...(rest as []))) as typeof doc.text;
}

// ── Markdown-lite text rendering (bold/code markers stripped, fenced code blocks in monospace) ──

function stripInline(s: string): string {
  return s.replace(/\*\*(.*?)\*\*/g, '$1').replace(/`([^`]*)`/g, '$1');
}

// ── Markdown table detection/rendering ──

function isTableRow(line: string): boolean {
  return /^\s*\|.*\|\s*$/.test(line);
}

function isSeparatorRow(line: string): boolean {
  return isTableRow(line) && /^[\s|:-]+$/.test(line);
}

function parseRow(line: string): string[] {
  return line.trim().replace(/^\|/, '').replace(/\|$/, '').split('|').map(c => stripInline(c.trim()));
}

function drawTable(doc: PDFKit.PDFDocument, header: string[], rows: string[][]): void {
  const { left, width } = box(doc);
  const cols = header.length;
  const colWidth = width / cols;
  const rowH = 18;

  const drawRow = (cells: string[], y: number, bold: boolean): void => {
    doc.font(bold ? 'Helvetica-Bold' : 'Helvetica').fontSize(8.5);
    cells.forEach((cell, i) => {
      doc.rect(left + i * colWidth, y, colWidth, rowH).fillAndStroke(bold ? '#f1f5f9' : '#ffffff', '#cbd5e1');
      doc.fillColor('#1f2937').text(cell, left + i * colWidth + 4, y + 5, { width: colWidth - 8, height: rowH - 4, ellipsis: true });
    });
  };

  ensureSpace(doc, rowH);
  drawRow(header, doc.y, true);
  doc.y += rowH;
  for (const row of rows) {
    ensureSpace(doc, rowH);
    drawRow(row, doc.y, false);
    doc.y += rowH;
  }
  doc.moveDown(0.3);
}

function renderText(doc: PDFKit.PDFDocument, raw: string): void {
  const { left, width } = box(doc);
  const lines = raw.split('\n');
  let inCode = false;
  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    if (line.trim().startsWith('```')) { inCode = !inCode; continue; }
    if (inCode) {
      doc.font('Courier').fontSize(8.5).fillColor('#1e293b').text(line || ' ', left, doc.y, { width, lineGap: 1 });
      continue;
    }
    if (isTableRow(line) && isSeparatorRow(lines[i + 1] ?? '')) {
      const header = parseRow(line);
      const rows: string[][] = [];
      let j = i + 2;
      while (j < lines.length && isTableRow(lines[j])) { rows.push(parseRow(lines[j])); j++; }
      drawTable(doc, header, rows);
      i = j - 1;
      continue;
    }
    const text = stripInline(line).replace(/^-\s+/, '\u2022 ');
    doc.font('Helvetica').fontSize(10).fillColor('#1f2937').text(text || ' ', left, doc.y, { width, lineGap: 2 });
  }
}

// ── Graph drawing (shared by click-edges / click-sequence / checkbox-multi graphs) ──

interface GNode { id: string; x: number; y: number }
interface GEdge { id?: string; from: string; to: string; weight?: number }

function drawArrowHead(doc: PDFKit.PDFDocument, tipX: number, tipY: number, ux: number, uy: number): void {
  const size = 6;
  const leftX = tipX - ux * size - uy * size * 0.6;
  const leftY = tipY - uy * size + ux * size * 0.6;
  const rightX = tipX - ux * size + uy * size * 0.6;
  const rightY = tipY - uy * size - ux * size * 0.6;
  doc.fillColor('#94a3b8').moveTo(tipX, tipY).lineTo(leftX, leftY).lineTo(rightX, rightY).closePath().fill();
}

function drawGraph(doc: PDFKit.PDFDocument, nodes: GNode[], edges: GEdge[], directed: boolean, x: number, y: number, w: number, h: number): void {
  if (nodes.length === 0) return;
  const xs = nodes.map(n => n.x), ys = nodes.map(n => n.y);
  const minX = Math.min(...xs), maxX = Math.max(...xs), minY = Math.min(...ys), maxY = Math.max(...ys);
  const pad = 16;
  const scaleX = maxX > minX ? (w - 2 * pad) / (maxX - minX) : 1;
  const scaleY = maxY > minY ? (h - 2 * pad) / (maxY - minY) : 1;
  const scale = Math.min(scaleX, scaleY);
  const R = 12;
  const pos = new Map<string, { px: number; py: number }>();
  for (const n of nodes) {
    pos.set(n.id, { px: x + pad + (n.x - minX) * scale, py: y + pad + (n.y - minY) * scale });
  }

  doc.lineWidth(1).strokeColor('#94a3b8');
  for (const e of edges) {
    const a = pos.get(e.from), b = pos.get(e.to);
    if (!a || !b) continue;
    doc.moveTo(a.px, a.py).lineTo(b.px, b.py).stroke();
    if (directed) {
      const dx = b.px - a.px, dy = b.py - a.py;
      const len = Math.hypot(dx, dy) || 1;
      drawArrowHead(doc, b.px - (dx / len) * R, b.py - (dy / len) * R, dx / len, dy / len);
    }
    if (e.weight != null) {
      const mx = (a.px + b.px) / 2, my = (a.py + b.py) / 2;
      doc.font('Helvetica-Bold').fontSize(7.5).fillColor('#2563eb').text(String(e.weight), mx - 6, my - 5, { width: 12, align: 'center' });
    }
  }
  for (const n of nodes) {
    const p = pos.get(n.id)!;
    doc.circle(p.px, p.py, R).fillAndStroke('#eff6ff', '#3b82f6');
    doc.font('Helvetica-Bold').fontSize(8).fillColor('#1e3a8a').text(n.id, p.px - R, p.py - 4, { width: R * 2, align: 'center' });
  }
}

// ── Per-type body renderers (visual scaffold matching the web widget) ──

function drawChips(doc: PDFKit.PDFDocument, items: string[]): void {
  const { left, width } = box(doc);
  const chipH = 22, gap = 8, padX = 10;
  let x = left, y = doc.y;
  doc.font('Helvetica').fontSize(10);
  for (const item of items) {
    const w = doc.widthOfString(item) + padX * 2;
    if (x + w > left + width) { x = left; y += chipH + gap; }
    doc.roundedRect(x, y, w, chipH, 4).stroke('#cbd5e1');
    doc.fillColor('#111827').text(item, x + padX, y + 6, { lineBreak: false });
    x += w + gap;
  }
  doc.y = y + chipH + 12;
}

function renderDragOrder(doc: PDFKit.PDFDocument, data: { pool: string[]; slots: number; slotLabels?: string[] }): void {
  const { left, width } = box(doc);
  doc.font('Helvetica-Bold').fontSize(9).fillColor('#374151').text('Available items:', left, doc.y);
  doc.moveDown(0.2);
  drawChips(doc, data.pool);
  doc.moveDown(0.3);
  doc.font('Helvetica-Bold').fontSize(9).fillColor('#374151').text(`Fill in ${data.slots} slot(s) in order:`, left, doc.y);
  doc.moveDown(0.3);
  const boxW = 92, boxH = 34, gap = 14;
  let x = left, y = doc.y;
  ensureSpace(doc, boxH + 30);
  y = doc.y;
  for (let i = 0; i < data.slots; i++) {
    if (x + boxW > left + width) { x = left; y += boxH + 26; }
    doc.dash(3, { space: 2 }).roundedRect(x, y, boxW, boxH, 4).stroke('#94a3b8').undash();
    doc.font('Helvetica').fontSize(8).fillColor('#6b7280')
      .text(data.slotLabels?.[i] ?? `Slot ${i + 1}`, x, y + boxH + 4, { width: boxW, align: 'center' });
    x += boxW + gap;
  }
  doc.y = y + boxH + 22;
}

function renderOptions(doc: PDFKit.PDFDocument, options: { id: string; text: string }[]): void {
  const { left, width } = box(doc);
  for (const opt of options) {
    ensureSpace(doc, 24);
    const y = doc.y;
    doc.rect(left, y + 1, 10, 10).stroke('#94a3b8');
    doc.font('Helvetica').fontSize(10).fillColor('#111827')
      .text(`${opt.id}.  ${stripInline(opt.text)}`, left + 18, y, { width: width - 18 });
    doc.moveDown(0.35);
  }
}

interface GraphDef { id: string; label?: string; nodes: GNode[]; edges: GEdge[]; directed?: boolean }
function chunk<T>(arr: T[], n: number): T[][] {
  const out: T[][] = [];
  for (let i = 0; i < arr.length; i += n) out.push(arr.slice(i, i + n));
  return out;
}

function renderGraphsGrid(doc: PDFKit.PDFDocument, graphs: GraphDef[]): void {
  const { left, width } = box(doc);
  const cols = 3;
  const cellW = width / cols;
  const graphH = 95;
  for (const row of chunk(graphs, cols)) {
    ensureSpace(doc, graphH + 45);
    const y0 = doc.y;
    row.forEach((g, i) => {
      const x0 = left + i * cellW;
      drawGraph(doc, g.nodes, g.edges, !!g.directed, x0, y0, cellW - 10, graphH);
      doc.font('Helvetica').fontSize(9).fillColor('#374151')
        .text(g.label ?? g.id, x0, y0 + graphH + 4, { width: cellW - 10, align: 'center' });
      doc.rect(x0 + (cellW - 10) / 2 - 5, y0 + graphH + 18, 10, 10).stroke('#94a3b8');
    });
    doc.y = y0 + graphH + 36;
  }
}

interface MatchItem { id: string; text: string }
function normalizeMatch(arr: (string | MatchItem)[]): MatchItem[] {
  return arr.map(it => (typeof it === 'string' ? { id: it, text: it } : it));
}

function renderDragMatch(doc: PDFKit.PDFDocument, data: { left: (string | MatchItem)[]; right: (string | MatchItem)[] }): void {
  const { left: contentLeft, width } = box(doc);
  const leftItems = normalizeMatch(data.left);
  const rightItems = normalizeMatch(data.right);
  const colW = (width - 40) / 2;
  const rightX = contentLeft + colW + 40;
  const rowH = 32;
  const n = Math.max(leftItems.length, rightItems.length);
  ensureSpace(doc, n * rowH + 20);
  const y = doc.y;
  leftItems.forEach((item, i) => {
    const yy = y + i * rowH;
    doc.roundedRect(contentLeft, yy, colW, rowH - 8, 4).stroke('#cbd5e1');
    doc.font('Helvetica').fontSize(9).fillColor('#111827').text(item.text, contentLeft + 8, yy + 7, { width: colW - 16 });
  });
  rightItems.forEach((item, i) => {
    const yy = y + i * rowH;
    doc.roundedRect(rightX, yy, colW, rowH - 8, 4).stroke('#cbd5e1');
    doc.font('Helvetica').fontSize(9).fillColor('#111827').text(item.text, rightX + 8, yy + 7, { width: colW - 16 });
  });
  doc.y = y + n * rowH + 10;
}

function renderFillMatrix(doc: PDFKit.PDFDocument, data: { nodes: string[] }): void {
  const { left } = box(doc);
  const nodes = data.nodes;
  const n = nodes.length;
  const cell = 30;
  ensureSpace(doc, (n + 1) * cell + 20);
  const startX = left, startY = doc.y;
  for (let c = 0; c < n; c++) {
    const x = startX + cell + c * cell;
    doc.rect(x, startY, cell, cell).stroke('#cbd5e1');
    doc.font('Helvetica-Bold').fontSize(9).fillColor('#374151').text(nodes[c], x, startY + 10, { width: cell, align: 'center' });
  }
  for (let r = 0; r < n; r++) {
    const y = startY + cell + r * cell;
    doc.rect(startX, y, cell, cell).stroke('#cbd5e1');
    doc.font('Helvetica-Bold').fontSize(9).fillColor('#374151').text(nodes[r], startX, y + 10, { width: cell, align: 'center' });
    for (let c = 0; c < n; c++) {
      const x = startX + cell + c * cell;
      doc.rect(x, y, cell, cell).stroke('#cbd5e1');
      if (r === c) doc.font('Helvetica').fontSize(9).fillColor('#9ca3af').text('\u2013', x, y + 10, { width: cell, align: 'center' });
    }
  }
  doc.y = startY + (n + 1) * cell + 14;
}

function renderClickCells(doc: PDFKit.PDFDocument, data: { capacity: number; cells: string[] }): void {
  const { left, width } = box(doc);
  doc.font('Helvetica').fontSize(9).fillColor('#6b7280').text(`Capacity: ${data.capacity}`, left, doc.y);
  doc.moveDown(0.3);
  const boxW = 50, boxH = 40, gap = 8;
  let x = left, y = doc.y;
  ensureSpace(doc, boxH + 30);
  y = doc.y;
  data.cells.forEach((label, i) => {
    if (x + boxW > left + width) { x = left; y += boxH + 26; }
    doc.roundedRect(x, y, boxW, boxH, 4).stroke('#cbd5e1');
    doc.font('Helvetica').fontSize(7.5).fillColor('#6b7280').text(`[${i}]`, x + 4, y + 4);
    doc.font('Helvetica-Bold').fontSize(10).fillColor('#111827').text(label, x, y + 18, { width: boxW, align: 'center' });
    doc.rect(x + boxW / 2 - 5, y + boxH + 6, 10, 10).stroke('#94a3b8');
    x += boxW + gap;
  });
  doc.y = y + boxH + 26;
}

function renderGraphFull(doc: PDFKit.PDFDocument, data: { nodes: GNode[]; edges: GEdge[]; directed?: boolean }, note: string): void {
  const { left, width } = box(doc);
  const h = 260;
  ensureSpace(doc, h + 30);
  const y0 = doc.y;
  doc.roundedRect(left, y0, width, h, 6).stroke('#e5e7eb');
  drawGraph(doc, data.nodes, data.edges, !!data.directed, left + 10, y0 + 10, width - 20, h - 20);
  doc.y = y0 + h + 10;
  doc.font('Helvetica-Oblique').fontSize(8).fillColor('#9ca3af').text(note, left, doc.y);
  doc.moveDown(0.3);
}

function renderClickBug(doc: PDFKit.PDFDocument, data: { lines: number }): void {
  const { left } = box(doc);
  doc.font('Helvetica-Oblique').fontSize(8).fillColor('#9ca3af')
    .text(`(On paper: write the line number below. Total lines: ${data.lines})`, left, doc.y);
  doc.moveDown(0.5);
  doc.font('Helvetica').fontSize(10).fillColor('#374151').text('Answer: __________', left, doc.y);
}

interface Patient { name: string; condition: string; urgency: number }
interface PriorityItem { id: string; priority: number; label: string; sublabel?: string }
function normalizePriority(data: { items?: PriorityItem[]; patients?: Patient[] }): PriorityItem[] {
  if (data.items) return data.items;
  if (data.patients) return data.patients.map(p => ({ id: p.name, priority: p.urgency, label: p.name, sublabel: p.condition }));
  return [];
}

function renderDragPriority(doc: PDFKit.PDFDocument, data: { items?: PriorityItem[]; patients?: Patient[] }): void {
  const { left, width } = box(doc);
  const items = normalizePriority(data);
  const rowH = 26;
  ensureSpace(doc, items.length * rowH + 40);
  const startY = doc.y;
  doc.font('Helvetica-Bold').fontSize(9).fillColor('#374151');
  doc.text('Rank', left, startY, { width: 40 });
  doc.text('Item', left + 40, startY, { width: width - 140 });
  doc.text('Priority', left + width - 100, startY, { width: 100 });
  let y = startY + 18;
  items.forEach(it => {
    doc.roundedRect(left, y, 30, 18, 3).stroke('#cbd5e1');
    doc.font('Helvetica').fontSize(9).fillColor('#111827');
    const label = it.sublabel ? `${it.label} \u2014 ${it.sublabel}` : it.label;
    doc.text(label, left + 40, y + 3, { width: width - 140 });
    doc.text(String(it.priority), left + width - 100, y + 3, { width: 100 });
    y += rowH;
  });
  doc.y = y + 10;
}

function renderProblemBody(doc: PDFKit.PDFDocument, problem: Problem): void {
  const data = problem.en.data as Record<string, unknown>;
  switch (problem.type) {
    case 'drag-order':
      renderDragOrder(doc, data as { pool: string[]; slots: number; slotLabels?: string[] });
      break;
    case 'multi-choice':
      renderOptions(doc, data.options as { id: string; text: string }[]);
      break;
    case 'checkbox-multi':
      if (data.graphs) renderGraphsGrid(doc, data.graphs as GraphDef[]);
      else renderOptions(doc, data.options as { id: string; text: string }[]);
      break;
    case 'drag-match':
      renderDragMatch(doc, data as { left: (string | MatchItem)[]; right: (string | MatchItem)[] });
      break;
    case 'fill-matrix':
      renderFillMatrix(doc, data as { nodes: string[] });
      break;
    case 'click-cells':
      renderClickCells(doc, data as { capacity: number; cells: string[] });
      break;
    case 'click-edges':
      renderGraphFull(doc, data as { nodes: GNode[]; edges: GEdge[]; directed?: boolean }, '(On paper: circle the edges you select.)');
      break;
    case 'click-sequence':
      renderGraphFull(doc, data as { nodes: GNode[]; edges: GEdge[]; directed?: boolean }, '(On paper: write the order of nodes clicked below.)');
      break;
    case 'click-bug':
      renderClickBug(doc, data as { lines: number });
      break;
    case 'drag-priority':
      renderDragPriority(doc, data as { items?: PriorityItem[]; patients?: Patient[] });
      break;
  }
}

function renderHeader(doc: PDFKit.PDFDocument, problem: Problem, index: number): void {
  const { left, width } = box(doc);
  doc.font('Helvetica-Bold').fontSize(16).fillColor('#111827').text(`${index}. ${problem.en.title}`, left, doc.y, { width });
  doc.moveDown(0.2);
  doc.font('Helvetica').fontSize(9).fillColor('#6b7280')
    .text(`${capitalize(problem.topic)}  \u00b7  ${capitalize(problem.difficulty)}  \u00b7  ${problem.points} pts  \u00b7  ID: ${problem.id}`, left, doc.y, { width });
  doc.moveDown(0.5);
}

function titlePage(doc: PDFKit.PDFDocument, title: string, subtitle: string): void {
  doc.font('Helvetica-Bold').fontSize(26).fillColor('#111827').text(title, { align: 'center' });
  doc.moveDown(0.5);
  doc.font('Helvetica').fontSize(13).fillColor('#6b7280').text(subtitle, { align: 'center' });
  doc.moveDown(0.3);
  doc.fontSize(10).fillColor('#9ca3af').text(`Generated ${new Date().toLocaleDateString()}`, { align: 'center' });
}

export function buildProblemsPdf(problems: Problem[], setLabel: string): PDFKit.PDFDocument {
  const doc = new PDFDocument({ size: 'A4', margin: MARGIN });
  patchTextSanitizer(doc);
  titlePage(doc, `Problem Set ${setLabel}`, `${problems.length} problems`);
  problems.forEach((p, i) => {
    doc.addPage();
    renderHeader(doc, p, i + 1);
    if (p.en.teaching) {
      doc.font('Helvetica-Bold').fontSize(10).fillColor('#2563eb').text('How it works', box(doc).left, doc.y);
      doc.moveDown(0.15);
      renderText(doc, p.en.teaching);
      doc.moveDown(0.5);
    }
    doc.font('Helvetica-Bold').fontSize(10).fillColor('#2563eb').text('Problem', box(doc).left, doc.y);
    doc.moveDown(0.15);
    renderText(doc, p.en.description);
    doc.moveDown(0.5);
    renderProblemBody(doc, p);
  });
  return doc;
}

// ── Answer key ──

function formatAnswer(problem: Problem): string {
  const a = problem.answer;
  const data = problem.en.data as Record<string, unknown>;
  if (a === null || a === undefined) {
    const edges = data.edges as GEdge[] | undefined;
    if (edges) return `Any valid order satisfying: ${edges.map(e => `${e.from} before ${e.to}`).join('; ')}`;
    return 'Dynamically validated \u2014 no single fixed answer';
  }
  if (problem.type === 'fill-matrix' && Array.isArray(a)) {
    const nodes = data.nodes as string[];
    return (a as number[][]).map(([r, c]) => `${nodes[r]}\u2192${nodes[c]}`).join(', ');
  }
  if (Array.isArray(a)) return a.join('  \u2192  ');
  if (typeof a === 'object') {
    return Object.entries(a as Record<string, string>).map(([k, v]) => `${k}   \u2192   ${v}`).join('\n');
  }
  return String(a);
}

export function buildAnswersPdf(problems: Problem[], setLabel: string): PDFKit.PDFDocument {
  const doc = new PDFDocument({ size: 'A4', margin: MARGIN });
  patchTextSanitizer(doc);
  titlePage(doc, `Answer Key \u2014 Set ${setLabel}`, `${problems.length} problems`);
  doc.addPage();
  const { left, width } = box(doc);
  problems.forEach((p, i) => {
    ensureSpace(doc, 60);
    doc.font('Helvetica-Bold').fontSize(11).fillColor('#111827').text(`${i + 1}. ${p.en.title}  (${p.id})`, left, doc.y, { width });
    doc.moveDown(0.15);
    doc.font('Helvetica').fontSize(10).fillColor('#1d4ed8').text(formatAnswer(p), left, doc.y, { width });
    doc.moveDown(0.6);
  });
  return doc;
}
