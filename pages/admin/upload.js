import { useState } from 'react';
import { useRouter } from 'next/router';
import Link from 'next/link';

export default function UploadDocument() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [dragActive, setDragActive] = useState(false);
  const [form, setForm] = useState({
    title: '',
    description: '',
    law_type: '',
    source: '',
    file: null
  });

  const lawTypes = [
    'Constituição',
    'Código Civil',
    'Código Penal',
    'Código de Trabalho',
    'Código Comercial',
    'Lei Administrativa',
    'Decreto-Lei',
    'Regulamento',
    'Outros'
  ];

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setForm(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setForm(prev => ({
        ...prev,
        file: file
      }));
    }
  };

  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      setForm(prev => ({
        ...prev,
        file: e.dataTransfer.files[0]
      }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!form.file || !form.title || !form.law_type) {
      alert('Por favor, preencha todos os campos obrigatórios');
      return;
    }

    setLoading(true);

    try {
      const formData = new FormData();
      formData.append('file', form.file);
      formData.append('title', form.title);
      formData.append('description', form.description || '');
      formData.append('law_type', form.law_type);
      formData.append('source', form.source);

      const response = await fetch('http://localhost:8000/api/admin/upload-document', {
        method: 'POST',
        body: formData,
      });

      if (response.ok) {
        const result = await response.json();
        alert(`Documento carregado com sucesso! ${result.chunks_created} chunks criados.`);
        router.push('/admin');
      } else {
        const error = await response.json();
        alert(`Erro: ${error.detail}`);
      }
    } catch (error) {
      console.error('Erro no upload:', error);
      alert('Erro ao carregar documento');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Carregar Documento Legal</h1>
              <p className="text-gray-600">Adicionar nova lei ou regulamento ao sistema</p>
            </div>
            <Link href="/admin">
              <button className="bg-gray-600 text-white px-4 py-2 rounded-lg hover:bg-gray-700 transition-colors">
                ← Voltar ao Painel
              </button>
            </Link>
          </div>
        </div>
      </div>

      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* File Upload */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Arquivo do Documento *
            </label>
            <div
              className={`border-2 border-dashed rounded-lg p-6 text-center cursor-pointer transition-colors ${
                dragActive
                  ? 'border-blue-400 bg-blue-50'
                  : 'border-gray-300 hover:border-gray-400'
              }`}
              onDragEnter={handleDrag}
              onDragLeave={handleDrag}
              onDragOver={handleDrag}
              onDrop={handleDrop}
              onClick={() => document.getElementById('file-input').click()}
            >
              <input
                id="file-input"
                type="file"
                accept=".pdf,.docx,.txt"
                onChange={handleFileChange}
                className="hidden"
              />
              
              {form.file ? (
                <div className="text-green-600">
                  <div className="text-lg mb-2">📄</div>
                  <p className="text-sm font-medium">{form.file.name}</p>
                  <p className="text-xs text-gray-500 mt-1">
                    {Math.round(form.file.size / 1024)} KB
                  </p>
                </div>
              ) : (
                <div className="text-gray-400">
                  <div className="text-3xl mb-2">📤</div>
                  <p className="text-sm">
                    Clique para seleccionar ou arraste o arquivo aqui
                  </p>
                  <p className="text-xs mt-1">PDF, DOCX ou TXT até 50MB</p>
                </div>
              )}
            </div>
          </div>

          {/* Title */}
          <div>
            <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-2">
              Título do Documento *
            </label>
            <input
              type="text"
              id="title"
              name="title"
              value={form.title}
              onChange={handleInputChange}
              required
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="Ex: Lei do Trabalho de Moçambique"
            />
          </div>

          {/* Law Type */}
          <div>
            <label htmlFor="law_type" className="block text-sm font-medium text-gray-700 mb-2">
              Tipo de Lei *
            </label>
            <select
              id="law_type"
              name="law_type"
              value={form.law_type}
              onChange={handleInputChange}
              required
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="">Seleccione o tipo</option>
              {lawTypes.map(type => (
                <option key={type} value={type}>{type}</option>
              ))}
            </select>
          </div>

          {/* Description */}
          <div>
            <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-2">
              Descrição
            </label>
            <textarea
              id="description"
              name="description"
              value={form.description}
              onChange={handleInputChange}
              rows={3}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="Breve descrição do conteúdo e aplicabilidade do documento"
            />
          </div>

          {/* Source */}
          <div>
            <label htmlFor="source" className="block text-sm font-medium text-gray-700 mb-2">
              Fonte/Origem
            </label>
            <input
              type="text"
              id="source"
              name="source"
              value={form.source}
              onChange={handleInputChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="Ex: Boletim da República, Assembleia da República"
            />
          </div>

          {/* Submit Button */}
          <div className="flex justify-end space-x-4 pt-6">
            <Link href="/admin">
              <button
                type="button"
                className="px-6 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
              >
                Cancelar
              </button>
            </Link>
            <button
              type="submit"
              disabled={loading}
              className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center space-x-2"
            >
              {loading ? (
                <>
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  <span>Processando...</span>
                </>
              ) : (
                <>
                  <span>📤</span>
                  <span>Carregar Documento</span>
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}