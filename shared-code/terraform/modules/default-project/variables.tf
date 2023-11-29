variable "project_name" {
  type = string
}
variable "project_countries" {
  type    = list(string)
  default = ["GB", "US", "NL", "FR", "IT", "ES", "PT", "DE", "CA"]
}
variable "project_currencies" {
  type    = list(string)
  default = ["EUR", "GBP", "USD"]
}
variable "project_languages" {
  type    = list(string)
  default = ["en-GB", "nl-NL", "de-DE", "fr-FR", "it-IT", "es-ES", "pt-PT", "en-US"]
}
variable "project_indexProducts" {
  type    = bool
  default = true
}
variable "project_indexOrders" {
  type    = bool
  default = true
}
