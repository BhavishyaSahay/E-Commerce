#!/bin/bash
# cleanup-aws.sh
# Deletes existing AWS resources with the configured prefix to resolve "already exists" errors during Terraform apply/plan.

PREFIX=${1:-"devops-ecom"}
REGION=${AWS_REGION:-"ap-south-1"} # Defaults to ap-south-1, change if your AWS_REGION is different

echo "======================================================="
echo "Cleaning up AWS resources..."
echo "Prefix: $PREFIX"
echo "Region: $REGION"
echo "======================================================="
echo "Note: Errors about resources not existing are normal and can be ignored."

# 1. ECS Service and Cluster
echo "-> Cleaning up ECS..."
aws ecs update-service --cluster "$PREFIX-cluster" --service "$PREFIX-service" --desired-count 0 --region "$REGION" >/dev/null 2>&1 || true
aws ecs delete-service --cluster "$PREFIX-cluster" --service "$PREFIX-service" --region "$REGION" >/dev/null 2>&1 || true
aws ecs delete-cluster --cluster "$PREFIX-cluster" --region "$REGION" >/dev/null 2>&1 || true

# Task definitions (deregistering all revisions)
TDS=$(aws ecs list-task-definitions --family-prefix "$PREFIX-app" --region "$REGION" --query 'taskDefinitionArns[]' --output text 2>/dev/null)
for td in $TDS; do
  aws ecs deregister-task-definition --task-definition "$td" --region "$REGION" >/dev/null 2>&1 || true
done

# 2. ECR Repository
echo "-> Cleaning up ECR..."
aws ecr delete-repository --repository-name "$PREFIX-app" --force --region "$REGION" >/dev/null 2>&1 || true

# 3. ALB and Target Groups
echo "-> Cleaning up ALB..."
ALB_ARN=$(aws elbv2 describe-load-balancers --names "$PREFIX-alb" --region "$REGION" --query 'LoadBalancers[0].LoadBalancerArn' --output text 2>/dev/null)
if [ -n "$ALB_ARN" ] && [ "$ALB_ARN" != "None" ]; then
  aws elbv2 delete-load-balancer --load-balancer-arn "$ALB_ARN" --region "$REGION" >/dev/null 2>&1 || true
  echo "   Waiting 10s for ALB to be deleted before deleting target groups and security groups..."
  sleep 10 
fi

TG_ARN=$(aws elbv2 describe-target-groups --names "$PREFIX-tg" --region "$REGION" --query 'TargetGroups[0].TargetGroupArn' --output text 2>/dev/null)
if [ -n "$TG_ARN" ] && [ "$TG_ARN" != "None" ]; then
  aws elbv2 delete-target-group --target-group-arn "$TG_ARN" --region "$REGION" >/dev/null 2>&1 || true
fi

# 4. Security Groups
echo "-> Cleaning up Security Groups..."
VPC_ID=$(aws ec2 describe-vpcs --filters "Name=isDefault,Values=true" --region "$REGION" --query 'Vpcs[0].VpcId' --output text 2>/dev/null)
if [ -n "$VPC_ID" ] && [ "$VPC_ID" != "None" ]; then
  ALB_SG=$(aws ec2 describe-security-groups --filters "Name=group-name,Values=$PREFIX-alb-sg" "Name=vpc-id,Values=$VPC_ID" --region "$REGION" --query 'SecurityGroups[0].GroupId' --output text 2>/dev/null)
  ECS_SG=$(aws ec2 describe-security-groups --filters "Name=group-name,Values=$PREFIX-ecs-sg" "Name=vpc-id,Values=$VPC_ID" --region "$REGION" --query 'SecurityGroups[0].GroupId' --output text 2>/dev/null)
  
  if [ -n "$ECS_SG" ] && [ "$ECS_SG" != "None" ]; then
    aws ec2 delete-security-group --group-id "$ECS_SG" --region "$REGION" >/dev/null 2>&1 || true
  fi
  if [ -n "$ALB_SG" ] && [ "$ALB_SG" != "None" ]; then
    aws ec2 delete-security-group --group-id "$ALB_SG" --region "$REGION" >/dev/null 2>&1 || true
  fi
fi

# 5. CloudWatch Log Group
echo "-> Cleaning up CloudWatch Logs..."
aws logs delete-log-group --log-group-name "/ecs/$PREFIX-app" --region "$REGION" >/dev/null 2>&1 || true

# 6. IAM Roles
echo "-> Cleaning up IAM Roles..."
aws iam detach-role-policy --role-name "$PREFIX-ecs-exec" --policy-arn "arn:aws:iam::aws:policy/service-role/AmazonECSTaskExecutionRolePolicy" >/dev/null 2>&1 || true
aws iam delete-role-policy --role-name "$PREFIX-ecs-exec" --policy-name "$PREFIX-exec-secrets" >/dev/null 2>&1 || true

aws iam delete-role --role-name "$PREFIX-ecs-exec" >/dev/null 2>&1 || true
aws iam delete-role --role-name "$PREFIX-ecs-task" >/dev/null 2>&1 || true

echo "======================================================="
echo "Cleanup complete! You can now re-run the pipeline."
echo "======================================================="
