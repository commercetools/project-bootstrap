terraform {
  required_providers {
    commercetools = {
      source = "labd/commercetools"
    }
  }
}

locals {
  envs = { for tuple in regexall("(.*)=(.*)", file("../typescript/.env")) : tuple[0] => sensitive(tuple[1]) }
}

provider "commercetools" {
  client_id     = local.envs["CTP_CLIENT_ID"]
  client_secret = local.envs["CTP_CLIENT_SECRET"]
  project_key   = local.envs["CTP_PROJECT_KEY"]
  token_url     = local.envs["CTP_AUTH_URL"]
  api_url       = local.envs["CTP_API_URL"]
  scopes        = local.envs["CTP_SCOPES"]
}
module "project" {
  source       = "../../shared-code/terraform/modules/default-project"
  project_name = local.envs["CTP_PROJECT_KEY"]
}
module "home-decoration-products" {
  source = "../../shared-code/terraform/modules/home-decoration-products"
}
