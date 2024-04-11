# This is a deployment/installation guide
cd code

npm install (node js > 14 required)

npm run setup_containers

(press y when prompted)


# Test within container node app
docker exec -it mysimbdp /bin/bash

npm run batch_test_one_file

npm run batch_test_too_many_files

npm run batch_test_file_too_large