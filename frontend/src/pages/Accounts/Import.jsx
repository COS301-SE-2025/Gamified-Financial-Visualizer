import React, { useState } from 'react';
import AccountsLayout from './AccountsLayout';
import { FaUpload, FaFilePdf, FaLink, FaTrash, FaQuestionCircle, FaSpinner } from 'react-icons/fa';

const ImportPage = () => {
  const [files, setFiles] = useState([]);
  const [url, setUrl] = useState('');
  const [isDragging, setIsDragging] = useState(false);
  const [isImporting, setIsImporting] = useState(false);
  const [importError, setImportError] = useState(null);
  const [importSuccess, setImportSuccess] = useState(false);

  const handleDragEnter = (e) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragging(false);
    const droppedFiles = Array.from(e.dataTransfer.files).filter(file => 
      file.type === 'application/pdf'
    );
    setFiles([...files, ...droppedFiles]);
  };

  const handleFileChange = (e) => {
    const selectedFiles = Array.from(e.target.files).filter(file => 
      file.type === 'application/pdf'
    );
    setFiles([...files, ...selectedFiles]);
  };

  const removeFile = (index) => {
    const newFiles = [...files];
    newFiles.splice(index, 1);
    setFiles(newFiles);
  };

  const handleDiscard = () => {
    setFiles([]);
    setUrl('');
    setImportError(null);
    setImportSuccess(false);
  };

  const handleImport = async () => {
    if (files.length === 0 && !url) return;

    setIsImporting(true);
    setImportError(null);
    setImportSuccess(false);

    try {
      if (files.length > 0) {
        const formData = new FormData();
        files.forEach(file => formData.append('statements', file));
        await new Promise(resolve => setTimeout(resolve, 1500));
      }

      if (url) {
        await new Promise(resolve => setTimeout(resolve, 1000));
      }

      setImportSuccess(true);
    } catch (error) {
      setImportError(error.message || 'Failed to import statements. Please try again.');
    } finally {
      setIsImporting(false);
    }
  };

  return (
    <AccountsLayout>
      <div className="min-h-screen bg-gray-50 py-8">
        {/* Background border container */}
       <div className="w-full px-4 border-2 border-gray-200 rounded-2xl bg-white shadow-sm overflow-hidden -mt-[25px]">
          {/* Inner content with padding */}
          <div className="px-6 py-8 sm:px-8 sm:py-10">
            {/* Header */}
            <div className="text-center mb-8">
              <h1 className="text-2xl md:text-3xl font-bold text-gray-800 mb-2">
                Import Bank Statements
              </h1>
              <p className="text-gray-600">
                Upload PDF statements to automatically extract and categorize transactions
              </p>
            </div>

            {/* Status Messages */}
            {importError && (
              <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg text-red-700">
                {importError}
              </div>
            )}
            
            {importSuccess && (
              <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-lg text-green-700">
                Statements imported successfully!
              </div>
            )}

            {/* Drag & Drop Zone */}
            <div 
              className={`border-2 border-dashed rounded-xl p-8 mb-6 text-center transition-all ${isDragging ? 'border-blue-500 bg-blue-50' : 'border-gray-300 hover:border-blue-400'}`}
              onDragEnter={handleDragEnter}
              onDragOver={handleDragEnter}
              onDragLeave={handleDragLeave}
              onDrop={handleDrop}
            >
              <div className="flex flex-col items-center justify-center space-y-3">
                <div className="bg-blue-100 p-4 rounded-full text-blue-600">
                  <FaUpload size={24} />
                </div>
                <h3 className="text-lg font-medium text-gray-700">
                  {files.length > 0 ? 'Add more files' : 'Drag PDF statements here'}
                </h3>
                <p className="text-gray-500 text-sm">
                  or
                </p>
                <label className="cursor-pointer bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition">
                  <input 
                    type="file" 
                    className="hidden" 
                    accept=".pdf" 
                    multiple 
                    onChange={handleFileChange}
                  />
                  Browse Files
                </label>
                <p className="text-xs text-gray-500 mt-2">
                  PDF files only (10 MB max per file)
                </p>
              </div>
            </div>

            {/* Uploaded Files List */}
            {files.length > 0 && (
              <div className="mb-6">
                <h3 className="text-md font-medium text-gray-700 mb-3">Files to import</h3>
                <div className="space-y-3">
                  {files.map((file, index) => (
                    <div key={index} className="flex items-center justify-between bg-gray-50 p-3 rounded-lg">
                      <div className="flex items-center space-x-3">
                        <FaFilePdf className="text-red-500" />
                        <div>
                          <p className="text-sm font-medium text-gray-800">{file.name}</p>
                          <p className="text-xs text-gray-500">{(file.size / (1024 * 1024)).toFixed(2)} MB</p>
                        </div>
                      </div>
                      <button 
                        onClick={() => removeFile(index)}
                        className="text-gray-400 hover:text-red-500"
                      >
                        <FaTrash />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* URL Import */}
            <div className="mb-8">
              <h3 className="text-md font-medium text-gray-700 mb-3 flex items-center">
                <FaLink className="mr-2 text-gray-500" />
                Or import from URL
              </h3>
              <div className="flex space-x-2">
                <input
                  type="text"
                  placeholder="https://yourbank.com/statement.pdf"
                  className="flex-1 border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  value={url}
                  onChange={(e) => setUrl(e.target.value)}
                />
                <button 
                  className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition"
                  onClick={() => {
                    if (url) {
                      handleImport();
                    }
                  }}
                >
                  Fetch
                </button>
              </div>
            </div>

            {/* Info & Actions */}
            <div className="border-t pt-6">
              <div className="flex items-start text-sm text-gray-500 mb-6">
                <FaQuestionCircle className="mt-1 mr-2 flex-shrink-0" />
                <p>
                  Some statement formats may require additional mapping. We support PDFs from most major banks.
                  <a href="#" className="text-blue-600 hover:underline ml-1">Learn more</a>
                </p>
              </div>

              <div className="flex justify-end space-x-3">
                <button 
                  onClick={handleDiscard}
                  className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition"
                  disabled={isImporting}
                >
                  Discard
                </button>
                <button 
                  onClick={handleImport}
                  className={`px-6 py-2 rounded-lg text-white transition flex items-center justify-center ${files.length > 0 || url ? 'bg-blue-600 hover:bg-blue-700' : 'bg-gray-400 cursor-not-allowed'}`}
                  disabled={!(files.length > 0 || url) || isImporting}
                >
                  {isImporting ? (
                    <>
                      <FaSpinner className="animate-spin mr-2" />
                      Importing...
                    </>
                  ) : (
                    'Import Statements'
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </AccountsLayout>
  );
};

export default ImportPage;