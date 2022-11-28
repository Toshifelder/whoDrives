import { useState, useEffect, useRef } from 'react'
import { GoogleMapsContext } from '../context/GoogleMapsContext';
import PlaceSearchBox from './PlaceSearchBox';
import styles from '../styles/Home.module.css'

const GoogleMap = () => {
	const [configuredMap, setConfiguredMap] = useState<boolean>(false);
	const [googleMap, setGoogleMap] = useState<google.maps.Map | null>(null);
	const googlemap = useRef(null);
	let map;

	useEffect(() => {
		let initPos = { lat: 38.2597203, lng: 140.8799705 };
		if (navigator.geolocation) {
			navigator.geolocation.getCurrentPosition(position => {
				initPos = { lat: position.coords.latitude, lng: position.coords.longitude }
			})
		}
		if (!googlemap.current) throw Error("divRef is not assigned");
		map = new google.maps.Map(googlemap.current, {
			center: initPos,
			zoom: 12,
			disableDefaultUI: true,
			zoomControl: true,
		});

		setGoogleMap(map);
		setConfiguredMap(true);
	}, [setGoogleMap]);


	return (
		<>
			<div id="map" ref={googlemap} />
			{configuredMap && (
				<GoogleMapsContext.Provider
					value={{
						googleMap: googleMap
					}}
				>
					<PlaceSearchBox></PlaceSearchBox>
				</GoogleMapsContext.Provider>
			)}
		</>
	)
}

export default GoogleMap