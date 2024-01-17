
variable AWS_SECRET_ACCESS_KEY {}
variable AWS_ACCESS_KEY_ID {}
variable AWS_REGION {}
variable KEY_NAME {}
variable ROUTE53_ZONE_ID{}
variable DOMAIN_NAME {}



terraform {
  required_providers {
    aws = {
      source = "hashicorp/aws"
      version = "5.32.1"
    }
  }
}

provider "aws" {
  region  = var.AWS_REGION
  access_key = var.AWS_ACCESS_KEY_ID
  secret_key = var.AWS_SECRET_ACCESS_KEY
}

resource "tls_private_key" "rsa4096" {
  algorithm = "RSA"
  rsa_bits = 4096
}


resource "aws_key_pair" "key_pair" {
    key_name = var.KEY_NAME
    public_key = tls_private_key.rsa4096.public_key_openssh
}

resource "local_file" "private_key" {
    content = tls_private_key.rsa4096.private_key_pem
    filename = var.KEY_NAME

    provisioner "local-exec" {
        command = "chmod 400 ${var.KEY_NAME}"
    }
}

resource "aws_security_group" "org_pdfmaster_ec2_group" {
  name = "org_pdfmaster_ec2_group"

  ingress {
    from_port   = 22
    to_port     = 22
    protocol    = "tcp"
    cidr_blocks = ["0.0.0.0/0"]
  }

  ingress {
    from_port   = 80
    to_port     = 80
    protocol    = "tcp"
    cidr_blocks = ["0.0.0.0/0"]
  }

  egress {
    from_port   = 0
    to_port     = 0
    protocol    = "-1"
    cidr_blocks = ["0.0.0.0/0"]
  }
}

resource "aws_instance" "public_instance" {
    ami = "ami-008fe2fc65df48dac"
    instance_type = "t3.micro"
    key_name = aws_key_pair.key_pair.key_name
    vpc_security_group_ids = [aws_security_group.org_pdfmaster_ec2_group.id]

    tags = {
      name = "public_instance"
    }

    root_block_device {
        volume_size = 8
        volume_type = "gp2"
    }

    provisioner "local-exec" {
        command = "touch dynamic_inventory.ini"
    }
}

// Route 53 records
resource "aws_route53_record" "record_1" {
  zone_id = var.ROUTE53_ZONE_ID
  name    = var.DOMAIN_NAME
  type    = "A"
  ttl     = 300
  records = [aws_instance.public_instance.public_ip]
}

resource "aws_route53_record" "record_2" {
  zone_id = var.ROUTE53_ZONE_ID
  name    = "www.${var.DOMAIN_NAME}"
  type    = "CNAME"
  ttl     = 300
  records = [var.DOMAIN_NAME]
}

data "template_file" "inventory" {
  template = <<-EOT
    [ec2_instances]
    ${aws_instance.public_instance.public_ip} ansible_user=ubuntu ansible_private_key_file=${path.module}/${var.KEY_NAME}
    EOT
}

resource "local_file" "dynamic_inventory" {
  depends_on = [aws_instance.public_instance]

  filename = "dynamic_inventory.ini"
  content  = data.template_file.inventory.rendered

  provisioner "local-exec" {
    command = "chmod 400 ${local_file.dynamic_inventory.filename}"
  }
}