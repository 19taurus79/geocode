import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import css from "./App.module.css";
import TopData from "./components/topData/topData";
import InputAddress from "./components/inputAddress/InputAddress";
import BottomData from "./components/bottomData/bottomData";
import { useDisplayAddressStore } from "./store/displayAddress";
import ChangeMapView from "./components/ChangeMapView/ChangeMapView";
export default function App() {
  const { addressData } = useDisplayAddressStore();
  console.log(addressData);
  return (
    <div className={css.container}>
      <MapContainer
        className={css.map}
        center={
          addressData.lat
            ? [addressData.lat, addressData.lon]
            : [49.973022, 35.984668]
        }
        zoom={13}
        // scrollWheelZoom={false}
        style={{ height: "100vh", width: "100%" }}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        <Marker
          position={
            addressData.lat
              ? [addressData.lat, addressData.lon]
              : [49.973022, 35.984668]
          }
        >
          <Popup>{addressData.display_name}</Popup>
        </Marker>
        <ChangeMapView
          center={addressData.lat ? [addressData.lat, addressData.lon] : null}
        />
      </MapContainer>
      <div className={css.dataTop}>
        <TopData />
      </div>
      <div className={css.input}>
        <InputAddress />
      </div>
      <div className={css.dataBottom}>
        <BottomData />
      </div>
    </div>
  );
}