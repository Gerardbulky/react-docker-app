# frontend



## Some chanllenges I encountered and how I resolved them

### React App

Initially I was using port 80 to expose the frontend app but the Vue app was running on port 5173, so I had to use port 5173 as my container port as reflected in the frontend-deployment.yaml file.

ports:
    - containerPort: 5173

Still in the I addded the command to run the container:
    command: ["npm", "run", "dev", "--", "--host"] 