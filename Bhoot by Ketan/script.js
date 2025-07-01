let prompt = document.querySelector("#prompt")
let chatContainer = document.querySelector(".chat-container")
let imagebtn = document.querySelector("#image");
let imageInput = document.querySelector("#image input")

const API_URL = "https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=AIzaSyCIKFErlJWP547DFUH42MDieHkdjFvleu4";


let user= {
    message:null,
    file:{
        mime_type: null,
        data : null
    }
}

async function generateResponse(aiChatBox){

    let text = aiChatBox.querySelector(".ai-chat-area");
    let RequestOption={
        method:"POST",
        headers: {'Content-Type' : 'application/json'},
        body: JSON.stringify({
            "contents":[
                {"parts": [{"text": "user.message"}, (user.file.data?[{"inline_data":user.file}]:[])

                ]
            }]
        })
    }

    try{
        let response = await fetch(API_URL, RequestOption)
        let data = await response.json();
        let apiResponse = data.candidates[0].content.parts[0].text.replace(/\*\*(.*?)\*\*/g, "$1").trim();
        text.innerHTML = apiResponse;
    }
    catch(error) {
        console.log(error);
    }

    finally{
        chatContainer.scrollTo({top:chatContainer.scrollHeight, behavior:"smooth"})
    }
}

function createChatBox(html, classes){
    let div = document.createElement("div")
    div.innerHTML = html;
    div.classList.add(classes)

    return div;
}


function handlechatResponse(userMessage){

    user.message = userMessage;

    let html = `<img src="user.png" alt="" id="userImage" width="50px">
            <div class="user-chat-area">
                ${user.message}
                ${user.file.data ? <img src="data:${user.file.mime_type};base64, ${user.file.data}" class="chooseimg" /> : "" }
            </div>`


    prompt.value = "";

    let userChatBox = createChatBox(html, "user-chat-box");

    chatContainer.appendChild(userChatBox);

    chatContainer.scrollTo({top:chatContainer.scrollHeight, behavior:"smooth"})

    setTimeout(() => {

        let html = `<img src="ai.png" alt="" id="aiImage" width="50px">
            <div class="ai-chat-area">
                <img src="loading.gif" alt="" class="load" width="50px">
            </div>`
            
            let aiChatBox = createChatBox(html, "ai-chat-box");
            chatContainer.appendChild(aiChatBox);

            generateResponse(aiChatBox)
    }, 600)
}




prompt.addEventListener("keydown", (e)=> {

    if(e.key == "Enter"){
        handlechatResponse(prompt.value);
    }
    
})

imageInput.addEventListener("change", ()=> {
    const file = imageInput.files[0];
    if(!file) return;

    let reader = new FileReader()
    reader.onload = (e) => {
        let base64String = e.target.result.split(",")[1];
        user.file={
            mime_type: file.type,
            data: base64String
        }
    }

    reader.readAsDataURL(file)
})

imagebtn.addEventListener("click", ()=> {
    imagebtn.querySelector("input").click();
})