import { createContext } from 'react';

type Props = {
  googleMap: google.maps.Map | null;
};

export const GoogleMapsContext = createContext<Props>({
  googleMap: null
});
