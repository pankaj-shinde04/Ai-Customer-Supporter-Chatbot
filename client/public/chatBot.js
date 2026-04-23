(function () {
  const api_Url = "http://localhost:3001/api/chat";

  const scriptTag = document.currentScript;
  const ownerId = scriptTag.getAttribute("data-owner-id");

  if (!ownerId) {
    console.error("Owner ID not found");
    return;
  }

  const button = document.createElement("div");
  button.innerHTML = "🗨️";
  Object.assign(button.style, {
    position: "fixed",
    bottom: "24px",
    right: "24px",
    width: "56px",
    height: "56px",
    borderRadius: "50%",
    backgroundColor: "#000",
    color: "#fff",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    cursor: "pointer",
    zIndex: "999999",
    fontSize: "22px",
    boxShadow: "0 15px 40px rgba(0,0,0,0.35)",
  });

  document.body.appendChild(button);

  const box = document.createElement("div");
  Object.assign(box.style, {
    position: "fixed",
    bottom: "90px",
    right: "24px",
    width: "320px",
    height: "420px",
    borderRadius: "14px",
    backgroundColor: "#fff",
    display: "none",
    boxShadow: "0 15px 40px rgba(0,0,0,0.25)",
    flexDirection: "column",
    overflow: "hidden",
    zIndex: "999999",
    fontFamily: "Inter, system-ui, sans-serif",
  });

  box.innerHTML = `<div style="
    background: #000;
    color: #fff;
    padding: 12px 14px;
    font-size: 14px;
   display: flex;
   align-items: center;
   justify-content: space-between;
   "> 
    <span>Customer Support</span> 
    <span style="cursor: pointer; font-size:16px" id="close-btn">X</span>

   </div>
    <div id="messages" style="
    flex: 1;
    padding: 12px;
    display: flex;
    flex-direction: column;
    overflow-y: auto;
    background: #f9fafb;
    "></div>

    <div style="
   display: flex;
   border-top: 1px solid #eee;
   padding: 8px;
   gap: 6px;
   ">
    <input id="chat-input" type:"text" style="
    flex: 1;
    padding: 8px 10px;
    border: 1px solid #d1d5db;
    border-radius: 8px;
    font-size: 14px;
    outline: none;
    
    " placeholder="Type a message"/>
    <button id="chat-send" style="
    padding: 8px 16px;
    background: #000;
    color: #fff;
    border: none;
    border-radius: 8px;
    cursor: pointer;
    font-size: 14px;
    
    ">send</button>
    </div>
`;

  document.body.appendChild(box);

  button.onclick=()=>{
    box.style.display = box.style.display === "none" ? "flex" : "none";
  } 
  
  document.querySelector("#close-btn").onclick = ()=>{
    box.style.display = "none";
  }

  const input = document.querySelector("#chat-input");
 const sendBtn = document.querySelector("#chat-send");
 const messagesArea = document.querySelector("#messages");

 function addMessage(text,from) {
    const bubble = document.createElement("div");
    bubble.innerHTML = text;
    Object.assign(bubble.style,{
        maxWidth: "78%",
        padding: "8px 12px",
        borderRadius: "12px",
        fontSize: "13px",
        lineHeight: "1.4",
        marginBottom: "8px",
        
        alignSelf: from === "user" ? "flex-end" : "flex-start",
        background: from === "user" ? "#000" : "#e5e7eb",
        color: from === "user" ? "#fff" : "#111",

        // bubble direction polish
        borderBottomRightRadius: from === "user" ? "4px" : "12px",
        borderBottomLeftRadius: from === "user" ? "14px" : "4px",
    });
    messagesArea.appendChild(bubble);
    messagesArea.scrollTop = messagesArea.scrollHeight;

 }

 sendBtn.onclick = async ()=>{
    const text = input.value.trim();
    if(!text){
        return
    }
    addMessage(text,"user");
    input.value = "";

    const typing = document.createElement("div");
    typing.innerHTML = "Typing...";
    Object.assign(typing.style,{
        fontSize: "12px",
        color: "#6b7280",
        marginBottom: "8px",
        alignSelf: "flex-start",
        fontStyle: "italic",
    });
    messagesArea.appendChild(typing);
    messagesArea.scrollTop = messagesArea.scrollHeight;

    try {
       const response = await fetch(api_Url,{
        method: "POST",
        headers: {
            "Content-Type": "application/json"},
        body: JSON.stringify({ownerId,message:text})    

       })
    
       const data = await response.json();
       messagesArea.removeChild(typing);
       addMessage(data || "something went wrong","ai");

    } catch (error) {
       console.log(error);
       
        messagesArea.removeChild(typing);
       addMessage(data || "something went wrong","ai");

    }
 }


})(); // immediate invoked function expression for chat bot, to avoid polluting global namespace
