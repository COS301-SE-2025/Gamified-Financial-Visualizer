var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
import { Router } from 'express';
import { createTransaction, createBudget, getUserTransactions, getTotalSpentPerCategory } from '@shared-services/transactions.service';
import { logger } from '../config/logger';
console.log("Alias working:", createTransaction);
var router = Router();
router.post('/', function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var _a, account_id, category_id, transaction_amount, transaction_type, transaction_date, description, is_recurring, transaction, error_1;
    return __generator(this, function (_b) {
        switch (_b.label) {
            case 0:
                _b.trys.push([0, 2, , 3]);
                _a = req.body, account_id = _a.account_id, category_id = _a.category_id, transaction_amount = _a.transaction_amount, transaction_type = _a.transaction_type, transaction_date = _a.transaction_date, description = _a.description, is_recurring = _a.is_recurring;
                if (!account_id || !transaction_amount || !transaction_type || !description) {
                    res.status(400).json({
                        status: 'error',
                        message: 'Required fields: account_id, transaction_amount, transaction_type, description'
                    });
                }
                return [4, createTransaction({
                        account_id: account_id,
                        category_id: category_id,
                        transaction_amount: transaction_amount,
                        transaction_type: transaction_type,
                        transaction_date: transaction_date,
                        description: description,
                        is_recurring: is_recurring
                    })];
            case 1:
                transaction = _b.sent();
                res.status(201).json({
                    status: 'success',
                    message: 'Transaction created successfully',
                    data: transaction
                });
                return [3, 3];
            case 2:
                error_1 = _b.sent();
                logger.error('[Transaction] Create failed', error_1);
                res.status(500).json({ status: 'error', message: error_1.message || 'Internal server error' });
                return [3, 3];
            case 3: return [2];
        }
    });
}); });
router.post('/', function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var _a, user_id, budget_name, period_start, period_end, allocations, result, error_2;
    return __generator(this, function (_b) {
        switch (_b.label) {
            case 0:
                _a = req.body, user_id = _a.user_id, budget_name = _a.budget_name, period_start = _a.period_start, period_end = _a.period_end, allocations = _a.allocations;
                if (!user_id || !period_start || !period_end || !Array.isArray(allocations)) {
                    res.status(400).json({
                        status: 'error',
                        message: 'user_id, period_start, period_end, and target_amount are required.'
                    });
                }
                _b.label = 1;
            case 1:
                _b.trys.push([1, 3, , 4]);
                return [4, createBudget(user_id, budget_name, period_start, period_end, allocations)];
            case 2:
                result = _b.sent();
                res.status(201).json({
                    status: 'success',
                    message: 'Budget and category allocation created successfully.',
                    data: { budget_id: result }
                });
                return [3, 4];
            case 3:
                error_2 = _b.sent();
                logger.error('[Routes] Failed to create budget', error_2);
                res.status(500).json({ status: 'error', message: error_2.message || 'Internal server error' });
                return [3, 4];
            case 4: return [2];
        }
    });
}); });
router.get('/user/:userId', function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var userId, transactions, error_3;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                userId = req.params.userId;
                _a.label = 1;
            case 1:
                _a.trys.push([1, 3, , 4]);
                return [4, getUserTransactions(Number(userId))];
            case 2:
                transactions = _a.sent();
                res.status(200).json({ status: 'success', data: transactions });
                return [3, 4];
            case 3:
                error_3 = _a.sent();
                logger.error('[Routes] Failed to fetch user transactions', error_3);
                res.status(500).json({ status: 'error', message: 'Internal server error' });
                return [3, 4];
            case 4: return [2];
        }
    });
}); });
router.get('/user/:userId/summary', function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var userId, summary, error_4;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                userId = req.params.userId;
                _a.label = 1;
            case 1:
                _a.trys.push([1, 3, , 4]);
                return [4, getTotalSpentPerCategory(Number(userId))];
            case 2:
                summary = _a.sent();
                res.status(200).json({
                    status: 'success',
                    data: summary
                });
                return [3, 4];
            case 3:
                error_4 = _a.sent();
                logger.error('[Routes] Failed to fetch transaction summary', error_4);
                res.status(500).json({ status: 'error', message: 'Internal server error' });
                return [3, 4];
            case 4: return [2];
        }
    });
}); });
export default router;
