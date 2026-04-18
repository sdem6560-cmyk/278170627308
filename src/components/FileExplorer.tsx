import React, { useState } from 'react';
import { motion } from 'motion/react';
import { Folder, File, Search, ChevronRight, ChevronDown, Download, Trash2, Shield, Lock, FileCode, FileText, FileArchive, Eye, X } from 'lucide-react';
import { AnimatePresence } from 'motion/react';
import { FileItem } from '../types';

interface FileExplorerProps {
  files: FileItem[];
  onFileSelect?: (file: FileItem) => void;
  onDelete?: (id: string) => void;
}

export const FileExplorer: React.FC<FileExplorerProps> = ({ 
  files,
  onFileSelect,
  onDelete
}) => {
  const [currentPath, setCurrentPath] = useState(['root', 'exfiltrated']);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [previewItem, setPreviewItem] = useState<FileItem | null>(null);

  const getIcon = (item: FileItem) => {
    if (item.type === 'folder') return <Folder size={16} className="text-[var(--accent-cyan)]" />;
    switch (item.extension) {
      case 'sql': return <FileCode size={16} className="text-[var(--accent-orange)]" />;
      case 'txt': return <FileText size={16} className="text-[var(--text-secondary)]" />;
      case 'py': return <FileCode size={16} className="text-[var(--accent-blue)]" />;
      case 'elf': return <Shield size={16} className="text-[var(--accent-red)]" />;
      case 'pcap': return <FileArchive size={16} className="text-[var(--accent-purple)]" />;
      default: return <File size={16} className="text-[var(--text-muted)]" />;
    }
  };

  return (
    <div className="flex-1 flex flex-col overflow-hidden bg-[var(--bg-secondary)] border border-[var(--border-color)] rounded-[var(--radius-lg)] m-1 relative">
      <div className="flex items-center justify-between px-4 py-3 border-b border-[var(--border-color)] bg-[rgba(255,255,255,0.02)]">
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2 text-[var(--text-primary)]">
            <Folder size={18} className="text-[var(--accent-cyan)]" />
            <span className="text-xs font-black uppercase tracking-widest">مستكشف الملفات (File Explorer)</span>
          </div>
          <div className="flex items-center gap-1 text-[10px] font-mono text-[var(--text-muted)]">
            {currentPath.map((p, i) => (
              <React.Fragment key={i}>
                <span className="hover:text-[var(--accent-cyan)] cursor-pointer transition-colors">{p}</span>
                {i < currentPath.length - 1 && <ChevronRight size={10} />}
              </React.Fragment>
            ))}
          </div>
        </div>
        <div className="flex items-center gap-2">
          <div className="relative">
            <Search size={12} className="absolute left-2.5 top-1/2 -translate-y-1/2 text-[var(--text-muted)]" />
            <input 
              type="text" 
              placeholder="بحث في الملفات..." 
              className="bg-[var(--bg-input)] border border-[var(--border-color)] rounded-md pl-8 pr-3 py-1 text-[10px] outline-none focus:border-[var(--accent-cyan)] transition-all w-48"
            />
          </div>
        </div>
      </div>

      <div className="flex flex-1 overflow-hidden relative">
        <div className={`flex-1 overflow-y-auto custom-scrollbar transition-all duration-300 ${previewItem ? 'mr-[33.33%] border-r border-[var(--border-color)]' : ''}`}>
          <table className="w-full text-left border-collapse font-mono text-[10px]">
            <thead className="sticky top-0 bg-[var(--bg-tertiary)] z-10">
              <tr className="border-b border-[var(--border-color)]">
                <th className="px-4 py-2 text-[var(--text-muted)] uppercase tracking-tighter w-1/2">Name</th>
                <th className="px-4 py-2 text-[var(--text-muted)] uppercase tracking-tighter">Size</th>
                <th className="px-4 py-2 text-[var(--text-muted)] uppercase tracking-tighter">Modified</th>
                <th className="px-4 py-2 text-[var(--text-muted)] uppercase tracking-tighter text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {files.map((folder) => (
                <React.Fragment key={folder.id}>
                  <tr 
                    onClick={() => setSelectedId(selectedId === folder.id ? null : folder.id)}
                    className={`border-b border-[rgba(255,255,255,0.02)] hover:bg-[rgba(0,240,255,0.03)] transition-colors cursor-pointer ${selectedId === folder.id ? 'bg-[rgba(0,240,255,0.05)]' : ''}`}
                  >
                    <td className="px-4 py-2 flex items-center gap-3">
                      {selectedId === folder.id ? <ChevronDown size={12} /> : <ChevronRight size={12} />}
                      {getIcon(folder)}
                      <span className="text-[var(--text-primary)] font-bold">{folder.name}</span>
                    </td>
                    <td className="px-4 py-2 text-[var(--text-muted)]">--</td>
                    <td className="px-4 py-2 text-[var(--text-muted)]">{folder.modified}</td>
                    <td className="px-4 py-2 text-right">
                      <button className="p-1 hover:text-[var(--accent-red)] transition-colors"><Trash2 size={12} /></button>
                    </td>
                  </tr>
                  {selectedId === folder.id && folder.children?.map((file) => (
                    <tr 
                      key={file.id}
                      onClick={() => setPreviewItem(file)}
                      className={`border-b border-[rgba(255,255,255,0.01)] hover:bg-[rgba(0,240,255,0.02)] transition-colors group cursor-pointer ${previewItem?.id === file.id ? 'bg-[rgba(0,240,255,0.05)]' : ''}`}
                    >
                      <td className="px-4 py-2 pl-12 flex items-center gap-3">
                        {getIcon(file)}
                        <span className="text-[var(--text-secondary)] group-hover:text-[var(--text-primary)] transition-colors">{file.name}</span>
                        {file.encrypted && <Lock size={10} className="text-[var(--accent-purple)]" />}
                      </td>
                      <td className="px-4 py-2 text-[var(--text-muted)]">{file.size}</td>
                      <td className="px-4 py-2 text-[var(--text-muted)]">{file.modified}</td>
                      <td className="px-4 py-2 text-right space-x-2">
                        <button 
                          onClick={(e) => { e.stopPropagation(); setPreviewItem(file); }}
                          className="p-1 hover:text-[var(--accent-cyan)] transition-colors"
                        ><Eye size={12} /></button>
                        <button className="p-1 hover:text-[var(--accent-cyan)] transition-colors"><Download size={12} /></button>
                        <button className="p-1 hover:text-[var(--accent-red)] transition-colors"><Trash2 size={12} /></button>
                      </td>
                    </tr>
                  ))}
                </React.Fragment>
              ))}
            </tbody>
          </table>
        </div>

        {/* Preview Panel */}
        <AnimatePresence>
          {previewItem && (
            <motion.div
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              className="absolute top-0 right-0 bottom-0 w-1/3 bg-[var(--bg-tertiary)] border-l border-[var(--border-color)] flex flex-col overflow-hidden z-20"
            >
              <div className="flex items-center justify-between px-4 py-3 border-b border-[var(--border-color)] bg-[rgba(255,255,255,0.02)]">
                <div className="flex items-center gap-2 overflow-hidden">
                  {getIcon(previewItem)}
                  <span className="text-[10px] font-black uppercase truncate">{previewItem.name}</span>
                </div>
                <button 
                  onClick={() => setPreviewItem(null)}
                  className="p-1 hover:text-[var(--accent-red)] transition-colors"
                >
                  <X size={14} />
                </button>
              </div>
              <div className="flex-1 overflow-y-auto p-4 custom-scrollbar">
                <div className="space-y-4">
                  <div className="p-3 rounded bg-[rgba(0,0,0,0.2)] border border-[rgba(255,255,255,0.05)] font-mono text-[9px] text-[var(--text-muted)] leading-relaxed whitespace-pre-wrap">
                    {previewItem.content || '[NO_CONTENT_AVAILABLE]'}
                  </div>
                  <div className="space-y-2">
                    <h4 className="text-[9px] font-black uppercase text-[var(--accent-cyan)] border-b border-[rgba(0,240,255,0.2)] pb-1">Metadata</h4>
                    <div className="grid grid-cols-2 gap-y-2 text-[9px] font-mono">
                      <span className="text-[var(--text-muted)]">Size:</span>
                      <span className="text-[var(--text-primary)]">{previewItem.size}</span>
                      <span className="text-[var(--text-muted)]">Type:</span>
                      <span className="text-[var(--text-primary)] uppercase">{previewItem.extension}</span>
                      <span className="text-[var(--text-muted)]">Created:</span>
                      <span className="text-[var(--text-primary)]">{previewItem.modified}</span>
                      <span className="text-[var(--text-muted)]">Integrity:</span>
                      <span className="text-[var(--accent-green)]">VERIFIED</span>
                    </div>
                  </div>
                </div>
              </div>
              <div className="p-4 border-t border-[var(--border-color)] grid grid-cols-2 gap-2">
                <button className="flex items-center justify-center gap-2 p-2 bg-[var(--bg-input)] border border-[var(--border-color)] rounded text-[9px] font-bold uppercase transition-all hover:border-[var(--accent-cyan)] hover:text-[var(--accent-cyan)]">
                  <Download size={12} /> Download
                </button>
                <button className="flex items-center justify-center gap-2 p-2 bg-[rgba(255,51,102,0.1)] border border-[rgba(255,51,102,0.3)] rounded text-[9px] font-bold uppercase text-[var(--accent-red)] transition-all hover:bg-[rgba(255,51,102,0.2)]">
                  <Trash2 size={12} /> Wipe
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      <div className="px-4 py-2 bg-[var(--bg-tertiary)] border-t border-[var(--border-color)] flex items-center justify-between text-[9px] font-mono text-[var(--text-muted)] uppercase tracking-widest shrink-0">
        <div className="flex gap-4">
          <span>Total Items: 8</span>
          <span>Storage: 1.2 GB / 10 GB</span>
        </div>
        <div className="flex items-center gap-2">
          <Shield size={10} className="text-[var(--accent-green)]" />
          <span>Encrypted Volume Active</span>
        </div>
      </div>
    </div>
  );
};
