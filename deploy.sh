#!/bin/bash

# terraform -chdir="./terraform" init
# terraform -chdir="./terraform" plan -var-file='secrets.tfvars'
# terraform -chdir="./terraform" destroy -var-file='secrets.tfvars' -auto-approve
terraform -chdir="./terraform" apply  -var-file='secrets.tfvars' -auto-approve