import fetchGeocode from "../../geocode";
import { useGeocodeStore } from "../../store/geocodData";
import { useState } from "react";
import css from "./InputAddress.module.css";
export default function InputAddress() {
  const { setGeocodeData } = useGeocodeStore();
  const [country, setCountry] = useState("Україна");
  const [region, setRegion] = useState("Харківська");
  const [district, setDistrict] = useState("");
  const [community, setCommunity] = useState("");
  const [settlement, setSettlement] = useState("");

  const getGeocode = async () => {
    const address = `${country}, ${region}, ${district}, ${community}, ${settlement}`;
    const data = await fetchGeocode(address);
    console.log("Geocode data received:", data);
    console.log(address);
    setGeocodeData(data);
  };

  const handleCapitalize = (setter) => (e) => {
    const value = e.target.value;
    if (value) {
      setter(value.charAt(0).toUpperCase() + value.slice(1));
    } else {
      setter("");
    }
  };

  return (
    <div className={css.container}>
      <input
        type="text"
        className={css.input}
        placeholder="Страна"
        value={country}
        onChange={handleCapitalize(setCountry)}
      />
      <input
        type="text"
        className={css.input}
        placeholder="Область"
        value={region}
        onChange={handleCapitalize(setRegion)}
      />
      <input
        type="text"
        className={css.input}
        placeholder="Район"
        value={district}
        onChange={handleCapitalize(setDistrict)}
      />
      <input
        type="text"
        className={css.input}
        placeholder="Теритареальная грамада"
        value={community}
        onChange={handleCapitalize(setCommunity)}
      />
      <input
        type="text"
        className={css.input}
        placeholder="Населенный пункт"
        value={settlement}
        onChange={handleCapitalize(setSettlement)}
      />
      <button className={css.button} onClick={() => getGeocode()}>
        Get Geocode
      </button>
    </div>
  );
}
