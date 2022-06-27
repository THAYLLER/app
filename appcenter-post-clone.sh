#!/usr/bin/env bash

yarn add react-native-camera
yarn add jetifier

yarn jetify -r

cd android/

./gradlew clean
./gradlew cleanBuildCache

cd ../

cd ios/
pod install

pod update SDWebImageWebPCoder
