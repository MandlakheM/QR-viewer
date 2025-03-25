import { useEffect, useState } from "react";
import axios from "axios";
import { QRCodeSVG } from "qrcode.react";
import "./App.css";

function App() {
  const [qrData, setQrData] = useState(null);
  const [guestQR, setGuestQR] = useState([]);

  async function getCode() {
    try {
      const res = await axios.get(
        "https://timemanagementsystemserver.onrender.com/api/QR/get-QRcode"
      );
      // console.log(res.data);
      setQrData(res.data); 
    } catch (error) {
      console.error("Error fetching QR code:", error);
    }
  }

  async function getGuestQRCode() {
    try {
      const res = await axios.get(
        "https://timemanagementsystemserver.onrender.com/api/guests/event-QR"
      );
      // console.log(res.data);
      setGuestQR(res.data); 
    } catch (error) {
      console.error("Error fetching QR code:", error);
    }
  }

  useEffect(() => {
    getCode();
    getGuestQRCode();
    const interval = setInterval(getCode, 24 * 60 * 60 * 1000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div
      style={{
        textAlign: "center",
        marginTop: "50px",
        display: "flex",
        alignItems: "center",
        gap: 255,
      }}
    >
      <div>
        <h2>codeTriber's QR Code</h2>
        {qrData ? (
          <>
            <QRCodeSVG
              value={qrData.id} 
              size={396}
              level={"H"} 
            />
            <p>
              Valid until: {new Date(qrData.validUntil).toLocaleTimeString()}
            </p>
          </>
        ) : (
          <p>Loading QR Code...</p>
        )}
      </div>
      <div>
        <h2>Guest QR Codes</h2>
        {guestQR && (
          <div style={{ margin: "10px" }}>
            <QRCodeSVG
              value={guestQR.url} 
              size={396}
              level={"H"} 
            />
            {/* <p>Event ID: {guest.eventId}</p> */}
          </div>
        )}
        <p>Loading Guest QR Codes...</p>
      </div>
    </div>
  );
}

export default App;
