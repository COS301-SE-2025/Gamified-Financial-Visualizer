import React, { use, useState, useEffect } from 'react';
import AccountsLayout from './AccountsLayout';
import { FaUpload, FaFilePdf, FaLink, FaTrash, FaQuestionCircle, FaSpinner, FaCheck, FaTimes, FaEdit } from 'react-icons/fa';

const ImportPage = () => {
  const userData = JSON.parse(localStorage.getItem('user') || '{}');
  const userId = userData?.id || null;

  // File upload state
  const [files, setFiles] = useState([]);
  const [url, setUrl] = useState('');
  const [isDragging, setIsDragging] = useState(false);

  // Import configuration state
  const [accounts, setAccounts] = useState(null);
  const [categories, setCategories] = useState([]); // Add categories state
  const [selectedAccount, setSelectedAccount] = useState('');
  const [selectedBank, setSelectedBank] = useState('');
  const [password, setPassword] = useState('');

  // Import process state
  const [isImporting, setIsImporting] = useState(false);
  const [importError, setImportError] = useState(null);
  const [importSuccess, setImportSuccess] = useState(false);
  const [showReview, setShowReview] = useState(false);

  // Mock transaction data for review
  const [transactions, setTransactions] = useState([]);

  // banks supported by the extraction service
  const banks = [
    { id: 'bank1', name: 'Nedbank' },
    { id: 'bank2', name: 'Standard Bank' },
    { id: 'bank3', name: 'FNB' },
    { id: 'bank4', name: 'Capitec' },
    { id: 'bank5', name: 'Absa' },
    { id: 'bank6', name: 'Old Mutual' }
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

  // 1) process the PDF upload (or URL)
  const handleImport = async () => {
    if ((!files.length && !url) || !selectedAccount || !selectedBank) return;
    setIsImporting(true);
    setImportError(null);

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
          { method: 'POST', body: form }
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
      console.log('Transactions to review:', txns);
      setTransactions(txns);
      setShowReview(true);
    } catch (err) {
      setImportError(err.message);
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

  const hasChanges = transactions.some(tx =>
    tx.category !== tx.originalCategory || tx.type !== tx.originalType
  );

  // 2) send back just the changed rows as feedback
  const handleConfirmChanges = async () => {
    setIsImporting(true);
    setImportError(null);

    const feedbacks = [];

    // build the minimal feedback array
    const payload = {
      feedbacks: transactions
        .filter(tx => tx.category !== tx.originalCategory)
        .map(tx => ({
          transactionId: tx.id,
          corrected_category: (categories.find(c => c.category_id === tx.category) || {}).category_name
        }))
    };

    //  send corrections to /feedback
    if (feedbacks.length) {
      const fbRes = await fetch(
        `http://localhost:5000/api/classifier/feedback`,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ feedback: payload.feedbacks })
        }
      );
      if (!fbRes.ok) throw new Error('Failed to save feedback');
    }

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
    } catch (err) {
      setImportError(err.message);
    } finally {
      setIsImporting(false);
    }
  };

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
                        <option key={account.account_id} value={account.account_id}>{account.account_name}</option>
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
                        <option key={bank.id} value={bank.name}>{bank.name}</option>
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
                {/* Transactions Table Preview */}
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
                            {transaction.amount < 0 ? `${Math.abs(transaction.amount)}` : `${transaction.amount}`}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            <select
                              value={transaction.category}
                              onChange={(e) => handleCategoryChange(transaction.id, e.target.value)}
                              className="border border-gray-300 rounded px-2 py-1"
                            >
                              {categories.map(category => (
                                <option key={category.category_id} value={category.category_id}>{category.category_name}</option>
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
                    <div className="flex space-x-3">
                      <button
                        onClick={() => setShowReview(false)}
                        className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition"
                      >
                        Back
                      </button>
                      <button
                        onClick={handleConfirmChanges}
                        className={`px-6 py-2 rounded-lg text-white transition flex items-center justify-center ${hasChanges ? 'bg-green-600 hover:bg-green-700' : 'bg-blue-600 hover:bg-blue-700'}`}
                        disabled={isImporting}
                      >
                        {isImporting ? (
                          <>
                            <FaSpinner className="animate-spin mr-2" />
                            Importing...
                          </>
                        ) : hasChanges ? (
                          <>
                            <FaCheck className="mr-2" />
                            Confirm Changes
                          </>
                        ) : (
                          'Import Transactions'
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