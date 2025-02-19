// components/MapComponents/index.js
import dynamic from "next/dynamic";

const MapWithNoSSR = dynamic(() => import("./MapComponent"), { ssr: false });
const AppointmenMapComponent = dynamic(() => import("./AppointmentMap"), {
  ssr: false,
});
const MapLocation = dynamic(() => import("./MapLocations"), {
  ssr: false,
});

export { MapWithNoSSR, AppointmenMapComponent, MapLocation };
