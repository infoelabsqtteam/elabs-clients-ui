# Stage 1: Compile and Build angular codebase

# Use official node image as the base image
FROM node:14 as build

# Set the working directory
WORKDIR /usr/local/app

# Add the source code to app
COPY ./ /usr/local/app/

RUN ls -lrt
#RUN	curl "https://awscli.amazonaws.com/awscli-exe-linux-x86_64.zip" -o "awscliv2.zip"
#RUN	unzip awscliv2.zip && ./aws/install
#RUN echo $AWS_ACCESS_KEY
#RUN echo $AWS_SECRET_KEY
#RUN echo $AWS_REGION
#ARG AWS_ACCESS_KEY_ID
#ARG AWS_SECRET_ACCESS_KEY
#ARG AWS_DEFAULT_REGION
#ENV AWS_ACCESS_KEY_ID=${AWS_ACCESS_KEY_ID}
#ENV AWS_SECRET_ACCESS_KEY=${AWS_SECRET_ACCESS_KEY}
#ENV AWS_DEFAULT_REGION=${AWS_DEFAULT_REGION}
#RUN aws configure set aws_access_key_id $AWS_ACCESS_KEY_ID 
#RUN aws configure set aws_secret_access_key $AWS_SECRET_ACCESS_KEY 
#RUN aws configure set default.region $AWS_DEFAULT_REGION
#RUN aws --version
#RUN echo `aws --version`


# Install all the dependencies
#RUN CODEARTIFACT_AUTH_TOKEN=`aws codeartifact login --tool npm --repository ui-core --domain ui-libs --domain-owner 292474393014 --region ap-south-1` && npm install
#RUN npm install -g @angular/cli@13.3.11

# Generate the build of the application
#RUN CODEARTIFACT_AUTH_TOKEN=`aws codeartifact login --tool npm --repository ui-core --domain ui-libs --domain-owner 292474393014 --region ap-south-1` && ng build --configuration=production

# Stage 2: Serve app with nginx server

# Use official nginx image as the base image
FROM nginx:latest

# Copy the build output to replace the default nginx contents.
COPY --from=build /usr/local/app/dist /usr/share/nginx/html
COPY /nginx.conf  /etc/nginx/conf.d/default.conf
# Expose port 80
EXPOSE 80
