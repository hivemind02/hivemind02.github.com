let json_a = {
    renderList: [
        {
            type: "column",
            children: [
                {
                    type: "text",
                    text: "Hello111"
                },
                {
                    type: "row",
                    children: [
                        {
                            type: "text",
                            text: "<font color='blue'>Jetpack</font> Compose!"
                        }
                    ]
                },
                {
                    type: "button",
                    text: "Button",
                    action: "click"
                }
            ]
        }
    ]
}

let json_b = {
    renderList: [
        {
            type: "column",
            children: [
                {
                    type: "text",
                    text: "안녕AAA"
                },
                {
                    type: "row",
                    children: [
                        {
                            type: "text",
                            text: "<font color='red'>제트팩</font> 컴포즈!"
                        }
                    ]
                },
                {
                    type: "button",
                    text: "Button",
                    action: "default"
                }
            ]
        }
    ]
}

var state = 'state_a'

function render() {
    let json
    if (state === 'state_a')
        json = json_a
    else
        json = json_b
    return JSON.stringify(json)
}

function action(event) {
    if (event === 'click')
        state = 'state_b'
    else
        state = 'state_a'
    return render()
}
