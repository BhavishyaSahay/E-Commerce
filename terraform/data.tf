data "aws_caller_identity" "current" {}

# Data source for the default VPC. Note: some newer AWS accounts or certain regions
# may not have a default VPC. If this fails, you must create one or specify a VPC ID.
data "aws_vpc" "default" {
  default = true
}

# Default-VPC subnets that are the primary subnet per AZ (one per AZ). Using all subnets
# sorted by id can pick two subnets in the same AZ and breaks ALB: "cannot be attached to
# multiple subnets in the same Availability Zone".
data "aws_subnets" "default" {
  filter {
    name   = "vpc-id"
    values = [data.aws_vpc.default.id]
  }
  filter {
    name   = "default-for-az"
    values = ["true"]
  }
}
