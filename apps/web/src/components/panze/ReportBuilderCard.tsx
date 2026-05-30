import React, { useMemo, useRef, useState } from 'react';
import { jsPDF } from 'jspdf';
import html2canvas from 'html2canvas';
import type { DemoWorkspace, DemoProject } from '../../lib/demoData';

const reportTypes = [
  { value: 'monthly', label: 'Monthly Overview' },
  { value: 'project', label: 'Project Summary' },
  { value: 'finance', label: 'Financial Report' }
];

interface ReportBuilderCardProps {
  workspace: DemoWorkspace;
}

export const ReportBuilderCard: React.FC<ReportBuilderCardProps> = ({ workspace }) => {
  const [reportName, setReportName] = useState('Executive Summary');
  const [reportType, setReportType] = useState(reportTypes[0].value);
  const [selectedProjectId, setSelectedProjectId] = useState(workspace.projects[0]?.id ?? '');
  const [includeMetrics, setIncludeMetrics] = useState({ status: true, workload: true, finance: false });
  const reportRef = useRef<HTMLDivElement | null>(null);

  const selectedProject = useMemo(
    () => workspace.projects.find((project) => project.id === selectedProjectId) ?? workspace.projects[0],
    [workspace.projects, selectedProjectId]
  );

  const taskCounts = useMemo(() => {
    if (!selectedProject) return { total: 0, done: 0, inProgress: 0 };
    const total = selectedProject.items.length;
    const done = selectedProject.items.filter((item) => ['Done'].includes(item.status)).length;
    const inProgress = selectedProject.items.filter((item) => ['In Progress', 'Doing'].includes(item.status)).length;
    return { total, done, inProgress };
  }, [selectedProject]);

  const exportPdf = async () => {
    if (!reportRef.current) return;
    const canvas = await html2canvas(reportRef.current, { scale: 2, useCORS: true, backgroundColor: '#ffffff' });
    const imgData = canvas.toDataURL('image/png');
    const pdf = new jsPDF({ orientation: 'portrait', unit: 'mm', format: 'a4' });
    const pageWidth = pdf.internal.pageSize.getWidth();
    const pageHeight = pdf.internal.pageSize.getHeight();
    const imgProps = pdf.getImageProperties(imgData);
    const pdfHeight = (imgProps.height * pageWidth) / imgProps.width;
    pdf.addImage(imgData, 'PNG', 0, 0, pageWidth, pdfHeight > pageHeight ? pageHeight : pdfHeight);
    pdf.save(`${reportName.replace(/\s+/g, '_')}.pdf`);
  };

  return (
    <div className="bg-white rounded-2xl p-8 shadow-card">
      <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
        <div>
          <p className="text-sm uppercase tracking-[0.3em] text-muted">Custom Report Builder</p>
          <h2 className="text-3xl font-extrabold text-ink mt-2">Create a Premium PDF Report</h2>
        </div>
        <button onClick={exportPdf} className="rounded-full bg-ink px-5 py-3 text-sm font-semibold text-white shadow-lg shadow-ink/10 transition hover:opacity-95">
          Export Professional PDF
        </button>
      </div>

      <div className="mt-8 grid gap-6 lg:grid-cols-3">
        <div className="rounded-[28px] bg-slate-50 p-6">
          <label className="text-sm font-semibold text-slate-500">Rapor Adı</label>
          <input
            value={reportName}
            onChange={(e) => setReportName(e.target.value)}
            className="mt-3 w-full rounded-3xl border border-slate-200 bg-white px-4 py-3 text-sm text-ink outline-none focus:border-accent-blue"
          />
        </div>
        <div className="rounded-[28px] bg-slate-50 p-6">
          <label className="text-sm font-semibold text-slate-500">Rapor Tipi</label>
          <select
            value={reportType}
            onChange={(e) => setReportType(e.target.value)}
            className="mt-3 w-full rounded-3xl border border-slate-200 bg-white px-4 py-3 text-sm text-ink outline-none"
          >
            {reportTypes.map((type) => (
              <option key={type.value} value={type.value}>{type.label}</option>
            ))}
          </select>
        </div>
        <div className="rounded-[28px] bg-slate-50 p-6">
          <label className="text-sm font-semibold text-slate-500">Project</label>
          <select
            value={selectedProjectId}
            onChange={(e) => setSelectedProjectId(e.target.value)}
            className="mt-3 w-full rounded-3xl border border-slate-200 bg-white px-4 py-3 text-sm text-ink outline-none"
          >
            {workspace.projects.map((project) => (
              <option key={project.id} value={project.id}>{project.name}</option>
            ))}
          </select>
        </div>
      </div>

      <div className="mt-6 rounded-[30px] border border-slate-200 bg-slate-50 p-6">
        <div className="grid gap-4 md:grid-cols-3">
          <div className="rounded-3xl bg-white p-5 shadow-sm">
            <p className="text-sm text-slate-500">Total Tasks</p>
            <p className="mt-3 text-3xl font-bold text-ink">{taskCounts.total}</p>
          </div>
          <div className="rounded-3xl bg-white p-5 shadow-sm">
            <p className="text-sm text-slate-500">Completed</p>
            <p className="mt-3 text-3xl font-bold text-ink">{taskCounts.done}</p>
          </div>
          <div className="rounded-3xl bg-white p-5 shadow-sm">
            <p className="text-sm text-slate-500">In Progress</p>
            <p className="mt-3 text-3xl font-bold text-ink">{taskCounts.inProgress}</p>
          </div>
        </div>
      </div>

      <div ref={reportRef} className="mt-8 rounded-[30px] border border-slate-200 bg-white p-8 shadow-sm">
        <div className="flex flex-col gap-6">
          <div className="rounded-[30px] bg-gradient-to-r from-gradient-from via-gradient-mid to-gradient-to p-8 text-white shadow-lg">
            <p className="text-sm uppercase tracking-[0.25em] opacity-90">{reportTypes.find((type) => type.value === reportType)?.label}</p>
            <h3 className="mt-4 text-4xl font-extrabold">{reportName}</h3>
            <p className="mt-3 max-w-2xl text-sm opacity-90">A premium executive report generated from your current workspace, with project insights, task breakdown and KPI summary.</p>
          </div>

          <div className="grid gap-6 lg:grid-cols-2">
            <div className="rounded-3xl bg-slate-50 p-6">
              <p className="text-sm uppercase tracking-[0.3em] text-muted">Project Overview</p>
              <h4 className="mt-4 text-xl font-semibold text-ink">{selectedProject?.name}</h4>
              <p className="mt-3 text-sm text-slate-600">{selectedProject?.description}</p>
              <div className="mt-4 space-y-3 text-sm text-slate-700">
                <p><span className="font-semibold">Lead:</span> {selectedProject?.lead}</p>
                <p><span className="font-semibold">Workflow:</span> {selectedProject?.workflow.join(', ')}</p>
                <p><span className="font-semibold">Team:</span> {workspace.members.join(', ')}</p>
              </div>
            </div>

            <div className="rounded-3xl bg-slate-50 p-6">
              <p className="text-sm uppercase tracking-[0.3em] text-muted">Metrics</p>
              <div className="mt-4 space-y-4 text-sm text-slate-700">
                {includeMetrics.status && <p><span className="font-semibold">Status Coverage:</span> {taskCounts.done} done, {taskCounts.inProgress} in progress</p>}
                {includeMetrics.workload && <p><span className="font-semibold">Workload:</span> {taskCounts.total} total tasks across the project.</p>}
                {includeMetrics.finance && <p><span className="font-semibold">Revenue:</span> $82,340 projected</p>}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
