def get_extractor(bank_name):
   match bank_name.lower():
      case "nedbank":
         from extractors.nedbank import extract
      case "fnb":
         from extractors.fnb import extract
      case "absa":
         from extractors.absa import extract
      case "capitec":
         from extractors.capitec import extract
      case "standard bank":
         from extractors.standard_bank import extract
      case "old mutual":
         from extractors.old_mutual import extract
      case _:
         raise ValueError(f"No extractor for bank: {bank_name}")
   return extract