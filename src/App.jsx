import { useEffect, useState } from "react";
import axios from "axios";
import { QRCodeSVG } from "qrcode.react";
import "./App.css";

function App() {
  const [qrData, setQrData] = useState(null);
  const [guestQR, setGuestQR] = useState([]);

  // Fetch QR Code from the backend
  async function getCode() {
    try {
      const res = await axios.get("https://timemanagementsystemserver.onrender.com/api/QR/get-QRcode");
      console.log(res.data);
      setQrData(res.data); // Only store the data portion
    } catch (error) {
      console.error("Error fetching QR code:", error);
    }
  }

  async function getGuestQRCode() {
    try {
      const res = await axios.get(
        "http://localhost:6070/api/guests/all-events"
      );
      console.log(res.data);
      setGuestQR(res.data); // Only store the data portion
    } catch (error) {
      console.error("Error fetching QR code:", error);
    }
  }

  useEffect(() => {
    getCode();
    getGuestQRCode();
    // Auto-refresh QR Code every 24 hours
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
        gap: 255
      }}
    >
      <div>
        <h2>codeTriber's QR Code</h2>
        {qrData ? (
          <>
            <QRCodeSVG
              value={qrData.id} // Only pass the unique QR code value (scannable: 1739951989684)
              size={396}
              level={"H"} // High error correction level
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
        {guestQR.length > 0 ? (
          guestQR.map((guest, index) => (
            <div key={index} style={{ margin: "10px" }}>
              <QRCodeSVG
                value={guest.eventId} // Only pass the unique event ID value
                size={396}
                level={"H"} // High error correction level
              />
              <p>Event ID: {guest.eventId}</p>
            </div>
          ))
        ) : (
          <p>Loading Guest QR Codes...</p>
        )}
      </div>
    </div>
  );
}

export default App;
