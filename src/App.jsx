import { useState } from "react"

function App(){
  const [description, setDescription] = useState("")
  const [reports, setReports] = useState([])
  const [category, setCategory] = useState("pothole")

  function handleAdd(){
    if (!description.trim()) return // dont save an empty report

    const newReport = {
      id: crypto.randomUUID(),
      category: category, 
      description: description,
      createdAt: new Date().toISOString()
    }
    setReports([...reports, newReport])
    setDescription("")
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
          <li key={report.id}>{report.category}: {report.description}</li>
        ))}
      </ul>
    </div>
  )
}
export default App