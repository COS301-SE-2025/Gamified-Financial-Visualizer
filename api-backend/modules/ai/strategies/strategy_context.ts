// src/classifier/ExtractorContext.ts
import { ExtractorStrategy } from './extractor_strategy';
import { NedbankExtractor } from './nedbank_extractor';
import { StandardBankExtractor } from './standardbank_extractor';
import { FNBExtractor } from './fnb_extractor';
import { AbsaExtractor } from './absa_extractor';
import { OldMutualExtractor } from './oldmutual_extractor';
import { CapitecExtractor } from './capitec_extractor';

export class ExtractorContext {
   private strategy: ExtractorStrategy;

   constructor(bankId: string) {
      switch (bankId) {
         case 'nedbank':  // Nedbank
            this.strategy = new NedbankExtractor();
            break;
         case 'standard bank':  // Standard Bank
            this.strategy = new StandardBankExtractor();
            break;
         case 'fnb':  // First National Bank
            this.strategy = new FNBExtractor();
            break;
         case 'absa':  // Absa Bank
            this.strategy = new AbsaExtractor();
            break;
         case 'old mutual':  // Old Mutual
            this.strategy = new OldMutualExtractor();
            break;
         case 'capitec':  // Capitec Bank
            this.strategy = new CapitecExtractor();
            break;
         // Add more cases for other banks as needed
         default:
            // fallback to a generic extractor
            this.strategy = new NedbankExtractor();
      }
   }

   async extract(filePath: string, outPath: string, password?: string) {
      return this.strategy.extract(filePath, outPath, password);
   }
}