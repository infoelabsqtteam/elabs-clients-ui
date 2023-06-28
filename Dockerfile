# Stage 1: Compile and Build angular codebase

# Use official node image as the base image
FROM node:12 as build

# Set the working directory
WORKDIR /usr/local/app

# Add the source code to app
COPY ./ /usr/local/app/

#Get Token
RUN export CODEARTIFACT_AUTH_TOKEN=`aws codeartifact get-authorization-token --domain ui-libs --domain-owner 292474393014 --region ap-south-1 --query authorizationToken --output text`
RUN aws codeartifact login --tool npm --repository ui-core --domain ui-libs --domain-owner 292474393014 --region ap-south-1

# Install all the dependencies
RUN npm install
RUN npm install -g @angular/cli@13.3.11


# Generate the build of the application
RUN ng build --configuration=production


# Stage 2: Serve app with nginx server

# Use official nginx image as the base image
FROM nginx:latest

# Copy the build output to replace the default nginx contents.
COPY --from=build /usr/local/app/dist /usr/share/nginx/html
COPY /nginx.conf  /etc/nginx/conf.d/default.conf
# Expose port 80
EXPOSE 80
