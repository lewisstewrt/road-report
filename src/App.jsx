import { useState, useEffect } from "react"

function App(){
  const [description, setDescription] = useState("")
  const [reports, setReports] = useState(() => {
  const saved = localStorage.getItem("reports")
  return saved ? JSON.parse(saved) : []
})
  const [category, setCategory] = useState("pothole")
  
  useEffect(() =>{
    localStorage.setItem("reports", JSON.stringify(reports))
  }, [reports])
  
  //change one report by its id without changing others
  function updateReport(id, changes){
    setReports(prev => prev.map(r =>
      r.id === id ? {...r, ...changes} : r
    ))
  }

  function deleteReport(id){
      setReports(prev => prev.filter(r => r.id !== id))
  }

  function handleAdd(){
    if (!description.trim()) return // dont save an empty report

    //Create report straight away marked as "locating"
    const newReport = {
      id: crypto.randomUUID(),
      category: category, 
      description: description,
      createdAt: new Date().toISOString(),
      status: "locating"
    }
    setReports([...reports, newReport])
    setDescription("")
    
    //check if browser can do location
    if (!("geolocation" in navigator)){
      setReports(prev => prev.map(r =>
        r.id === newReport.id ? {...r, status: "No location support"} : r
      ))
      return
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        updateReport(newReport.id, {
          lat: position.coords.latitude,
          lng: position.coords.longitude,
          status: "located"
        })
      },
      (error) => {
        //Failure, permission denied, unavailable or timed out
        console.log("Location error:", error.message)
        updateReport(newReport.id, {status: "Location failed"})
      },
      {enableHighAccuracy: true, timeout: 10000}
    )
  }
  return(
    <div>
      <select value = {category} onChange={(e) => setCategory(e.target.value)}>
        <option value="pothole">Pothole</option>
        <option value="damaged sign">Damaged sign</option>
        <option value="broken streetlight">Broken streetlight</option>
        <option value="flooding">Flooding</option>
        <option value="other">Other</option>
      </select>
      <textarea value = {description} onChange={(e) => setDescription(e.target.value)} />
      <button onClick={handleAdd}>Submit Report</button>

      <ul>
        {reports.map((report) => (
          <li 
          key={report.id}>{report.category}: {report.description} ({report.status}) 
          <button onClick={() => deleteReport(report.id)}>Delete</button>
          </li>

        ))}
      </ul>
    </div>
  )
}
export default App