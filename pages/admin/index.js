import { useState, useEffect } from 'react';
import Link from 'next/link';

export default function AdminDashboard() {
  const [stats, setStats] = useState(null);
  const [documents, setDocuments] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    console.log('🔄 Carregando dados do painel administrativo...');
    try {
      // Load statistics with fallback for demo
      try {
        const statsResponse = await fetch('http://localhost:8000/api/admin/stats');
        if (statsResponse.ok) {
          const statsData = await statsResponse.json();
          console.log('✅ Estatísticas carregadas:', statsData);
          setStats(statsData);
        } else {
          console.log('⚠️ Backend indisponível, usando dados demo');
          setStats({
            documents: 1,
            chunks: 3,
            chat_sessions: 0,
            messages: 0,
            ai_status: 'demo'
          });
        }
      } catch (error) {
        console.log('❌ Erro ao carregar estatísticas:', error);
        setStats({
          documents: 1,
          chunks: 3,
          chat_sessions: 0,
          messages: 0,
          ai_status: 'demo'
        });
      }

      // Load documents with fallback for demo
      try {
        const docsResponse = await fetch('http://localhost:8000/api/admin/documents');
        if (docsResponse.ok) {
          const docsData = await docsResponse.json();
          console.log('✅ Documentos carregados:', docsData);
          const documentList = docsData.documents || docsData;
          console.log('📋 Lista de documentos processada:', documentList);
          setDocuments(documentList);
        } else {
          console.log('⚠️ Backend indisponível, mostrando documentos demo');
          setDocuments([
            {
              id: 'demo-1',
              title: 'Documento Demo - Constituição',
              law_type: 'Constituição',
              source: 'Sistema Demo',
              created_at: new Date().toISOString(),
              chunk_count: 3
            }
          ]);
        }
      } catch (error) {
        console.log('❌ Erro ao carregar documentos:', error);
        setDocuments([
          {
            id: 'demo-1', 
            title: 'Documento Demo - Constituição',
            law_type: 'Constituição',
            source: 'Sistema Demo',
            created_at: new Date().toISOString(),
            chunk_count: 3
          }
        ]);
      }
    } catch (error) {
      console.error('Erro ao carregar dados:', error);
    } finally {
      setLoading(false);
    }
  };

  const deleteDocument = async (documentId) => {
    if (!confirm('Tem certeza que deseja remover este documento?')) return;

    try {
      const response = await fetch(`http://localhost:8000/api/admin/documents/${documentId}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        setDocuments(documents.filter(doc => doc.id !== documentId));
        loadData(); // Reload stats
      }
    } catch (error) {
      console.error('Erro ao remover documento:', error);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-8 h-8 border-3 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Carregando painel administrativo...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-indigo-900">
      {/* Header */}
      <div className="glass-dark border-b border-white/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <div>
              <h1 className="text-3xl font-bold text-white">Painel Administrativo</h1>
              <p className="text-gray-300">Gestão do Muzaia</p>
            </div>
            <Link href="/admin/upload">
              <button className="btn-primary">
                + Carregar Documento
              </button>
            </Link>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Statistics */}
        {stats && (
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8 animate-fade-in">
            <div className="card-modern">
              <div className="p-6">
                <div className="flex items-center">
                  <div className="flex-shrink-0">
                    <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
                      <span className="text-white text-lg">📚</span>
                    </div>
                  </div>
                  <div className="ml-4 w-0 flex-1">
                    <dl>
                      <dt className="text-sm font-medium text-gray-300 truncate">Documentos</dt>
                      <dd className="text-2xl font-bold text-white">{stats.documents}</dd>
                    </dl>
                  </div>
                </div>
              </div>
            </div>

            <div className="card-modern">
              <div className="p-6">
                <div className="flex items-center">
                  <div className="flex-shrink-0">
                    <div className="w-12 h-12 bg-gradient-to-r from-emerald-500 to-teal-600 rounded-full flex items-center justify-center">
                      <span className="text-white text-lg">🔍</span>
                    </div>
                  </div>
                  <div className="ml-4 w-0 flex-1">
                    <dl>
                      <dt className="text-sm font-medium text-gray-300 truncate">Chunks RAG</dt>
                      <dd className="text-2xl font-bold text-white">{stats.chunks}</dd>
                    </dl>
                  </div>
                </div>
              </div>
            </div>

            <div className="card-modern">
              <div className="p-6">
                <div className="flex items-center">
                  <div className="flex-shrink-0">
                    <div className="w-12 h-12 bg-gradient-to-r from-purple-500 to-pink-600 rounded-full flex items-center justify-center">
                      <span className="text-white text-lg">💬</span>
                    </div>
                  </div>
                  <div className="ml-4 w-0 flex-1">
                    <dl>
                      <dt className="text-sm font-medium text-gray-300 truncate">Sessões de Chat</dt>
                      <dd className="text-2xl font-bold text-white">{stats.chat_sessions}</dd>
                    </dl>
                  </div>
                </div>
              </div>
            </div>

            <div className="card-modern">
              <div className="p-6">
                <div className="flex items-center">
                  <div className="flex-shrink-0">
                    <div className="w-12 h-12 bg-gradient-to-r from-orange-500 to-red-600 rounded-full flex items-center justify-center">
                      <span className="text-white text-lg">🤖</span>
                    </div>
                  </div>
                  <div className="ml-4 w-0 flex-1">
                    <dl>
                      <dt className="text-sm font-medium text-gray-300 truncate">Estado da IA</dt>
                      <dd className="text-lg font-bold text-white">
                        {stats.ai_status === 'configured' ? '✅ Activo' : stats.ai_status === 'demo' ? '🔄 Demo' : '❌ Inactivo'}
                      </dd>
                    </dl>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Documents Table */}
        <div className="card-modern animate-fade-in">
          <div className="px-6 py-5">
            <h3 className="text-xl leading-6 font-bold text-white">Documentos Legais</h3>
            <p className="mt-1 max-w-2xl text-sm text-gray-300">
              Lista de todos os documentos carregados no sistema
            </p>
          </div>
          <div className="space-y-4 px-6 pb-6">
            {documents.map((doc) => (
              <div key={doc.id} className="glass-light p-4 rounded-xl border border-white/10 hover:border-white/20 transition-all">
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <h4 className="text-lg font-semibold text-white">{doc.title}</h4>
                    <p className="text-sm text-gray-300 mt-1">{doc.description || 'Sem descrição'}</p>
                    <div className="mt-3 flex items-center text-sm text-gray-300 space-x-4">
                      <span className="bg-gradient-to-r from-blue-500 to-purple-600 text-white px-3 py-1 rounded-full text-xs font-medium">
                        {doc.law_type}
                      </span>
                      <span className="flex items-center">
                        🔍 {doc.chunk_count} chunks
                      </span>
                      <span className="flex items-center">
                        📅 {doc.created_at ? new Date(doc.created_at).toLocaleDateString('pt-PT') : 'N/A'}
                      </span>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <button
                      onClick={() => deleteDocument(doc.id)}
                      className="bg-red-500/20 text-red-400 hover:bg-red-500/30 px-3 py-2 rounded-lg transition-all flex items-center space-x-1"
                    >
                      <span>🗑️</span>
                      <span>Remover</span>
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
          {documents.length === 0 && (
            <div className="px-6 py-12 text-center">
              <div className="text-gray-400 mb-4">
                <span className="text-4xl">📄</span>
              </div>
              <p className="text-gray-300 mb-4">Nenhum documento carregado ainda.</p>
              <Link href="/admin/upload">
                <button className="btn-primary">
                  Carregar o primeiro documento
                </button>
              </Link>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}