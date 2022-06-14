import Spinner from "react-bootstrap/Spinner";

function LoadingData(){
  return (
    <div className="table-cell vertical-align text-secondary text-center">
      <Spinner animation="border" variant="success">
        <span className="visually-hidden">Loading...</span>
      </Spinner>
      <span className="mx-3 fs-3">Đang tải ...</span>
    </div>
  )
}

export default LoadingData