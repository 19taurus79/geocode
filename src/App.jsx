import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import css from "./App.module.css";
import TopData from "./components/topData/topData";
import InputAddress from "./components/inputAddress/InputAddress";
import BottomData from "./components/bottomData/bottomData";
import { useDisplayAddressStore } from "./store/displayAddress";
import ChangeMapView from "./components/ChangeMapView/ChangeMapView";
import Header from "./components/Header/Header";
import { useState, useRef, useEffect } from "react";

export default function App() {
  const { addressData } = useDisplayAddressStore();
  const [isDataTopVisible, setDataTopVisible] = useState(false);
  const [isAddressSearchVisible, setAddressSearchVisible] = useState(true);
  const mapRef = useRef(null);

  const handleLoadDataClick = () => {
    setDataTopVisible((prev) => !prev);
  };

  const handleToggleAddressSearch = () => {
    setAddressSearchVisible((prev) => !prev);
  };

  useEffect(() => {
    if (mapRef.current) {
      setTimeout(() => {
        mapRef.current.invalidateSize();
      }, 400); // A small delay to allow the layout to update
    }
  }, [isDataTopVisible, isAddressSearchVisible]);

  console.log(addressData);
  return (
    <div
      className={`${css.container} ${
        !isDataTopVisible ? css.dataLoadedLayout : ""
      } ${
        !isAddressSearchVisible ? css.addressSearchHidden : ""
      }`}
    >
      <div className={css.header}>
        <Header
          onLoadDataClick={handleLoadDataClick}
          isDataTopVisible={isDataTopVisible}
          onToggleAddressSearch={handleToggleAddressSearch}
          isAddressSearchVisible={isAddressSearchVisible}
        />
      </div>
      <div className={css.map}>
        <MapContainer
          ref={mapRef}
          center={
          addressData.lat
            ? [addressData.lat, addressData.lon]
            : [49.973022, 35.984668]
        }
        zoom={13}
        // scrollWheelZoom={false}
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
      </div>
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