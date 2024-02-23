import { StatusBar } from "expo-status-bar";
import * as Location from "expo-location";
import { useEffect, useState } from "react";
import {
	StyleSheet,
	Text,
	View,
	ScrollView,
	Dimensions,
	ActivityIndicator,
} from "react-native";

const { width: SCREEN_WIDTH } = Dimensions.get("window");
const API_KEY = "7991634b36a09e5324877e87f08c3120";

export default function App() {
	const [location, setLocation] = useState(null);
	const [ok, setOk] = useState(true);
	const [city, setCity] = useState("--");
	const [district, setDistrict] = useState("--");
	const [days, setDays] = useState("");

	const ask = async () => {
		try {
			console.log("위치 정보 가져오는 중...");
			const { granted } = await Location.requestForegroundPermissionsAsync();
			if (!granted) {
				setOk(false);
			}

			const {
				coords: { latitude, longitude },
			} = await Location.getCurrentPositionAsync({ accuracy: 5 });
			const location = await Location.reverseGeocodeAsync(
				{
					latitude,
					longitude,
				},
				{ useGoogleMaps: false }
			);
			setCity(location[0].city);
			setDistrict(location[0].district);
			const url = `https://api.openweathermap.org/data/2.5/forecast?lat=${latitude}&lon=${longitude}&cnt=10&appid=${API_KEY}&units=metric&lang=kr`;
			const response = await fetch(url);
			const data = await response.json();
			setDays(data.list);

			console.log("완료.");
		} catch (error) {
			console.log(error);
		}
	};

	useEffect(() => {
		ask();
	}, [location]);

	return (
		<View style={style.container}>
			<View style={style.location}>
				<Text style={style.cityName}>{city}</Text>
				<Text style={style.districtName}>{district}</Text>
			</View>
			<ScrollView
				horizontal
				pagingEnabled
				showsHorizontalScrollIndicator={false}
				contentContainerStyle={style.weather}
			>
				{days.length === 0 ? (
					// 로딩 화면
					<View style={style.day}>
						<ActivityIndicator
							color="black"
							size="large"
							style={{ marginTop: 10 }}
						/>
					</View>
				) : (
					days.map((day, index) => (
						<View key={index} style={style.day}>
							<Text style={style.temp}>
								{parseFloat(day.main.temp).toFixed(1)}
							</Text>
							<Text style={style.humidity}>{day.main.humidity}%</Text>
							<Text
								style={style.wetherStatus}
							>{`${day.weather[0].main}, ${day.weather[0].description}`}</Text>
						</View>
					))
				)}
			</ScrollView>

			{/* <StatusBar style="converted" /> */}
		</View>
	);
}

const style = StyleSheet.create({
	container: {
		flex: 1,
		flexDirection: "column",
		backgroundColor: "gray",
		// backgroundColor: "#ff9f0a",
	},

	location: {
		flex: 1,
		justifyContent: "center",
		alignItems: "center",
	},
	cityName: {
		marginVertical: "auto",
		marginHorizontal: "0",
		color: "#000",
		fontSize: 60,
		fontWeight: "600",
	},
	districtName: {
		fontSize: 30,
		fontWeight: "600",
		marginTop: 10,
	},

	weather: {},
	day: {
		width: SCREEN_WIDTH,
		alignItems: "center",
	},
	temp: {
		alignItems: "center",
		paddingTop: 20,
		color: "lightgray",
		fontSize: 120,
		fontWeight: "600",
	},
	humidity: {
		color: "lightgray",
		fontSize: 70,
		fontWeight: "500",
	},
	wetherStatus: {
		alignItems: "center",
		marginVertical: 5,
		fontSize: 30,
		fontWeight: "300",
	},
});
