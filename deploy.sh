terraform init
terraform plan -chdir='./terraform' -var-file='secrets.tfvars' -auto-approve
terraform apply -chdir='./terraform' -var-file='secrets.tfvars' -auto-approve