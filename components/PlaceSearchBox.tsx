import { useContext, useEffect } from 'react'
import { GoogleMapsContext } from '../context/GoogleMapsContext';
import styles from '../styles/Home.module.css'

const PlaceSearchBox = () => {
	const { googleMap } = useContext(GoogleMapsContext);

	useEffect(() => {
		// Create the search box and link it to the UI element.
		const input = document.getElementById("pac-input") as HTMLInputElement;
		const searchBox = new google.maps.places.SearchBox(input);

		if (googleMap) {
			googleMap.controls[google.maps.ControlPosition.TOP_CENTER].push(input);
			// Bias the SearchBox results towards current map's viewport.
			googleMap.addListener("bounds_changed", () => {
				searchBox.setBounds(googleMap.getBounds() as google.maps.LatLngBounds);
			});

			let markers: google.maps.Marker[] = [];

			// Listen for the event fired when the user selects a prediction and retrieve
			// more details for that place.
			searchBox.addListener("places_changed", () => {
				const places = searchBox.getPlaces();

				if (places) {
					if (places.length == 0) return;

					// Clear out the old markers.
					markers.forEach((marker) => {
						marker.setMap(null);
					});
					markers = [];

					// For each place, get the icon, name and location.
					const bounds = new google.maps.LatLngBounds();

					places.forEach((place) => {
						if (!place.geometry || !place.geometry.location) {
							console.log("Returned place contains no geometry");
							return;
						}

						const icon = {
							url: place.icon as string,
							size: new google.maps.Size(71, 71),
							origin: new google.maps.Point(0, 0),
							anchor: new google.maps.Point(17, 34),
							scaledSize: new google.maps.Size(25, 25),
						};

						// Create a marker for each place.
						markers.push(
							new google.maps.Marker({
								map: googleMap,
								icon: icon,
								title: place.name,
								position: place.geometry.location,
							})
						);
						if (place.geometry.viewport) {
							// Only geocodes have viewport.
							bounds.union(place.geometry.viewport);
						} else {
							bounds.extend(place.geometry.location);
						}
					});
					googleMap.fitBounds(bounds);
				}
			});
		}
	});

	return (
		<>
			<input
				id="pac-input"
				className={styles.controls}
				type="text"
				placeholder="Google マップを検索する"
			/>
		</>
	)
}

export default PlaceSearchBox