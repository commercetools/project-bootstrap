resource "commercetools_shipping_method" "standard-shipping-method" {
  key  = "standard-shipping-method"
  name = "Standard shipping method"
  localized_description = {
    en-GB = "Standard shipping method",
    en-US = "Standard shipping method",
    nl-NL = "Standaard verzendmethode",
    de-DE = "Standardversandmethode",
    fr-FR = "Méthode d'expédition standard",
    it-IT = "Metodo di spedizione standard",
    es-ES = "Método de envío estándar",
    pt-PT = "Método de envio padrão"
  }
  is_default      = true
  tax_category_id = commercetools_tax_category.vat-standard.id
}

resource "commercetools_shipping_zone_rate" "benelux-zone-rate" {
  shipping_method_id = commercetools_shipping_method.standard-shipping-method.id
  shipping_zone_id   = commercetools_shipping_zone.benelux.id
  price {
    cent_amount   = 500
    currency_code = "EUR"
  }
  free_above {
    cent_amount   = 5000
    currency_code = "EUR"
  }
  depends_on = [
    commercetools_shipping_zone.benelux,
    commercetools_shipping_method.standard-shipping-method
  ]
}

resource "commercetools_shipping_zone_rate" "north-america-zone-rate" {
  shipping_method_id = commercetools_shipping_method.standard-shipping-method.id
  shipping_zone_id   = commercetools_shipping_zone.north-america.id
  price {
    cent_amount   = 500
    currency_code = "USD"
  }
  free_above {
    cent_amount   = 5000
    currency_code = "USD"
  }
  depends_on = [
    commercetools_shipping_zone.north-america,
    commercetools_shipping_method.standard-shipping-method
  ]
}

resource "commercetools_shipping_zone_rate" "great-britain-zone-rate" {
  shipping_method_id = commercetools_shipping_method.standard-shipping-method.id
  shipping_zone_id   = commercetools_shipping_zone.great-britain.id
  price {
    cent_amount   = 500
    currency_code = "GBP"
  }
  free_above {
    cent_amount   = 5000
    currency_code = "GBP"
  }
  depends_on = [
    commercetools_shipping_zone.great-britain,
    commercetools_shipping_method.standard-shipping-method
  ]
}

resource "commercetools_shipping_zone_rate" "europe-central-zone-rate" {
  shipping_method_id = commercetools_shipping_method.standard-shipping-method.id
  shipping_zone_id   = commercetools_shipping_zone.europe-central.id
  price {
    cent_amount   = 500
    currency_code = "EUR"
  }
  free_above {
    cent_amount   = 5000
    currency_code = "EUR"
  }
  depends_on = [
    commercetools_shipping_zone.europe-central,
    commercetools_shipping_method.standard-shipping-method
  ]
}

resource "commercetools_shipping_zone_rate" "europe-south-zone-rate" {
  shipping_method_id = commercetools_shipping_method.standard-shipping-method.id
  shipping_zone_id   = commercetools_shipping_zone.europe-south.id
  price {
    cent_amount   = 500
    currency_code = "EUR"
  }
  free_above {
    cent_amount   = 5000
    currency_code = "EUR"
  }
  depends_on = [
    commercetools_shipping_zone.europe-south,
    commercetools_shipping_method.standard-shipping-method
  ]
}

resource "commercetools_shipping_method" "premium-shipping-method" {
  key  = "premium-shipping-method"
  name = "Premium shipping method"
  localized_description = {
    en-GB = "Premium shipping method", nl-NL = "Premium verzendmethode", de-DE = "Premium -Versandmethode",
    fr-FR = "Méthode d'expédition premium", it-IT = "Metodo di spedizione premium", es-ES = "Método de envío premium",
    pt-PT = "Método de envio premium", en-US = "Premium shipping method"
  }
  tax_category_id = commercetools_tax_category.vat-standard.id
}

resource "commercetools_shipping_zone_rate" "premium-benelux-zone-rate" {
  shipping_method_id = commercetools_shipping_method.premium-shipping-method.id
  shipping_zone_id   = commercetools_shipping_zone.benelux.id
  price {
    cent_amount   = 1000
    currency_code = "EUR"
  }
  free_above {
    cent_amount   = 10000
    currency_code = "EUR"
  }
  depends_on = [
    commercetools_shipping_zone.benelux,
    commercetools_shipping_method.premium-shipping-method
  ]
}

resource "commercetools_shipping_zone_rate" "premium-great-britain-zone-rate" {
  shipping_method_id = commercetools_shipping_method.premium-shipping-method.id
  shipping_zone_id   = commercetools_shipping_zone.great-britain.id
  price {
    cent_amount   = 1000
    currency_code = "GBP"
  }
  free_above {
    cent_amount   = 10000
    currency_code = "GBP"
  }
  depends_on = [
    commercetools_shipping_zone.great-britain,
    commercetools_shipping_method.premium-shipping-method
  ]
}

resource "commercetools_shipping_zone_rate" "premium-europe-central-zone-rate" {
  shipping_method_id = commercetools_shipping_method.premium-shipping-method.id
  shipping_zone_id   = commercetools_shipping_zone.europe-central.id
  price {
    cent_amount   = 1000
    currency_code = "EUR"
  }
  free_above {
    cent_amount   = 10000
    currency_code = "EUR"
  }
  depends_on = [
    commercetools_shipping_zone.europe-central,
    commercetools_shipping_method.premium-shipping-method
  ]
}

resource "commercetools_shipping_zone_rate" "premium-europe-south-zone-rate" {
  shipping_method_id = commercetools_shipping_method.premium-shipping-method.id
  shipping_zone_id   = commercetools_shipping_zone.europe-south.id
  price {
    cent_amount   = 1000
    currency_code = "EUR"
  }
  free_above {
    cent_amount   = 10000
    currency_code = "EUR"
  }
  depends_on = [
    commercetools_shipping_zone.europe-south,
    commercetools_shipping_method.premium-shipping-method
  ]
}

