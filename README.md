# elabs-clients

Branching

1. Develop (For Develop Env)
2. SIT (For SIT Env)
3. UAT (For UAT Env)
4. Prod (For Qualitek and ItcLabs)
5. commonClientProd (All Clients Except - Qualitek and Itc)


Sample Commit Message - 

#Commit - Client Ui/Branch
--------------------
Name - 
Branch -
Last Commit Id - XXXXX
Approved By -  XXXXX
Jira - 
-----------------------



#How to install new library version in application 

export CODEARTIFACT_AUTH_TOKEN=`aws codeartifact get-authorization-token --domain ui-libs --domain-owner 292474393014 --region ap-south-1 --query authorizationToken --output text`

aws codeartifact login --tool npm --repository ui-library --domain ui-libs --domain-owner 292474393014 --region ap-sou
