const api_endpoint = "https://vision.googleapis.com/v1/images:annotate";
const apikey = "AIzaSyBpGkcHXy2xJsuYFGSLUf49yGdXSwwnwD8"; //please don't steal this lmfao
const censored_img_url = "https://0x0.st/izbu.png";
const data_file = chrome.runtime.getURL("data/info.json");
const key_path = chrome.runtime.getURL("data/key.json");
const imgs_path = chrome.runtime.getURL("images/");
var key;
console.log("is this working?");

/*
const text_elements = [
    'h1','h2','h3','h4','h5','h6',
    'ul', 'dir', 'menu', 'li', 'dl', 'dt', 'dd',
    'p', 'pre', 'blockquote', 'address',
    'input', 'span', 'a', 'cite'//,
    //'div'
];
*/

function replace(a, b){ //a is the element to be replaced, b is the tag name
    if(a){
        h = a.offsetHeight;
        w = a.offsetWidth;
        c = document.createElement(b);
        var index;
        while (a.firstChild) {
            c.appendChild(a.firstChild); // *Moves* the child
        }
        // Copy the attributes
        for (index = a.attributes.length - 1; index >= 0; --index) {
            c.attributes.setNamedItem(a.attributes[index].cloneNode());
        }
        // Replace it
        a.parentNode.replaceChild(c, a);
        c.style.height = h + "px";
        c.style.width = w + "px"
        return c;
    }
}

function censor(){
    imgs = document.getElementsByTagName("img");
    for(i=0; i<imgs.length; i++){
        if(imgs[i].src){
            a = imgs[i];
            var req = new XMLHttpRequest();
            req.onload = function(){
                if(this.responseText == "True"){
                    d = replace(a, "div");
                    if(d){
                        d.style.backgroundImage = "url("+censored_img_url+")";
                        d.style.backgroundRepeat = "repeat";
                    }
                }
            }
            req.setRequestHeader("url", a.src)
            req.open("POST", "localhost:5000/api");
            req.send();
        }
    }
}

/*
function detect_imgs(imgdata, i, trigger_list){
    if(imgdata){
        var req = new XMLHttpRequest();
        data = {
            'requests': [{
                'image': {
                    'content': imgdata
                },
                'features': [
                    {
                        'type': 'LABEL_DETECTION',
                        'maxResults': 10
                    }
                ]
            }]
        };
        req.onload = function(){
            censor_dummy(JSON.parse(this.responseText).responses[0].labelAnnotations, trigger_list, i);
        }
        req.open("POST", api_endpoint + "?key=" + apikey);
        //req.setRequestHeader("Authorization")
        req.send(JSON.stringify(data));
    }
}
*/

function censor_dummy(labels, trigger_list, item){
    if(labels){
        imgs = document.getElementsByTagName("img");
        for(i=0; i<labels.length; i++){
            if(trigger_list.includes(labels[i].description.toLowerCase())){
                d = replace(imgs[item], "div");
                if(d){
                    d.style.backgroundImage = "url("+censored_img_url+")";
                    d.style.backgroundRepeat = "repeat";
                }
                break;
            }
        }
    }
}


document.body.style.opacity = 0;
var d_f = new XMLHttpRequest(); //get data_file
var g_k = new XMLHttpRequest(); //get API key
var user_data, trigger_words;
d_f.onload = function(){
    user_data = JSON.parse(this.responseText);
    trigger_words = user_data.trigger_words;
    g_k.onload = function(){
        key = JSON.parse(this.responseText);
        window.onload = function(){
            censor();
        }
        window.onunload = function(){
            censor();
        }
        setTimeout(function(){
            censor();
            document.body.style.opacity = 1;
        }, 2000);
    }
    g_k.open("GET", key_path);
    g_k.send();
}
d_f.open("GET", data_file)
d_f.send()