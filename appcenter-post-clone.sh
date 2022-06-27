#!/usr/bin/env bash

rm -rf node_modules/
yarn
npx jetify -r


yarn add react-native-camera
yarn add jetifier

cd android/

./gradlew clean
./gradlew cleanBuildCache

cd ../

cd ios/
pod install

pod update SDWebImageWebPCoder