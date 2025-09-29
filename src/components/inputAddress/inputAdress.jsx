import fetchGeocode from "../../geocode";
import { useGeocodeStore } from "../../store/geocodData";
import { useRef } from "react";
import css from "./InputAddress.module.css";
export default function InputAddress() {
  const { setGeocodeData } = useGeocodeStore();
  const inputRef = useRef(null);
  const getGeocode = async () => {
    const address = inputRef.current.value;
    const data = await fetchGeocode(address);
    console.log("Geocode data received:", data);
    console.log(address);
    setGeocodeData(data);
  };

  return (
    <div className={css.container}>
      <textarea
        type="text"
        rows={3}
        ref={inputRef}
        className={css.input}
        //   onChange={(e) => getGeocode(e.target.value)}
        placeholder="Введіть адресу"
      />
      <button className={css.button} onClick={() => getGeocode()}>
        Get Geocode
      </button>
    </div>
  );
}
