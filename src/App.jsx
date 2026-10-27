import { useState, useRef, useCallback} from "react"
import db from "./db"
import { useLiveQuery } from "dexie-react-hooks"
import Webcam from "react-webcam"

function App(){
  const [description, setDescription] = useState("")
  const reports = useLiveQuery(() => db.reports.orderBy("createdAt").reverse().toArray()) ?? []


  const [category, setCategory] = useState("pothole")
  const [editingId, setEditingId] = useState(null)
  const [editText, setEditText] = useState("")
  const [photo, setPhoto] = useState(null)
  
  function capture(){
    const image = webcamRef.current.getScreenshot() 
    setPhoto(image)
  }
  //change one report by its id without changing others
  function updateReport(id, changes){
    db.reports.update(id, changes)
  }

  function deleteReport(id){
      db.reports.delete(id)
  }

 async function handleAdd(){
    if (!description.trim()) return // dont save an empty report

    //Create report straight away marked as "locating"
    const newReport = {
      category: category, 
      description: description,
      createdAt: new Date().toISOString(),
      status: "locating"
    }
    const id = await db.reports.add(newReport)
    setDescription("")
    
    //check if browser can do location
    if (!("geolocation" in navigator)){
      updateReport(id, {status: "No location support"})
      return
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        updateReport(id, {
          lat: position.coords.latitude,
          lng: position.coords.longitude,
          status: "located"
        })
      },
      (error) => {
        //Failure, permission denied, unavailable or timed out
        console.log("Location error:", error.message)
        updateReport(id, {status: "Location failed"})
      },
      {enableHighAccuracy: true, timeout: 10000}
    )
  }
  const webcamRef = useRef(null)
  const videoConstraints={
    width: 1280,
    height: 720,
    facingMode: "environment"
  }
  return(
    <div>
      <Webcam videoConstraints={videoConstraints} ref={webcamRef}></Webcam>
      <select value = {category} onChange={(e) => setCategory(e.target.value)}>
        <option value="pothole">Pothole</option>
        <option value="damaged sign">Damaged sign</option>
        <option value="broken streetlight">Broken streetlight</option>
        <option value="flooding">Flooding</option>
        <option value="other">Other</option>
      </select>
      <textarea value = {description} onChange={(e) => setDescription(e.target.value)} />
      <button onClick={handleAdd}>Submit Report</button>
      <button onClick={capture}>Take Photo</button>
      {photo && <img src={photo} alt="Captured" width="300" />}

      <ul>
        {reports.map((report) => (
          <li 
          key={report.id}>{report.category}: {report.description} ({report.status}) 
          <button onClick={() => deleteReport(report.id)}>Delete</button>
          <button 
          onClick={() => {setEditingId(report.id); setEditText(report.description)}}
            >Edit</button>
          </li>

        ))}
      </ul>
    </div>
  )
}
export default App