resource "commercetools_shipping_zone" "benelux" {
  key         = "benelux"
  name        = "Benelux"
  description = "Shipping zone for the BeNeLux"
  location {
    country = "NL"
  }
  location {
    country = "BE"
  }
  location {
    country = "LU"
  }
}

resource "commercetools_shipping_zone" "europe-central" {
  key         = "europe-central"
  name        = "Central Europe"
  description = "Shipping zone for Central Europe"
  location {
    country = "DE"
  }
  location {
    country = "AT"
  }
  location {
    country = "CH"
  }
}

resource "commercetools_shipping_zone" "europe-south" {
  key         = "europe-south"
  name        = "Southern Europe"
  description = "Shipping zone for Southern Europe"
  location {
    country = "IT"
  }
  location {
    country = "FR"
  }
  location {
    country = "ES"
  }
  location {
    country = "PT"
  }
}

resource "commercetools_shipping_zone" "north-america" {
  key         = "north-america"
  name        = "North America"
  description = "Shipping zone for North America"
  location {
    country = "US"
  }
  location {
    country = "CA"
  }
}

resource "commercetools_shipping_zone" "great-britain" {
  key         = "great-britain"
  name        = "Great Britain"
  description = "Shipping zone for Great Britain"
  location {
    country = "GB"
  }
}
