#!/usr/bin/env bash

yarn add react-native-camera

cd android/

./gradlew clean
./gradlew cleanBuildCache

cd ../

cd ios/
pod install

pod update SDWebImageWebPCoder