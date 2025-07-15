import { runProcess } from '../routes/classifierRouter';
import path from 'path';
import { ExtractorStrategy } from './extractor_strategy';

export class AbsaExtractor implements ExtractorStrategy {
  async extract(filePath: string, outPath: string, password = '') {
    await runProcess('python3', [
      path.resolve(__dirname, '../services/extractors/absa.py'),
      filePath,
      '--out', outPath,
      '--password', password
    ]);
  }
}