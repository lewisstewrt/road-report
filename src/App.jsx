import { useState } from "react"

function App(){
  const [description, setDescription] = useState("")
  const [reports, setReports] = useState([])

  function handleAdd(){
    const newReport = {id: crypto.randomUUID(), description: description}
    setReports([...reports, newReport])
    setDescription("")
  }
  return(
    <div>
      <textarea value = {description} onChange={(e) => setDescription(e.target.value)} />
      <button onClick={handleAdd}>Submit Report</button>

      <ul>
        {reports.map((report) => (
          <li key={report.id}>{report.description}</li>
        ))}
      </ul>
    </div>
  )
}
export default App