import React, { useState, useEffect } from 'react'
import { Button, Image, View, Platform, Text } from 'react-native'
import { BarCodeScanner } from 'expo-barcode-scanner'
import * as ImagePicker from 'expo-image-picker'

export default function ImagePickerExample() {
	const [image, setImage] = useState(null)
	const [hasPermission, setHasPermission] = useState(null)

	const askForCameraPermission = () => {
		;(async () => {
			const { status } = await BarCodeScanner.requestPermissionsAsync()
			setHasPermission(status === 'granted')
		})()
	}

	// Request Camera Permission
	useEffect(() => {
		askForCameraPermission()
	}, [])

	// Check permissions and return the screens
	if (hasPermission === null) {
		return (
			<View
				style={{
					flex: 1,
					alignItems: 'center',
					justifyContent: 'center',
				}}>
				<Text>Requesting for camera permission</Text>
			</View>
		)
	}
	if (hasPermission === false) {
		return (
			<View
				style={{
					flex: 1,
					alignItems: 'center',
					justifyContent: 'center',
				}}>
				<Text style={{ margin: 10 }}>No access to camera</Text>
				<Button
					title={'Allow Camera'}
					onPress={() => askForCameraPermission()}
				/>
			</View>
		)
	}

	const captureImage = async () => {
		// No permissions request is necessary for launching the image library
		// let result = await ImagePicker.launchImageLibraryAsync({
		// 	mediaTypes: ImagePicker.MediaTypeOptions.All,
		// 	allowsEditing: true,
		// 	aspect: [4, 3],
		// 	quality: 1,
        // })
        
        let result = await ImagePicker.launchCameraAsync({
            allowsEditing: false,
            aspect: [4, 3],
            quality: 1,
            mediaTypes: ImagePicker.MediaTypeOptions.Images
        })

		console.log(result)

		if (!result.cancelled) {
			setImage(result.uri)
		}
	}

	return (
		<View
			style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
			<Button
				title='Take image from camera'
				onPress={captureImage}
			/>
			{image && (
				<Image
					source={{ uri: image }}
					style={{ width: 200, height: 200 }}
				/>
			)}
		</View>
	)
}
