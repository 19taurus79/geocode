import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import css from "./App.module.css";
import TopData from "./components/topData/topData";
import InputAddress from "./components/inputAddress/InputAddress";
import BottomData from "./components/bottomData/bottomData";
import { useDisplayAddressStore } from "./store/displayAddress";
import { useApplicationsStore } from "./store/applicationsStore";
import fetchApplications from "./fetchApplications";
import ChangeMapView from "./components/ChangeMapView/ChangeMapView";
import Header from "./components/Header/Header";
import { useState, useRef, useEffect } from "react";
import { customIcon } from "./leaflet-icon";

export default function App() {
  const { addressData } = useDisplayAddressStore();
  const { applications, setApplications } = useApplicationsStore();
  const [isDataTopVisible, setDataTopVisible] = useState(false);
  const [isAddressSearchVisible, setAddressSearchVisible] = useState(true);
  const [areApplicationsVisible, setAreApplicationsVisible] = useState(false);
  const mapRef = useRef(null);

  const handleLoadDataClick = () => {
    setDataTopVisible((prev) => !prev);
  };

  const handleToggleAddressSearch = () => {
    setAddressSearchVisible((prev) => !prev);
  };

  const handleToggleApplications = () => {
    setAreApplicationsVisible((prev) => !prev);
  };

  useEffect(() => {
    const getApplications = async () => {
      if (areApplicationsVisible && applications.length === 0) {
        const apps = await fetchApplications();
        setApplications(apps);
      }
    };
    getApplications();
  }, [areApplicationsVisible, applications.length, setApplications]);

  useEffect(() => {
    if (mapRef.current) {
      setTimeout(() => {
        mapRef.current.invalidateSize();
      }, 400); // A small delay to allow the layout to update
    }
  }, [isDataTopVisible, isAddressSearchVisible]);

  console.log(addressData);

  let addressMarker = null;
  if (addressData && addressData.lat) {
    addressMarker = (
      <Marker
        icon={customIcon}
        position={[addressData.lat, addressData.lon]}
      >
        <Popup>{addressData.display_name}</Popup>
      </Marker>
    );
  }

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
          onToggleApplications={handleToggleApplications}
          areApplicationsVisible={areApplicationsVisible}
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
          {areApplicationsVisible &&
            applications.map((app) => (
              <Marker
                key={app.id}
                position={[app.lat, app.lon]}
                icon={customIcon}
              >
                <Popup>
                  {app.name} <br /> {app.address}
                </Popup>
              </Marker>
            ))}
          {addressMarker}
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