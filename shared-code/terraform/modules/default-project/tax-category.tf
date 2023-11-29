### Default Tax ###
resource "commercetools_tax_category" "vat-standard" {
  name        = "standard"
  key         = "vat-standard"
  description = "Standard VAT"
}

resource "commercetools_tax_category_rate" "vat-standard-de" {
  tax_category_id   = commercetools_tax_category.vat-standard.id
  name              = "vat-standard-de"
  amount            = 0.19
  included_in_price = true
  country           = "DE"
}

resource "commercetools_tax_category_rate" "vat-standard-nl" {
  tax_category_id   = commercetools_tax_category.vat-standard.id
  name              = "vat-standard-nl"
  amount            = 0.21
  included_in_price = true
  country           = "NL"
}

resource "commercetools_tax_category_rate" "vat-standard-gb" {
  tax_category_id   = commercetools_tax_category.vat-standard.id
  name              = "vat-standard-gb"
  amount            = 0.19
  included_in_price = true
  country           = "GB"
}

resource "commercetools_tax_category_rate" "vat-standard-us" {
  tax_category_id   = commercetools_tax_category.vat-standard.id
  name              = "vat-standard-us"
  amount            = 0.15
  included_in_price = true
  country           = "US"
}

resource "commercetools_tax_category_rate" "vat-standard-es" {
  tax_category_id   = commercetools_tax_category.vat-standard.id
  name              = "vat-standard-es"
  amount            = 0.21
  included_in_price = true
  country           = "ES"
}

resource "commercetools_tax_category_rate" "vat-standard-fr" {
  tax_category_id   = commercetools_tax_category.vat-standard.id
  name              = "vat-standard-fr"
  amount            = 0.20
  included_in_price = true
  country           = "FR"
}

resource "commercetools_tax_category_rate" "vat-standard-pt" {
  tax_category_id   = commercetools_tax_category.vat-standard.id
  name              = "vat-standard-pt"
  amount            = 0.23
  included_in_price = true
  country           = "PT"
}

resource "commercetools_tax_category_rate" "vat-standard-it" {
  tax_category_id   = commercetools_tax_category.vat-standard.id
  name              = "vat-standard-it"
  amount            = 0.22
  included_in_price = true
  country           = "IT"
}


