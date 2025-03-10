var canvas = document.getElementById('gameCanvas');
var ctx = canvas.getContext('2d');  // Membuat objek context 2d

var bgImage = new Image(); // Membuat objek image
bgImage.src = "bg2.jpeg"; 

var segitigaObj = { // Objek segitiga
    x: 50,
    y: 520,
    size: 80,
    vx: 10
};

var bullets = []; // Array untuk menyimpan peluru
var bulletSpeed = 10;
var scoreValue = 0; // Nilai score
var gameOver = false; 

bgImage.onload = function () { // Event saat gambar background selesai dimuat
    updateGame(); 
};

// Fungsi untuk menampilkan score
function score() {
    ctx.save(); 
    ctx.font = "50px Arial";
    ctx.fillStyle = "black";
    ctx.fillText("Score: " + scoreValue, 40, 150);
    ctx.restore(); 
}


// Fungsi untuk menggambar segitiga
function segitiga() {
    ctx.save();
    ctx.fillStyle = "blue";
    ctx.beginPath(); // Mulai path
    ctx.moveTo(segitigaObj.x, segitigaObj.y);
    ctx.lineTo(segitigaObj.x + segitigaObj.size, segitigaObj.y + segitigaObj.size / 2);
    ctx.lineTo(segitigaObj.x, segitigaObj.y + segitigaObj.size);
    ctx.closePath(); // Menutup path
    ctx.fill();
    ctx.restore();
}


// Fungsi untuk menggambar segilima
function segilima() {
    ctx.save();
    var centerX = 850;
    var centerY = 550;
    var size = 50;
    var sisi = 5; // Jumlah sisi pada segilima
    var angle = (2 * Math.PI) / sisi; // Sudut rotasi
    var rotationOffset = -Math.PI / 2; 

    ctx.beginPath();
    for (var i = 0; i <= sisi; i++) {
        var x = centerX + size * Math.cos(i * angle + rotationOffset);
        var y = centerY + size * Math.sin(i * angle + rotationOffset);
        if (i === 0) {
            ctx.moveTo(x, y);
        } else {
            ctx.lineTo(x, y);
        }
    }
    ctx.closePath();
    ctx.stroke();
    ctx.fillStyle = "purple";
    ctx.fill();
    ctx.restore();
}

// Fungsi untuk menggambar peluru
function drawBullets() {
    ctx.save();
    ctx.fillStyle = "red";
    bullets.forEach((bullet) => {
        ctx.beginPath();
        ctx.arc(bullet.x, bullet.y, bullet.radius, 0, Math.PI * 2);
        ctx.fill();
    });
    ctx.restore();
}


// Fungsi untuk mengupdate posisi peluru
function updateBullets() {
    bullets.forEach((bullet, index) => {
        bullet.x += bulletSpeed;

        // Mengahpus peluru jika sudah melewati canvas
        if (bullet.x > canvas.width) {
            bullets.splice(index, 1);
        }

        // Cek apakah peluru mengenai segilima
        if (checkBulletCollision(bullet)) {
            scoreValue++;
            bullets.splice(index, 1); // Hapus peluru setelah kena segilima
        }
    });
}

// Fungsi untuk mengecek tabrakan peluru dengan segilima
function checkBulletCollision(bullet) {
    var pentagonCenterX = 850;
    var pentagonCenterY = 550;
    var pentagonSize = 50;

    var dx = bullet.x - pentagonCenterX;
    var dy = bullet.y - pentagonCenterY;
    var distance = Math.sqrt(dx * dx + dy * dy);

    return distance < bullet.radius + pentagonSize;
}

// Fungsi untuk mengecek game over
function checkGameOver() {
    var pentagonX = 800; // Area segilima
    if (segitigaObj.x + segitigaObj.size >= pentagonX) {
        gameOver = true;
        setTimeout(() => {
            alert("GAME OVER\nSCORE: " + scoreValue);
            location.reload();
        }, 500);
    }
}

function updateGame() {
    if (gameOver) return;

    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.drawImage(bgImage, 0, 0, canvas.width, canvas.height);
    score();
    segilima();
    segitiga();
    drawBullets();
    updateBullets();
    checkGameOver();

    requestAnimationFrame(updateGame);
}

window.addEventListener("keydown", (e) => {
    if (gameOver) return;

    console.log(`keydown | tombol ${e.key} ditekan`);

    if (e.key === "ArrowRight" && segitigaObj.x + segitigaObj.size < 800) {
        segitigaObj.x += segitigaObj.vx;
    }

    if (e.key === "ArrowLeft" && segitigaObj.x > 0) {
        segitigaObj.x -= segitigaObj.vx;
    }

    if (e.key === " ") {
        bullets.push({
            x: segitigaObj.x + segitigaObj.size,
            y: segitigaObj.y + segitigaObj.size / 2,
            radius: 5
        });
    }
});
