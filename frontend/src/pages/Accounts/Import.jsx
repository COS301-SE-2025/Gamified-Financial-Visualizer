import React, { useState , useEffect} from 'react';
import AccountsLayout from './AccountsLayout';
import { 
  FaUpload, FaFilePdf, FaLink, FaTrash, FaQuestionCircle, 
  FaSpinner, FaCheckCircle, FaTimes, FaArrowLeft, 
  FaExclamationTriangle, FaSave, FaLock, FaFolderOpen,
  FaGlobe, FaDownload, FaArrowRight, FaFileAlt, FaExclamationCircle,
  FaChevronLeft, FaChevronRight
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

  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const [transactionsPerPage] = useState(5);

  const banks = [
    { id: 'bank1', name: 'Nedbank' },
    { id: 'bank2', name: 'Standard Bank' },
    { id: 'bank3', name: 'FNB' },
    { id: 'bank4', name: 'Capitec' },
    { id: 'bank5', name: 'Absa' },
    { id: 'bank6', name: 'Old Mutual' }
  ];

  const transactionTypes = ['income', 'expense', 'transfer'];

  // Pagination calculations
  const indexOfLastTransaction = currentPage * transactionsPerPage;
  const indexOfFirstTransaction = indexOfLastTransaction - transactionsPerPage;
  const currentTransactions = transactions.slice(indexOfFirstTransaction, indexOfLastTransaction);
  const totalPages = Math.ceil(transactions.length / transactionsPerPage);

  // Pagination functions
  const nextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage(currentPage + 1);
    }
  };

  const prevPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };

  const goToPage = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  // Reset pagination when transactions change
  useEffect(() => {
    setCurrentPage(1);
  }, [transactions]);

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
    setCurrentPage(1);
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
          `http://localhost:5000/api/classifier/upload-statement`,
          { method: 'POST',
           headers: { 'Accept': 'application/json' }, 
           body: form
         }
        );
      } else {
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
            recurringFlags: transactions.map(_ => false)
          })
        }
      );

      const body = await res.json();
      if (!res.ok) throw new Error(body.error || 'Feedback save failed');

      setImportSuccess(true);
      setShowReview(false);
      setCurrentPage(1);
                
      if (payload.feedbacks.length) {
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
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-4 sm:py-6 lg:py-8">
        <div className="w-full px-4 sm:px-6 max-w-7xl mx-auto">
          <div className="border border-gray-200 dark:border-gray-700 rounded-lg sm:rounded-xl lg:rounded-2xl bg-white dark:bg-gray-800 shadow-sm lg:shadow-lg overflow-hidden">
            <div className="px-4 py-6 sm:px-6 sm:py-8 lg:px-8 lg:py-10">
              {/* Step Indicator */}
              <div className="flex justify-center mb-6 lg:mb-8">
                <div className="flex items-center">
                  <div className={`flex items-center justify-center w-8 h-8 sm:w-10 sm:h-10 rounded-full text-sm sm:text-base font-medium ${!showReview ? 'bg-sky-500 text-white' : 'bg-gray-200 text-gray-600'}`}>
                    1
                  </div>
                  <div className={`w-12 sm:w-20 h-0.5 sm:h-1 mx-2 sm:mx-3 ${!showReview ? 'bg-gray-300' : 'bg-sky-500'}`}></div>
                  <div className={`flex items-center justify-center w-8 h-8 sm:w-10 sm:h-10 rounded-full text-sm sm:text-base font-medium ${showReview ? 'bg-sky-500 text-white' : 'bg-gray-200 text-gray-600'}`}>
                    2
                  </div>
                </div>
              </div>

              {!showReview ? (
                <>
                  {/* Header */}
                  <div className="text-center mb-6 lg:mb-8">
                    <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-800 dark:text-white mb-2 sm:mb-3">
                      Import Bank Statements
                    </h1>
                    <p className="text-base sm:text-lg text-gray-600 dark:text-gray-400 max-w-3xl mx-auto">
                      Upload a PDF statement to automatically extract and categorize transactions with <span className="font-bold text-[#83AB55]">AI</span>
                    </p>
                  </div>

                  {/* Status Messages */}
                  {importError && (
                    <div className="mb-6 p-3 sm:p-4 bg-red-50 border-l-4 border-red-500 rounded-lg flex items-start">
                      <FaExclamationCircle className="text-red-500 mt-0.5 mr-2 sm:mr-3 flex-shrink-0 text-base sm:text-lg" />
                      <div className="flex-1">
                        <h3 className="font-medium text-red-800 text-base sm:text-lg">Error</h3>
                        <p className="text-red-700 text-sm sm:text-base">{importError}</p>
                      </div>
                    </div>
                  )}

                  {importSuccess && (
                    <div className="mb-6 p-3 sm:p-4 bg-green-50 border-l-4 border-green-500 rounded-lg flex items-start">
                      <FaCheckCircle className="text-green-500 mt-0.5 mr-2 sm:mr-3 flex-shrink-0 text-base sm:text-lg" />
                      <div className="flex-1">
                        <h3 className="font-medium text-green-800 text-base sm:text-lg">Success</h3>
                        <p className="text-green-700 text-sm sm:text-base">Transactions imported successfully</p>
                      </div>
                    </div>
                  )}

                  <div className="space-y-6 lg:space-y-8">
                    {/* Configuration Section */}
                    <div className="bg-gray-50 dark:bg-gray-700 p-4 sm:p-6 rounded-lg sm:rounded-xl">
                      <h2 className="text-lg sm:text-xl font-semibold text-gray-800 mb-4 sm:mb-5 dark:text-gray-200">Import Settings</h2>
                      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-5">
                        <div>
                          <label className="block text-sm sm:text-base font-medium text-gray-700 mb-2 sm:mb-3 dark:text-gray-300">
                            Destination Account <span className="text-red-500">*</span>
                          </label>
                          <select
                            className="w-full border border-gray-300 dark:bg-gray-800 dark:border-gray-600 rounded-lg px-3 sm:px-4 py-2 sm:py-3 text-sm sm:text-base focus:ring-2 focus:ring-sky-400 focus:border-transparent dark:text-white"
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
                          <label className="block text-sm sm:text-base font-medium text-gray-700 dark:text-gray-300 mb-2 sm:mb-3">
                            Bank <span className="text-red-500">*</span>
                          </label>
                          <select
                            className="w-full border border-gray-300 dark:bg-gray-800 dark:border-gray-600 rounded-lg px-3 sm:px-4 py-2 sm:py-3 text-sm sm:text-base focus:ring-2 focus:ring-sky-400 focus:border-transparent dark:text-white"
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

                        <div className="lg:col-span-2">
                          <label className="block text-sm sm:text-base font-medium text-gray-700 dark:text-gray-300 mb-2 sm:mb-3">
                            PDF Password (if required)
                          </label>
                          <div className="relative">
                            <input
                              type="password"
                              className="w-full border border-gray-300 dark:bg-gray-800 dark:border-gray-600 rounded-lg px-3 sm:px-4 py-2 sm:py-3 pr-10 text-sm sm:text-base focus:ring-2 focus:ring-sky-400 focus:border-transparent dark:text-white"
                              placeholder="Enter password"
                              value={password}
                              onChange={(e) => setPassword(e.target.value)}
                            />
                            <FaLock className="absolute right-3 sm:right-4 top-2.5 sm:top-3 text-gray-400 text-sm sm:text-base" />
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* File Upload Section */}
                    <div>
                      <h2 className="text-lg sm:text-xl font-semibold text-gray-800 dark:text-gray-200 mb-4">Upload Statement</h2>
                      
                      <div
                        className={`border-2 border-dashed rounded-lg sm:rounded-xl p-6 sm:p-8 mb-4 sm:mb-6 text-center transition-all ${isDragging ? 'border-sky-400 bg-blue-50' : 'border-gray-300 hover:border-sky-300'}`}
                        onDragEnter={handleDragEnter}
                        onDragOver={handleDragEnter}
                        onDragLeave={handleDragLeave}
                        onDrop={handleDrop}
                      >
                        <div className="flex flex-col items-center justify-center space-y-3 sm:space-y-4">
                          <div className="bg-blue-100 p-3 sm:p-4 rounded-full text-sky-500">
                            <FaUpload size={20} className="sm:w-6 sm:h-6" />
                          </div>
                          <h3 className="text-lg sm:text-xl font-medium text-gray-700">
                            {files.length > 0 ? 'Replace file' : 'Drag PDF statement here'}
                          </h3>
                          <p className="text-gray-500 text-base sm:text-lg">or</p>
                          <label className="cursor-pointer bg-sky-500 text-white px-4 sm:px-6 py-2 sm:py-3 rounded-lg hover:bg-sky-600 transition flex items-center text-sm sm:text-base">
                            <FaFolderOpen className="mr-2" />
                            <input
                              type="file"
                              className="hidden"
                              accept=".pdf"
                              onChange={handleFileChange}
                            />
                            Select File
                          </label>
                          <p className="text-sm sm:text-base text-gray-500 mt-2">
                            PDF file only (max 10MB)
                          </p>
                        </div>
                      </div>

                      {files.length > 0 && (
                        <div className="bg-gray-50 dark:bg-gray-700 p-4 sm:p-5 rounded-lg">
                          <h3 className="text-base sm:text-lg font-medium text-gray-700 dark:text-gray-200 mb-3 sm:mb-4 flex items-center">
                            <FaFileAlt className="mr-2 sm:mr-3 text-gray-500" />
                            File to Import
                          </h3>
                          <div className="space-y-2 sm:space-y-3">
                            {files.map((file, index) => (
                              <div key={index} className="flex items-center justify-between bg-white dark:bg-gray-800 p-3 sm:p-4 rounded-lg border border-gray-200 dark:border-gray-600">
                                <div className="flex items-center space-x-3 sm:space-x-4 flex-1 min-w-0">
                                  <FaFilePdf className="text-red-500 text-lg sm:text-xl flex-shrink-0" />
                                  <div className="min-w-0 flex-1">
                                    <p className="text-sm sm:text-base font-medium text-gray-800 dark:text-white truncate">{file.name}</p>
                                    <p className="text-xs sm:text-sm text-gray-500 dark:text-gray-400">{(file.size / (1024 * 1024)).toFixed(2)} MB</p>
                                  </div>
                                </div>
                                <button
                                  onClick={() => removeFile(index)}
                                  className="text-gray-400 hover:text-red-500 p-1 sm:p-2 flex-shrink-0"
                                  aria-label="Remove file"
                                >
                                  <FaTrash className="text-sm sm:text-base" />
                                </button>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>

                    {/* URL Import Section */}
                    <div>
                      <h2 className="text-base sm:text-lg font-medium text-gray-700 dark:text-gray-300 mb-3 sm:mb-4 flex items-center">
                        <FaLink className="mr-2 sm:mr-3 text-gray-500 dark:text-gray-400" />
                        Or import from URL
                      </h2>
                      <div className="flex flex-col sm:flex-row space-y-3 sm:space-y-0 sm:space-x-3">
                        <div className="flex-1 relative">
                          <input
                            type="text"
                            placeholder="https://yourbank.com/statement.pdf"
                            className="w-full border border-gray-300 dark:border-gray-600 rounded-lg px-3 sm:px-4 py-2 sm:py-3 pl-10 sm:pl-12 text-sm sm:text-base focus:ring-2 focus:ring-sky-400 focus:border-transparent dark:bg-gray-700 dark:text-white"
                            value={url}
                            onChange={(e) => setUrl(e.target.value)}
                          />
                          <FaGlobe className="absolute left-3 sm:left-4 top-2.5 sm:top-3 text-gray-400 text-sm sm:text-base" />
                        </div>
                        <button
                          className="bg-sky-500 text-white px-4 sm:px-6 py-2 sm:py-3 rounded-lg hover:bg-sky-600 transition flex items-center justify-center text-sm sm:text-base whitespace-nowrap"
                          onClick={() => url && handleImport()}
                          disabled={!url}
                        >
                          <FaDownload className="mr-2" />
                          Fetch
                        </button>
                      </div>
                    </div>

                    {/* Help Section */}
                    <div className="border-t pt-6 sm:pt-8">
                      <div className="flex items-start text-sm sm:text-base text-gray-500 mb-6 sm:mb-8">
                        <div className="bg-blue-100 p-2 sm:p-3 rounded-full text-sky-500 mr-3 sm:mr-4 flex-shrink-0">
                          <FaQuestionCircle className="text-sm sm:text-base" />
                        </div>
                        <div className="flex-1">
                          <p className="font-medium text-gray-700 dark:text-gray-300 mb-1 sm:mb-2 text-base sm:text-lg">Need help?</p>
                          <p className="text-sm sm:text-base text-gray-600 dark:text-gray-400">
                            We support PDFs from most major banks. If your bank is not listed, please contact support. <br />
                            All statements are processed securely, privately and never stored on the system nor shared to third parties.
                          </p>
                        </div>
                      </div>

                      {/* Import Button */}
                      <div className="flex justify-center">
                        <button
                          onClick={handleImport}
                          className={`px-6 sm:px-8 py-3 sm:py-4 rounded-lg text-white transition flex items-center text-sm sm:text-base w-full sm:w-auto justify-center ${
                          (files.length > 0 || url) && selectedAccount && selectedBank 
                            ? 'bg-sky-500 hover:bg-sky-600' 
                            : 'bg-gray-400 dark:bg-gray-600 cursor-not-allowed'
                        }`}
                          disabled={!(files.length === 1 || url) || !selectedAccount || !selectedBank || isImporting}
                        >
                          {isImporting ? (
                            <>
                              <FaSpinner className="animate-spin mr-2 sm:mr-3" />
                              Processing...
                            </>
                          ) : (
                            <>
                              <FaArrowRight className="mr-2 sm:mr-3" />
                              Review Transactions
                            </>
                          )}
                        </button>
                      </div>
                    </div>
                  </div>
                </>
              ) : (
                <>
                  {/* Review Section */}
                  <div className="mb-6 sm:mb-8">
                    <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-800 dark:text-white mb-2 sm:mb-3">
                      Review Transactions
                    </h1>
                    <p className="text-base sm:text-lg text-gray-600 dark:text-gray-400">
                      Verify and categorize the extracted transactions ({transactions.length} total)
                    </p>
                  </div>

                  {/* Mobile Transactions List */}
                  <div className="lg:hidden mb-6 sm:mb-8">
                    <div className="space-y-4 sm:space-y-5">
                      {currentTransactions.map((transaction) => (
                        <div key={transaction.id} className="bg-gray-50 dark:bg-gray-700 p-4 sm:p-5 rounded-lg">
                          <div className="grid grid-cols-2 gap-3 sm:gap-4 mb-3 sm:mb-4">
                            <div>
                              <span className="text-xs sm:text-sm text-gray-500 dark:text-gray-400 uppercase tracking-wide">Date</span>
                              <p className="text-sm sm:text-base font-medium text-gray-800 dark:text-white">{transaction.date}</p>
                            </div>
                            <div>
                              <span className="text-xs sm:text-sm text-gray-500 dark:text-gray-400 uppercase tracking-wide">Amount</span>
                              <p className={`text-sm sm:text-base font-medium ${
                                transaction.amount < 0 
                                  ? 'text-red-600 dark:text-red-400' 
                                  : 'text-green-600 dark:text-green-400'
                              }`}>
                                {transaction.amount < 0 ? `-$${Math.abs(transaction.amount).toFixed(2)}` : `$${transaction.amount.toFixed(2)}`}
                              </p>
                            </div>
                          </div>
                          
                          <div className="mb-3 sm:mb-4">
                            <span className="text-xs sm:text-sm text-gray-500 dark:text-gray-400 uppercase tracking-wide">Description</span>
                            <p className="text-sm sm:text-base font-medium text-gray-800 dark:text-white break-words">{transaction.description}</p>
                          </div>
                          
                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                            <div>
                              <span className="text-xs sm:text-sm text-gray-500 dark:text-gray-400 uppercase tracking-wide">Category</span>
                              <select
                                value={transaction.category}
                                onChange={(e) => handleCategoryChange(transaction.id, Number(e.target.value))}
                                className="w-full border border-gray-300 dark:border-gray-600 rounded px-2 sm:px-3 py-1.5 sm:py-2 text-xs sm:text-sm dark:bg-gray-600 dark:text-white mt-1"
                              >
                                {categories.map(category => (
                                  <option key={category.category_id} value={category.category_id}>{category.category_name}</option>
                                ))}
                              </select>
                            </div>
                            <div>
                              <span className="text-xs sm:text-sm text-gray-500 dark:text-gray-400 uppercase tracking-wide">Type</span>
                              <select
                                value={transaction.transaction_type}
                                onChange={(e) => handleTypeChange(transaction.id, e.target.value)}
                                className="w-full border border-gray-300 dark:border-gray-600 rounded px-2 sm:px-3 py-1.5 sm:py-2 text-xs sm:text-sm dark:bg-gray-600 dark:text-white mt-1"
                              >
                                {transactionTypes.map(type => (
                                  <option key={type} value={type}>{type}</option>
                                ))}
                              </select>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>

                    {/* Mobile Pagination */}
                    {transactions.length > transactionsPerPage && (
                      <div className="flex justify-center items-center mt-6 space-x-2">
                        <button
                          onClick={prevPage}
                          disabled={currentPage === 1}
                          className={`flex items-center justify-center w-8 h-8 sm:w-10 sm:h-10 rounded-lg ${
                            currentPage === 1 
                              ? 'bg-gray-100 text-gray-300 cursor-not-allowed' 
                              : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                          }`}
                        >
                          <FaChevronLeft className="text-xs sm:text-sm" />
                        </button>
                        
                        {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                          let pageNumber;
                          if (totalPages <= 5) {
                            pageNumber = i + 1;
                          } else if (currentPage <= 3) {
                            pageNumber = i + 1;
                          } else if (currentPage >= totalPages - 2) {
                            pageNumber = totalPages - 4 + i;
                          } else {
                            pageNumber = currentPage - 2 + i;
                          }
                          
                          return (
                            <button
                              key={pageNumber}
                              onClick={() => goToPage(pageNumber)}
                              className={`w-8 h-8 sm:w-10 sm:h-10 rounded-lg text-xs sm:text-sm font-medium transition-colors ${
                                currentPage === pageNumber
                                  ? 'bg-sky-100 text-sky-600 border border-sky-200'
                                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                              }`}
                            >
                              {pageNumber}
                            </button>
                          );
                        })}
                        
                        <button
                          onClick={nextPage}
                          disabled={currentPage === totalPages}
                          className={`flex items-center justify-center w-8 h-8 sm:w-10 sm:h-10 rounded-lg ${
                            currentPage === totalPages 
                              ? 'bg-gray-100 text-gray-300 cursor-not-allowed' 
                              : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                          }`}
                        >
                          <FaChevronRight className="text-xs sm:text-sm" />
                        </button>
                      </div>
                    )}
                  </div>

                  {/* Desktop Transactions Table */}
                  <div className="hidden lg:block">
                    <div className="overflow-x-auto mb-6 bg-white dark:bg-gray-800 rounded-lg shadow">
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
                          {currentTransactions.map((transaction) => (
                            <tr key={transaction.id} className="hover:bg-gray-50 dark:hover:bg-gray-700">
                              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                                {transaction.date}
                              </td>
                              <td className="px-6 py-4 text-sm font-medium text-gray-900 dark:text-white max-w-xs">
                                <div className="truncate" title={transaction.description}>
                                  {transaction.description}
                                </div>
                              </td>
                              <td className={`px-6 py-4 whitespace-nowrap text-sm font-medium ${
                                transaction.amount < 0 
                                  ? 'text-red-600 dark:text-red-400' 
                                  : 'text-green-600 dark:text-green-400'
                              }`}>
                                {transaction.amount < 0 ? `-${Math.abs(transaction.amount).toFixed(2)}` : `${transaction.amount.toFixed(2)}`}
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap">
                                <select
                                  value={transaction.category}
                                  onChange={(e) => handleCategoryChange(transaction.id, Number(e.target.value))}
                                  className="border border-gray-300 dark:border-gray-600 rounded px-3 py-2 text-sm dark:bg-gray-700 dark:text-white w-full max-w-xs"
                                >
                                  {categories.map(category => (
                                    <option key={category.category_id} value={category.category_id}>{category.category_name}</option>
                                  ))}
                                </select>
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap">
                                <select
                                  value={transaction.transaction_type}
                                  onChange={(e) => handleTypeChange(transaction.id, e.target.value)}
                                  className="border border-gray-300 dark:border-gray-600 rounded px-3 py-2 text-sm dark:bg-gray-700 dark:text-white w-full max-w-xs"
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

                    {/* Desktop Pagination */}
                    {transactions.length > transactionsPerPage && (
                      <div className="flex justify-between items-center mb-6">
                        <div>
                          <p className="text-sm text-gray-600 dark:text-gray-400">
                            Showing {indexOfFirstTransaction + 1} to {Math.min(indexOfLastTransaction, transactions.length)} of {transactions.length} transactions
                          </p>
                        </div>
                        
                        <div className="flex items-center space-x-2">
                          <button
                            onClick={prevPage}
                            disabled={currentPage === 1}
                            className={`flex items-center justify-center w-10 h-10 rounded-lg ${
                              currentPage === 1 
                                ? 'bg-gray-100 text-gray-300 cursor-not-allowed' 
                                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                            }`}
                          >
                            <FaChevronLeft className="text-sm" />
                          </button>
                          
                          {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                            let pageNumber;
                            if (totalPages <= 5) {
                              pageNumber = i + 1;
                            } else if (currentPage <= 3) {
                              pageNumber = i + 1;
                            } else if (currentPage >= totalPages - 2) {
                              pageNumber = totalPages - 4 + i;
                            } else {
                              pageNumber = currentPage - 2 + i;
                            }
                            
                            return (
                              <button
                                key={pageNumber}
                                onClick={() => goToPage(pageNumber)}
                                className={`w-10 h-10 rounded-lg text-sm font-medium transition-colors ${
                                  currentPage === pageNumber
                                    ? 'bg-sky-100 text-sky-600 border border-sky-200'
                                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                                }`}
                              >
                                {pageNumber}
                              </button>
                            );
                          })}
                          
                          <button
                            onClick={nextPage}
                            disabled={currentPage === totalPages}
                            className={`flex items-center justify-center w-10 h-10 rounded-lg ${
                              currentPage === totalPages 
                                ? 'bg-gray-100 text-gray-300 cursor-not-allowed' 
                                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                            }`}
                          >
                            <FaChevronRight className="text-sm" />
                          </button>
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Action Buttons */}
                  <div className="border-t pt-6 sm:pt-8">
                    <div className="flex flex-col lg:flex-row lg:justify-between lg:items-center space-y-4 lg:space-y-0">
                      <div>
                        {hasChanges && (
                          <div className="flex items-center text-yellow-600 bg-yellow-50 px-3 sm:px-4 py-2 rounded-full text-sm sm:text-base">
                            <FaExclamationTriangle className="mr-2 flex-shrink-0" />
                            <span>Unsaved changes</span>
                          </div>
                        )}
                      </div>
                      <div className="flex flex-col sm:flex-row space-y-3 sm:space-y-0 sm:space-x-4">
                        <button
                          onClick={() => setShowReview(false)}
                          className="px-4 sm:px-6 py-2 sm:py-3 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition flex items-center justify-center text-sm sm:text-base"
                        >
                          <FaArrowLeft className="mr-2 sm:mr-3" />
                          Back
                        </button>
                        <button
                          onClick={handleFinalImport}
                          className="px-6 sm:px-8 py-2 sm:py-3 bg-sky-500 rounded-lg text-white hover:bg-sky-600 transition flex items-center justify-center text-sm sm:text-base"
                          disabled={isImporting}
                        >
                          {isImporting ? (
                            <>
                              <FaSpinner className="animate-spin mr-2 sm:mr-3" />
                              Importing...
                            </>
                          ) : (
                            <>
                              <FaSave className="mr-2 sm:mr-3" />
                              Complete Import ({transactions.length} transactions)
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