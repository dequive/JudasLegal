import { useState, useEffect } from 'react';
import Head from 'next/head';

const DOCUMENT_TYPES = {
  1: 'Constituição da República',
  2: 'Lei',
  3: 'Decreto-Lei',
  4: 'Decreto',
  5: 'Regulamento',
  6: 'Portaria',
  7: 'Diploma Ministerial',
  8: 'Instrução',
  9: 'Circular',
  10: 'Despacho'
};

const LEGAL_AREAS = {
  1: 'Direito Constitucional',
  2: 'Direito Civil',
  3: 'Direito Penal',
  4: 'Direito Comercial',
  5: 'Direito do Trabalho',
  6: 'Direito Administrativo',
  7: 'Direito Fiscal',
  8: 'Direito Fundiário',
  9: 'Direito Ambiental',
  10: 'Direito da Família',
  11: 'Processo Civil',
  12: 'Processo Penal',
  13: 'Segurança Social',
  14: 'Imigração',
  15: 'Propriedade Intelectual'
};

export default function AdminAdvanced() {
  const [stats, setStats] = useState(null);
  const [documents, setDocuments] = useState([]);
  const [uploadFile, setUploadFile] = useState(null);
  const [uploadForm, setUploadForm] = useState({
    document_type: '',
    legal_area: '',
    description: '',
    source: 'Sistema Muzaia'
  });
  const [uploading, setUploading] = useState(false);
  const [uploadResult, setUploadResult] = useState(null);
  const [activeTab, setActiveTab] = useState('upload');

  useEffect(() => {
    fetchStats();
    fetchDocuments();
  }, []);

  const fetchStats = async () => {
    try {
      const response = await fetch('http://localhost:8000/api/legal/processing-stats');
      const data = await response.json();
      setStats(data);
    } catch (error) {
      console.error('Erro ao buscar estatísticas:', error);
    }
  };

  const fetchDocuments = async () => {
    try {
      const response = await fetch('http://localhost:8000/api/legal/documents-advanced');
      const data = await response.json();
      setDocuments(data.documents || []);
    } catch (error) {
      console.error('Erro ao buscar documentos:', error);
    }
  };

  const handleUpload = async (e) => {
    e.preventDefault();
    if (!uploadFile) {
      alert('Seleccione um arquivo para upload');
      return;
    }

    setUploading(true);
    setUploadResult(null);

    const formData = new FormData();
    formData.append('file', uploadFile);
    
    if (uploadForm.document_type) {
      formData.append('document_type', uploadForm.document_type);
    }
    if (uploadForm.legal_area) {
      formData.append('legal_area', uploadForm.legal_area);
    }
    if (uploadForm.description) {
      formData.append('description', uploadForm.description);
    }
    if (uploadForm.source) {
      formData.append('source', uploadForm.source);
    }

    try {
      const response = await fetch('http://localhost:8000/api/legal/upload-advanced', {
        method: 'POST',
        body: formData
      });

      const result = await response.json();
      
      if (response.ok) {
        setUploadResult(result);
        setUploadFile(null);
        setUploadForm({
          document_type: '',
          legal_area: '',
          description: '',
          source: 'Sistema Muzaia'
        });
        // Refresh data
        fetchStats();
        fetchDocuments();
      } else {
        setUploadResult({ error: result.detail || 'Erro no upload' });
      }
    } catch (error) {
      setUploadResult({ error: error.message });
    } finally {
      setUploading(false);
    }
  };

  const getComplexityColor = (level) => {
    switch(level) {
      case 1: return 'text-green-600';
      case 2: return 'text-yellow-600';
      case 3: return 'text-orange-600';
      case 4: return 'text-red-600';
      default: return 'text-gray-600';
    }
  };

  const getComplexityText = (level) => {
    switch(level) {
      case 1: return 'Simples';
      case 2: return 'Moderado';
      case 3: return 'Complexo';
      case 4: return 'Muito Complexo';
      default: return 'N/A';
    }
  };

  return (
    <>
      <Head>
        <title>Administração Avançada - Sistema Muzaia</title>
      </Head>
      
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-indigo-900">
        {/* Header */}
        <div className="bg-black/20 backdrop-blur-sm border-b border-white/10">
          <div className="max-w-7xl mx-auto px-4 py-6">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-3xl font-bold bg-gradient-to-r from-emerald-400 to-blue-400 bg-clip-text text-transparent">
                  Administração Avançada
                </h1>
                <p className="text-slate-300 mt-2">Sistema de Processamento Hierárquico Legal - Fase 3</p>
              </div>
              <div className="flex space-x-4">
                <button
                  onClick={() => setActiveTab('upload')}
                  className={`px-4 py-2 rounded-lg font-medium transition-all ${
                    activeTab === 'upload' 
                      ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30' 
                      : 'text-slate-400 hover:text-white'
                  }`}
                >
                  Upload Avançado
                </button>
                <button
                  onClick={() => setActiveTab('documents')}
                  className={`px-4 py-2 rounded-lg font-medium transition-all ${
                    activeTab === 'documents' 
                      ? 'bg-blue-500/20 text-blue-300 border border-blue-500/30' 
                      : 'text-slate-400 hover:text-white'
                  }`}
                >
                  Documentos
                </button>
                <button
                  onClick={() => setActiveTab('stats')}
                  className={`px-4 py-2 rounded-lg font-medium transition-all ${
                    activeTab === 'stats' 
                      ? 'bg-purple-500/20 text-purple-300 border border-purple-500/30' 
                      : 'text-slate-400 hover:text-white'
                  }`}
                >
                  Estatísticas
                </button>
              </div>
            </div>
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-4 py-8">
          {/* Upload Tab */}
          {activeTab === 'upload' && (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* Upload Form */}
              <div className="bg-white/5 backdrop-blur-sm rounded-2xl border border-white/10 p-6">
                <h2 className="text-2xl font-bold text-white mb-6">Upload Hierárquico</h2>
                
                <form onSubmit={handleUpload} className="space-y-6">
                  {/* File Input */}
                  <div>
                    <label className="block text-sm font-medium text-slate-300 mb-2">
                      Documento Legal
                    </label>
                    <input
                      type="file"
                      accept=".pdf,.docx,.txt"
                      onChange={(e) => setUploadFile(e.target.files[0])}
                      className="w-full px-4 py-3 bg-black/20 border border-white/20 rounded-lg text-white placeholder-slate-400 focus:outline-none focus:border-emerald-500"
                    />
                    <p className="text-xs text-slate-400 mt-1">Formatos: PDF, DOCX, TXT</p>
                  </div>

                  {/* Document Type */}
                  <div>
                    <label className="block text-sm font-medium text-slate-300 mb-2">
                      Tipo de Documento
                    </label>
                    <select
                      value={uploadForm.document_type}
                      onChange={(e) => setUploadForm({...uploadForm, document_type: e.target.value})}
                      className="w-full px-4 py-3 bg-black/20 border border-white/20 rounded-lg text-white focus:outline-none focus:border-emerald-500"
                    >
                      <option value="">Detecção Automática</option>
                      {Object.entries(DOCUMENT_TYPES).map(([key, value]) => (
                        <option key={key} value={key} className="bg-slate-800">{value}</option>
                      ))}
                    </select>
                  </div>

                  {/* Legal Area */}
                  <div>
                    <label className="block text-sm font-medium text-slate-300 mb-2">
                      Área Legal
                    </label>
                    <select
                      value={uploadForm.legal_area}
                      onChange={(e) => setUploadForm({...uploadForm, legal_area: e.target.value})}
                      className="w-full px-4 py-3 bg-black/20 border border-white/20 rounded-lg text-white focus:outline-none focus:border-emerald-500"
                    >
                      <option value="">Detecção Automática</option>
                      {Object.entries(LEGAL_AREAS).map(([key, value]) => (
                        <option key={key} value={key} className="bg-slate-800">{value}</option>
                      ))}
                    </select>
                  </div>

                  {/* Description */}
                  <div>
                    <label className="block text-sm font-medium text-slate-300 mb-2">
                      Descrição
                    </label>
                    <textarea
                      value={uploadForm.description}
                      onChange={(e) => setUploadForm({...uploadForm, description: e.target.value})}
                      placeholder="Descrição opcional do documento..."
                      rows={3}
                      className="w-full px-4 py-3 bg-black/20 border border-white/20 rounded-lg text-white placeholder-slate-400 focus:outline-none focus:border-emerald-500"
                    />
                  </div>

                  {/* Source */}
                  <div>
                    <label className="block text-sm font-medium text-slate-300 mb-2">
                      Fonte
                    </label>
                    <input
                      type="text"
                      value={uploadForm.source}
                      onChange={(e) => setUploadForm({...uploadForm, source: e.target.value})}
                      placeholder="Fonte do documento"
                      className="w-full px-4 py-3 bg-black/20 border border-white/20 rounded-lg text-white placeholder-slate-400 focus:outline-none focus:border-emerald-500"
                    />
                  </div>

                  {/* Submit Button */}
                  <button
                    type="submit"
                    disabled={uploading || !uploadFile}
                    className="w-full py-3 bg-gradient-to-r from-emerald-500 to-blue-500 text-white font-semibold rounded-lg hover:from-emerald-600 hover:to-blue-600 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300"
                  >
                    {uploading ? 'Processando...' : 'Processar Documento'}
                  </button>
                </form>
              </div>

              {/* Upload Result */}
              <div className="bg-white/5 backdrop-blur-sm rounded-2xl border border-white/10 p-6">
                <h2 className="text-2xl font-bold text-white mb-6">Resultado do Processamento</h2>
                
                {uploadResult ? (
                  <div className="space-y-4">
                    {uploadResult.error ? (
                      <div className="bg-red-500/20 border border-red-500/30 rounded-lg p-4">
                        <p className="text-red-300 font-medium">Erro no processamento:</p>
                        <p className="text-red-200">{uploadResult.error}</p>
                      </div>
                    ) : (
                      <div className="bg-green-500/20 border border-green-500/30 rounded-lg p-4">
                        <p className="text-green-300 font-medium mb-3">Documento processado com sucesso!</p>
                        <div className="space-y-2 text-sm text-slate-300">
                          <p><span className="font-medium">ID:</span> {uploadResult.document_id}</p>
                          <p><span className="font-medium">Título:</span> {uploadResult.title}</p>
                          <p><span className="font-medium">Chunks:</span> {uploadResult.chunks_created}</p>
                          <p><span className="font-medium">Tipo:</span> {uploadResult.processing_info?.document_type}</p>
                          <p><span className="font-medium">Área:</span> {uploadResult.processing_info?.legal_area}</p>
                          <p><span className="font-medium">Conceitos:</span> {uploadResult.processing_info?.legal_concepts_found}</p>
                          <p><span className="font-medium">Citações:</span> {uploadResult.processing_info?.citations_found}</p>
                        </div>
                      </div>
                    )}
                  </div>
                ) : (
                  <div className="text-center text-slate-400 py-12">
                    <p>Resultado do processamento aparecerá aqui</p>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Documents Tab */}
          {activeTab === 'documents' && (
            <div className="bg-white/5 backdrop-blur-sm rounded-2xl border border-white/10 p-6">
              <h2 className="text-2xl font-bold text-white mb-6">Documentos Processados</h2>
              
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-white/10">
                      <th className="text-left py-3 px-4 font-medium text-slate-300">ID</th>
                      <th className="text-left py-3 px-4 font-medium text-slate-300">Título</th>
                      <th className="text-left py-3 px-4 font-medium text-slate-300">Tipo</th>
                      <th className="text-left py-3 px-4 font-medium text-slate-300">Área</th>
                      <th className="text-left py-3 px-4 font-medium text-slate-300">Chunks</th>
                      <th className="text-left py-3 px-4 font-medium text-slate-300">Autoridade</th>
                      <th className="text-left py-3 px-4 font-medium text-slate-300">Data</th>
                    </tr>
                  </thead>
                  <tbody>
                    {documents.map((doc) => (
                      <tr key={doc.id} className="border-b border-white/5">
                        <td className="py-3 px-4 text-slate-300">{doc.id}</td>
                        <td className="py-3 px-4 text-white font-medium max-w-xs truncate">{doc.title}</td>
                        <td className="py-3 px-4 text-slate-300">{DOCUMENT_TYPES[doc.document_type] || 'N/A'}</td>
                        <td className="py-3 px-4 text-slate-300">{LEGAL_AREAS[doc.legal_area] || 'N/A'}</td>
                        <td className="py-3 px-4 text-slate-300">{doc.chunk_count}</td>
                        <td className="py-3 px-4">
                          <div className="flex items-center">
                            <div className="w-16 bg-gray-700 rounded-full h-2 mr-2">
                              <div 
                                className="bg-gradient-to-r from-emerald-400 to-blue-400 h-2 rounded-full" 
                                style={{width: `${doc.authority_weight * 100}%`}}
                              ></div>
                            </div>
                            <span className="text-xs text-slate-400">{(doc.authority_weight * 100).toFixed(0)}%</span>
                          </div>
                        </td>
                        <td className="py-3 px-4 text-slate-400">
                          {doc.created_at ? new Date(doc.created_at).toLocaleDateString('pt') : 'N/A'}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
                
                {documents.length === 0 && (
                  <div className="text-center text-slate-400 py-12">
                    <p>Nenhum documento processado ainda</p>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Stats Tab */}
          {activeTab === 'stats' && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {stats && (
                <>
                  {/* General Stats */}
                  <div className="bg-white/5 backdrop-blur-sm rounded-2xl border border-white/10 p-6">
                    <h3 className="text-lg font-bold text-white mb-4">Estatísticas Gerais</h3>
                    <div className="space-y-3">
                      <div className="flex justify-between">
                        <span className="text-slate-300">Documentos:</span>
                        <span className="text-white font-medium">{stats.general?.total_documents || 0}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-slate-300">Chunks:</span>
                        <span className="text-white font-medium">{stats.general?.total_chunks || 0}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-slate-300">Tipos:</span>
                        <span className="text-white font-medium">{stats.general?.document_types || 0}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-slate-300">Áreas:</span>
                        <span className="text-white font-medium">{stats.general?.legal_areas || 0}</span>
                      </div>
                    </div>
                  </div>

                  {/* Type Distribution */}
                  {stats.type_distribution && (
                    <div className="bg-white/5 backdrop-blur-sm rounded-2xl border border-white/10 p-6">
                      <h3 className="text-lg font-bold text-white mb-4">Por Tipo</h3>
                      <div className="space-y-3">
                        {Object.entries(stats.type_distribution).map(([type, count]) => (
                          <div key={type} className="flex justify-between">
                            <span className="text-slate-300">{DOCUMENT_TYPES[type] || `Tipo ${type}`}:</span>
                            <span className="text-white font-medium">{count}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Area Distribution */}
                  {stats.area_distribution && (
                    <div className="bg-white/5 backdrop-blur-sm rounded-2xl border border-white/10 p-6">
                      <h3 className="text-lg font-bold text-white mb-4">Por Área Legal</h3>
                      <div className="space-y-3">
                        {Object.entries(stats.area_distribution).map(([area, count]) => (
                          <div key={area} className="flex justify-between">
                            <span className="text-slate-300">{LEGAL_AREAS[area] || `Área ${area}`}:</span>
                            <span className="text-white font-medium">{count}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </>
              )}
            </div>
          )}
        </div>
      </div>
    </>
  );
}