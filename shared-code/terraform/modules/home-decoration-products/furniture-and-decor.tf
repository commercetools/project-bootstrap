resource "commercetools_product_type" "furniture-and-decor" {
  name        = "Furniture and decor"
  description = "items with color, fabric, size, finish and/or product spec attributes"
  key         = "furniture-and-decor"

  attribute {
    name = "productspec"
    label = {
      de-DE = "Produktspezifikationen",
      en-GB = "Product Specifications",
      it-IT = "specifiche del prodotto",
      ja-JP = "製品仕様",
      nl-NL = "product specificaties",
      fr-FR = "Spécifications du produit",
      en-AU = "Product Specifications",
      es-MX = "Especificaciones del producto",
      zh-CN = "产品规格",
      pt-PT = "especificações do produto",
      en-US = "Product Specifications",
      ar-AE = "مواصفات المنتج",
      en-CA = "Product Specifications",
      es-ES = "Especificaciones del producto",
      fr-CA = "Spécifications du produit",
    }
    required = false
    type {
      name = "ltext"
    }
    constraint = "SameForAll"
    searchable = false
    input_hint = "MultiLine"

  }

  attribute {
    name = "color"
    label = {
      de-DE = "Farbe",
      en-GB = "Color",
      it-IT = "Colore",
      ja-JP = "色",
      nl-NL = "Kleur",
      fr-FR = "Couleur",
      en-AU = "Color",
      es-MX = "Color",
      zh-CN = "颜色",
      pt-PT = "Cor",
      en-US = "Color",
      ar-AE = "لون",
      en-CA = "Color",
      es-ES = "Color",
      fr-CA = "Couleur",
    }
    required = false
    type {
      name = "ltext"
    }
    constraint = "None"
    searchable = false
    input_hint = "SingleLine"

  }

  attribute {
    name = "finish"
    label = {
      de-DE = "Fertig",
      en-GB = "Finish",
      it-IT = "Fine",
      ja-JP = "仕上げる",
      nl-NL = "Finish",
      fr-FR = "Finition",
      en-AU = "Finish",
      es-MX = "Finalizar",
      zh-CN = "结束",
      pt-PT = "Terminar",
      en-US = "Finish",
      ar-AE = "ينهي",
      en-CA = "Finish",
      es-ES = "Finalizar",
      fr-CA = "Finition",
    }
    required = false
    type {
      name = "ltext"
    }
    constraint = "None"
    searchable = false
    input_hint = "SingleLine"

  }

  attribute {
    name = "colorlabel"
    label = {
      de-DE = "Farbetikett",
      en-GB = "Color Label",
      it-IT = "Etichetta a colori",
      ja-JP = "カラーラベル",
      nl-NL = "Kleurlabel",
      fr-FR = "Étiquette de couleur",
      en-AU = "Color Label",
      es-MX = "Etiqueta de color",
      zh-CN = "颜色标签",
      pt-PT = "Etiqueta colorida",
      en-US = "Color Label",
      ar-AE = "تسمية اللون",
      en-CA = "Color Label",
      es-ES = "Etiqueta de color",
      fr-CA = "Étiquette de couleur",
    }
    required = false
    type {
      name = "ltext"
    }
    constraint = "None"
    searchable = true
    input_hint = "SingleLine"

  }

  attribute {
    name = "finishlabel"
    label = {
      de-DE = "Fertiges Etikett",
      en-GB = "Finish Label",
      it-IT = "Etichetta di finitura",
      ja-JP = "仕上げラベル",
      nl-NL = "Afwerkingslabel",
      fr-FR = "Terminer l'étiquette",
      en-AU = "Finish Label",
      es-MX = "Etiqueta de acabado",
      zh-CN = "完成标签",
      pt-PT = "Etiqueta de acabamento",
      en-US = "Finish Label",
      ar-AE = "تسمية النهاية",
      en-CA = "Finish Label",
      es-ES = "Etiqueta de acabado",
      fr-CA = "Terminer l'étiquette",
    }
    required = false
    type {
      name = "ltext"
    }
    constraint = "None"
    searchable = true
    input_hint = "SingleLine"

  }

  attribute {
    name = "new-arrival"
    label = {
      de-DE = "Neuankömmling",
      en-GB = "New Arrival",
      it-IT = "Nuovo arrivo",
      ja-JP = "新参者",
      nl-NL = "Nieuwe aankomst",
      fr-FR = "Nouvelle arrivee",
      en-AU = "New Arrival",
      es-MX = "Nueva llegada",
      zh-CN = "新品到货",
      pt-PT = "Nova chegada",
      en-US = "New Arrival",
      ar-AE = "قادم جديد",
      en-CA = "New Arrival",
      es-ES = "Nueva llegada",
      fr-CA = "Nouvelle arrivee",
    }
    required = false
    type {
      name = "boolean"
    }
    constraint = "None"
    searchable = false
    input_hint = "SingleLine"

  }

  attribute {
    name = "size"
    label = {
      de-DE = "Größe",
      en-GB = "Size",
      it-IT = "Misurare",
      ja-JP = "サイズ",
      nl-NL = "Maat",
      fr-FR = "Taille",
      en-AU = "Size",
      es-MX = "Tamaño",
      zh-CN = "尺寸",
      pt-PT = "Tamanho",
      en-US = "Size",
      ar-AE = "مقاس",
      en-CA = "Size",
      es-ES = "Tamaño",
      fr-CA = "Taille",
    }
    required = false
    type {
      name = "ltext"
    }
    constraint = "None"
    searchable = true
    input_hint = "SingleLine"

  }

  attribute {
    name = "product-description"
    label = {
      de-DE = "Produktbeschreibung",
      en-GB = "Product Description",
      it-IT = "Descrizione del prodotto",
      ja-JP = "製品説明",
      nl-NL = "Productomschrijving",
      fr-FR = "Description du produit",
      en-AU = "Product Description",
      es-MX = "Descripción del Producto",
      zh-CN = "产品描述",
      pt-PT = "Descrição do produto",
      en-US = "Product Description",
      ar-AE = "وصف المنتج",
      en-CA = "Product Description",
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
    name = "color-filter"
    label = {
      de-DE = "Farbfilter",
      en-GB = "Color Filter",
      it-IT = "Filtro colore",
      ja-JP = "カラーフィルター",
      nl-NL = "Kleurenfilter",
      fr-FR = "Filtre de couleur",
      en-AU = "Color Filter",
      es-MX = "Filtro de color",
      zh-CN = "彩色滤光片",
      pt-PT = "Filtro de cor",
      en-US = "Color Filter",
      ar-AE = "مرشح اللون",
      en-CA = "Color Filter",
      es-ES = "Filtro de color",
      fr-CA = "Filtre de couleur",
    }
    required = false
    type {
      name = "lenum"
      localized_value {
        key   = "#FFF"
        label = {
          de-DE = "Weiss",
          en-GB = "White",
          it-IT = "Bianco",
          ja-JP = "白",
          nl-NL = "Wit",
          fr-FR = "Blanc",
          en-AU = "White",
          es-MX = "Blanco",
          zh-CN = "白色的",
          pt-PT = "Branco",
          en-US = "White",
          ar-AE = "أبيض",
          en-CA = "White",
          es-ES = "Blanco",
          fr-CA = "Blanc",
                }
            }
      localized_value {
        key   = "#000"
        label = {
          de-DE = "Schwarz",
          en-GB = "Black",
          it-IT = "Nero",
          ja-JP = "黒",
          nl-NL = "Zwart",
          fr-FR = "Noir",
          en-AU = "Black",
          es-MX = "Negro",
          zh-CN = "黑色的",
          pt-PT = "Preto",
          en-US = "Black",
          ar-AE = "أسود",
          en-CA = "Black",
          es-ES = "Negro",
          fr-CA = "Noir",
                }
            }
      localized_value {
        key   = "#808080"
        label = {
          de-DE = "Grau",
          en-GB = "Gray",
          it-IT = "Grigio",
          ja-JP = "グレー",
          nl-NL = "Grijs",
          fr-FR = "Gris",
          en-AU = "Gray",
          es-MX = "Gris",
          zh-CN = "灰色的",
          pt-PT = "Cinza",
          en-US = "Gray",
          ar-AE = "رمادي",
          en-CA = "Gray",
          es-ES = "Gris",
          fr-CA = "Gris",
                }
            }
      localized_value {
        key   = "#0000FF"
        label = {
          de-DE = "Blau",
          en-GB = "Blue",
          it-IT = "Blu",
          ja-JP = "青",
          nl-NL = "Blauw",
          fr-FR = "Bleu",
          en-AU = "Blue",
          es-MX = "Azul",
          zh-CN = "蓝色的",
          pt-PT = "Azul",
          en-US = "Blue",
          ar-AE = "أزرق",
          en-CA = "Blue",
          es-ES = "Azul",
          fr-CA = "Bleu",
                }
            }
      localized_value {
        key   = "#00FF00"
        label = {
          de-DE = "Grün",
          en-GB = "Green",
          it-IT = "Verde",
          ja-JP = "緑",
          nl-NL = "Groente",
          fr-FR = "Vert",
          en-AU = "Green",
          es-MX = "Verde",
          zh-CN = "绿色的",
          pt-PT = "Verde",
          en-US = "Green",
          ar-AE = "أخضر",
          en-CA = "Green",
          es-ES = "Verde",
          fr-CA = "Vert",
                }
            }
      localized_value {
        key   = "#A020F0"
        label = {
          de-DE = "Lila",
          en-GB = "Purple",
          it-IT = "Viola",
          ja-JP = "紫",
          nl-NL = "Paars",
          fr-FR = "Violet",
          en-AU = "Purple",
          es-MX = "Púrpura",
          zh-CN = "紫色的",
          pt-PT = "Roxo",
          en-US = "Purple",
          ar-AE = "أرجواني",
          en-CA = "Purple",
          es-ES = "Púrpura",
          fr-CA = "Violet",
                }
            }
      localized_value {
        key   = "#C4A484"
        label = {
          de-DE = "Hellbraun",
          en-GB = "Light Brown",
          it-IT = "Marrone chiaro",
          ja-JP = "ライト・ブラウン",
          nl-NL = "Lichtbruin",
          fr-FR = "Brun clair",
          en-AU = "Light Brown",
          es-MX = "Marrón claro",
          zh-CN = "浅褐色",
          pt-PT = "Marrom claro",
          en-US = "Light Brown",
          ar-AE = "البني الفاتح",
          en-CA = "Light Brown",
          es-ES = "Marrón claro",
          fr-CA = "Brun clair",
                }
            }
      localized_value {
        key   = "#F5F5DC"
        label = {
          de-DE = "Beige",
          en-GB = "Beige",
          it-IT = "Beige",
          ja-JP = "ベージュ",
          nl-NL = "Beige",
          fr-FR = "Beige",
          en-AU = "Beige",
          es-MX = "Beige",
          zh-CN = "浅褐色的",
          pt-PT = "Bege",
          en-US = "Beige",
          ar-AE = "اللون البيج",
          en-CA = "Beige",
          es-ES = "Beige",
          fr-CA = "Beige",
                }
            }
      localized_value {
        key   = "#D2B48C"
        label = {
          de-DE = "Bräunen",
          en-GB = "Tan",
          it-IT = "Abbronzatura",
          ja-JP = "タン",
          nl-NL = "Bruinen",
          fr-FR = "bronzer",
          en-AU = "Tan",
          es-MX = "Broncearse",
          zh-CN = "谭",
          pt-PT = "bronzeado",
          en-US = "Tan",
          ar-AE = "تان",
          en-CA = "Tan",
          es-ES = "Broncearse",
          fr-CA = "bronzer",
                }
            }
      localized_value {
        key   = "#FFFFF0"
        label = {
          de-DE = "Elfenbein",
          en-GB = "Ivory",
          it-IT = "Avorio",
          ja-JP = "象牙",
          nl-NL = "ivoor",
          fr-FR = "Ivoire",
          en-AU = "Ivory",
          es-MX = "Marfil",
          zh-CN = "象牙",
          pt-PT = "Marfim",
          en-US = "Ivory",
          ar-AE = "عاج",
          en-CA = "Ivory",
          es-ES = "Marfil",
          fr-CA = "Ivoire",
                }
            }
      localized_value {
        key   = "#FFD700"
        label = {
          de-DE = "Gold",
          en-GB = "Gold",
          it-IT = "Oro",
          ja-JP = "金",
          nl-NL = "Goud",
          fr-FR = "Or",
          en-AU = "Gold",
          es-MX = "Oro",
          zh-CN = "金子",
          pt-PT = "Ouro",
          en-US = "Gold",
          ar-AE = "ذهب",
          en-CA = "Gold",
          es-ES = "Oro",
          fr-CA = "Or",
                }
            }
      localized_value {
        key   = "#964B00"
        label = {
          de-DE = "Dunkelbraun",
          en-GB = "Dark Brown",
          it-IT = "Marrone scuro",
          ja-JP = "ダークブラウン",
          nl-NL = "Donker bruin",
          fr-FR = "Marron foncé",
          en-AU = "Dark Brown",
          es-MX = "Marron oscuro",
          zh-CN = "深棕色",
          pt-PT = "Marrom escuro",
          en-US = "Dark Brown",
          ar-AE = "بني غامق",
          en-CA = "Dark Brown",
          es-ES = "Marron oscuro",
          fr-CA = "Marron foncé",
                }
            }
      localized_value {
        key   = "#C0C0C0"
        label = {
          de-DE = "Silber",
          en-GB = "Silver",
          it-IT = "Argento",
          ja-JP = "銀",
          nl-NL = "Zilver",
          fr-FR = "Argent",
          en-AU = "Silver",
          es-MX = "Plata",
          zh-CN = "银",
          pt-PT = "Prata",
          en-US = "Silver",
          ar-AE = "فضة",
          en-CA = "Silver",
          es-ES = "Plata",
          fr-CA = "Argent",
                }
            }
      localized_value {
        key   = "#FFC0CB"
        label = {
          de-DE = "Rosa",
          en-GB = "Pink",
          it-IT = "Rosa",
          ja-JP = "ピンク",
          nl-NL = "Roze",
          fr-FR = "Rose",
          en-AU = "Pink",
          es-MX = "Rosa",
          zh-CN = "粉色的",
          pt-PT = "Rosa",
          en-US = "Pink",
          ar-AE = "لون القرنفل",
          en-CA = "Pink",
          es-ES = "Rosa",
          fr-CA = "Rose",
                }
            }
      localized_value {
        key   = "#FFA500"
        label = {
          de-DE = "Orange",
          en-GB = "Orange",
          it-IT = "Arancia",
          ja-JP = "オレンジ",
          nl-NL = "Oranje",
          fr-FR = "Orange",
          en-AU = "Orange",
          es-MX = "Naranja",
          zh-CN = "橙子",
          pt-PT = "Laranja",
          en-US = "Orange",
          ar-AE = "البرتقالي",
          en-CA = "Orange",
          es-ES = "Naranja",
          fr-CA = "Orange",
                }
            }
    }
    constraint = "None"
    searchable = true
    input_hint = "SingleLine"

  }

}
