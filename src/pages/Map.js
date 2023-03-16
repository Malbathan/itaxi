import React, {useEffect, useMemo, useState} from "react";
import { GoogleMap, Marker, useJsApiLoader } from '@react-google-maps/api';
import IconLocation from '../assets/icon-location.png'

export default function Map() {

  const [userPos, setUserPos] = useState({lat: -15.790021, lng: -47.883702})
  console.log(userPos)

  const containerStyle = {width: '100%', height: '100%', position:'absolute'}
  
  const { isLoaded } = useJsApiLoader({
    id: 'google-map-script',
    // Utilizei a chave diretamente pois com o .env ele me gerava uma tela de uso para desenvolvimento
    googleMapsApiKey: "AIzaSyCQ0iWK_d_nwpZFEcvVqKGSLVoVcQCqW8U",
    
  })
  
  
  useEffect(() => {
    navigator.geolocation.getCurrentPosition((pos) =>{
        const newUserPos = { 
              lat: pos.coords.latitude,
              lng: pos.coords.longitude,
         };
        setUserPos(newUserPos)
     }, (err) => {
        console.log(err);
   });
  }, [])
  
  let position = useMemo(() => ({ 
    lat: userPos.lat,
    lng: userPos.lng
  }),[userPos]);

  const markerOptions = {
    icon: IconLocation
  }

  return (
    isLoaded ? (
      <GoogleMap
        mapContainerStyle={containerStyle}
        center={position}
        zoom={18}
        options={{mapTypeControl: false, fullscreenControl: false}}
      >
        <Marker  position={position} options={markerOptions} />
      </GoogleMap>
      
    ) : (
      <></>
        )
  )
}
