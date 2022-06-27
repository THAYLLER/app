// @flow
import * as React from "react";
import {StyleSheet, View, ActivityIndicator, Linking, Text, TouchableOpacity } from "react-native";
import {observable, runInAction} from "mobx";
import {observer} from "mobx-react/native";


@observer
export default class EnableCameraPermission extends React.Component<{}> {

    @observable canOpen: boolean | null = null;

    async componentDidMount(): Promise<void> {
        const canOpen = await Linking.canOpenURL("app-settings:");
        runInAction(() => this.canOpen = canOpen);
    }

    render(): React.Node {
        const {canOpen} = this;
        if (canOpen === null) {
            return (
                <View style={styles.loading}>
                    <ActivityIndicator />
                </View>
            );
        }
        return (
            <View style={styles.container}>
                <Text type="title1">Take Pictures with React Native Elements</Text>
                <Text>
                Allow access to your camera to start taking photos with React Native Elements.
                </Text>
                {
                    canOpen === true && (
                        <View style={{flex:1}}>
                            <TouchableOpacity onPress={onPress}>
                                <Text>
                                Enable Camera Access
                                </Text>
                            </TouchableOpacity>
                        </View>
                    )
                }
                {
                    canOpen === false && (
                        <Text>
                        Allow access to your camera in the app settings.
                        </Text>
                    )
                }
            </View>
        );
    }
}

const onPress = async (): Promise<void> => Linking.openURL("app-settings:");

const styles = StyleSheet.create({
    loading: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center"
    },
    container: {
        flexGrow: 1,
        justifyContent: "center",
        padding: 16
    }
});
