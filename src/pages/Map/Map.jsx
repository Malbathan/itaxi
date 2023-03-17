import { useRef, useState, useEffect } from 'react'
import { Style } from './MapStyle'
import './Map.css'
import {
  Box, Button, ButtonGroup, Flex, Modal, ModalContent, ModalHeader, ModalCloseButton, ModalBody, ModalFooter,
  ModalOverlay, HStack, VStack, IconButton, Input, Image, useDisclosure, Text, RadioGroup, Radio
} from '@chakra-ui/react'
import { FaLocationArrow, FaTimes } from 'react-icons/fa'

import car1 from '../../assets/car1.png'
import car2 from '../../assets/car2.png'
import car3 from '../../assets/car3.png'

import * as api from '@react-google-maps/api'

const libraries = ['places']

function Map() {
  const { isLoaded } = api.useJsApiLoader({
    googleMapsApiKey: process.env.REACT_APP_GOOGLE_MAPS_API_KEY,
    libraries: libraries,
  })

  const [map, setMap] = useState(/** @type google.maps.Map */(null))
  const [directionsResponse, setDirectionsResponse] = useState(null)
  const [isOpenDriver, setIsOpenDriver] = useState(false)
  const [disable, setDisable] = useState(true)
  const [distance, setDistance] = useState('')
  const [duration, setDuration] = useState('')
  const [value, setValue] = useState('')
  const [price, setPrice] = useState({ priceX: '', priceComfort: '', priceDeluxe: '' })
  const [userPos, setUserPos] = useState({ lat: -15.790021, lng: -47.883702 })
  const {isOpen, onOpen, onClose} = useDisclosure()
  const originRef = useRef()
  const destinationRef = useRef()

  // Posição inicial do Mapa.
  useEffect(() => {

    navigator.geolocation.getCurrentPosition((pos) => {
      const newUserPos = {
        lat: pos.coords.latitude,
        lng: pos.coords.longitude,
      };
      setUserPos(newUserPos)
    }, (err) => {
      console.log(err);
    });

  }, [])

  // Efeito ao traçar rota e trazer valores 
  useEffect(() => {

    const TableOfPrices = {
      x: 1.20,
      comfort: 2.20,
      deluxe: 3.20
    }
    if (!!distance) {
      let distanceNumber = parseFloat(distance.replace(',', '.'));
      let durationNumber = parseFloat(duration.replace(/\D/gim, ''));


      let price1 = distanceNumber + durationNumber / 2 * TableOfPrices.x
      let price2 = distanceNumber + durationNumber / 2 * TableOfPrices.comfort
      let price3 = distanceNumber + durationNumber / 2 * TableOfPrices.deluxe

      const newPrice = {
        priceX: price1.toFixed(2),
        priceComfort: price2.toFixed(2),
        priceDeluxe: price3.toFixed(2)
      }

      setPrice(newPrice)
    }

  }, [distance, duration])

  // Ativar botão de escolha de carro
  useEffect(() => {

    if (value.length > 0) {
      setDisable(false)
    }

  }, [value])

  if (!isLoaded) {
    return null
  }

  async function calculateRoute() {

    if (originRef.current.value === '' || destinationRef.current.value === '') {
      return
    }

    // eslint-disable-next-line no-undef
    const directionsService = new google.maps.DirectionsService()
    const results = await directionsService.route({
      origin: originRef.current.value,
      destination: destinationRef.current.value,
      // eslint-disable-next-line no-undef
      travelMode: google.maps.TravelMode.DRIVING,
    })

    setDirectionsResponse(results)
    setDistance(results.routes[0].legs[0].distance.text)
    setDuration(results.routes[0].legs[0].duration.text)
  }

  function clearRoute() {

    setDirectionsResponse(null)
    setDistance('')
    setDuration('')
    originRef.current.value = ''
    destinationRef.current.value = ''
    setPrice({ priceX: '', priceComfort: '', priceDeluxe: '' });

  }


  function routeHandleClick() {

    if (originRef.current.value && destinationRef.current.value) {
      calculateRoute();
      onOpen()
    }

  }

  function handleGoodChoise() {
    onClose()
    setIsOpenDriver(true)
  }

  function closeDriverModal() {
    setIsOpenDriver(false)
  }

  return (
    <Flex
      position='relative'
      flexDirection='column'
      alignItems='center'
      h='100vh'
      w='100vw'
    >
      <Box position='absolute' left={0} top={0} h='100%' w='100%'>

        <api.GoogleMap
          center={userPos}
          zoom={18}
          mapContainerStyle={{ width: '100%', height: '100%' }}
          options={{
            zoomControl: false,
            streetViewControl: false,
            mapTypeControl: false,
            fullscreenControl: false,
            styles: Style
          }}
          onLoad={map => setMap(map)}
        >
          <api.Marker position={userPos} />
          {directionsResponse && (
            <api.DirectionsRenderer directions={directionsResponse} />
          )}
        </api.GoogleMap>
      </Box>
      <Box
        p={4}
        borderRadius='lg'
        m={4}
        bgColor='white'
        shadow='base'
        minW='container.md'
        zIndex='1'
      >
        <HStack spacing={2} justifyContent='space-between'>
          <Box flexGrow={1}>
            <api.Autocomplete>
              <Input type='text' placeholder='Origem' ref={originRef} />
            </api.Autocomplete>
          </Box>
          <Box flexGrow={1}>
            <api.Autocomplete>
              <Input
                type='text'
                placeholder='Destino'
                ref={destinationRef}
              />
            </api.Autocomplete>
          </Box>

          <ButtonGroup>
            <Button
              colorScheme='pink'
              type='submit'
              onClick={routeHandleClick}
            >
              Rotas
            </Button>
            <IconButton
              aria-label='center back'
              icon={<FaTimes />}
              onClick={clearRoute}
            />
          </ButtonGroup>
        </HStack>
        <HStack spacing={4} mt={4} justifyContent='space-between'>
          <Text as='b'>Distancia: {distance} </Text>
          <Text as='b'>Duração: {duration} </Text>
          <IconButton
            aria-label='center back'
            icon={<FaLocationArrow />}
            isRound
            onClick={() => {
              map.panTo(userPos)
              map.setZoom(15)
            }}
          />
        </HStack>

        <Modal isCentered isOpen={isOpen} onClose={onClose}>
          <ModalOverlay
            bg='blackAlpha.300'
            backdropFilter='blur(10px) hue-rotate(90deg)'
          />
          <ModalContent>
            <ModalHeader>Escolha sua caranga! ;) </ModalHeader>
            <ModalCloseButton />
            <ModalBody>
              <RadioGroup onChange={setValue} value={value} width="100%">
                <VStack  width="100%" >
                  <Radio value='1' width="100%" >
                    <HStack  width="100%">
                      <Image src={car1} boxSize='100px' objectFit='full' alt='fusca azul' />
                      <Text as='b'> X-fusca </Text>
                      <Text as='b' ml='auto'>R${price.priceX}</Text>
                    </HStack>
                  </Radio>
                  <Radio value='2' width="100%" >
                    <HStack width="100%">
                      <Image src={car2} boxSize='100px' objectFit='full' alt='Combi laranja' />
                      <Text as='b'> Combi-Comfort </Text>
                      <Text as='b' ml='auto'>R${price.priceComfort}</Text>
                    </HStack>
                  </Radio>
                  <Radio value='3' width="100%" >
                    <HStack  width="100%">
                      <Image src={car3} boxSize='100px' objectFit='full' alt='carro de luxo vintage' />
                      <Text as='b'> Cadilac - Bip Bip! </Text>
                      <Text as='b' ml='auto'>R${price.priceDeluxe}</Text>
                    </HStack>
                  </Radio>
                </VStack>
              </RadioGroup>
            </ModalBody>
            <ModalFooter>
              <Button onClick={handleGoodChoise} disabled={disable} mr="2" colorScheme='yellow' >Boa escolha!</Button>
              <Button onClick={onClose}>Fechar</Button>
            </ModalFooter>
          </ModalContent>
        </Modal>
      </Box>

      <Modal isCentered isOpen={isOpenDriver} onClose={closeDriverModal} >
        <ModalOverlay
          bg='none'
          backdropFilter='auto'
          backdropInvert='80%'
          backdropBlur='2px'
        />
        <ModalContent>
          <ModalHeader>Seu motora está a caminho! ;)</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <Image src='https://pbs.twimg.com/media/D_jKTlLXoAAYUS-.jpg:large' alt='Agostinho Carrara'>

            </Image>
          </ModalBody>
        </ModalContent>
      </Modal>
    </Flex>
  )
}

export default Map