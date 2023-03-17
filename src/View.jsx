import React from 'react'
import ThreeJS from './ThreeJS'

import Image from './assets/panorama/Building.jpg'

const View = () => {
  return (
    <ThreeJS image={Image} />
  )
}

export default View