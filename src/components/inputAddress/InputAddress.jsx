import { useState, useEffect, useMemo } from "react";
import { useGeocodeStore } from "../../store/geocodData";
import { useDisplayAddressStore } from "../../store/displayAddress"; // Import DisplayAddressStore
import { getRegions, searchAddresses } from "../../services/addressService";
import fetchGeocode from "../../geocode"; // Static import
import { Autocomplete, TextField, CircularProgress, Box, Typography } from "@mui/material";
import css from "./InputAddress.module.css";

export default function InputAddress() {
  const { setGeocodeData } = useGeocodeStore();
  const { setAddressData } = useDisplayAddressStore(); // Use setAddressData
  
  // Region state
  const [regions, setRegions] = useState([]);
  const [selectedRegion, setSelectedRegion] = useState(null);
  const [loadingRegions, setLoadingRegions] = useState(false);

  // Address search state
  const [addressOptions, setAddressOptions] = useState([]);
  const [selectedAddress, setSelectedAddress] = useState(null);
  const [inputValue, setInputValue] = useState("");
  const [loadingAddress, setLoadingAddress] = useState(false);

  // Load regions on mount
  useEffect(() => {
    async function loadRegions() {
      setLoadingRegions(true);
      const data = await getRegions();
      setRegions(data);
      setLoadingRegions(false);
    }
    loadRegions();
  }, []);

  // Search addresses when input changes
  useEffect(() => {
    let active = true;

    if (inputValue.length < 3 || !selectedRegion) {
      setAddressOptions(selectedAddress ? [selectedAddress] : []);
      return;
    }

    const timer = setTimeout(async () => {
      setLoadingAddress(true);
      // Pass selectedRegion.level_1_id as expected by the API
      const results = await searchAddresses(inputValue, selectedRegion.level_1_id);
      
      if (active) {
        setAddressOptions(results);
        setLoadingAddress(false);
      }
    }, 500); // Debounce

    return () => {
      active = false;
      clearTimeout(timer);
    };
  }, [inputValue, selectedRegion, selectedAddress]);

  // Handle final selection
  const handleAddressSelect = async (event, newValue) => {
    setSelectedAddress(newValue);
    
    if (newValue) {
      // 1. Construct the full address string for geocoding
      const addressToGeocode = newValue.full_address || 
        `Україна, ${newValue.region || ""}, ${newValue.district || ""}, ${newValue.community || ""}, ${newValue.name}`;

      console.log("Attempting to geocode:", addressToGeocode);

      // 2. Call the existing geocode service to get coordinates
      try {
        const rawGeocodeResult = await fetchGeocode(addressToGeocode);
        
        console.log("Geocode result:", rawGeocodeResult);
        
        // Handle array response (take the first result)
        const geocodedData = Array.isArray(rawGeocodeResult) ? rawGeocodeResult[0] : rawGeocodeResult;

        if (!geocodedData) {
            console.warn("Geocode returned empty data");
            throw new Error("No geocode results");
        }

        const finalData = {
          ...geocodedData,
          // Ensure address fields are populated from our structured backend data
          // if geocoder returns incomplete address info
          address: {
            ...(geocodedData.address || {}),
            country: "Україна",
            state: newValue.region,
            county: newValue.district,
            city: newValue.category === "M" ? newValue.name : geocodedData.address?.city,
            town: newValue.category === "X" ? newValue.name : geocodedData.address?.town,
            village: newValue.category === "C" ? newValue.name : geocodedData.address?.village,
            municipality: newValue.community
          }
        };

        // 3. Update BOTH stores
        setGeocodeData(finalData); // Keep existing behavior
        setAddressData(finalData); // Trigger map update via App.jsx

      } catch (error) {
        console.error("Failed to geocode selected address:", error);
        // Fallback if geocoding fails, but at least we have the name
        const fallbackData = {
            display_name: newValue.full_address,
            lat: "0",
            lon: "0"
        };
        setGeocodeData(fallbackData);
        setAddressData(fallbackData);
      }
    } else {
      setGeocodeData({});
      setAddressData({});
    }
  };

  const autocompleteSx = {
    "& .MuiOutlinedInput-root": {
      color: "white",
      "& fieldset": { borderColor: "rgba(255, 255, 255, 0.5)" },
      "&:hover fieldset": { borderColor: "white" },
      "&.Mui-focused fieldset": { borderColor: "#5b9bd5" },
      "&.Mui-disabled fieldset": { borderColor: "rgba(255, 255, 255, 0.2)" },
    },
    "& .MuiInputLabel-root": { color: "rgba(255, 255, 255, 0.7)" },
    "& .MuiInputLabel-root.Mui-focused": { color: "#5b9bd5" },
    "& .MuiInputLabel-root.Mui-disabled": { color: "rgba(255, 255, 255, 0.3)" },
    "& .MuiSvgIcon-root": { color: "white" },
    // Dropdown styles
    "& + .MuiAutocomplete-popper .MuiAutocomplete-paper": {
      backgroundColor: "#333",
      color: "white",
    },
    "& + .MuiAutocomplete-popper .MuiAutocomplete-option": {
      "&:hover": { backgroundColor: "#444" },
      "&[aria-selected='true']": { backgroundColor: "#555" },
      "&[aria-selected='true']:hover": { backgroundColor: "#666" },
    },
    "& + .MuiAutocomplete-popper .MuiAutocomplete-noOptions": {
      color: "white",
      backgroundColor: "#333"
    },
    "& + .MuiAutocomplete-popper .MuiAutocomplete-loading": {
      color: "white",
      backgroundColor: "#333"
    }
  };

  return (
    <div className={css.container}>
      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3, width: '100%' }}>
        
        {/* Region Select */}
        <Autocomplete
          options={regions}
          getOptionLabel={(option) => option.name}
          value={selectedRegion}
          onChange={(event, newValue) => {
            setSelectedRegion(newValue);
            setSelectedAddress(null);
            setAddressOptions([]);
            setInputValue("");
          }}
          loading={loadingRegions}
          sx={autocompleteSx}
          slotProps={{
             paper: {
               sx: {
                 backgroundColor: "#333",
                 color: "white",
                 "& .MuiAutocomplete-noOptions": { color: "white" },
                 "& .MuiAutocomplete-loading": { color: "white" }
               }
             }
          }}
          renderInput={(params) => (
            <TextField
              {...params}
              label="Оберіть область"
              variant="outlined"
              size="small"
              className={css.input}
              InputProps={{
                ...params.InputProps,
                endAdornment: (
                  <>
                    {loadingRegions ? <CircularProgress color="inherit" size={20} /> : null}
                    {params.InputProps.endAdornment}
                  </>
                ),
              }}
            />
          )}
        />

        {/* Address Search */}
        <Autocomplete
          disabled={!selectedRegion}
          options={addressOptions}
          getOptionLabel={(option) => {
             if (typeof option === 'string') return option;
             return option.full_address || option.name;
          }}
          filterOptions={(x) => x}
          autoComplete
          includeInputInList
          filterSelectedOptions
          value={selectedAddress}
          onChange={handleAddressSelect}
          onInputChange={(event, newInputValue) => {
            setInputValue(newInputValue);
          }}
          loading={loadingAddress}
          noOptionsText="Не знайдено (введіть мінімум 3 літери)"
          sx={autocompleteSx}
          slotProps={{
             paper: {
               sx: {
                 backgroundColor: "#333",
                 color: "white",
                 "& .MuiAutocomplete-noOptions": { color: "white" },
                 "& .MuiAutocomplete-loading": { color: "white" }
               }
             }
          }}
          renderInput={(params) => (
            <TextField
              {...params}
              label="Пошук населеного пункту"
              variant="outlined"
              size="small"
              className={css.input}
              fullWidth
              InputProps={{
                ...params.InputProps,
                endAdornment: (
                  <>
                    {loadingAddress ? <CircularProgress color="inherit" size={20} /> : null}
                    {params.InputProps.endAdornment}
                  </>
                ),
              }}
            />
          )}
          renderOption={(props, option) => {
            const { key, ...optionProps } = props;
            return (
              <li key={key || option.full_address} {...optionProps}>
                <Box>
                  <Typography variant="body1" sx={{ color: "white" }}>{option.name}</Typography>
                  <Typography variant="caption" sx={{ color: "rgba(255, 255, 255, 0.7)" }}>
                    {option.full_address}
                  </Typography>
                </Box>
              </li>
            );
          }}
        />
      </Box>
    </div>
  );
}
