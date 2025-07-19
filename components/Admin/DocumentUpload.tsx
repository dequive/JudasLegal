import React, { useState } from 'react';
import { useAdminStore } from '@/store/adminStore';

interface DocumentUploadProps {
  onUploadComplete: () => void;
}

const DocumentUpload: React.FC<DocumentUploadProps> = ({ onUploadComplete }) => {
  const [file, setFile] = useState<File | null>(null);
  const [metadata, setMetadata] = useState({
    title: '',
    law_type: '',
    source: '',
    description: ''
  });
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState('');
  
  const { uploadDocument } = useAdminStore();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!file) return;

    setUploading(true);
    setError('');
    
    try {
      await uploadDocument(file, metadata);
      onUploadComplete();
      
      // Reset form
      setFile(null);
      setMetadata({ title: '', law_type: '', source: '', description: '' });
      
      // Reset file input
      const fileInput = document.getElementById('file-upload') as HTMLInputElement;
      if (fileInput) fileInput.value = '';
      
    } catch (error) {
      setError(error instanceof Error ? error.message : 'Erro no upload');
    } finally {
      setUploading(false);
    }
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  return (
    <div className="max-w-2xl mx-auto p-6 bg-gray-50 rounded-lg shadow-md">
      <h2 className="text-2xl font-bold mb-6 text-gray-900">Upload de Documento Legal</h2>
      
      {error && (
        <div className="mb-4 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
          {error}
        </div>
      )}
      
      <form onSubmit={handleSubmit} className="space-y-4">
        {/* File Upload */}
        <div>
          <label className="block text-sm font-medium mb-2 text-gray-700">
            Arquivo (PDF, DOCX, TXT) *
          </label>
          <input
            id="file-upload"
            type="file"
            accept=".pdf,.docx,.txt"
            onChange={(e) => setFile(e.target.files?.[0] || null)}
            className="block w-full border border-gray-300 rounded-md p-2 focus:ring-indigo-500 focus:border-indigo-500"
            required
          />
          {file && (
            <p className="mt-1 text-sm text-gray-500">
              Arquivo selecionado: {file.name} ({formatFileSize(file.size)})
            </p>
          )}
        </div>

        {/* Metadata Fields */}
        <div>
          <label className="block text-sm font-medium mb-2 text-gray-700">Título *</label>
          <input
            type="text"
            value={metadata.title}
            onChange={(e) => setMetadata({...metadata, title: e.target.value})}
            className="block w-full border border-gray-300 rounded-md p-2 focus:ring-indigo-500 focus:border-indigo-500"
            placeholder="Ex: Lei do Trabalho de Moçambique"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-2 text-gray-700">Tipo de Lei *</label>
          <select
            value={metadata.law_type}
            onChange={(e) => setMetadata({...metadata, law_type: e.target.value})}
            className="block w-full border border-gray-300 rounded-md p-2 focus:ring-indigo-500 focus:border-indigo-500"
            required
          >
            <option value="">Selecionar tipo</option>
            <option value="constituicao">Constituição</option>
            <option value="codigo_civil">Código Civil</option>
            <option value="codigo_penal">Código Penal</option>
            <option value="lei_trabalho">Lei do Trabalho</option>
            <option value="codigo_comercial">Código Comercial</option>
            <option value="lei_familiar">Lei da Família</option>
            <option value="decreto">Decreto</option>
            <option value="regulamento">Regulamento</option>
            <option value="outros">Outros</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium mb-2 text-gray-700">Fonte *</label>
          <input
            type="text"
            value={metadata.source}
            onChange={(e) => setMetadata({...metadata, source: e.target.value})}
            placeholder="Ex: Boletim da República, Série I, nº 12 de 2023"
            className="block w-full border border-gray-300 rounded-md p-2 focus:ring-indigo-500 focus:border-indigo-500"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-2 text-gray-700">Descrição (opcional)</label>
          <textarea
            value={metadata.description}
            onChange={(e) => setMetadata({...metadata, description: e.target.value})}
            rows={3}
            placeholder="Descrição adicional sobre o documento..."
            className="block w-full border border-gray-300 rounded-md p-2 focus:ring-indigo-500 focus:border-indigo-500"
          />
        </div>

        <button
          type="submit"
          disabled={!file || uploading || !metadata.title || !metadata.law_type || !metadata.source}
          className="w-full bg-indigo-600 text-white py-2 px-4 rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {uploading ? 'Processando...' : 'Fazer Upload'}
        </button>
      </form>
      
      {uploading && (
        <div className="mt-4 p-4 bg-blue-50 rounded-md">
          <div className="flex items-center">
            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-600 mr-2"></div>
            <div className="text-sm text-blue-700">
              Processando documento... Isto pode demorar alguns minutos.
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default DocumentUpload;