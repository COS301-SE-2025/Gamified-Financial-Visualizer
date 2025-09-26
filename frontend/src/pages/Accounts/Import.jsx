import React, { useState , useEffect} from 'react';
import AccountsLayout from './AccountsLayout';
import { 
  FaUpload, FaFilePdf, FaLink, FaTrash, FaQuestionCircle, 
  FaSpinner, FaCheckCircle, FaTimes, FaArrowLeft, 
  FaExclamationTriangle, FaSave, FaLock, FaFolderOpen,
  FaGlobe, FaDownload, FaArrowRight, FaFileAlt, FaExclamationCircle
} from 'react-icons/fa';

const BASE_URL = process.env.REACT_APP_API_URL || 'https://gamified-finance-backend-d2a3hnatafa7h8bw.southafricanorth-01.azurewebsites.net';
// const BASE_URL = "http://localhost:3000";
// const BASE_URL = "http://localhost:5000";

const ImportPage = () => {
  const userData = JSON.parse(localStorage.getItem('user') || '{}');
  const userId = userData?.id || null;

  // File upload state
  const [files, setFiles] = useState([]);
  const [url, setUrl] = useState('');
  const [isDragging, setIsDragging] = useState(false);

  // Import configuration state
  const [selectedAccount, setSelectedAccount] = useState('');
  const [accounts, setAccounts] = useState(null);
  const [selectedBank, setSelectedBank] = useState('');
  const [password, setPassword] = useState('');

  const [transactions, setTransactions] = useState([]);
  const [categories, setCategories] = useState([]);

  // Import process state
  const [isImporting, setIsImporting] = useState(false);
  const [importError, setImportError] = useState(null);
  const [importSuccess, setImportSuccess] = useState(false);
  const [showReview, setShowReview] = useState(false);
  const [importProgress, setImportProgress] = useState(0);

  const banks = [
    { id: 'bank1', name: 'Nedbank' },
    { id: 'bank2', name: 'Standard Bank' },
    { id: 'bank3', name: 'FNB' },
    { id: 'bank4', name: 'Capitec' },
    { id: 'bank5', name: 'Absa' },
    { id: 'bank6', name: 'Old Mutual' }
  ];

  const transactionTypes = ['income', 'expense', 'transfer'];

  // File handling functions
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
    setFiles(droppedFiles.slice(0, 1)); // Only keep the first file
  };

  const handleFileChange = (e) => {
    const selectedFiles = Array.from(e.target.files).filter(file =>
      file.type === 'application/pdf'
    );
    setFiles(selectedFiles.slice(0, 1)); // Only keep the first file
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

  // Import process
  const handleImport = async () => {
    if (files.length === 0 && !url) {
      setImportError('Please upload a file or enter a URL');
      return;
    }
    if (!selectedAccount) {
      setImportError('Please select a destination account');
      return;
    }
    if (!selectedBank) {
      setImportError('Please select your bank');
      return;
    }

    setIsImporting(true);
    setImportError(null);
    setImportSuccess(false);
    setImportProgress(0);

    try {
      let res, body;
      if (files.length) {
        const form = new FormData();
        form.append('statement', files[0]);
        form.append('accountId', selectedAccount);
        form.append('password', password);
        form.append('bankName', selectedBank.toLowerCase());    
              
        res = await fetch(
          `${BASE_URL}/api/classifier/upload-statement`,
          { method: 'POST',
           headers: { 'Accept': 'application/json' }, 
           body: form
         }
        );
      } else {
        res = await fetch(
          `${BASE_URL}/api/classifier/upload-statement-url`,
          {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              url,
              accountId: selectedAccount,
              bankName: selectedBank,
              password
            })
          }
        );
      }
const contentType = res.headers.get('content-type');

      if (!contentType || !contentType.includes('application/json')) {
  const text = await res.text();
  throw new Error(`Expected JSON, got: ${text.slice(0, 100)}`);
}

      body = await res.json();
      if (!res.ok) throw new Error(body.error || 'Upload failed');

      const txns = body.preview.map((tx) => {
        const match = categories.find(c => c.category_name === tx.predicted_category.toLowerCase());
        const id = match ? match.category_id : null;

        return {
          id: `${tx.accountId}-${tx.date}-${tx.description}-${Math.random().toString(36).substr(2, 9)}`,
          accountId: tx.accountId,
          date: tx.date,
          description: tx.description,
          amount: tx.amount,
          direction: tx.direction,
          transaction_type: tx.transaction_type,
          category: tx.category_id,
          originalCategory: id,
          originalType: tx.transaction_type,
        };
      });
      setTransactions(txns);
      setShowReview(true);
    } catch (error) {
      setImportError(error.message || 'Import failed. Please try again.');
    } finally {
      setIsImporting(false);
    }
  };

  // Transaction editing
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

  const handleDescriptionChange = (id, newDescription) => {
    setTransactions(transactions.map(tx =>
      tx.id === id ? { ...tx, description: newDescription } : tx
    ));
  };

  const handleFinalImport = async () => {
    setIsImporting(true);
    setIsImporting(true);
    setImportError(null);

    const payload = {
      feedbacks: transactions
        .filter(tx => tx.category !== tx.originalCategory)
        .map(tx => ({
          desc: tx.description,
          corrected_category: categories.find(c => c.category_id === tx.category)?.category_name || 'Uncategorized'
        }))
    };

    try {
      const res = await fetch(
        `${BASE_URL}/api/classifier/confirm-statement`,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            preview: transactions.map(tx => ({
              accountId: tx.accountId,
              date: tx.date,
              description: tx.description,
              amount: tx.amount,
              direction: tx.direction,
              balance: tx.balance,
              predicted_category: tx.predicted_category,
              classification_source: tx.classification_source,
              category_id: tx.category,
              transaction_type: tx.transaction_type
            })),
            recurringFlags: transactions.map(_ => false)
          })
        }
      );

      const body = await res.json();
      if (!res.ok) throw new Error(body.error || 'Feedback save failed');

      setImportSuccess(true);
      setShowReview(false);
                
      if (payload.feedbacks.length) {
        fetch(
          `${BASE_URL}/api/classifier/feedback`,
          {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ feedback: payload.feedbacks })
          }
        );
      }
    } catch (err) {
      setImportError(err.message);
    } finally {
      setIsImporting(false);
    }
  };

  const hasChanges = transactions.some(tx => 
    tx.category !== tx.originalCategory || tx.type !== tx.originalType
  );

  useEffect(() => {
    fetch(`${BASE_URL}/api/accounts/user/${userId}`)
      .then(r => r.json())
      .then(j => setAccounts(j.data))
      .catch(() => setAccounts([]));

    fetch(`${BASE_URL}/api/transactions/categories`)
      .then(r => r.json())
      .then(j => setCategories(j.data))
      .catch(() => setCategories([]));
  }, [userId]);

  if (!accounts) {
    return (
      <AccountsLayout>
        <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
          <div className="text-center">
            <h1 className="text-2xl font-bold text-gray-800 dark:text-white mb-4">Loading accounts...</h1>
            <p className="text-gray-600 dark:text-gray-400">Please wait while we fetch your accounts.</p>
          </div>
        </div>
      </AccountsLayout>
    );
  }

  return (
    <AccountsLayout>
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-8">
        <div className="w-full px-4 max-w-4xl mx-auto">
          <div className="border-2 border-gray-200 dark:border-gray-700 rounded-2xl bg-white dark:bg-gray-800 shadow-sm overflow-hidden">
            <div className="px-6 py-8 sm:px-8 sm:py-10">
              {/* Step Indicator */}
              <div className="flex justify-center mb-8">
                <div className="flex items-center">
                  <div className={`flex items-center justify-center w-8 h-8 rounded-full ${!showReview ? 'bg-sky-500 text-white' : 'bg-gray-200 text-gray-600'}`}>
                    1
                  </div>
                  <div className={`w-16 h-1 mx-2 ${!showReview ? 'bg-gray-300' : 'bg-sky-500'}`}></div>
                  <div className={`flex items-center justify-center w-8 h-8 rounded-full ${showReview ? 'bg-sky-500 text-white' : 'bg-gray-200 text-gray-600'}`}>
                    2
                  </div>
                </div>
              </div>

              {!showReview ? (
                <>
                  {/* Upload Section */}
                  <div className="text-center mb-8">
                    <h1 className="text-2xl md:text-3xl font-bold text-gray-800 dark:text-white mb-2">
                      Import Bank Statements
                    </h1>
                    <p className="text-gray-600 dark:text-gray-400">
                      Upload a PDF statement to automatically extract and categorize transactions with <span className="font-bold text-[#83AB55]">AI</span>
                    </p>
                  </div>

                  {/* Status Messages */}
                  {importError && (
                    <div className="mb-6 p-4 bg-red-50 border-l-4 border-red-500 rounded-lg flex items-start">
                      <FaExclamationCircle className="text-red-500 mt-0.5 mr-3 flex-shrink-0" />
                      <div>
                        <h3 className="font-medium text-red-800">Error</h3>
                        <p className="text-red-700">{importError}</p>
                      </div>
                    </div>
                  )}

                  {importSuccess && (
                    <div className="mb-6 p-4 bg-green-50 border-l-4 border-green-500 rounded-lg flex items-start">
                      <FaCheckCircle className="text-green-500 mt-0.5 mr-3 flex-shrink-0" />
                      <div>
                        <h3 className="font-medium text-green-800">Success</h3>
                        <p className="text-green-700">Transactions imported successfully</p>
                      </div>
                    </div>
                  )}

                  {/* Configuration */}
                  <div className="bg-gray-50 p-5 rounded-xl mb-6 dark:bg-gray-700">
                    <h2 className="text-lg font-semibold text-gray-800 mb-4 dark:text-gray-200">Import Settings</h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2 dark:text-gray-300">
                          Destination Account <span className="text-red-500">*</span>
                        </label>
                        <select
                          className="w-full border border-gray-300 dark:bg-gray-800 dark:border-gray-600 rounded-lg px-4 py-2 focus:ring-2 focus:ring-sky-400 focus:border-transparent"
                          value={selectedAccount}
                          onChange={(e) => setSelectedAccount(e.target.value)}
                          required
                        >
                          <option value="">Select an account</option>
                          {accounts.map(account => (
                            <option key={account.account_id} value={account.account_id}>{account.account_name}</option>
                          ))}
                        </select>
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                          Bank <span className="text-red-500">*</span>
                        </label>
                        <select
                          className="w-full border border-gray-300 dark:bg-gray-800 dark:border-gray-600 rounded-lg px-4 py-2 focus:ring-2 focus:ring-sky-400 focus:border-transparent  dark:text-white"
                          value={selectedBank}
                          onChange={(e) => setSelectedBank(e.target.value)}
                          required
                        >
                          <option value="">Select your bank</option>
                          {banks.map(bank => (
                            <option key={bank.id} value={bank.name}>{bank.name}</option>
                          ))}
                        </select>
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                          PDF Password (if required)
                        </label>
                        <div className="relative">
                          <input
                            type="password"
                            className="w-full border border-gray-300 dark:bg-gray-800 dark:border-gray-600 rounded-lg px-4 py-2 focus:ring-2 focus:ring-sky-400 focus:border-transparent  dark:text-white"
                            placeholder="Enter password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                          />
                          <FaLock className="absolute right-3 top-3 text-gray-400" />
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* File Upload */}
                  <div className="mb-8">
                    <h2 className="text-lg font-semibold text-gray-800 mb-3">Upload Statement</h2>
                    
                    <div
                      className={`border-2 border-dashed rounded-xl p-8 mb-4 text-center transition-all ${isDragging ? 'border-sky-400 bg-blue-50' : 'border-gray-300 hover:border-sky-300'}`}
                      onDragEnter={handleDragEnter}
                      onDragOver={handleDragEnter}
                      onDragLeave={handleDragLeave}
                      onDrop={handleDrop}
                    >
                      <div className="flex flex-col items-center justify-center space-y-3">
                        <div className="bg-blue-100 p-4 rounded-full text-sky-500">
                          <FaUpload size={24} />
                        </div>
                        <h3 className="text-lg font-medium text-gray-700">
                          {files.length > 0 ? 'Replace file' : 'Drag PDF statement here'}
                        </h3>
                        <p className="text-gray-500 text-sm">or</p>
                        <label className="cursor-pointer bg-sky-500 text-white px-4 py-2 rounded-lg hover:bg-sky-600 transition flex items-center">
                          <FaFolderOpen className="mr-2" />
                          <input
                            type="file"
                            className="hidden"
                            accept=".pdf"
                            onChange={handleFileChange}
                          />
                          Select File
                        </label>
                        <p className="text-xs text-gray-500 mt-2">
                          PDF file only (max 10MB)
                        </p>
                      </div>
                    </div>

                    {files.length > 0 && (
                      <div className="bg-gray-50 p-4 rounded-lg">
                        <h3 className="text-md font-medium text-gray-700 dark:text-gray-300 mb-3 flex items-center">
                          <FaFileAlt className="mr-2 text-gray-500" />
                          File to Import
                        </h3>
                        <div className="space-y-2">
                          {files.map((file, index) => (
                            <div key={index} className="flex items-center justify-between bg-white dark:bg-gray-700 p-3 rounded-lg border border-gray-200">
                              <div className="flex items-center space-x-3">
                                <FaFilePdf className="text-red-500" />
                                <div>
                                  <p className="text-sm font-medium text-gray-800 dark:text-white">{file.name}</p>
                                  <p className="text-xs text-gray-500 dark:text-gray-400">{(file.size / (1024 * 1024)).toFixed(2)} MB</p>
                                </div>
                              </div>
                              <button
                                onClick={() => removeFile(index)}
                                className="text-gray-400 hover:text-red-500 p-1"
                                aria-label="Remove file dark:hover:text-red-400"
                              >
                                <FaTrash />
                              </button>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>

                  {/* URL Import */}
                  <div className="mb-8">
                    <h2 className="text-md font-medium text-gray-700 dark:text-gray-300 mb-3 flex items-center">
                      <FaLink className="mr-2 text-gray-500 dark:text-gray-400" />
                      Or import from URL
                    </h2>
                    <div className="flex space-x-2">
                      <div className="flex-1 relative">
                        <input
                          type="text"
                          placeholder="https://yourbank.com/statement.pdf"
                          className="w-full border border-gray-300 dark:border-gray-600 rounded-lg px-4 py-2 pl-10 focus:ring-2 focus:ring-sky-400 focus:border-transparent dark:bg-gray-700 dark:text-white"
                          value={url}
                          onChange={(e) => setUrl(e.target.value)}
                        />
                        <FaGlobe className="absolute left-3 top-3 text-gray-400" />
                      </div>
                      <button
                        className="bg-sky-500 text-white px-4 py-2 rounded-lg hover:bg-sky-600 transition flex items-center"
                        onClick={() => url && handleImport()}
                        disabled={!url}
                      >
                        <FaDownload className="mr-2" />
                        Fetch
                      </button>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="border-t pt-6">
                    <div className="flex items-start text-sm text-gray-500 mb-6">
                      <div className="bg-blue-100 p-2 rounded-full text-sky-500 mr-3">
                        <FaQuestionCircle />
                      </div>
                      <div>
                        <p className="font-medium text-gray-700 mb-1">Need help?</p>
                        <p>
                          We support PDFs from most major banks. If your bank is not listed, please contact support. <br />
                          All statements are processed securely, privately and never stored on the system nor shared to third parties.<br />
                        </p>
                      </div>
                    </div>

                    <div className="flex justify-between">
                      <button
                        onClick={handleDiscard}
                        className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 transition flex items-center"
                        disabled={isImporting}
                      >
                        <FaTimes className="mr-2" />
                        Cancel
                      </button>
                      <button
                        onClick={handleImport}
                        className={`px-6 py-2 rounded-lg text-white transition flex items-center ${
                        (files.length > 0 || url) && selectedAccount && selectedBank 
                          ? 'bg-sky-500 hover:bg-sky-600' 
                          : 'bg-gray-400 dark:bg-gray-600 cursor-not-allowed'
                      }`}
                        disabled={!(files.length === 1 || url) || !selectedAccount || !selectedBank || isImporting}
                      >
                        {isImporting ? (
                          <>
                            <FaSpinner className="animate-spin mr-2" />
                            Processing...
                          </>
                        ) : (
                          <>
                            <FaArrowRight className="mr-2" />
                            Review Transactions
                          </>
                        )}
                      </button>
                    </div>
                  </div>
                </>
              ) : (
                <>
                  {/* Review Section */}
                  <div className="mb-8">
                    <h1 className="text-2xl md:text-3xl font-bold text-gray-800 dark:text-white mb-2">
                      Review Transactions
                    </h1>
                    <p className="text-gray-600 dark:text-gray-400">
                      Verify and categorize the extracted transactions
                    </p>
                  </div>

                <div className="overflow-x-auto mb-6">
                  <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                    <thead className="bg-gray-50 dark:bg-gray-700">
                      <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Date</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Description</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Amount</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Category</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Type</th>
                      </tr>
                    </thead>
                    <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                      {transactions.map((transaction) => (
                        <tr key={transaction.id}>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                            {transaction.date}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-white">
                            {transaction.description}
                          </td>
                          <td className={`px-6 py-4 whitespace-nowrap text-sm ${
                            transaction.amount < 0 
                              ? 'text-red-600 dark:text-red-400' 
                              : 'text-green-600 dark:text-green-400'
                          }`}>
                            {transaction.amount < 0 ? `-$${Math.abs(transaction.amount).toFixed(2)}` : `$${transaction.amount.toFixed(2)}`}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                            <select
                              value={transaction.category}
                              onChange={(e) => handleCategoryChange(transaction.id, Number(e.target.value))}
                              className="border border-gray-300 dark:border-gray-600 rounded px-2 py-1 dark:bg-gray-700 dark:text-white"
                            >
                              {categories.map(category => (
                                <option key={category.category_id} value={category.category_id}>{category.category_name}</option>
                              ))}
                            </select>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                            <select
                              value={transaction.transaction_type}
                              onChange={(e) => handleTypeChange(transaction.id, e.target.value)}
                              className="border border-gray-300 dark:border-gray-600 rounded px-2 py-1 dark:bg-gray-700 dark:text-white"
                            >
                              {transactionTypes.map(type => (
                                <option key={type} value={type}>{type}</option>
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
                      <div>
                        {hasChanges && (
                          <div className="flex items-center text-yellow-600 bg-yellow-50 px-3 py-1 rounded-full text-sm">
                            <FaExclamationTriangle className="mr-1" />
                            Unsaved changes
                          </div>
                        )}
                      </div>
                      <div className="flex space-x-3">
                        <button
                          onClick={() => setShowReview(false)}
                          className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition flex items-center"
                        >
                          <FaArrowLeft className="mr-2" />
                          Back
                        </button>
                        <button
                          onClick={handleFinalImport}
                          className="px-6 py-2 bg-sky-500 rounded-lg text-white hover:bg-sky-600 transition flex items-center"
                          disabled={isImporting}
                        >
                          {isImporting ? (
                            <>
                              <FaSpinner className="animate-spin mr-2" />
                              Importing...
                            </>
                          ) : (
                            <>
                              <FaSave className="mr-2" />
                              Complete Import
                            </>
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
      </div>
    </AccountsLayout>
  );
};

export default ImportPage;