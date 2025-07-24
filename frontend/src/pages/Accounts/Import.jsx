import React, { useState } from 'react';
import AccountsLayout from './AccountsLayout';
import { FaUpload, FaFilePdf, FaLink, FaTrash, FaQuestionCircle, FaSpinner, FaCheck, FaTimes, FaEdit } from 'react-icons/fa';

const ImportPage = () => {
  // File upload state
  const [files, setFiles] = useState([]);
  const [url, setUrl] = useState('');
  const [isDragging, setIsDragging] = useState(false);

  // Import configuration state
  const [selectedAccount, setSelectedAccount] = useState('');
  const [selectedBank, setSelectedBank] = useState('');
  const [password, setPassword] = useState('');

  // Import process state
  const [isImporting, setIsImporting] = useState(false);
  const [importError, setImportError] = useState(null);
  const [importSuccess, setImportSuccess] = useState(false);
  const [showReview, setShowReview] = useState(false);
  const [importProgress, setImportProgress] = useState(0);

  // Mock transaction data for review
  const [transactions, setTransactions] = useState([
    { id: 1, date: '2023-05-15', description: 'Grocery Store', amount: -85.32, category: 'Groceries', type: 'expense', originalCategory: 'Groceries', originalType: 'expense' },
    { id: 2, date: '2023-05-14', description: 'Salary Deposit', amount: 2500.00, category: 'Income', type: 'income', originalCategory: 'Income', originalType: 'income' },
    { id: 3, date: '2023-05-12', description: 'AMZN Purchase', amount: -42.99, category: 'Shopping', type: 'expense', originalCategory: 'Shopping', originalType: 'expense' },
    { id: 4, date: '2023-05-10', description: 'Electric Bill', amount: -120.50, category: 'Utilities', type: 'expense', originalCategory: 'Utilities', originalType: 'expense' },
    { id: 5, date: '2023-05-08', description: 'Restaurant', amount: -65.80, category: 'Dining', type: 'expense', originalCategory: 'Dining', originalType: 'expense' },
  ]);

  // Mock accounts and banks data
  const accounts = [
    { id: 'acc1', name: 'Primary Checking (****3456)' },
    { id: 'acc2', name: 'Savings Account (****7890)' },
    { id: 'acc3', name: 'Credit Card (****4321)' },
  ];

  const banks = [
    { id: 'bank1', name: 'Chase Bank' },
    { id: 'bank2', name: 'Bank of America' },
    { id: 'bank3', name: 'Wells Fargo' },
    { id: 'bank4', name: 'Citibank' },
  ];

  const categories = [
    'Income', 'Groceries', 'Dining', 'Shopping',
    'Utilities', 'Entertainment', 'Transportation',
    'Healthcare', 'Travel', 'Education'
  ];

  const transactionTypes = ['income', 'expense', 'transfer'];

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
    setShowReview(false);
  };

  const handleImport = async () => {
    if (files.length === 0 && !url) return;
    if (!selectedAccount) {
      setImportError('Please select an account');
      return;
    }
    if (!selectedBank) {
      setImportError('Please select a bank');
      return;
    }

    setIsImporting(true);
    setImportError(null);
    setImportSuccess(false);
    setImportProgress(0);

    try {
      // Simulate progress updates
      const interval = setInterval(() => {
        setImportProgress(prev => {
          if (prev >= 90) {
            clearInterval(interval);
            return prev;
          }
          return prev + 10;
        });
      }, 200);

      // Simulate API call to process the statement
      await new Promise(resolve => setTimeout(resolve, 1500));

      // Complete the progress
      setImportProgress(100);
      await new Promise(resolve => setTimeout(resolve, 300));

      // Show the review screen
      setShowReview(true);
    } catch (error) {
      setImportError(error.message || 'Failed to import statements. Please try again.');
    } finally {
      setIsImporting(false);
    }
  };

  const handleCategoryChange = (id, newCategory) => {
    setTransactions(transactions.map(tx =>
      tx.id === id ? { ...tx, category: newCategory } : tx
    ));
  };

  const handleTypeChange = (id, newType) => {
    setTransactions(transactions.map(tx =>
      tx.id === id ? { ...tx, type: newType } : tx
    ));
  };

  const handleConfirmChanges = async () => {
    setIsImporting(true);
    try {
      // Simulate API call to save changes
      await new Promise(resolve => setTimeout(resolve, 1000));
      setImportSuccess(true);
      setShowReview(false);
    } catch (error) {
      setImportError('Failed to save changes. Please try again.');
    } finally {
      setIsImporting(false);
    }
  };

  const hasChanges = transactions.some(tx =>
    tx.category !== tx.originalCategory || tx.type !== tx.originalType
  );

  return (
    <AccountsLayout>
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="w-full px-4 border-2 border-gray-200 rounded-2xl bg-white shadow-sm overflow-hidden -mt-[25px]">
          <div className="px-6 py-8 sm:px-8 sm:py-10">
            {!showReview ? (
              <>
                <div className="text-center mb-8">
                  <h1 className="text-2xl md:text-3xl font-bold text-gray-800 mb-2">
                    Import Bank Statements
                  </h1>
                  <p className="text-gray-600">
                    Upload PDF statements to automatically extract and categorize transactions
                  </p>
                </div>

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

                {/* Configuration Section */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Destination Account
                    </label>
                    <select
                      className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      value={selectedAccount}
                      onChange={(e) => setSelectedAccount(e.target.value)}
                    >
                      <option value="">Select an account</option>
                      {accounts.map(account => (
                        <option key={account.id} value={account.id}>{account.name}</option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Bank Statement From
                    </label>
                    <select
                      className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      value={selectedBank}
                      onChange={(e) => setSelectedBank(e.target.value)}
                    >
                      <option value="">Select your bank</option>
                      {banks.map(bank => (
                        <option key={bank.id} value={bank.id}>{bank.name}</option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Statement Password (if required)
                    </label>
                    <input
                      type="password"
                      className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="Optional"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                    />
                  </div>
                </div>

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
                      className={`px-6 py-2 rounded-lg text-white transition flex items-center justify-center ${(files.length > 0 || url) && selectedAccount && selectedBank ? 'bg-blue-600 hover:bg-blue-700' : 'bg-gray-400 cursor-not-allowed'}`}
                      disabled={!(files.length > 0 || url) || !selectedAccount || !selectedBank || isImporting}
                    >
                      {isImporting ? (
                        <>
                          <FaSpinner className="animate-spin mr-2" />
                          Processing...
                        </>
                      ) : (
                        'Process Statement'
                      )}
                    </button>
                  </div>
                </div>
              </>
            ) : (
              <>
                <div className="mb-8">
                  <h1 className="text-2xl md:text-3xl font-bold text-gray-800 mb-2">
                    Review Transactions
                  </h1>
                  <p className="text-gray-600">
                    Please review the extracted transactions and make any necessary corrections
                  </p>
                </div>

                <div className="overflow-x-auto mb-6">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Description</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Amount</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Category</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Type</th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {transactions.map((transaction) => (
                        <tr key={transaction.id}>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            {transaction.date}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                            {transaction.description}
                          </td>
                          <td className={`px-6 py-4 whitespace-nowrap text-sm ${transaction.amount < 0 ? 'text-red-600' : 'text-green-600'}`}>
                            {transaction.amount < 0 ? `-$${Math.abs(transaction.amount).toFixed(2)}` : `$${transaction.amount.toFixed(2)}`}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            <select
                              value={transaction.category}
                              onChange={(e) => handleCategoryChange(transaction.id, e.target.value)}
                              className="border border-gray-300 rounded px-2 py-1"
                            >
                              {categories.map(category => (
                                <option key={category} value={category}>{category}</option>
                              ))}
                            </select>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            <select
                              value={transaction.type}
                              onChange={(e) => handleTypeChange(transaction.id, e.target.value)}
                              className="border border-gray-300 rounded px-2 py-1"
                            >
                              {transactionTypes.map(type => (
                                <option key={type} value={type}>{type.charAt(0).toUpperCase() + type.slice(1)}</option>
                              ))}
                            </select>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                <div className="border-t pt-6">
                  <div className="flex justify-between items-center">
                    <div className="text-sm text-gray-500">
                      {hasChanges && (
                        <span className="flex items-center text-yellow-600">
                          <FaEdit className="mr-1" /> You have unsaved changes
                        </span>
                      )}
                    </div>
                    <div className="flex-1 max-w-md">
                      <button
                        onClick={handleImport}
                        className={`px-6 py-2 rounded-lg text-white transition flex items-center justify-center w-full ${(files.length > 0 || url) && selectedAccount && selectedBank ? 'bg-blue-600 hover:bg-blue-700' : 'bg-gray-400 cursor-not-allowed'}`}
                        disabled={!(files.length > 0 || url) || !selectedAccount || !selectedBank || isImporting}
                      >
                        {isImporting ? (
                          <div className="w-full bg-gray-200 rounded-full h-2.5">
                            <div
                              className="bg-blue-600 h-2.5 rounded-full transition-all duration-300 ease-out"
                              style={{ width: `${importProgress}%` }}
                            ></div>
                          </div>
                        ) : (
                          'Process Statement'
                        )}
                      </button>
                    </div>
                  </div>
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </AccountsLayout>
  );
};

export default ImportPage;