resource "commercetools_product_type" "product-sets" {
  name        = "Product sets"
  description = "products also sold as sets with their variants"
  key         = "product-sets"

  attribute {
    name = "type"
    label = {
      de-DE = "Typ",
      en-GB = "Type",
      it-IT = "Tipo",
      ja-JP = "タイプ",
      nl-NL = "Type",
      fr-FR = "Taper",
      en-AU = "Type",
      es-MX = "Tipo",
      zh-CN = "类型",
      pt-PT = "Tipo",
      en-US = "Type",
      ar-AE = "يكتب",
      en-CA = "Type",
      es-ES = "Tipo",
      fr-CA = "Taper",
    }
    required = false
    type {
      name = "set"
      element_type {
        name = "ltext"
      }
    }
    constraint = "None"
    searchable = true
    input_hint = "SingleLine"

  }

}
