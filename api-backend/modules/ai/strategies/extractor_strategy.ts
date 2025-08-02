// src/classifier/strategies/ExtractorStrategy.ts
export interface ExtractorStrategy {
  extract(
    filePath: string,
    outPath: string,
    password?: string
  ): Promise<void>;
}