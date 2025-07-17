// src/classifier/strategies/StandardBankExtractor.ts
import { runProcess } from '../routes/classifierRouter';
import path from 'path';
import { ExtractorStrategy } from './extractor_strategy';
import {logger} from '../../../config/logger';

export class StandardBankExtractor implements ExtractorStrategy {
  async extract(filePath: string, outPath: string, password = '') {
    logger.info(`Standard Bank Extractor: Extracting file ${filePath} to ${outPath}`);
    await runProcess('python3', [
      path.resolve(__dirname, '../app/services/extractors/standard_bank.py'),
      filePath,
      '--out', outPath,
      '--password', password
    ]);
  }
}