import { useDisplayAddressStore } from "../../store/displayAddress";
import { useGeocodeStore } from "../../store/geocodData";
import { useUploadFilesStore } from "../../store/uploadFilesStore";

export default function BottomData() {
  const { setAddressData } = useDisplayAddressStore();
  const { geocodeData } = useGeocodeStore();
  const { files, rawFiles } = useUploadFilesStore();
  return (
    <div>
      {/* <h2>Дані з геокодування:</h2>
      {geocodeData ? (
        <pre>{JSON.stringify(geocodeData, null, 2)}</pre>
      ) : (
        <p>Немає даних</p>
      )} */}
      {geocodeData.length > 0 && (
        <div>
          <h2>Дані з геокодування:</h2>
          <ul>
            {geocodeData.map((item, index) => (
              <li key={index}>
                <p
                  onClick={() => {
                    console.log(item);
                    setAddressData(item);
                  }}
                >
                  Address: {item.display_name}
                </p>
                <p>Latitude: {item.lat}</p>
                <p>Longitude: {item.lon}</p>
                <button
                  onClick={() => {
                    {
                      console.log(item);
                      console.log("Оброблені файли", files);
                      console.log("Не оброблені файли", rawFiles);
                    }
                  }}
                >
                  Select
                </button>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
