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
      <div className={css.inputWrapper}>
        <input
          type="text"
          className={css.input}
          placeholder="Країна"
          value={country}
          onChange={handleCapitalize(setCountry)}
        />
        {country && (
          <button className={css.clearButton} onClick={() => setCountry("")}>
            X
          </button>
        )}
      </div>
      <div className={css.inputWrapper}>
        <input
          type="text"
          className={css.input}
          placeholder="Область"
          value={region}
          onChange={handleCapitalize(setRegion)}
        />
        {region && (
          <button className={css.clearButton} onClick={() => setRegion("")}>
            X
          </button>
        )}
      </div>
      <div className={css.inputWrapper}>
        <input
          type="text"
          className={css.input}
          placeholder="Район"
          value={district}
          onChange={handleCapitalize(setDistrict)}
        />
        {district && (
          <button className={css.clearButton} onClick={() => setDistrict("")}>
            X
          </button>
        )}
      </div>
      <div className={css.inputWrapper}>
        <input
          type="text"
          className={css.input}
          placeholder="Територіальна грамада"
          value={community}
          onChange={handleCapitalize(setCommunity)}
        />
        {community && (
          <button className={css.clearButton} onClick={() => setCommunity("")}>
            X
          </button>
        )}
      </div>
      <div className={css.inputWrapper}>
        <input
          type="text"
          className={css.input}
          placeholder="Населений пункт"
          value={settlement}
          onChange={handleCapitalize(setSettlement)}
        />
        {settlement && (
          <button className={css.clearButton} onClick={() => setSettlement("")}>
            X
          </button>
        )}
      </div>
      <button className={css.button} onClick={() => getGeocode()}>
        Геокодувати
      </button>
    </div>
  );
}
