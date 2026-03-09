const API="https://phi-lab-server.vercel.app/api/v1/lab/issues"

const issuesDiv=document.getElementById("issues")

let allIssues=[]


function login(){

document.getElementById("loginPage").classList.add("hidden")
document.getElementById("dashboard").classList.remove("hidden")

loadIssues()

}


async function loadIssues(){

const res=await fetch(API)
const data=await res.json()

allIssues=data.data

displayIssues(allIssues)

updateIssueCount()

}



function updateIssueCount(){

const total=allIssues.length
const open=allIssues.filter(i=>i.status==="open").length
const closed=allIssues.filter(i=>i.status==="closed").length

document.querySelector("h3.font-bold").innerText=`${total} Issues`

const statusLabels=document.querySelectorAll(".flex.items-center p.text-sm")

if(statusLabels[0]) statusLabels[0].innerText=`Open (${open})`
if(statusLabels[1]) statusLabels[1].innerText=`Closed (${closed})`

}



function displayIssues(issues){

issuesDiv.innerHTML=""

issues.forEach(issue=>{

const card=document.createElement("div")

const priorityColor =
issue.priority==="high"
? "bg-red-100 text-red-600"
: issue.priority==="medium"
? "bg-yellow-100 text-yellow-600"
: "bg-gray-200 text-gray-600"

const borderColor =
issue.status==="open"
? "border-green-600"
: "border-[#A855F7]"

const statusIcon =
issue.status==="open"
? "./assets/Open-Status.png"
: "./assets/Closed- Status .png"


const labelsHTML = issue.labels.map(label => {

let style="bg-gray-100 text-gray-600"

if(label==="bug") style="bg-red-100 text-red-500"
if(label==="enhancement") style="bg-green-100 text-green-600"
if(label==="help wanted") style="bg-yellow-100 text-yellow-600"

return `<span class="${style} text-xs px-2 py-1 rounded-full font-semibold">
${label.toUpperCase()}
</span>`

}).join("")

const date = new Date(issue.createdAt).toLocaleDateString()



card.className=`bg-white rounded-xl border-t-4 ${borderColor} p-4 shadow-sm hover:shadow-lg cursor-pointer transition`

card.innerHTML=`

<div class="flex justify-between items-center mb-3">

<div class="flex items-center gap-2">
<img src="${statusIcon}" class="w-6 h-6"/>
</div>

<span class="text-xs font-semibold px-3 py-1 rounded-full ${priorityColor}">
${issue.priority.toUpperCase()}
</span>

</div>


<h3 class="font-semibold text-gray-800 mb-2">
${issue.title}
</h3>


<p class="text-sm text-gray-500 mb-4">
${issue.description.slice(0,80)}
</p>


<div class="flex gap-2 mb-4 flex-wrap">
${labelsHTML}
</div>


<div class="text-xs text-gray-400">

<p>#${issue.id} by ${issue.author}</p>
<p>${date}</p>

</div>

`

card.onclick=()=>openIssue(issue.id)

issuesDiv.appendChild(card)

})

}



async function openIssue(id){

const res=await fetch(
`https://phi-lab-server.vercel.app/api/v1/lab/issue/${id}`
)

const data=await res.json()

const issue=data.data

document.querySelector("#modal h2").innerText=issue.title
document.querySelector("#modal p.text-gray-600").innerText=issue.description

document.getElementById("modalAssignee").innerText=issue.assignee || "Unknown"
document.getElementById("modalUser").innerText=`Opened by ${issue.assignee || "Unknown"}`
document.getElementById("modalDate").innerText="22/02/2026"

const priority=document.getElementById("modalPriority")

priority.innerText=issue.priority.toUpperCase()

priority.className=`text-xs px-3 py-1 rounded-full ${
issue.priority==="high"
?"bg-red-500 text-white"
:issue.priority==="medium"
?"bg-yellow-500 text-white"
:"bg-gray-400 text-white"
}`

document.getElementById("modal").classList.remove("hidden")

}



document.getElementById("search").addEventListener("keyup",async(e)=>{

const q=e.target.value

if(q.length<2){

displayIssues(allIssues)
return

}

const res=await fetch(
`https://phi-lab-server.vercel.app/api/v1/lab/issues/search?q=${q}`
)

const data=await res.json()

displayIssues(data.data)

})



function filterStatus(status,el){

document.querySelectorAll(".tab").forEach(tab=>{

tab.classList.remove("bg-purple-600","text-white")
tab.classList.add("border")

})

el.classList.remove("border")
el.classList.add("bg-purple-600","text-white")

if(!status){

displayIssues(allIssues)
return

}

const filtered=allIssues.filter(i=>i.status===status)

displayIssues(filtered)

}