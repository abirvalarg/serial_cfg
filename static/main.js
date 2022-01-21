setSchemeBtn.onclick = (event) => {
	event.preventDefault();
	let xhr = new XMLHttpRequest();
	xhr.open("post", "/scheme", true);
	xhr.responseType = 'json';
	xhr.onloadend = () => {
		if(xhr.status == 200) {
			scheme.innerText = schemeFile.files[0].name;
			schemeMsg.style = "display: none;";
			fieldPlace.innerHTML = "";
			xhr.response.fields.forEach((name) => {
				let el = document.createElement("div");
				let title = document.createElement("h3");
				title.innerText = name;
				el.appendChild(title);
				let form = document.createElement("form");
				let field = document.createElement("input");
				field.type = "number";
				form.appendChild(field);
				let btn = document.createElement("input");
				btn.type = "submit";
				btn.value = "send";
				btn.onclick = (event) => {
					event.preventDefault();
					send_param(name, field.value);
				}
				form.appendChild(btn);
				el.appendChild(form);
				fieldPlace.appendChild(el);
			});
		} else {
			schemeMsg.style = "display: block;";
			schemeMsg.innerText = "Couldn't load scheme: " +
				xhr.responseText;
		}
	}
	let data = new FormData();
	data.append("scheme", schemeFile.files[0]);
	xhr.send(data);
}

interfaceBtn.onclick = (event) => {
	event.preventDefault();
	let xhr = new XMLHttpRequest();
	xhr.open("post", "/open", true);
	xhr.onloadend = () => {
		if(xhr.status == 200) {
			interface.innerText = interfaceIn.value;
			interfaceMsg.style = "display: none;";
		} else {
			interfaceMsg.style = "display: block;";
			interfaceMsg.innerText = "Couldn't open interface";
		}
	}
	xhr.send(new FormData(interfaceForm));
}

function send_param(name, value) {
	let xhr = new XMLHttpRequest();
	xhr.open("post", "/send", true);
	let data = new FormData();
	data.append('name', name);
	data.append('value', value);
	xhr.onloadend = () => {
		if(xhr.status == 200) {
			errorMsg.innerText = "";
		} else {
			errorMsg.innerText = "Can't send params: " + xhr.responseText;
		}
	}
	xhr.send(data);
}
