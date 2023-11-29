
# project-bootstrap
A Project to quickly bootstrap new commercetools projects.

To bootstrap a new project follow these simple steps:
Let's assume you want to setup a new b2c store.

 1. Create a branch to avoid overriding data and also to be able to commit your .env files and terraform states
 2. Create a project in MC and create an API client
 3. Copy and paste the credentials to ./b2c/typescript/.env
 4. Run `yarn install` to install all required NPM dependencies
 5. Run `cd ./shared-code`
 6. Run `yarn run build`

Now you are good to go.

## Terraform
Now it is time to run terraform.

 1. Run `cd ./b2c/terraform`
 2. Run `terraform init` and `terraform plan`
 3. Run `terraform apply` to apply the configuration.

## Importing Data
Now run the typescript importer files to do create product, variants, prices, inventory, categories and customers...
 
 1. `cd ../typescript`
 2. `yarn run bootstrap`

The menu will guide you from here.
![import.gif](docs%2Fimport.gif)
Now validate the import
![validate.gif](docs%2Fvalidate.gif)

## Tips & Tricks
### Translation on Import
The importing process supports translation via Google Translate. All you need to do is
 1. Login to google using `google-cli`
 2. Configure the parameter `TRANSLATION_ENABLED="true"` in your `.env` file
Since this comes at a cost, the result from Google is stored in a JSON file to mimic a poor man's translation memory system.
### Developing
During development you might not always want to run a real import. Therefore set the flag `DRY_RUN=true` within your `.env` file.
Since most of the magic is happening within the `./shared-folder` directory, you can run a `yarn run watch` or `yarn run test` here to continuously build or test your changes.
