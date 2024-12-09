import React from 'react'
// import images from '../../assets/images'
import Lottie from 'lottie-react'

interface HeadingProps {
  lottieAnimation: object
  loopComplete?: () => void
}
function LottieAnima ({ lottieAnimation, loopComplete }: HeadingProps): ReturnType<React.FC> {
  return (
        <Lottie animationData={lottieAnimation} loop={true} allowFullScreen={true} onLoopComplete={loopComplete}/>
  )
}

export default LottieAnima
