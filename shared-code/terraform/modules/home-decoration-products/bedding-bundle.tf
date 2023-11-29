resource "commercetools_product_type" "bedding-bundle" {
  name        = "Bedding Bundle"
  description = "Product type used to bundle bedding components"
  key         = "bedding-bundle"

  attribute {
    name = "product-description"
    label = {
      de-DE = "Produktbeschreibung",
      en-GB = "product-description",
      it-IT = "Descrizione del prodotto",
      ja-JP = "製品説明",
      nl-NL = "Productomschrijving",
      fr-FR = "Description du produit",
      en-AU = "product-description",
      es-MX = "Descripción del Producto",
      zh-CN = "产品描述",
      pt-PT = "Descrição do produto",
      en-US = "product-description",
      ar-AE = "وصف المنتج",
      en-CA = "product-description",
      es-ES = "Descripción del Producto",
      fr-CA = "Description du produit",
    }
    required = false
    type {
      name = "ltext"
    }
    constraint = "SameForAll"
    searchable = false
    input_hint = "SingleLine"

  }

  attribute {
    name = "product-spec"
    label = {
      de-DE = "Produktspezifikation",
      en-GB = "Product Spec",
      it-IT = "Specifiche del prodotto",
      ja-JP = "製品仕様",
      nl-NL = "Productspecificatie",
      fr-FR = "Spécification du produit",
      en-AU = "Product Spec",
      es-MX = "Especificaciones del producto",
      zh-CN = "产品规格",
      pt-PT = "Especificações do produto",
      en-US = "Product Spec",
      ar-AE = "مواصفات المنتج",
      en-CA = "Product Spec",
      es-ES = "Especificaciones del producto",
      fr-CA = "Spécification du produit",
    }
    required = false
    type {
      name = "ltext"
    }
    constraint = "SameForAll"
    searchable = false
    input_hint = "SingleLine"

  }

  attribute {
    name = "product-ref"
    label = {
      de-DE = "Produkte dieses Bundles",
      en-GB = "Products of this bundle",
      it-IT = "Prodotti di questo pacchetto",
      ja-JP = "このバンドルの製品",
      nl-NL = "Producten uit deze bundel",
      fr-FR = "Produits de ce pack",
      en-AU = "Products of this bundle",
      es-MX = "Productos de este paquete",
      zh-CN = "该捆绑包的产品",
      pt-PT = "Produtos deste pacote",
      en-US = "Products of this bundle",
      ar-AE = "منتجات هذه الحزمة",
      en-CA = "Products of this bundle",
      es-ES = "Productos de este paquete",
      fr-CA = "Produits de ce pack",
    }
    required = false
    type {
      name = "set"
      element_type {
        name = "reference"
        reference_type_id = "product"
      }
    }
    constraint = "None"
    searchable = false
    input_hint = "SingleLine"

  }

}
