import Container from 'react-bootstrap/Container';
import Navbar from 'react-bootstrap/Navbar';

function StickyHeader() {
  return (
    <>
      <Navbar style={{background: "linear-gradient(270deg,orange,lightblue,blue)", animation: "2s infinite alternate linear"}} sticky="top">
          <div class="container" >
            <a ><img
              src={require('../Images/feedback.png')} width="150%" height="50" /></a>
          </div>
      </Navbar>
      <br />
    </>
  );
}

export default StickyHeader;