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
import { Fontisto } from "@expo/vector-icons";

const { width: SCREEN_WIDTH } = Dimensions.get("window");
const API_KEY = "7991634b36a09e5324877e87f08c3120";
const icons = {
	Clear: "day-sunny",
	Clouds: "cloudy",
	Atmosphere: "cloudy-gusts",
	Snow: "snow",
	Rain: "rains",
	Drizzle: "rain",
	Thunderstorm: "lighting",
};

export default function App() {
	const [location, setLocation] = useState(null);
	const [ok, setOk] = useState(true);
	const [city, setCity] = useState("--");
	const [district, setDistrict] = useState("--동");
	const [days, setDays] = useState("");

	const getWeather = async () => {
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
		getWeather();
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
				{!days ? (
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
							<View style={style.first}>
								<Text style={style.temp}>
									{parseFloat(day.main.temp).toFixed(1)}
								</Text>

								<Fontisto
									name={icons[day.weather[0].main]}
									size="80"
									color="lightgray"
								/>
							</View>
							<Text style={style.humidity}>{day.main.humidity}%</Text>
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
		fontSize: 50,
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
	},
	first: {
		width: "100%",
		flexDirection: "row",
		justifyContent: "space-between",
		alignItems: "center",
		paddingHorizontal: "10%",
	},
	temp: {
		alignItems: "center",
		color: "lightgray",
		fontSize: 120,
		fontWeight: "600",
	},

	humidity: {
		marginTop: -20,
		paddingHorizontal: "10%",
		color: "lightgray",
		fontSize: 65,
		fontWeight: "500",
	},
});
