resource "commercetools_type" "paymenttype" {
  key = "paymenttype"
  name = {
    en-GB = "Payment Additional Fields", en-US = "Payment Additional Fields", nl-NL = "Betaling extra velden", de-DE = "Zahlen zusätzliche Felder",
    fr-FR = "Paiement champs supplémentaires", it-IT = "Pagamento di campi aggiuntivi",
    es-ES = "Pago de campos adicionales", pt-PT = "Pagamento de campos adicionais"
  }
  description = {
    en-GB = "Payment custom type.", en-US = "Payment custom type.", nl-NL = "Betaling Custom Type.", de-DE = "Zahlungsmaßstabsart Typ.",
    fr-FR = "Type personnalisé de paiement.", it-IT = "Tipo personalizzato di pagamento.",
    es-ES = "Tipo personalizado de pago.", pt-PT = "Pagamento Tipo personalizado."
  }

  resource_type_ids = ["payment"]

  field {
    name = "cardSummary"
    label = {
      en-GB = "Card Summary", en-US = "Card Summary", nl-NL = "Samenvatting van de kaart", de-DE = "Kartenzusammenfassung",
      fr-FR = "Résumé de la carte", it-IT = "Riepilogo della carta", es-ES = "Resumen de cartas",
      pt-PT = "Resumo do cartão"
    }
    required = false
    type {
      name = "String"
    }
    input_hint = "SingleLine"
  }
}
