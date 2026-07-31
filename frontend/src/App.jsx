import { useState } from "react";
import axios from 'axios';
import QRCode from "react-qr-code";
import QRCodeGenerator from "qrcode";
const API_BASE_URL=import.meta.env.VITE_BASE_URL;

function  App(){
  const [url,seturl]=useState("");
  const [shortUrl,setshortUrl]=useState("");
  const [copied,setCopied]=useState(false);
  const [qrimage,setQrimage]=useState("");

  const handleShorten=async()=>{
    if (!url) return;
    try{
     const res=await axios.post(`${API_BASE_URL}/shorten`,{
      originalUrl:url
     });
     const newShortUrl=res.data.shortUrl;
     setshortUrl(newShortUrl);
     setCopied(false);
     const qr=await QRCodeGenerator.toDataURL(newShortUrl);
     setQrimage(qr);
    }catch(err){
      console.log(err);
      alert("something went wrong")
    }
  }
   const handleCopy=()=>{
     navigator.clipboard.writeText(shortUrl);
     setCopied(true);
     setTimeout(()=>setCopied(false),2000)
   } 

  return (
  <div className="min-h-screen flex flex-col items-center 
  justify-center p-6">
    <h1 className="text-4xl font-bold mb-4 text-center">MERN URL 
      SHORTNER</h1>
      <div className="flex flex-col gap-3 w-full max-w-3xl">
        <input type="text" className="input input-success w-full" placeholder="Enter long url" value={url}
        onChange={(e)=>seturl(e.target.value)}/>
        <button onClick={handleShorten}
        className="btn btn-primary w-full sm:w-auto">Shorten
         
        </button>
      </div>
      {shortUrl && (
        <div className="flex flex-col items-center max-w-3xl w-full">
          <p className="font-medium mb-2">your short link:</p>
          <a className="link link-primary break-all" href={shortUrl}>{shortUrl} </a>
          <button onClick={handleCopy} className={`btn mt-2 w-full ${
          copied ? "btn-success" : "btn-secondary"
        }`}
        >
            {copied ? "copied" : "copy"}
          </button>
          <div className="bg-white p-4 rounded-lg shadow mt-6">
            <p className="mb-2 text-center font-semibold text-gray-800">Scan QR Code</p>

            <QRCode value={shortUrl} size={180}></QRCode>
            </div>
            {qrimage &&(
              <a className="btn btn-accent mt-3 w-full "href={qrimage} download="qr-code.png">Download Qr code</a>
            )}
          </div>
      )}
   </div>
  );
}

export default App