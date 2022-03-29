import React, { useState, useEffect } from 'react'
import { Text, View, StyleSheet, Button } from 'react-native'
import { BarCodeScanner } from 'expo-barcode-scanner'

export default function App() {
	const [hasPermission, setHasPermission] = useState(null)
	const [scanned, setScanned] = useState(false)
	const [text, setText] = useState('Not yet scanned')
	const [isCorrect, setIsCorrect] = useState(false)

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

	// What happens when we scan the bar code
	const handleBarCodeScanned = ({ type, data }) => {
		setScanned(true)
		setText(data)
		console.log('Type: ' + type + '\nData: ' + data)
	}

	// Check permissions and return the screens
	if (hasPermission === null) {
		return (
			<View style={styles.container}>
				<Text>Requesting for camera permission</Text>
			</View>
		)
	}
	if (hasPermission === false) {
		return (
			<View style={styles.container}>
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
			mediaTypes: ImagePicker.MediaTypeOptions.Images,
		})

		console.log(result)

		if (!result.cancelled) {
			setImage(result.uri)
		}
	}

	// Return the View
	return (
		<View style={styles.container}>
			{!isCorrect && (
				<View style={styles.barcodebox}>
					<BarCodeScanner
						onBarCodeScanned={
							scanned ? undefined : handleBarCodeScanned
						}
						style={{ height: 400, width: 400 }}
					/>
				</View>
			)}
			{/* <Text style={styles.maintext}>{text}</Text> */}

			{scanned && !isCorrect && (
				<>
					<Button
						title={'Scan again?'}
						onPress={() => setScanned(false)}
						color='tomato'
					/>
					<Button
						title={'Done'}
						onPress={() => setIsCorrect(true)}
						color='tomato'
					/>
				</>
			)}
		</View>
	)
}

const styles = StyleSheet.create({
	container: {
		flex: 1,
		backgroundColor: '#fff',
		alignItems: 'center',
		justifyContent: 'center',
	},
	maintext: {
		fontSize: 16,
		margin: 20,
	},
	barcodebox: {
		alignItems: 'center',
		justifyContent: 'center',
		height: 300,
		width: 300,
		overflow: 'hidden',
		borderRadius: 30,
		backgroundColor: 'tomato',
	},
})
