var canvas = document.getElementById('gameCanvas');
var ctx = canvas.getContext('2d');  // Membuat objek context 2d

var bgImage = new Image(); // Membuat objek image
bgImage.src = "bg3.jpeg"; 

var segitigaObj = { // Objek segitiga
    x: 50,
    y: 520,
    size: 80,
    vx: 10,
    lives: 3 // Menambahkan properti nyawa
};

var heartImage = new Image(); // Membuat objek image untuk nyawa
heartImage.src = "hati.png"; 


var segilimaObj = { // Objek segilima
    x: 850,
    y: 550,
    size: 50,
    vx: -2,
    vy: 0,
    bullets: []
};

// Fungsi untuk menggambar nyawa
function drawLives() {
    for (var i = 0; i < segitigaObj.lives; i++) {
        ctx.drawImage(heartImage, 660 + i * 80, 100, 70, 70);
    }
}


var bullets = []; // Array untuk menyimpan peluru
var bulletSpeed = 10;
var scoreValue = 0; // Nilai score
var gameOver = false; 

// Menggambar nyawa saat game dimulai
bgImage.onload = function () {
    updateGame();
};

// Fungsi untuk menampilkan score
function score() {
    ctx.save(); 
    ctx.font = "50px Staatliches ";
    ctx.fillStyle = "black";
    ctx.fillText("Score: " + scoreValue, 40, 150);
    ctx.restore(); 
}

// Fungsi untuk menggambar segitiga
function segitiga() {
    ctx.save();
    ctx.fillStyle = "#00008B";
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
    var centerX = segilimaObj.x;
    var centerY = segilimaObj.y;
    var size = segilimaObj.size;
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

// Fungsi untuk menggambar peluru segilima
function drawSegilimaBullets() {
    ctx.save();
    ctx.fillStyle = "black";
    segilimaObj.bullets.forEach((bullet) => {
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

    segilimaObj.bullets.forEach((bullet, index) => {
        bullet.x -= bulletSpeed;

        // Mengahpus peluru jika sudah melewati canvas
        if (bullet.x < 0) {
            segilimaObj.bullets.splice(index, 1);
        }

        // Cek apakah peluru mengenai segitiga
        if (checkSegitigaCollision(bullet)) {
            segitigaObj.lives--; // Mengurangi nyawa segitiga
            segilimaObj.bullets.splice(index, 1); // Hapus peluru setelah kena segitiga
            if (segitigaObj.lives <= 0) {
                gameOver = true;
                setTimeout(() => {
                    alert("GAME OVER\nSCORE: " + scoreValue);
                    location.reload();
                }, 500);
            }
        }
    });
}

// Fungsi untuk mengecek tabrakan peluru dengan segilima
function checkBulletCollision(bullet) {
    var dx = bullet.x - segilimaObj.x;
    var dy = bullet.y - segilimaObj.y;
    var distance = Math.sqrt(dx * dx + dy * dy);

    return distance < bullet.radius + segilimaObj.size;
}

// Fungsi untuk mengecek tabrakan peluru dengan segitiga
function checkSegitigaCollision(bullet) {
    var dx = bullet.x - (segitigaObj.x + segitigaObj.size / 2);
    var dy = bullet.y - (segitigaObj.y + segitigaObj.size / 2);
    var distance = Math.sqrt(dx * dx + dy * dy);

    return distance < bullet.radius + segitigaObj.size / 2;
}

// Fungsi untuk mengecek tabrakan antara segitiga dan segilima
function checkSegitigaSegilimaCollision() {
    var dx = (segitigaObj.x + segitigaObj.size / 2) - segilimaObj.x;
    var dy = (segitigaObj.y + segitigaObj.size / 2) - segilimaObj.y;
    var distance = Math.sqrt(dx * dx + dy * dy);

    return distance < segitigaObj.size / 2 + segilimaObj.size;
}

// Fungsi untuk mengecek game over
function checkGameOver() {
    if (checkSegitigaSegilimaCollision()) {
        gameOver = true;
        setTimeout(() => {
            alert("GAME OVER\nSCORE: " + scoreValue);
            location.reload();
        }, 500);
    }
}

// Fungsi untuk mengupdate posisi segilima
function updateSegilima() {
    segilimaObj.x += segilimaObj.vx;
    segilimaObj.y += segilimaObj.vy;

    // Membuat segilima bergerak bolak-balik
    if (segilimaObj.x < 600 || segilimaObj.x > 850) {
        segilimaObj.vx *= -1;
    }
}

// Fungsi untuk membuat segilima menembak secara otomatis
function segilimaShoot() {
    segilimaObj.bullets.push({
        x: segilimaObj.x,
        y: segilimaObj.y,
        radius: 5
    });
}

function updateGame() {
    if (gameOver) return;

    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.drawImage(bgImage, 0, 0, canvas.width, canvas.height);
    score();
    drawLives(); // Menggambar nyawa
    segilima();
    segitiga();
    drawBullets();
    drawSegilimaBullets();
    updateBullets();
    updateSegilima();
    checkGameOver();


    requestAnimationFrame(updateGame);
}

// Membuat segilima menembak setiap 1 detik
setInterval(segilimaShoot, 2000);

window.addEventListener("keydown", (e) => {
    if (gameOver) return;

    console.log(`keydown | tombol ${e.key} ditekan`);

    if (e.key === "ArrowRight" && segitigaObj.x + segitigaObj.size < 1000) {
        segitigaObj.x += segitigaObj.vx;
    }

    if (e.key === "ArrowLeft" && segitigaObj.x > 0) {
        segitigaObj.x -= segitigaObj.vx;
    }

    if (e.key == "ArrowUp" && segitigaObj.y > 0) {
        segitigaObj.y -= segitigaObj.vx;
    }

    if (e.key == "ArrowDown" && segitigaObj.y > 0) {
        segitigaObj.y += segitigaObj.vx;
    }

    if (e.key === " ") {
        e.preventDefault(); // Ini akan menghentikan aksi default (scroll)
        bullets.push({
            x: segitigaObj.x + segitigaObj.size,
            y: segitigaObj.y + segitigaObj.size / 2,
            radius: 5
        });
    }
});
