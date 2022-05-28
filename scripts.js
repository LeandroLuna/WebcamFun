const video = document.querySelector('.player'); // Webcam
const canvas = document.querySelector('.photo'); // Manipulações
const ctx = canvas.getContext('2d');
const strip = document.querySelector('.strip');
const snap = document.querySelector('.snap');

function getVideo() {
    navigator.mediaDevices.getUserMedia({
        video: true,
        audio: false
    }).then(localMediaStream => {
        video.srcObject = localMediaStream
        video.play()
    }).catch(e => {
        console.error(`OH NOOO!`, e)
    })
}


function paintToCanvas() {
    const width = video.videoWidth
    const height = video.videoHeight
    canvas.width = width
    canvas.height = height

    return setInterval(() => {
        ctx.drawImage(video, 0, 0, width, height)

        //take the pixels 
        let pixels = ctx.getImageData(0, 0, width, height)

        //change the pixels colors
        // // pixels = redEffect(pixels)
        // pixels = rgbSplit(pixels)
        // ctx.globalAlpha = 0.1;
        pixels = greenScreen(pixels)

        //reaply them back
        ctx.putImageData(pixels, 0, 0)
    })
}

function takePhoto() {
    //play the sound
    snap.currentTime = 0
    snap.play()

    //take the data out of the canvas
    const data = canvas.toDataURL('image/jpeg')
    const link = document.createElement('a')
    link.href = data
    link.setAttribute('download', 'image')
    link.innerHTML = `<img src="${data}" alt="Image from canvas"/>`
    strip.insertBefore(link, strip.firstChild)
}

function redEffect(pixels) {
    for (let i = 0; i < pixels.data.length; i += 4) {
        pixels.data[i + 0] = pixels.data[i + 0] + 100 // Red
        pixels.data[i + 1] = pixels.data[i + 1] - 50 // Green
        pixels.data[i + 2] = pixels.data[i + 2] * 0.5 // Blue

    }
    return pixels
}

function rgbSplit(pixels) {
    for (let i = 0; i < pixels.data.length; i += 4) {
        pixels.data[i - 150] = pixels.data[i + 0] // Red
        pixels.data[i + 100] = pixels.data[i + 1] // Green
        pixels.data[i - 150] = pixels.data[i + 2] // Blue

    }
    return pixels
}


function greenScreen(pixels) {
    const levels = {};
    document.querySelectorAll('.rgb input').forEach(input => {
        levels[input.name] = input.value
    });

    for (i = 0; i < pixels.data.length; i += 4) {
        red = pixels.data[i + 0];
        green = pixels.data[i + 1];
        blue = pixels.data[i + 2];
        alpha = pixels.data[i + 3];


        // if red, green and blue are between 0-100
        if (red >= levels.rmin &&
            green >= levels.gmin &&
            blue >= levels.bmin &&
            red <= levels.rmax &&
            green <= levels.gmax &&
            blue <= levels.bmax) {
            //take it out
            alpha = 0 // alpha to 0 = transparent
        }
    }
    return pixels;
}

getVideo()
video.addEventListener('canplay', paintToCanvas)