
resource "commercetools_project_settings" "project" {
  name                         = var.project_name
  countries                    = var.project_countries
  currencies                   = var.project_currencies
  languages                    = var.project_languages
  enable_search_index_products = var.project_indexProducts
  enable_search_index_orders   = var.project_indexOrders
}
