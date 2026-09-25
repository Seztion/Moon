let myName = "";
const channel = new BroadcastChannel('moon_festival_channel'); // ใช้จำลองการส่งข้อมูลระหว่างแท็บ/ผู้เล่นในเครื่องเดียวกัน (หากต้องการเล่นข้ามเครื่องให้อัปเกรดเป็น Firebase ต่อไปได้ครับ)

function joinGame() {
    const input = document.getElementById("username-input").value.trim();
    if (!input) {
        alert("กรุณากรอกชื่อก่อนเข้างานไหว้พระจันทร์ครับ!");
        return;
    }
    myName = input;
    document.getElementById("login-screen").classList.remove("active");
    document.getElementById("game-screen").classList.add("active");

    addSystemMessage(`คุณ ${myName} ได้เข้าร่วมเทศกาลไหว้พระจันทร์แล้ว 🏮`);
    
    // ส่งสัญญาณบอกเพื่อนว่ามีคนเข้าห้อง
    channel.postMessage({ type: 'JOIN', name: myName });
}

function releaseLantern() {
    const wishInput = document.getElementById("wish-input");
    const wishText = wishInput.value.trim() || "สุขสันต์วันไหว้พระจันทร์ 🌕";
    
    // สร้างโคมของตัวเอง
    createLanternElement(myName, wishText);

    // ส่งข้อมูลโคมให้เพื่อนเห็น
    channel.postMessage({ type: 'LANTERN', name: myName, wish: wishText });
    
    wishInput.value = "";
}

function createLanternElement(name, wish) {
    const sky = document.getElementById("sky-lanterns");
    const lantern = document.createElement("div");
    lantern.className = "floating-lantern";
    
    // สุ่มตำแหน่งซ้าย-ขวา
    const randomLeft = Math.random() * 80 + 10;
    lantern.style.left = `${randomLeft}%`;

    lantern.innerHTML = `<strong>${name}</strong><br>"${wish}"`;
    sky.appendChild(lantern);

    // ลบ DOM ทิ้งเมื่ออนิเมชั่นจบ
    setTimeout(() => {
        lantern.remove();
    }, 7000);
}

function sendChatMessage() {
    const chatInput = document.getElementById("chat-input");
    const msg = chatInput.value.trim();
    if (!msg) return;

    appendChat(myName, msg);
    channel.postMessage({ type: 'CHAT', name: myName, message: msg });
    chatInput.value = "";
}

function checkEnter(e) {
    if (e.key === 'Enter') {
        sendChatMessage();
    }
}

function appendChat(name, message) {
    const chatBox = document.getElementById("chat-messages");
    const div = document.createElement("div");
    div.innerHTML = `<b>${name}:</b> ${message}`;
    chatBox.appendChild(div);
    chatBox.scrollTop = chatBox.scrollHeight;
}

function addSystemMessage(message) {
    const chatBox = document.getElementById("chat-messages");
    const div = document.createElement("div");
    div.style.color = "#ffcc00";
    div.style.fontStyle = "italic";
    div.innerHTML = `* ${message}`;
    chatBox.appendChild(div);
    chatBox.scrollTop = chatBox.scrollHeight;
}

// รับข้อมูลจากเพื่อนๆ ผ่าน BroadcastChannel
channel.onmessage = (event) => {
    const data = event.data;
    if (data.type === 'JOIN') {
        addSystemMessage(`${data.name} เข้ามาในงานแล้วจ้า`);
    } else if (data.type === 'LANTERN') {
        createLanternElement(data.name, data.wish);
    } else if (data.type === 'CHAT') {
        appendChat(data.name, data.message);
    }
};
