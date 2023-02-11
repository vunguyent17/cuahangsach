import Spinner from "react-bootstrap/Spinner";

function LoadingData(){
  return (
      <Spinner animation="border" variant="dark" size="sm">
        <span className="visually-hidden">Loading...</span>
      </Spinner>
  )
}

export default LoadingData