import { runProcess } from '../routes/classifierRouter';
import path from 'path';
import { ExtractorStrategy } from './extractor_strategy';
import {logger} from '../../../config/logger';

export class CapitecExtractor implements ExtractorStrategy {
  async extract(filePath: string, outPath: string, password = '') {
    logger.info(`Capitec Extractor: Extracting file ${filePath} to ${outPath}`);
    await runProcess('python3', [
      path.resolve(__dirname, '../app/classifier//services/extractors/capitec.py'),
      filePath,
      '--out', outPath,
      '--password', password
    ]);
  }
}