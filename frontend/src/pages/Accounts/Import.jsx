import React, { useState , useEffect} from 'react';
import AccountsLayout from './AccountsLayout';
import { 
  FaUpload, FaFilePdf, FaLink, FaTrash, FaQuestionCircle, 
  FaSpinner, FaCheckCircle, FaTimes, FaArrowLeft, 
  FaExclamationTriangle, FaSave, FaLock, FaFolderOpen,
  FaGlobe, FaDownload, FaArrowRight, FaFileAlt, FaExclamationCircle
} from 'react-icons/fa';

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


  const banks =  [
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

  // Import process
  const handleImport = async () => {
    if (files.length === 0 && !url) {
      setImportError('Please upload files or enter a URL');
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
        form.append('statement', files[0]);              // note: single-file
        form.append('accountId', selectedAccount);
        form.append('password', password);
        form.append('bankName', selectedBank.toLowerCase());    
              
        res = await fetch(
          `http://localhost:5000/api/classifier/upload-statement`,
          { method: 'POST',
           headers: { 'Accept': 'application/json' }, 
           body: form
         }
        );
      } else {
        // if you support URL-based upload server-side:
        res = await fetch(
          `http://localhost:5000/api/classifier/upload-statement-url`,
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

      // Map your DB rows into UI-friendly shape
      const txns = body.preview.map((tx) => {
        const match = categories.find(c => c.category_name === tx.predicted_category.toLowerCase());
        const id = match ? match.category_id : null;

        return {
          id: `${tx.accountId}-${tx.date}-${tx.description}-${Math.random().toString(36).substr(2, 9)}`, // unique ID
          accountId: tx.accountId,
          date: tx.date,
          description: tx.description,
          amount: tx.amount,
          direction: tx.direction,
          transaction_type: tx.transaction_type,
          category: tx.category_id,         // numeric ID
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


    // build the minimal feedback array
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
        `http://localhost:5000/api/classifier/confirm-statement`,
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
            recurringFlags: transactions.map(_ => false)  // or your real flags
          })
        }
      );

      const body = await res.json();
      if (!res.ok) throw new Error(body.error || 'Feedback save failed');

      setImportSuccess(true);
      setShowReview(false);
                
      //  send corrections to /feedback
      if (payload.feedbacks.length) {
        console.log('Feedback payload:', payload.feedbacks);
        fetch(
          `http://localhost:5000/api/classifier/feedback`,
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
    fetch(`http://localhost:5000/api/accounts/user/${userId}`)
      .then(r => r.json())
      .then(j => setAccounts(j.data))
      .catch(() => setAccounts([]));

    fetch(`http://localhost:5000/api/transactions/categories`)
      .then(r => r.json())
      .then(j => setCategories(j.data))
      .catch(() => setCategories([]));
  }, [userId]);

  if (!accounts) {
    return (
      <AccountsLayout>
        <div className="min-h-screen bg-gray-50 flex items-center justify-center">
          <div className="text-center">
            <h1 className="text-2xl font-bold text-gray-800 mb-4">Loading accounts...</h1>
            <p className="text-gray-600">Please wait while we fetch your accounts.</p>
          </div>
        </div>
      </AccountsLayout>
    );
  }

  return (
    <AccountsLayout>
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="w-full px-4 max-w-4xl mx-auto">
          <div className="border-2 border-gray-200 rounded-2xl bg-white shadow-sm overflow-hidden">
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
                    <h1 className="text-2xl md:text-3xl font-bold text-gray-800 mb-2">
                      Import Bank Statements
                    </h1>
                    <p className="text-gray-600">
                      Upload PDF statements to automatically extract and categorize transactions with <span className="font-bold text-[#83AB55]">AI</span>
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
                  <div className="bg-gray-50 p-5 rounded-xl mb-6">
                    <h2 className="text-lg font-semibold text-gray-800 mb-4">Import Settings</h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Destination Account <span className="text-red-500">*</span>
                        </label>
                        <select
                          className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-sky-400 focus:border-transparent"
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
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Bank <span className="text-red-500">*</span>
                        </label>
                        <select
                          className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-sky-400 focus:border-transparent"
                          value={selectedBank}
                          onChange={(e) => setSelectedBank(e.target.value)}
                          required
                        >
                          <option value="">Select your bank</option>
                          {banks.map(bank => (
                            <option key={bank.id} value={bank.id}>{bank.name}</option>
                          ))}
                        </select>
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          PDF Password (if required)
                        </label>
                        <div className="relative">
                          <input
                            type="password"
                            className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-sky-400 focus:border-transparent"
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
                    <h2 className="text-lg font-semibold text-gray-800 mb-3">Upload Statements</h2>
                    
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
                          {files.length > 0 ? 'Add more files' : 'Drag PDF statements here'}
                        </h3>
                        <p className="text-gray-500 text-sm">or</p>
                        <label className="cursor-pointer bg-sky-500 text-white px-4 py-2 rounded-lg hover:bg-sky-600 transition flex items-center">
                          <FaFolderOpen className="mr-2" />
                          <input
                            type="file"
                            className="hidden"
                            accept=".pdf"
                            multiple
                            onChange={handleFileChange}
                          />
                          Select Files
                        </label>
                        <p className="text-xs text-gray-500 mt-2">
                          PDF files only (max 10MB each)
                        </p>
                      </div>
                    </div>

                    {files.length > 0 && (
                      <div className="bg-gray-50 p-4 rounded-lg">
                        <h3 className="text-md font-medium text-gray-700 mb-3 flex items-center">
                          <FaFileAlt className="mr-2 text-gray-500" />
                          Files to Import ({files.length})
                        </h3>
                        <div className="space-y-2">
                          {files.map((file, index) => (
                            <div key={index} className="flex items-center justify-between bg-white p-3 rounded-lg border border-gray-200">
                              <div className="flex items-center space-x-3">
                                <FaFilePdf className="text-red-500" />
                                <div>
                                  <p className="text-sm font-medium text-gray-800">{file.name}</p>
                                  <p className="text-xs text-gray-500">{(file.size / (1024 * 1024)).toFixed(2)} MB</p>
                                </div>
                              </div>
                              <button
                                onClick={() => removeFile(index)}
                                className="text-gray-400 hover:text-red-500 p-1"
                                aria-label="Remove file"
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
                    <h2 className="text-md font-medium text-gray-700 mb-3 flex items-center">
                      <FaLink className="mr-2 text-gray-500" />
                      Or import from URL
                    </h2>
                    <div className="flex space-x-2">
                      <div className="flex-1 relative">
                        <input
                          type="text"
                          placeholder="https://yourbank.com/statement.pdf"
                          className="w-full border border-gray-300 rounded-lg px-4 py-2 pl-10 focus:ring-2 focus:ring-sky-400 focus:border-transparent"
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
                        className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition flex items-center"
                        disabled={isImporting}
                      >
                        <FaTimes className="mr-2" />
                        Cancel
                      </button>
                      <button
                        onClick={handleImport}
                        className={`px-6 py-2 rounded-lg text-white transition flex items-center ${(files.length > 0 || url) && selectedAccount && selectedBank ? 'bg-sky-500 hover:bg-sky-600' : 'bg-gray-400 cursor-not-allowed'}`}
                        disabled={!(files.length > 0 || url) || !selectedAccount || !selectedBank || isImporting}
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
                    <h1 className="text-2xl md:text-3xl font-bold text-gray-800 mb-2">
                      Review Transactions
                    </h1>
                    <p className="text-gray-600">
                      Verify and categorize the extracted transactions
                    </p>
                  </div>

                  <div className="bg-gray-50 p-4 rounded-xl mb-6">
                    <div className="overflow-x-auto">
                      <table className="min-w-full divide-y divide-gray-200 bg-white rounded-lg overflow-hidden">
                        <thead className="bg-gray-100">
                          <tr>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Description</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Amount</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Category</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Type</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-200">
                          {transactions.map((transaction) => (
                            <tr key={transaction.id} className="hover:bg-gray-50">
                              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                {transaction.date}
                              </td>
                              <td className="px-6 py-4 text-sm font-medium text-gray-900">
                                <input
                                  type="text"
                                  value={transaction.description}
                                  onChange={(e) => handleDescriptionChange(transaction.id, e.target.value)}
                                  className="border-b border-gray-300 focus:border-sky-400 focus:outline-none w-full"
                                />
                              </td>
                              <td className={`px-6 py-4 whitespace-nowrap text-sm font-medium ${transaction.amount < 0 ? 'text-red-500' : 'text-lime-600'}`}>
                                {transaction.amount < 0 ? `-$${Math.abs(transaction.amount).toFixed(2)}` : `$${transaction.amount.toFixed(2)}`}
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap">
                                <select
                                  value={transaction.category}
                                  onChange={(e) => handleCategoryChange(transaction.id, e.target.value)}
                                  className="text-sm border border-gray-300 rounded-md px-2 py-1 focus:ring-sky-400 focus:border-sky-500"
                                >
                                  {categories.map(category => (
                                    <option key={category} value={category}>{category}</option>
                                  ))}
                                </select>
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap">
                                <select
                                  value={transaction.type}
                                  onChange={(e) => handleTypeChange(transaction.id, e.target.value)}
                                  className="text-sm border border-gray-300 rounded-md px-2 py-1 focus:ring-sky-400 focus:border-sky-400"
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