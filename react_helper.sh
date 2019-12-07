#!/bin/bash
# you can create a component or page from kagu root directory
# first argument is the name of the component/container
# second argument is to specify component/container

# e.g. ./bin/react_helper.sh HeaderComponent component {to create component}
# e.g. ./bin/react_helper.sh LandingPage container {to create a container}

generate_files() {
    file_name="$(tr '[:upper:]' '[:lower:]' <<< ${1:0:1})${1:1}"
    echo -e "export { default } from './$file_name';" > index.js
    echo -e "@import '../../styles/generic';"  > $file_name.module.scss
    echo -e "import React from 'react'; \nimport styles from './$file_name.module.scss'; \n\nconst $1 = () => {}; \n\nexport default $1;" > $file_name.js
}

if [[ "$2" == "component" ]];
    then
        pwd=`pwd`
        cd ${pwd}
        cd ./src/components
        mkdir $1
        cd $1
        generate_files $1
        echo "$1 component created"
elif [[ "$2" == "container" ]];
    then
        pwd=`pwd`
        cd ${pwd}
        cd ./src/containers
        mkdir $1
        cd $1
        generate_files $1
        echo "$1 container created"
else
    echo " Please specify either container or component"
fi
