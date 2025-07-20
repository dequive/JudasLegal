import { useState, useEffect } from 'react';
import { useAuth } from '../../hooks/useAuth';
import AuthGuard from '../../components/AuthGuard';
import UserProfile from '../../components/UserProfile';

export default function AdvancedAdmin() {
  const [hierarchyInfo, setHierarchyInfo] = useState(null);
  const [documents, setDocuments] = useState([]);
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [uploadFile, setUploadFile] = useState(null);
  const [uploadMetadata, setUploadMetadata] = useState({
    title: '',
    document_type: '',
    legal_area: '',
    description: '',
    source: ''
  });
  const [uploadLoading, setUploadLoading] = useState(false);

  useEffect(() => {
    loadAdminData();
  }, []);

  const loadAdminData = async () => {
    try {
      // Carregar hierarquia legal
      const hierarchyRes = await fetch('http://localhost:8000/api/legal/hierarchy');
      if (hierarchyRes.ok) {
        const hierarchyData = await hierarchyRes.json();
        setHierarchyInfo(hierarchyData);
      }

      // Carregar documentos avançados
      const docsRes = await fetch('http://localhost:8000/api/legal/documents-advanced');
      if (docsRes.ok) {
        const docsData = await docsRes.json();
        setDocuments(docsData.documents || []);
      }

      // Carregar estatísticas
      const statsRes = await fetch('http://localhost:8000/api/legal/processing-stats');
      if (statsRes.ok) {
        const statsData = await statsRes.json();
        setStats(statsData);
      }

      setLoading(false);
    } catch (error) {
      console.error('Erro ao carregar dados administrativos:', error);
      setLoading(false);
    }
  };

  const handleAdvancedUpload = async (e) => {
    e.preventDefault();
    if (!uploadFile) return;

    setUploadLoading(true);
    try {
      const formData = new FormData();
      formData.append('file', uploadFile);
      formData.append('title', uploadMetadata.title);
      
      if (uploadMetadata.document_type) {
        formData.append('document_type', uploadMetadata.document_type);
      }
      if (uploadMetadata.legal_area) {
        formData.append('legal_area', uploadMetadata.legal_area);
      }
      if (uploadMetadata.description) {
        formData.append('description', uploadMetadata.description);
      }
      if (uploadMetadata.source) {
        formData.append('source', uploadMetadata.source);
      }

      const response = await fetch('http://localhost:8000/api/legal/upload-advanced', {
        method: 'POST',
        body: formData
      });

      if (response.ok) {
        const result = await response.json();
        alert(`Documento processado com sucesso!\n${result.chunks_created} chunks criados`);
        setUploadFile(null);
        setUploadMetadata({
          title: '',
          document_type: '',
          legal_area: '',
          description: '',
          source: ''
        });
        loadAdminData(); // Recarregar dados
      } else {
        const error = await response.json();
        alert(`Erro no upload: ${error.detail}`);
      }
    } catch (error) {
      alert(`Erro: ${error.message}`);
    } finally {
      setUploadLoading(false);
    }
  };

  if (loading) {
    return (
      <AuthGuard>
        <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-indigo-900 p-4">
          <UserProfile />
          <div className="flex items-center justify-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-400"></div>
          </div>
        </div>
      </AuthGuard>
    );
  }

  return (
    <AuthGuard>
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-indigo-900 p-4">
        <UserProfile />
        
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="text-center mb-8">
            <h1 className="text-4xl font-bold bg-gradient-to-r from-emerald-400 to-blue-400 bg-clip-text text-transparent mb-4">
              Administração Avançada Muzaia
            </h1>
            <p className="text-slate-300 text-lg">
              Sistema legal hierárquico com processamento inteligente
            </p>
          </div>

          {/* Upload Avançado */}
          <div className="backdrop-blur-sm bg-white/10 rounded-2xl p-6 border border-white/20 shadow-2xl mb-8">
            <h2 className="text-2xl font-bold text-white mb-6">Upload com Processamento Avançado</h2>
            
            <form onSubmit={handleAdvancedUpload} className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-white text-sm font-medium mb-2">
                  Arquivo Legal
                </label>
                <input
                  type="file"
                  accept=".pdf,.docx,.txt"
                  onChange={(e) => setUploadFile(e.target.files[0])}
                  className="w-full p-3 rounded-lg bg-slate-800/50 border border-slate-600 text-white"
                  required
                />
              </div>

              <div>
                <label className="block text-white text-sm font-medium mb-2">
                  Título do Documento
                </label>
                <input
                  type="text"
                  value={uploadMetadata.title}
                  onChange={(e) => setUploadMetadata(prev => ({...prev, title: e.target.value}))}
                  className="w-full p-3 rounded-lg bg-slate-800/50 border border-slate-600 text-white"
                  placeholder="Ex: Lei de Terras nº 19/97"
                  required
                />
              </div>

              <div>
                <label className="block text-white text-sm font-medium mb-2">
                  Tipo de Documento
                </label>
                <select
                  value={uploadMetadata.document_type}
                  onChange={(e) => setUploadMetadata(prev => ({...prev, document_type: e.target.value}))}
                  className="w-full p-3 rounded-lg bg-slate-800/50 border border-slate-600 text-white"
                >
                  <option value="">Detecção automática</option>
                  {hierarchyInfo?.document_types && Object.entries(hierarchyInfo.document_types).map(([id, name]) => (
                    <option key={id} value={id}>{name}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-white text-sm font-medium mb-2">
                  Área Jurídica
                </label>
                <select
                  value={uploadMetadata.legal_area}
                  onChange={(e) => setUploadMetadata(prev => ({...prev, legal_area: e.target.value}))}
                  className="w-full p-3 rounded-lg bg-slate-800/50 border border-slate-600 text-white"
                >
                  <option value="">Detecção automática</option>
                  {hierarchyInfo?.legal_areas && Object.entries(hierarchyInfo.legal_areas).map(([id, name]) => (
                    <option key={id} value={id}>{name}</option>
                  ))}
                </select>
              </div>

              <div className="md:col-span-2">
                <label className="block text-white text-sm font-medium mb-2">
                  Descrição (opcional)
                </label>
                <textarea
                  value={uploadMetadata.description}
                  onChange={(e) => setUploadMetadata(prev => ({...prev, description: e.target.value}))}
                  className="w-full p-3 rounded-lg bg-slate-800/50 border border-slate-600 text-white"
                  rows="3"
                  placeholder="Descrição do conteúdo do documento..."
                />
              </div>

              <div>
                <label className="block text-white text-sm font-medium mb-2">
                  Fonte (opcional)
                </label>
                <input
                  type="text"
                  value={uploadMetadata.source}
                  onChange={(e) => setUploadMetadata(prev => ({...prev, source: e.target.value}))}
                  className="w-full p-3 rounded-lg bg-slate-800/50 border border-slate-600 text-white"
                  placeholder="Ex: Boletim da República"
                />
              </div>

              <div className="flex items-end">
                <button
                  type="submit"
                  disabled={uploadLoading || !uploadFile}
                  className="w-full bg-gradient-to-r from-emerald-500 to-blue-500 hover:from-emerald-600 hover:to-blue-600 text-white font-bold py-3 px-6 rounded-lg transition-all duration-300 disabled:opacity-50"
                >
                  {uploadLoading ? 'Processando...' : 'Upload Avançado'}
                </button>
              </div>
            </form>
          </div>

          {/* Estatísticas Avançadas */}
          {stats && (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
              <div className="backdrop-blur-sm bg-white/10 rounded-2xl p-6 border border-white/20">
                <h3 className="text-lg font-bold text-white mb-4">Documentos por Tipo</h3>
                {stats.documents_by_type_names && Object.entries(stats.documents_by_type_names).map(([type, count]) => (
                  <div key={type} className="flex justify-between items-center mb-2">
                    <span className="text-slate-300 text-sm">{type}</span>
                    <span className="text-emerald-400 font-bold">{count}</span>
                  </div>
                ))}
              </div>

              <div className="backdrop-blur-sm bg-white/10 rounded-2xl p-6 border border-white/20">
                <h3 className="text-lg font-bold text-white mb-4">Documentos por Área</h3>
                {stats.documents_by_area_names && Object.entries(stats.documents_by_area_names).slice(0, 6).map(([area, count]) => (
                  <div key={area} className="flex justify-between items-center mb-2">
                    <span className="text-slate-300 text-sm">{area}</span>
                    <span className="text-blue-400 font-bold">{count}</span>
                  </div>
                ))}
              </div>

              <div className="backdrop-blur-sm bg-white/10 rounded-2xl p-6 border border-white/20">
                <h3 className="text-lg font-bold text-white mb-4">Estatísticas Gerais</h3>
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-slate-300">Total de Documentos</span>
                    <span className="text-purple-400 font-bold">{stats.total_documents || 0}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-300">Total de Chunks</span>
                    <span className="text-purple-400 font-bold">{stats.total_chunks || 0}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-300">Chunks por Doc</span>
                    <span className="text-purple-400 font-bold">{stats.average_chunks_per_document?.toFixed(1) || '0'}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-300">Novos (7 dias)</span>
                    <span className="text-purple-400 font-bold">{stats.recent_documents_7_days || 0}</span>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Lista de Documentos Avançada */}
          <div className="backdrop-blur-sm bg-white/10 rounded-2xl p-6 border border-white/20">
            <h2 className="text-2xl font-bold text-white mb-6">Documentos Processados</h2>
            
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead>
                  <tr className="border-b border-slate-600">
                    <th className="text-white font-semibold py-3 px-4">Título</th>
                    <th className="text-white font-semibold py-3 px-4">Tipo</th>
                    <th className="text-white font-semibold py-3 px-4">Área</th>
                    <th className="text-white font-semibold py-3 px-4">Chunks</th>
                    <th className="text-white font-semibold py-3 px-4">Status</th>
                  </tr>
                </thead>
                <tbody>
                  {documents.map((doc) => (
                    <tr key={doc.id} className="border-b border-slate-700/50 hover:bg-white/5">
                      <td className="py-3 px-4">
                        <div>
                          <div className="text-white font-medium">{doc.title}</div>
                          {doc.keywords && doc.keywords.length > 0 && (
                            <div className="text-slate-400 text-xs mt-1">
                              {doc.keywords.slice(0, 3).join(', ')}
                            </div>
                          )}
                        </div>
                      </td>
                      <td className="py-3 px-4">
                        <span className="inline-block bg-emerald-500/20 text-emerald-300 px-2 py-1 rounded text-xs">
                          {doc.document_type?.name}
                        </span>
                      </td>
                      <td className="py-3 px-4">
                        <span className="inline-block bg-blue-500/20 text-blue-300 px-2 py-1 rounded text-xs">
                          {doc.legal_area?.name}
                        </span>
                      </td>
                      <td className="py-3 px-4">
                        <span className="text-purple-400 font-mono">{doc.chunk_count}</span>
                      </td>
                      <td className="py-3 px-4">
                        <span className={`inline-block px-2 py-1 rounded text-xs ${
                          doc.status === 'active' ? 'bg-green-500/20 text-green-300' : 'bg-gray-500/20 text-gray-300'
                        }`}>
                          {doc.status === 'active' ? 'Activo' : doc.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>

              {documents.length === 0 && (
                <div className="text-center py-8 text-slate-400">
                  Nenhum documento processado encontrado
                </div>
              )}
            </div>
          </div>

          {/* Hierarquia Legal */}
          {hierarchyInfo && (
            <div className="backdrop-blur-sm bg-white/10 rounded-2xl p-6 border border-white/20 mt-8">
              <h2 className="text-2xl font-bold text-white mb-6">Hierarquia Legal Moçambicana</h2>
              
              {hierarchyInfo.hierarchy_levels && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {Object.entries(hierarchyInfo.hierarchy_levels).map(([level, description]) => (
                    <div key={level} className="flex items-center space-x-3">
                      <div className="w-8 h-8 bg-gradient-to-r from-emerald-500 to-blue-500 rounded-full flex items-center justify-center">
                        <span className="text-white font-bold text-sm">{level}</span>
                      </div>
                      <div className="text-slate-300">{description}</div>
                    </div>
                  ))}
                </div>
              )}

              {hierarchyInfo.priority_documents && (
                <div className="mt-6">
                  <h3 className="text-lg font-bold text-white mb-4">Documentos Prioritários para Adicionar</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {hierarchyInfo.priority_documents.slice(0, 6).map((doc, index) => (
                      <div key={index} className="bg-slate-800/30 p-4 rounded-lg">
                        <div className="text-white font-medium">{doc.title}</div>
                        <div className="text-slate-400 text-sm mt-1">{doc.description}</div>
                        <div className="flex items-center mt-2 space-x-2">
                          <span className={`px-2 py-1 rounded text-xs ${
                            doc.priority === 1 ? 'bg-red-500/20 text-red-300' : 'bg-yellow-500/20 text-yellow-300'
                          }`}>
                            Prioridade {doc.priority}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Navegação */}
          <div className="flex justify-center space-x-4 mt-8">
            <a
              href="/admin"
              className="bg-slate-700 hover:bg-slate-600 text-white px-6 py-3 rounded-lg transition-all duration-300"
            >
              ← Voltar ao Admin Básico
            </a>
            <a
              href="/chat"
              className="bg-gradient-to-r from-emerald-500 to-blue-500 hover:from-emerald-600 hover:to-blue-600 text-white px-6 py-3 rounded-lg transition-all duration-300"
            >
              Testar Chat →
            </a>
          </div>
        </div>
      </div>
    </AuthGuard>
  );
}