// ** MUI Imports
import { useTheme } from '@mui/material/styles'
import Box from '@mui/material/Box'
import CircularProgress from '@mui/material/CircularProgress'

const FallbackSpinner = ({ sx }) => {
  // ** Hook
  const theme = useTheme()
  const svgStyles = {
    display: 'block',
    width: '10em',
    height: '10em',
  };

  const pencilRotate = {
    animation: 'pencilRotate 3s linear infinite',
  };

  const pencilStroke = {
    animation: 'pencilStroke 3s linear infinite',
    strokeDashoffset: 439.82,
    strokeDasharray: '439.82 439.82',
    strokeWidth: 2,
    stroke: 'currentColor',
    fill: 'none',
    transform: 'translate(100px,100px) rotate(-113deg)',
  };

  const pencilBody1 = {
    animation: 'pencilBody1 3s linear infinite',
    strokeDashoffset: 402,
    strokeDasharray: '402.12 402.12',
    strokeWidth: 30,
    stroke: 'hsl(223,90%,50%)',
    fill: 'none',
  };

  const pencilBody2 = {
    animation: 'pencilBody2 3s linear infinite',
    strokeDashoffset: 465,
    strokeDasharray: '464.96 464.96',
    strokeWidth: 10,
    stroke: 'hsl(223,90%,60%)',
    fill: 'none',
  };

  const pencilBody3 = {
    animation: 'pencilBody3 3s linear infinite',
    strokeDashoffset: 339,
    strokeDasharray: '339.29 339.29',
    strokeWidth: 10,
    stroke: 'hsl(223,90%,40%)',
    fill: 'none',
  };

  const pencilEraser = {
    animation: 'pencilEraser 3s linear infinite',
    transform: 'rotate(-90deg) translate(49px,0)',
  };

  const pencilEraserSkew = {
    animation: 'pencilEraserSkew 3s ease-in-out infinite',
  };

  const pencilPoint = {
    animation: 'pencilPoint 3s linear infinite',
    transform: 'rotate(-90deg) translate(49px,-30px)',
  };
  return (
    <Box
      sx={{
        height: '100vh',
        display: 'flex',
        alignItems: 'center',
        flexDirection: 'column',
        justifyContent: 'center',
        ...sx
      }}
    >
      <img src='/images/logos/logo ferka2.png' alt='fekraHub' width={500} height={500}/>
     <svg xmlns="http://www.w3.org/2000/svg" height="200px" width="200px" viewBox="0 0 200 200" style={svgStyles}>
      <defs>
        <clipPath id="pencil-eraser">
          <rect height="30" width="30" ry="5" rx="5"></rect>
        </clipPath>
      </defs>
      <circle
        transform="rotate(-113,100,100)"
        strokeLinecap="round"
        style={pencilStroke}
        r="70"
        className="pencil__stroke"
      ></circle>
      <g transform="translate(100,100)" style={pencilRotate}>
        <g fill="none">
          <circle transform="rotate(-90)" style={pencilBody1} r="64" className="pencil__body1"></circle>
          <circle transform="rotate(-90)" style={pencilBody2} r="74" className="pencil__body2"></circle>
          <circle transform="rotate(-90)" style={pencilBody3} r="54" className="pencil__body3"></circle>
        </g>
        <g transform="rotate(-90) translate(49,0)" style={pencilEraser} className="pencil__eraser">
          <g style={pencilEraserSkew} className="pencil__eraser-skew">
            <rect height="30" width="30" ry="5" rx="5" fill="hsl(223,90%,70%)"></rect>
            <rect clipPath="url(#pencil-eraser)" height="30" width="5" fill="hsl(223,90%,60%)"></rect>
            <rect height="20" width="30" fill="hsl(223,10%,90%)"></rect>
            <rect height="20" width="15" fill="hsl(223,10%,70%)"></rect>
            <rect height="20" width="5" fill="hsl(223,10%,80%)"></rect>
            <rect height="2" width="30" y="6" fill="hsla(223,10%,10%,0.2)"></rect>
            <rect height="2" width="30" y="13" fill="hsla(223,10%,10%,0.2)"></rect>
          </g>
        </g>
        <g transform="rotate(-90) translate(49,-30)" style={pencilPoint} className="pencil__point">
          <polygon points="15 0,30 30,0 30" fill="hsl(33,90%,70%)"></polygon>
          <polygon points="15 0,6 30,0 30" fill="hsl(33,90%,50%)"></polygon>
          <polygon points="15 0,20 10,10 10" fill="hsl(223,10%,10%)"></polygon>
        </g>
      </g>
    </svg>
    </Box>
  )
}

export default FallbackSpinner
