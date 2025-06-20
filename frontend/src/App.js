import { useState } from "react";
import axios from 'axios'
import *  as XLSX from 'xlsx'
function App() {

  const [msg, setmsg] = useState("")
  const [status, setstatus] = useState(false)
  const [emailList, setemailList] = useState("")

  function handlemsg(evt) {
    setmsg(evt.target.value)
  }

  function send() {
    setstatus(true)
    axios.post(`${process.env.REACT_APP_API_URL}/sendemail`, { msg, emailList })

      .then(function (data) {
        if (data.data === true) {
          alert("Email Sent Successfully")
          setstatus(false)
        }
        else {
          alert("Failed")
        }
      })

  }
  function handlefile(event) {
    const file = event.target.files[0]
    console.log(file)
    const reader = new FileReader()

    reader.onload = function (event) {
      const data = event.target.result
      const workbook = XLSX.read(data, { type: "binary" })
      const sheetName = workbook.SheetNames[0]
      const worksheet = workbook.Sheets[sheetName]
      console.log(worksheet)
      const emailList = XLSX.utils.sheet_to_json(worksheet, { header: 'A' })
      const totalemail = emailList.map(function (item) {
        return item.A
      })
      console.log(totalemail)
      setemailList(totalemail)
    }

    reader.readAsBinaryString(file)

  }

  return (
    <div className="text-center">
      <div className="bg-blue-950 text-white text-center">
        <h1 className="text-2xl font-medium px-5 py-3">BulkMail</h1>
      </div>
      <div className="bg-blue-800 text-white text-center">
        <h1 className=" font-medium px-5 py-3">We can help your business with sending multiple emails at once</h1>
      </div>
      <div className="bg-blue-600 text-white text-center">
        <h1 className=" font-medium px-5 py-3">Drag and Drop</h1>
      </div>

      <div className="bg-blue-400 flex flex-col items-center text-black px-5 py-3">
        <textarea onChange={handlemsg} value={msg} className="w-[80%] h-32 py-2 outline-none px-2 border norder-black rounded-md " placeholder="Enter the email text...."></textarea>

        <div>
          <input type="file" onChange={handlefile} className="border-4 border-dashed py-4 px-4 mt-5 mb-5 "></input>
          <p>Total Emails in the file:{emailList.length}</p>
        </div>
        <button onClick={send} className="bg-blue-950 px-2 py-2 mt-3 text-white font-medium rounded-md w-fit">{status ? "Sending..." : "Send"}</button>
      </div>
      <div className="bg-blue-300 text-white text-cente p-8">

      </div>

      <div className="bg-blue-200 text-white text-center p-8">

      </div>

    </div>
  );
}

export default App;